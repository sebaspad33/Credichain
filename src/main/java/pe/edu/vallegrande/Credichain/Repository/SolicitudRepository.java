package pe.edu.vallegrande.Credichain.Repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import pe.edu.vallegrande.Credichain.Dto.LastSolicitud;
import pe.edu.vallegrande.Credichain.Model.Solicitud;
import reactor.core.publisher.Flux;

@Repository
public interface SolicitudRepository extends ReactiveCrudRepository<Solicitud, Long> {

    @Query("SELECT id_solicitud, usuario, estado FROM Solicitud ORDER BY id_solicitud DESC LIMIT 1")
    Flux<LastSolicitud> findLastSolicitud();

}
