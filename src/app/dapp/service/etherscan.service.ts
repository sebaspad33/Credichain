import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EtherscanInternalTransaction, EtherscanTransaction} from "../interface/wallet.interface";
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EtherscanService {
  private apiKeyEtherscan = environment.api.apiKeyEtherscan;
  private baseUrlEtherscan = environment.api.baseUrlEtherscan;

  // Mapear red a endpoint de Etherscan
  private getBaseUrlByNetwork(network: string): string {
    switch (network) {
      case 'mainnet':
        return 'https://api.etherscan.io/api';
      case 'sepolia':
        return 'https://api-sepolia.etherscan.io/api';
      case 'goerli':
        return 'https://api-goerli.etherscan.io/api';
      case 'holesky':
        return 'https://api-holesky.etherscan.io/api';
      case 'ephemery':
        return 'https://explorer.ephemery.dev/api'; // Si existe API compatible
      default:
        return this.baseUrlEtherscan;
    }
  }

  constructor(private http: HttpClient) {}

  getTransactions(address: string, network: string = 'holesky'): Observable<{ status: string; message: string; result: EtherscanTransaction[] }> {
    const baseUrl = this.getBaseUrlByNetwork(network);
    const url = `${baseUrl}?module=account&action=txlist` +
      `&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${this.apiKeyEtherscan}`;
    return this.http.get<{ status: string; message: string; result: EtherscanTransaction[] }>(url);
  }

  getInternalTransactions(address: string, network: string = 'holesky'): Observable<{ status: string; message: string; result: EtherscanInternalTransaction[] }> {
    const baseUrl = this.getBaseUrlByNetwork(network);
    const url = `${baseUrl}?module=account&action=txlistinternal` +
      `&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${this.apiKeyEtherscan}`;
    return this.http.get<{ status: string; message: string; result: EtherscanInternalTransaction[] }>(url);
  }
}
