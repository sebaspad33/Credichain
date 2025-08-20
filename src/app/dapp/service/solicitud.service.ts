import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {EnviarSolicitud, LastSolicitud} from '../interface/wallet.interface';
import { Solicitud } from '../interface/wallet.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private apiCrediBackUrl = environment.api.apiCrediBackUrl;
  private solicitudActualizada = new Subject<void>();
  solicitudActualizada$ = this.solicitudActualizada.asObservable();

  constructor(private http: HttpClient) { }

  getSolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiCrediBackUrl}`);
  }

  getLastSoli(): Observable<LastSolicitud[]> {
    return this.http.get<LastSolicitud[]>(`${this.apiCrediBackUrl}/solicitud/last`);
  }

  addNewSolicitud(soli: EnviarSolicitud): Observable<EnviarSolicitud> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<EnviarSolicitud>(this.apiCrediBackUrl, soli, { headers });
  }

  rejectSolicitud(idSolicitud: number): Observable<string> {
    return this.http.put<string>(`${this.apiCrediBackUrl}/reject/${idSolicitud}`, {}, { responseType: 'text' as 'json' });
  }

  acceptSolicitud(idSolicitud: number): Observable<string> {
    return this.http.put<string>(`${this.apiCrediBackUrl}/accept/${idSolicitud}`, {}, { responseType: 'text' as 'json' });
  }

  // Método para notificar que una solicitud ha cambiado de estado
  notificarCambioEstado() {
    this.solicitudActualizada.next();
  }

}
