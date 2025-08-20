package pe.edu.vallegrande.Credichain.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LastSolicitud {

    private Long idSolicitud;
    private String usuario;
    private String estado;
}
