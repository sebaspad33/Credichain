// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Transferencia de créditos en ETH con administración de roles
/// @dev Permite al propietario agregar y gestionar administradores
contract CreditTransfer {

    address public owner;
    mapping(address => bool) public administradores;

    /// @notice Evento que notifica cuando un nuevo administrador es agregado
    event AdministradorAgregado(address indexed nuevoAdmin);
    
    /// @notice Evento que notifica cuando un administrador es eliminado
    event AdministradorEliminado(address indexed adminRemovido);
    
    /// @notice Evento que notifica una transferencia exitosa
    event TransferenciaRealizada(address indexed destinatario, uint256 monto);

    constructor() {
        owner = msg.sender;
        administradores[msg.sender] = true; // El propietario es administrador por defecto
    }

    /// @dev Modificador para restringir acciones solo a administradores
    modifier soloAdmin() {
        require(administradores[msg.sender], "Solo un administrador puede realizar esta accion.");
        _;
    }

    /// @notice Agrega un nuevo administrador (solo permitido por el propietario)
    /// @param nuevoAdmin Dirección del nuevo administrador
    function agregarAdmin(address nuevoAdmin) public {
        require(msg.sender == owner, "Solo el propietario puede agregar administradores.");
        administradores[nuevoAdmin] = true;
        emit AdministradorAgregado(nuevoAdmin);
    }

    /// @notice Elimina un administrador existente (solo permitido por el propietario)
    /// @param admin Dirección del administrador a eliminar
    function eliminarAdmin(address admin) public {
        require(msg.sender == owner, "Solo el propietario puede eliminar administradores.");
        require(admin != owner, "No puedes eliminar al propietario como administrador.");
        administradores[admin] = false;
        emit AdministradorEliminado(admin);
    }

    /// @notice Permite a administradores enviar ETH al usuario cuando se aprueba una solicitud
    /// @param destinatario Dirección del usuario
    /// @param monto Monto a transferir (en wei)
    function aprobarYTransferirETH(address payable destinatario, uint256 monto)
        public
        soloAdmin
    {
        require(address(this).balance >= monto, "Fondos insuficientes en el contrato");
        destinatario.transfer(monto);
        emit TransferenciaRealizada(destinatario, monto);
    }

    /// @notice Transfiere ETH directamente utilizando los ETH enviados en la transacción.
    /// @param destinatario Dirección del usuario
    /// @param monto Monto a transferir (en wei)
    function aprobarYTransferirETHDirect(address payable destinatario, uint256 monto)
        public
        payable
    {
    require(msg.value >= monto, "No se envio suficiente ETH en la transaccion");
    destinatario.transfer(monto);

    uint256 exceso = msg.value - monto;
    if (exceso > 0) {
        payable(msg.sender).transfer(exceso);
    }

    emit TransferenciaRealizada(destinatario, monto);
    }


    /// @notice Permite recibir ETH en el contrato
    receive() external payable {}

    /// @notice Devuelve el balance total en ETH del contrato
    function obtenerBalanceContrato() public view returns (uint256) {
        return address(this).balance;
    }
}
