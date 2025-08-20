# 🌐 Credichain - Backend

Backend del proyecto **CrediChain**, una dApp de gestión de créditos en la red Ethereum (Holesky).  
Este microservicio expone endpoints para la administración de solicitudes de crédito y contactos, integrándose con un frontend en Angular y un smart contract en Solidity.

---

## 🚀 Tecnologías utilizadas
- **Java 17**
- **Spring Boot 3 (WebFlux - programación reactiva)**
- **R2DBC con PostgreSQL**
- **Lombok**
- **Maven**

---

## 📌 Funcionalidades principales
- Gestión de solicitudes de crédito (`crear`, `aprobar`, `rechazar`, `listar`).
- Consulta de la última solicitud registrada.
- Administración de contactos para transacciones.
- Endpoints reactivos con **Flux** y **Mono**.
- Integración con frontend Angular y Etherscan para historial de transacciones.

---

## 📂 Endpoints principales

### Solicitudes
- `GET /api/credi` → Listar todas las solicitudes.  
- `POST /api/credi` → Crear una nueva solicitud de crédito.  
- `PUT /api/credi/accept/{id}` → Aceptar solicitud por ID.  
- `PUT /api/credi/reject/{id}` → Rechazar solicitud por ID.  
- `GET /api/credi/solicitud/last` → Consultar la última solicitud registrada.  

### Contactos
- `GET /api/credi/contacts` → Listar todos los contactos.  
- `POST /api/credi/create/contact` → Registrar un nuevo contacto.  

---

## ⚙️ Ejecución local

1. Clonar el repositorio y moverse a la rama **backend**:
   ```bash
   git clone <url-repo>
   cd credichain-backend
