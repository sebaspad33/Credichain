import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";
import {WalletService} from "../../../service/wallet.service";
import {ContactoService} from "../../../service/contacto.service";
import {Contacto} from '../../../interface/wallet.interface';
import {EthpriceService} from "../../../service/ethprice.service";
import { TransactionContractService } from '../../../service/transaction-contract.service';

@Component({
  selector: 'app-enviar-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './enviar-modal.component.html',
  styleUrl: './enviar-modal.component.css'
})
export class EnviarModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  direccionDestino: string = '';
  monto: number | null = null;
  addressUsuario: string = '';
  avatarUrl: string = '';
  contactos: Contacto[] = [];
  ethBalance: number = 0;
  ethPriceUSD: number = 0;
  ethPricePEN: number = 0;
  transaccionExitosa: boolean = false;
  envioPorContrato: boolean = false;

  constructor(
    private walletService: WalletService,
    private ethpriceService: EthpriceService,
    private contactoService: ContactoService,
    private transactionContractService: TransactionContractService
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.walletService.initProvider();
    this.addressUsuario = this.walletService.getAccount()?.toLowerCase() || '';
    this.avatarUrl = this.addressUsuario
      ? `https://api.dicebear.com/7.x/identicon/svg?seed=${this.addressUsuario}`
      : '';
    if (this.addressUsuario) {
      await this.updateBalance();
      await this.loadEthPrices();
    } else {
      console.warn("No se encontró cuenta conectada");
    }
    this.getContactos();
  }

  async updateBalance(): Promise<void> {
    try {
      const balance = await this.walletService.getBalance();
      this.ethBalance = parseFloat(balance);
    } catch (error) {
      console.error("Error al obtener el balance:", error);
    }
  }

  async loadEthPrices(): Promise<void> {
    try {
      const data = await this.ethpriceService.getEthPrice().toPromise();
      this.ethPriceUSD = data.ethereum.usd;
      this.ethPricePEN = data.ethereum.pen;
    } catch (error) {
      console.error("Error al obtener el precio de ETH:", error);
    }
  }

  getContactos(): void {
    const account = this.walletService.getAccount();
    if (!account) {
      console.warn('No se encontró la cuenta del usuario logueado.');
      this.contactos = [];
      return;
    }
    const addressUsuario = account.toLowerCase();
    this.contactoService.getContactos().subscribe({
      next: (res) => {
        this.contactos = res.filter(contacto =>
          contacto.userRegistered?.toLowerCase() === addressUsuario
        );
      },
      error: () => console.error('Error al cargar contactos')
    });
  }

  seleccionarContacto(contacto: Contacto): void {
    if (contacto.addressContacto) {
      this.direccionDestino = contacto.addressContacto;
    }
  }

  avatarUrlContact(addr: string): string {
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${addr}`;
  }

  direccionValida(): boolean {
    return this.direccionDestino.startsWith('0x') && this.direccionDestino.length === 42;
  }

  shortenAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  async enviarETH(): Promise<void> {
    if (!this.direccionValida() || !this.monto) {
      console.warn("Dirección destino inválida o monto no definido.");
      return;
    }
    try {
      if (this.envioPorContrato) {
        // Enviar usando el contrato
        console.log(`🚀 Enviando ${this.monto} ETH a ${this.direccionDestino} por contrato...`);
        await this.transactionContractService.sendTransaction(this.direccionDestino, this.monto.toString());
      } else {
        // Enviar directo
        console.log(`🚀 Enviando ${this.monto} ETH a ${this.direccionDestino}...`);
        await this.walletService.transferETH(this.direccionDestino, this.monto.toString());
      }
      console.log("✅ Transacción completada.");
      this.transaccionExitosa = true;
      await this.updateBalance();
      await this.loadEthPrices();
    } catch (error) {
      console.error("❌ Error al enviar ETH:", error);
    }
  }

  closeModal() {
    this.close.emit();
    this.resetFormulario();
  }

  resetFormulario() {
    this.direccionDestino = '';
    this.monto = null;
  }

}
