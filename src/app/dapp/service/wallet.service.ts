import {Injectable} from '@angular/core';
import {ethers, BrowserProvider, JsonRpcProvider} from 'ethers';
import abi from '../abi/transaction.json';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private smartContractHolesky = environment.api.smartContractHolesky;
  // RPC público para Holesky
  private jsonProvider = new JsonRpcProvider('https://ethereum-holesky.publicnode.com');
  private provider: ethers.BrowserProvider | null = null;
  private account: string | null = null;

  //Re-inicializar el provider
  async initProvider(): Promise<void> {
    if (window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      throw new Error("MetaMask no está instalado");
    }
  }

  //Método para conectar a wallet Metamask
  async connectWallet(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask no está instalado');
    }
    await this.initProvider();
    const accounts = await this.provider!.send("eth_requestAccounts", []);
    this.account = accounts[0];
    if (this.account) {
      localStorage.setItem('account', this.account);
    }
    return this.account!;
  }

  //Método para obtener el balance de red seleccionada (Holesky,Mainet,Seepolia.etc)
  async getBalance(): Promise<string> {
    if (!this.provider) {
      throw new Error("Provider no inicializado");
    }
    // Asegura que this.account esté siempre definido si existe en localStorage
    if (!this.account) {
      this.account = localStorage.getItem('account');
    }
    if (!this.account) {
      throw new Error("Wallet no conectada");
    }
    const balance = await this.provider.getBalance(this.account);
    return ethers.formatEther(balance);
  }

  //Método que devuelve la dirección de la cuenta del usuario
  getAccount(): string | null {
    if (this.account) return this.account;
    return localStorage.getItem('account');
  }

  //Método para obteneer el contrato
  private getContrato(signerOrProvider: ethers.Provider | ethers.Signer) {
    return new ethers.Contract(this.smartContractHolesky, abi, signerOrProvider);
  }

  //Método para obtener el balance del contrao
  async getBalanceContrato(): Promise<string> {
    const contrato = this.getContrato(this.jsonProvider);
    const balance = await contrato['obtenerBalanceContrato']();
    return ethers.formatEther(balance);
  }

  // Método para transferir ETH solicitado
  async aprobarYTransferirETH(destinatario: string, montoEth: string): Promise<void> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error("MetaMask no está instalado");
    }
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contrato = this.getContrato(signer);

    const montoWei = ethers.parseEther(montoEth);

    try {
      const tx = await contrato['aprobarYTransferirETH'](destinatario, montoWei);
      console.log("🚀 Transacción enviada:", tx.hash);
    } catch (error: any) {
      console.error("❌ Error al transferir ETH:", error);
      throw error;
    }
  }

  // Método para transferir ETH de forma directa
  async aprobarYTransferirETHDirect(destinatario: string, montoEth: string): Promise<void> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error("MetaMask no está instalado");
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contrato = this.getContrato(signer);

    const montoWei = ethers.parseEther(montoEth);

    try {
      const tx = await contrato['aprobarYTransferirETHDirect'](destinatario, montoWei, {
        value: montoWei
      });
      console.log("🚀 Transacción enviada correctamente:", tx.hash);
    } catch (error: any) {
      console.error("❌ Error al transferir ETH:", error);
      throw error;
    }
  }

  async transferETH(destinatario: string, montoEth: string): Promise<void> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error("MetaMask no está instalado");
  }
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const montoWei = ethers.parseEther(montoEth);

  try {
    const tx = await signer.sendTransaction({
      to: destinatario,
      value: montoWei
    });
    console.log("🚀 Transacción directa enviada:", tx.hash);
    await tx.wait();
  } catch (error: any) {
    console.error("❌ Error al transferir ETH directo:", error);
    throw error;
  }
}

  //Método para desloguearte de la aplicación
  logout(): void {
  this.account = null;
  localStorage.removeItem('account');
}

}
