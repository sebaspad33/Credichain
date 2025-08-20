package pe.edu.vallegrande.Credichain.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.Credichain.Dto.LastSolicitud;
import pe.edu.vallegrande.Credichain.Dto.SolicitudRequest;
import pe.edu.vallegrande.Credichain.Model.Contacto;
import pe.edu.vallegrande.Credichain.Model.Solicitud;
import pe.edu.vallegrande.Credichain.Service.ContactoService;
import pe.edu.vallegrande.Credichain.Service.SolicitudService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("api/credi")
@AllArgsConstructor
public class SolicitudController {

    private final SolicitudService solicitudService;
    private final ContactoService contactoService;

    @GetMapping
    public Flux<Solicitud> getAllSolicitudes() {
        return solicitudService.getAll();
    }

    @GetMapping("/contacts")
    public Flux<Contacto> getAllContactos() {
        return contactoService.getAll();
    }

    @GetMapping("/solicitud/last")
    public Flux<LastSolicitud> getLastSolicitud() {
        return solicitudService.getLastSolicitud();
    }

    @PostMapping
    public Mono<ResponseEntity<Solicitud>> create(@RequestBody SolicitudRequest request) {
        return solicitudService.createSolicitud(request)
                .map(soli -> ResponseEntity.ok(soli))
                .defaultIfEmpty(ResponseEntity.badRequest().build());
    }

    @PostMapping("/create/contact")
    public Mono<ResponseEntity<Contacto>> createContact(@RequestBody Contacto contacto) {
        return contactoService.createContact(contacto)
                .map(contact -> ResponseEntity.ok(contact))
                .defaultIfEmpty(ResponseEntity.badRequest().build());
    }

    @PutMapping("/accept/{id}")
    public Mono<ResponseEntity<Solicitud>> acceptSolicitud(@PathVariable Long id) {
        return solicitudService.acceptRequest(id)
                .map(acceptSolicitud -> ResponseEntity.ok(acceptSolicitud))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PutMapping("/reject/{id}")
    public Mono<ResponseEntity<Solicitud>> rejectSolicitud(@PathVariable Long id) {
        return solicitudService.rejectRequest(id)
                .map(rejectSolicitud -> ResponseEntity.ok(rejectSolicitud))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

}
