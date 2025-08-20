import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Solicitud } from '../../../interface/wallet.interface';
import { SolicitudService } from '../../../service/solicitud.service';
import { WalletService } from "../../../service/wallet.service";

@Component({
  selector: 'app-solicitud-modal',
  standalone: true,
  imports: [CommonModule,NgIf, NgFor],
  templateUrl: './solicitud-modal.component.html',
  styleUrl: './solicitud-modal.component.css'
})
export class SolicitudModalComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  solicitudes: Solicitud[] = [];

  constructor(
    private solicitudService: SolicitudService,
    private walletService: WalletService) { }

  ngOnInit(): void {
    this.getSolicitudes();
  }

  getSolicitudes() {
    this.solicitudService.getSolicitudes().subscribe({
      next: (data) => {
        this.solicitudes = data;
      },
      error: (err) => {
        console.error('Error al obtener solicitudes:', err);
      }
    });
  }

  rejectSoli(idSolicitud: number): void {
    this.solicitudService.rejectSolicitud(idSolicitud).subscribe({
      next: () => {
        this.getSolicitudes();
        this.solicitudService.notificarCambioEstado();
      },
      error: (err) => console.error('Error al rechazar:', err)
    });
  }

  acceptSoli(solicitud: Solicitud): void {
    const montoStr = solicitud.monto.toString();
    const destinatario = solicitud.usuario;

    this.walletService.aprobarYTransferirETH(destinatario, montoStr).then(() => {
      this.solicitudService.acceptSolicitud(solicitud.idSolicitud).subscribe({
        next: () => {
          this.getSolicitudes();
          this.solicitudService.notificarCambioEstado();
        },
        error: (err) => console.error('Error al aceptar:', err)
      });
    }).catch(error => {
      console.error('Error en la transferencia:', error);
    });
  }

  shortenAddress(address: string): string {
    if (!address) return '';
    return address.length > 10
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address;
  }

  cerrarModal() {
    this.close.emit();
  }

}
