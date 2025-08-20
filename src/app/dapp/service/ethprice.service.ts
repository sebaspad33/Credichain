import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EthpriceService {

  private coinGeckoUrl = environment.api.baseUrlCoinGecko;

  constructor(private http: HttpClient) { }

  // Método para obtener el precio de Ethereum en USD y PEN (Soles Peruanos)
  getEthPrice(): Observable<any> {
    const url = `${this.coinGeckoUrl}/simple/price?ids=ethereum&vs_currencies=usd,pen`;
    return this.http.get<any>(url);
  }
}
