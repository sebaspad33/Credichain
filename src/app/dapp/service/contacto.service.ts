import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Contacto} from "../interface/wallet.interface";
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private apiCrediBackUrl = environment.api.apiCrediBackUrl;

  constructor(private http: HttpClient) { }

  getContactos(): Observable<Contacto[]> {
    return this.http.get<Contacto[]>(`${this.apiCrediBackUrl}/contacts`);
  }

  addNewContact(soli: Contacto): Observable<Contacto> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Contacto>(`${this.apiCrediBackUrl}/create/contact`, soli, { headers });
  }
}
