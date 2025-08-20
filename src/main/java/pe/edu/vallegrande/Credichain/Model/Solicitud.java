package pe.edu.vallegrande.Credichain.Model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import java.math.BigDecimal;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("Solicitud")
public class Solicitud {

    @Id
    @Column("id_solicitud")
    private Long idSolicitud;

    @Column("usuario")
    private String usuario;

    @Column("monto")
    private BigDecimal monto;

    @Column("plazo")
    private Integer plazo;

    @Column("dni")
    private String dni;

    @Column("dni_imagen")
    private byte[] dniImagen;

    @Column("celular")
    private String celular;

    @Column("estado")
    private String estado;

}
