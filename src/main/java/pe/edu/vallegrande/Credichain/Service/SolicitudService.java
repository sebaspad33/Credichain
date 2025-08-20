package pe.edu.vallegrande.Credichain.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.Credichain.Dto.SolicitudRequest;
import pe.edu.vallegrande.Credichain.Dto.LastSolicitud;
import pe.edu.vallegrande.Credichain.Model.Solicitud;
import pe.edu.vallegrande.Credichain.Repository.SolicitudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.Base64;


@Service
@RequiredArgsConstructor
public class SolicitudService {

    private final SolicitudRepository solicitudRepository;

    // Método para obtener todos las solicitudes
    public Flux<Solicitud> getAll() {
        return solicitudRepository.findAll();
    }

    // Método para obtener la ultima solicitud ingresada
    public Flux<LastSolicitud> getLastSolicitud() {
        return solicitudRepository.findLastSolicitud();
    }

    // Método para registrar una solicitud
    public Mono<Solicitud> createSolicitud(SolicitudRequest request) {
        Solicitud solicitud = new Solicitud();
        solicitud.setUsuario(request.getUsuario());
        solicitud.setMonto(request.getMonto());
        solicitud.setPlazo(request.getPlazo());
        solicitud.setCelular(request.getCelular());
    
        if (request.getDni() != null && !request.getDni().isEmpty()) {
            solicitud.setDni(request.getDni());
        }
    
        if (request.getDniImagen() != null && !request.getDniImagen().isEmpty()) {
            byte[] imagenBytes = Base64.getDecoder().decode(request.getDniImagen()); // Decodificación Base64
            solicitud.setDniImagen(imagenBytes);
        }
    
        return solicitudRepository.save(solicitud);
    }    

    // Método para rechazar una solicitud
    public Mono<Solicitud> rejectRequest(Long id) {
        return solicitudRepository.findById(id)
                .flatMap(existingSolicitud -> {
                    if ("pendiente".equals(existingSolicitud.getEstado())) {
                        existingSolicitud.setEstado("rechazada");
                        return solicitudRepository.save(existingSolicitud);
                    } else {
                        return Mono.error(new RuntimeException("Solicitud is already rechazada"));
                    }
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Solicitud not found")));
    }

    // Método para aceptar una solicitud
    public Mono<Solicitud> acceptRequest(Long id) {
        return solicitudRepository.findById(id)
                .flatMap(existingSolicitud -> {
                    if ("pendiente".equals(existingSolicitud.getEstado())) {
                        existingSolicitud.setEstado("aceptada");
                        return solicitudRepository.save(existingSolicitud);
                    } else {
                        return Mono.error(new RuntimeException("Solicitud is already aceptada"));
                    }
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Solicitud not found")));
    }

}
