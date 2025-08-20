import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ContactoService } from '../../../service/contacto.service';
import { WalletService } from '../../../service/wallet.service';
import {Contacto} from '../../../interface/wallet.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto-modal',
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ],
  templateUrl: './contacto-modal.component.html',
  styleUrl: './contacto-modal.component.css'
})
export class ContactoModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  contactos: Contacto[] = [];
  step = 1;
  newContact: Contacto = {} as Contacto;
  address: string | null = null;

  constructor(
    private contactoService: ContactoService,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.getContactos();
    this.address = this.walletService.getAccount();
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

  shortenAddress(addr: string): string {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  avatarUrl(addr: string): string {
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${addr}`;
  }

  addContact(): void {
    this.newContact.userRegistered = this.address ?? '';
    console.log('Enviando contacto:', this.newContact);
    this.contactoService.addNewContact(this.newContact).subscribe({
      next: () => {
        this.getContactos();
        this.step = 1;
      },
      error: (err) => {
        console.error('Error al agregar contacto:', err);
      },
    });
  }

  cerrarModal() {
    this.close.emit();
    this.resetFormulario()
  }

  resetFormulario() {
    this.newContact = {} as Contacto;
  }
}
