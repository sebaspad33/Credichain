package pe.edu.vallegrande.Credichain.Model;

import lombok.Data;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("Contactos")
public class Contacto {

    @Id
    @Column("id_contacto")
    private Long idContacto;

    @Column("name_contacto")
    private String nameContacto;

    @Column("address_contacto")
    private String addressContacto;

    @Column("user_registered")
    private String userRegistered;
    
}
