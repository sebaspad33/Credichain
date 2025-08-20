export interface Wallet {
    address: string;
}

export interface Solicitud {
    idSolicitud: number;
    usuario: string;
    monto: number;
    plazo: number;
    dni?: string;
    dniImagen?: string;
    celular: string;
    estado: string;
}

export interface EnviarSolicitud {
  usuario: string;
  monto: number;
  plazo: number;
  dni?: string;
  dniImagen?: string;
  celular: string;
}
export interface Contacto {
  idContacto?: number;
  nameContacto: string;
  addressContacto: string;
  userRegistered: string;
}

export interface LastSolicitud {
  idSolicitud: number;
  estado: string;
}

export interface EtherscanTransaction {
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
}

export interface EtherscanInternalTransaction {
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
}

