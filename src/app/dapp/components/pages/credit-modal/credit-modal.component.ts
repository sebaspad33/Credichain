import {NgIf} from '@angular/common';
import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SolicitudService} from "../../../service/solicitud.service";
import {WalletService} from "../../../service/wallet.service";
import {EnviarSolicitud} from "../../../interface/wallet.interface";

@Component({
  selector: 'app-credit-modal',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './credit-modal.component.html',
  styleUrl: './credit-modal.component.css'
})
export class CreditModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() initialStep: number = 1;
  step = 1;
  newSoli: EnviarSolicitud = {} as EnviarSolicitud;
  dniImageBase64: string | null = null;
  estadoSolicitud: string | null = null;

  constructor(
    private solicitudService: SolicitudService,
    private walletService: WalletService) {
  }

  ngOnInit(): void {
    this.verificarEstadoSolicitud();
    this.step = this.initialStep;
  }

  verificarEstadoSolicitud() {
    const usuarioLogueado = this.walletService.getAccount()?.toLowerCase();

    this.solicitudService.getSolicitudes().subscribe({
      next: (res) => {
        const solicitudesPendientes = res.filter(sol =>
          sol.usuario.toLowerCase() === usuarioLogueado && sol.estado === 'pendiente'
        );

        this.estadoSolicitud = solicitudesPendientes.length > 0 ? 'pendiente' : '';
        this.step = 1; // Siempre se queda en el paso 1
      },
      error: (err) => {
        console.error('Error al obtener solicitudes:', err);
      }
    });
  }

  finalizarSolicitud() {
    if (this.dniImageBase64) {
      this.newSoli.dniImagen = this.dniImageBase64;
    }
    this.addSolicitud();
    this.step = 7;
  }

  addSolicitud(): void {
    this.solicitudService.addNewSolicitud(this.newSoli).subscribe({
      next: () => {
        this.solicitudService.notificarCambioEstado();
        this.closeModal();
      },
      error: (err) => {
        this.closeModal();
        console.error('Error al insertar la solicitud:', err);
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.dniImageBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  closeModal() {
    this.close.emit();
    this.resetFormulario();
  }

  resetFormulario() {
    this.newSoli = {} as EnviarSolicitud;
  }
}
