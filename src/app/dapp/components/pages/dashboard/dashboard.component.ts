import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin} from 'rxjs';
import {RouterModule} from '@angular/router';
import {NavbarComponent} from '../../../../common/navbar/navbar.component';
import {CommonModule} from '@angular/common';
import {WalletService} from '../../../service/wallet.service';
import {EthpriceService} from '../../../service/ethprice.service';
import {CreditModalComponent} from '../credit-modal/credit-modal.component';
import {SolicitudService} from "../../../service/solicitud.service";
import {Subscription} from 'rxjs';
import {
  Contacto,
  EtherscanTransaction,
  EtherscanInternalTransaction,
  Solicitud
} from '../../../interface/wallet.interface';
import {StartComponent} from "../start/start.component";
import {EnviarModalComponent} from "../enviar-modal/enviar-modal.component";
import {FormsModule} from "@angular/forms";
import {EtherscanService} from "../../../service/etherscan.service";
import {ContactoService} from "../../../service/contacto.service";
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule,
    NavbarComponent,
    CommonModule,
    CreditModalComponent,
    StartComponent,
    EnviarModalComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  activeTab: string = 'tokens';
  address: string | null = null;
  shortened: string | null = null;
  showCreditModal: boolean = false;
  showSendModal: boolean = false;
  ethBalance: number = 0;
  ethPriceUSD: number = 0;
  ethPricePEN: number = 0;
  prevSolicitudId: number | null = null;
  solicitud: Solicitud | null = null;
  showStartPopup: boolean = true;
  solicitudesFiltradas: Solicitud[] = [];
  mostrarTransacciones: boolean = false;
  transacciones: any[] = [];
  internalTransacciones: EtherscanInternalTransaction[] = [];
  contactos: Contacto[] = [];
  selectedNetwork: string = 'mainnet';
  availableNetworks: { chainId: string, name: string }[] = [
    { chainId: '0x1', name: 'Ethereum Mainnet' },
    { chainId: '0xaa36a7', name: 'Sepolia' },
    { chainId: '0x5', name: 'Goerli' },
    { chainId: '0x4268', name: 'Holesky' },
    { chainId: '0x259C743', name: 'Ephemery' }
  ];
  mensaje: boolean = false;

  private subCambio!: Subscription;
  private smartContractHolesky: string = environment.api.contractAddress;

  constructor(
    private walletService: WalletService,
    private ethpriceService: EthpriceService,
    private solicitudService: SolicitudService,
    private etherscanService: EtherscanService,
    private contactoService: ContactoService
  ) {
  }

  async ngOnInit() {
    await this.walletService.initProvider();
    this.address = this.walletService.getAccount();

    if (this.address) {
      this.shortened = this.shortenAddress(this.address);
      await this.updateBalance();
      await this.loadEthPrices();
      this.cargarHistorialSolicitudes();
      this.cargarContactos();
      this.cargarHistorialTransacciones();
    } else {
      console.warn("No se encontró cuenta conectada");
    }

    // Lógica de solicitudes
    this.getUltimaSolicitud();
    this.subCambio = this.solicitudService.solicitudActualizada$.subscribe(() => {
      this.getUltimaSolicitud();
    });
    // Detectar red actual y seleccionarla
    this.detectCurrentNetwork();
  }

  async detectCurrentNetwork() {
    if (window.ethereum && window.ethereum.request) {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const found = this.availableNetworks.find(n => n.chainId === chainId);
        if (found) {
          this.selectedNetwork = found.name.toLowerCase();
        }
      } catch (e) {}
    }
  }

  ngOnDestroy() {
    if (this.subCambio) {
      this.subCambio.unsubscribe();
    }
  }

  async onNetworkChange(event: Event) {
    const selectedName = (event.target as HTMLSelectElement).value;
    const selected = this.availableNetworks.find(n => n.name.toLowerCase() === selectedName);
    if (!selected || !window.ethereum) return;
    this.selectedNetwork = selected.name.toLowerCase();
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: selected.chainId }]
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Red no agregada, no se puede añadir automáticamente sin datos completos
        alert('Esta red no está agregada en MetaMask. Por favor, agrégala manualmente.');
        return;
      } else {
        console.error(`❌ Error cambiando de red:`, switchError);
        return;
      }
    }
    await this.walletService.initProvider();
    await this.updateBalance();
    this.cargarHistorialTransacciones();
  }

  async updateBalance() {
    try {
      const balance = await this.walletService.getBalance();
      console.log("Balance recibido:", balance);
      this.ethBalance = parseFloat(balance);
    } catch (error) {
      console.error("Error al obtener el balance:", error);
    }
  }

  async loadEthPrices() {
    try {
      const data = await this.ethpriceService.getEthPrice().toPromise();
      this.ethPriceUSD = data.ethereum.usd;
      this.ethPricePEN = data.ethereum.pen;
    } catch (error) {
      console.error("Error al obtener el precio de ETH:", error);
    }
  }

  cargarContactos(): void {
    if (!this.address) {
      return;
    }
    this.contactoService.getContactos().subscribe({
      next: (data) => {
        this.contactos = data.filter(contact =>
          contact.userRegistered.toLowerCase() === this.address!.toLowerCase()
        );
      },
      error: (err) => console.error('Error al cargar contactos', err)
    });
  }

  getNombreContacto(addressDestino: string): string {
    if (!this.contactos || !this.address) {
      return addressDestino;
    }
    const contactoEncontrado = this.contactos.find(contact =>
      contact.addressContacto.toLowerCase() === addressDestino.toLowerCase()
    );
    if (contactoEncontrado) {
      return contactoEncontrado.nameContacto;
    }
    return `${addressDestino.slice(0, 10)}...`;
  }

  getUltimaSolicitud(): void {
    this.solicitudService.getSolicitudes().subscribe({
      next: (data) => {
        const usuarioLogueado = this.address?.toLowerCase();

        const solicitudesUsuario = data.filter(sol => sol.usuario.toLowerCase() === usuarioLogueado);

        if (solicitudesUsuario.length > 0) {
          const ultimaSolicitud = solicitudesUsuario[solicitudesUsuario.length - 1];

          if (this.prevSolicitudId === null) {
            this.prevSolicitudId = ultimaSolicitud.idSolicitud;
          }

          if (this.prevSolicitudId !== ultimaSolicitud.idSolicitud) {
            this.prevSolicitudId = ultimaSolicitud.idSolicitud;
          }

          this.solicitud = ultimaSolicitud;
        } else {
          this.solicitud = null;
        }
      },
      error: (err) => {
        console.error('Error al obtener las solicitudes:', err);
      }
    });
  }

  cargarHistorialSolicitudes(): void {
    if (!this.address) return;
    const usuarioLogueado = this.address.toLowerCase();
    this.solicitudService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudesFiltradas = data.filter(sol => sol.usuario.toLowerCase() === usuarioLogueado);
      },
      error: (err) => {
        console.error('Error al cargar solicitudes para el historial:', err);
      }
    });
  }

  cargarHistorialTransacciones(): void {
    if (!this.address) return;

    // Selecciona el contrato (mismo para todas las redes en este entorno)
    let contractAddress = environment.api.contractAddress;

    forkJoin({
      external: this.etherscanService.getTransactions(this.address, this.selectedNetwork),
      internal: this.etherscanService.getInternalTransactions(contractAddress, this.selectedNetwork)
    }).subscribe(
      ({external, internal}) => {
        this.internalTransacciones = internal.result.filter(
          (intTx) => +intTx.value > 0
        );

        // Todas las transacciones externas donde el usuario es origen o destino
        const allExternalTxs: EtherscanTransaction[] = external.result.filter(
          (extTx) =>
            extTx.from.toLowerCase() === this.address!.toLowerCase() ||
            extTx.to.toLowerCase() === this.address!.toLowerCase()
        );

        // Combina y marca tipo y dirección
        this.transacciones = allExternalTxs.map((extTx) => {
          let tipo = 'Directo';
          let direccion = 'enviada';
          let to = extTx.to;
          let value = extTx.value;

          // Si es al contrato, busca la interna
          if (extTx.to.toLowerCase() === contractAddress.toLowerCase()) {
            const intTx = this.internalTransacciones.find(
              (tx) => tx.hash.toLowerCase() === extTx.hash.toLowerCase()
            );
            if (intTx) {
              tipo = 'Contrato';
              to = intTx.to;
              value = intTx.value;
            }
          }

          if (extTx.from.toLowerCase() === this.address!.toLowerCase()) {
            direccion = 'enviada';
          } else {
            direccion = 'recibida';
          }

          return {
            hash: extTx.hash,
            from: extTx.from,
            to: to,
            value: value,
            timeStamp: extTx.timeStamp,
            tipo: tipo,
            direccion: direccion
          };
        });

        // Ordena por fecha descendente
        this.transacciones.sort((a, b) => +b.timeStamp - +a.timeStamp);
      },
      (error) => {
        console.error('Error al cargar transacciones combinadas', error);
      }
    );
  }

  shorteHash(hash: string): string {
    if (hash == '' || hash == '0x447b6FE8EC60fA2060b67c4FAF4245136FDA5b05') {
      this.mensaje = true;
    } else {
      this.mensaje = false;
      return hash.slice(0, 6) + '...' + hash.slice(-4);
    }
    return '';
  }

  getEtherscanTxUrl(hash: string): string {
    switch (this.selectedNetwork) {
      case 'mainnet':
        return `https://etherscan.io/tx/${hash}`;
      case 'ephemery':
        return `https://explorer.ephemery.dev/tx/${hash}`;
      case 'holesky':
      default:
        return `https://holesky.etherscan.io/tx/${hash}`;
    }
  }
  getEstadoClase(etapa: string): string {
    if (!this.solicitud) {
      return 'bg-gray-300';
    }

    switch (etapa) {
      case 'solicitud':
        return this.solicitud.estado === 'pendiente' || this.solicitud.estado === 'evaluacion' || this.solicitud.estado === 'aprobada'
          ? 'bg-red-600'
          : 'bg-gray-300';

      case 'evaluacion':
        return this.solicitud.estado === 'pendiente' || this.solicitud.estado === 'evaluacion' || this.solicitud.estado === 'aprobada'
          ? 'bg-red-600'
          : 'bg-gray-300';

      case 'estado':
        return this.solicitud.estado === 'pendiente'
          ? 'bg-yellow-500'
          : this.solicitud.estado === 'aprobada'
            ? 'bg-green-600'
            : this.solicitud.estado === 'rechazada'
              ? 'bg-gray-800'
              : 'bg-gray-300';

      case 'depositado':
        return this.solicitud.estado === 'aprobada' ? 'bg-green-600' : 'bg-gray-200';

      default:
        return 'bg-gray-300';
    }
  }

  shortenAddress(addr: string): string {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  openCreditModal() {
    this.showCreditModal = true;
  }

  closeCreditModal() {
    this.showCreditModal = false;
  }

  openSendModal() {
    this.showSendModal = true;
  }

  closeSendModal() {
    this.showSendModal = false;
  }

  closeStartPopup() {
    this.showStartPopup = false;
  }
}
