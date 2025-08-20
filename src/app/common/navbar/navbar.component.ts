import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../dapp/service/wallet.service';
import { Router } from '@angular/router';
import { SolicitudModalComponent } from '../../dapp/components/pages/solicitud-modal/solicitud-modal.component';
import { ContactoModalComponent } from "../../dapp/components/pages/contacto-modal/contacto-modal.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, SolicitudModalComponent,ContactoModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  menuAbierto: boolean = false;
  menuOpen = false;
  userMenuOpen = false;
  mostrarSolicitudModal: boolean = false;
  mostrarContactoModal: boolean = false;
  address: string = '';
  shortened: string = '';
  avatarUrl: string = '';

  constructor(
    private walletService: WalletService,
    private router: Router) { }

  ngOnInit(): void {
    const acc = this.walletService.getAccount() ?? '';
    this.address = acc;
    this.shortened = acc ? this.shortenAddress(acc) : '';
    this.avatarUrl = acc ? `https://api.dicebear.com/7.x/identicon/svg?seed=${acc}` : '';
  }

  copiarUsuario(texto: string) {
    if (!texto) return;
    navigator.clipboard.writeText(texto).then(() => {
    }, err => {
      console.error('Error al copiar', err);
    });
  }

  abrirModalSolicitudes() {
    this.mostrarSolicitudModal = true;
  }

  cerrarModalSolicitudes() {
    this.mostrarSolicitudModal = false;
  }

  abrirModalContactos() {
    this.mostrarContactoModal = true;
  }

  cerrarModalContactos() {
    this.mostrarContactoModal = false;
  }

  toggleMenuAbierto() {
    this.menuAbierto = !this.menuAbierto;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  shortenAddress(addr: string): string {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  logout(): void {
    this.walletService.logout();
    this.address = '';
    this.shortened = '';
    this.avatarUrl = '';
    this.router.navigate(['/']);
  }

}
