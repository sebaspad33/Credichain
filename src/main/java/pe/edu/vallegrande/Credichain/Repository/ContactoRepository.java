package pe.edu.vallegrande.Credichain.Repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import pe.edu.vallegrande.Credichain.Model.Contacto;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactoRepository extends ReactiveCrudRepository<Contacto,Long> {

    
} 
