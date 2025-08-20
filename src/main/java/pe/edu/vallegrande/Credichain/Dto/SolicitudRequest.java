package pe.edu.vallegrande.Credichain.Dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudRequest {

    private String usuario;
    private BigDecimal monto;
    private Integer plazo;
    private String dni;
    private String dniImagen;
    private String celular;
}
