# 📜 Smart Contract - CreditTransfer

Este directorio contiene el **Smart Contract `CreditTransfer`**, parte del proyecto **CrediChain**, que gestiona la **transferencia de créditos en ETH** bajo un sistema de administración de roles.  

El contrato está desarrollado en **Solidity (v0.8.20)** y desplegado en la **Ethereum Holesky Testnet**.

---

## 🧾 Descripción general

- Permite que el **propietario del contrato** designe y gestione administradores.
- Los **administradores** tienen la capacidad de aprobar y transferir ETH a usuarios como parte del flujo de créditos.
- El contrato puede recibir ETH, mantener un balance interno y realizar transferencias seguras.
- Incluye un sistema de eventos para auditar en la blockchain cada acción relevante.

---

## 🛠️ Documentación NatSpec

El contrato utiliza **NatSpec** (`Ethereum Natural Language Specification`) para documentar cada elemento.  

### 📌 Estructura NatSpec aplicada:
- **@title** → Título del contrato.
- **@notice** → Breve descripción de lo que hace la función o contrato.
- **@dev** → Detalles técnicos para desarrolladores.
- **@param** → Explicación de parámetros de las funciones.
- **@return** → Valores de retorno en funciones.
- **@event** → Eventos emitidos durante la ejecución.

---

### ✨ Variables principales
- `owner`: Dirección del propietario del contrato.
- `administradores`: Mapeo que gestiona las direcciones autorizadas como administradores.

---

### ⚙️ Funcionalidades principales

#### 👤 Gestión de roles
- `agregarAdmin(address nuevoAdmin)`  
  @notice Permite al propietario agregar un nuevo administrador.  
  @param nuevoAdmin Dirección a autorizar.  
  @event `AdministradorAgregado`.

- `eliminarAdmin(address admin)`  
  @notice Permite al propietario eliminar un administrador.  
  @param admin Dirección a remover.  
  @event `AdministradorEliminado`.

---

#### 💸 Transferencias de ETH
- `aprobarYTransferirETH(address payable destinatario, uint256 monto)`  
  @notice Permite a un administrador enviar ETH desde el balance del contrato.  
  @param destinatario Dirección del usuario.  
  @param monto Monto a transferir en wei.  
  @event `TransferenciaRealizada`.

- `aprobarYTransferirETHDirect(address payable destinatario, uint256 monto)`  
  @notice Transfiere ETH directamente utilizando los fondos enviados en la transacción (`msg.value`).  
  @param destinatario Dirección del usuario.  
  @param monto Monto a transferir en wei.  
  @event `TransferenciaRealizada`.

---

#### 📥 Recepción y consulta
- `receive() external payable`  
  @notice Permite al contrato recibir ETH directamente.

- `obtenerBalanceContrato() public view returns (uint256)`  
  @notice Devuelve el balance total en ETH del contrato.  
  @return Balance en wei.

---

### 📡 Eventos
- `AdministradorAgregado(address nuevoAdmin)` → Se emite al agregar un administrador.  
- `AdministradorEliminado(address adminRemovido)` → Se emite al eliminar un administrador.  
- `TransferenciaRealizada(address destinatario, uint256 monto)` → Se emite al aprobar y transferir ETH.

---

## 🔗 Uso esperado en CrediChain

1. El **propietario despliega el contrato** y se convierte en el primer administrador.  
2. El propietario agrega nuevos administradores (ej. personal de aprobación de créditos).  
3. Los administradores pueden aprobar solicitudes y realizar transferencias en ETH al usuario.  
4. Cada acción queda registrada en la blockchain a través de los **eventos**.  
5. El frontend consulta el contrato para mostrar historial de transferencias y balance.  

---

## 🧪 Requisitos para pruebas
- **Remix IDE** o **Hardhat**.
- Red de pruebas: **Ethereum Holesky Testnet**.
- Billetera **MetaMask** con ETH de prueba.  

Ejemplo en Remix:
1. Copiar el contrato en un archivo `CreditTransfer.sol`.
2. Compilar con Solidity `0.8.20`.
3. Desplegar en la red **Holesky Testnet**.
4. Interactuar con las funciones (`agregarAdmin`, `aprobarYTransferirETH`, etc.).


