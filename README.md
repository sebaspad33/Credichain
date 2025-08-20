# 🌐 Frontend - CrediChain Dashboard

Este directorio contiene el **Frontend** de la aplicación **CrediChain**, desarrollado con **Angular 17** y estilizado con **TailwindCSS**, que permite la interacción de usuarios y administradores con los **Smart Contracts** desplegados en Ethereum (Holesky Testnet).

---

## 🚀 Tecnologías principales

- **Angular 17** → Framework frontend.
- **TailwindCSS 3** → Estilos utilitarios modernos y responsivos.
- **Ethers.js 6** → Conexión con contratos inteligentes en Ethereum.
- **SweetAlert2** → Alertas interactivas y modales.
- **Ngx-Pagination** → Manejo de listas y paginación.
- **Express SSR** → Renderizado del lado del servidor (SSR opcional).

---

## 📂 Estructura del proyecto (Vistas principales)

```
frontend/
│── abi/                       
│── components/
│   ├── pages/                 
│   │   ├── contacto-modal/      # Modal de contacto para soporte o consultas
│   │   ├── credit-modal/        # Modal para visualizar y gestionar créditos
│   │   ├── dashboard/           # Panel principal para usuarios y administradores
│   │   ├── enviar-modal/        # Modal para realizar transferencias de ETH
│   │   ├── login/               # Pantalla de inicio de sesión
│   │   ├── solicitud-modal/     # Modal para solicitar créditos
│   │   └── start/               # Página inicial de bienvenida o introducción
│   ├── components.component.html 
│   └── components.component.ts    
│── interface/                   
│── service/                     
```

---

## 📌 Funcionalidades por página

- **`start/` (Página inicial)**  
  - Pantalla de bienvenida al sistema CrediChain.  
  - Introducción a la plataforma y acceso al login.  

- **`login/` (Inicio de sesión)**  
  - Conexión de la billetera (MetaMask u otro proveedor).  
  - Validación de usuario (cliente o administrador).  

- **`dashboard/` (Panel principal)**  
  - Vista principal tras iniciar sesión.  
  - Para **usuarios**: historial de créditos, solicitudes y estado actual.  
  - Para **administradores**: control de solicitudes y gestión de transferencias.  

- **`solicitud-modal/` (Solicitud de créditos)**  
  - Formulario para que los usuarios soliciten un crédito.  
  - Registro de la solicitud en el Smart Contract.  

- **`credit-modal/` (Modal de créditos)**  
  - Visualización de créditos activos.  
  - Detalles de montos, plazos y estados.  

- **`enviar-modal/` (Transferencias ETH)**  
  - Funcionalidad exclusiva para **administradores**.  
  - Permite enviar fondos a las direcciones de usuarios solicitantes.  

- **`contacto-modal/` (Contacto)**  
  - Modal de soporte o contacto con el equipo de CrediChain.  
  - Permite que el usuario envíe un mensaje o solicitud de ayuda.  

---

