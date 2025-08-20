package pe.edu.vallegrande.Credichain.Service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import pe.edu.vallegrande.Credichain.Model.Contacto;
import pe.edu.vallegrande.Credichain.Repository.ContactoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ContactoService {

    private final ContactoRepository contactoRepository;

    // Método para obtener todos los contactos
    public Flux<Contacto> getAll() {
        return contactoRepository.findAll();
    }

    // Método para guardar un nuevo contacto
    public Mono<Contacto> createContact(Contacto contacto) {
        Contacto contact = new Contacto();
        contact.setNameContacto(contacto.getNameContacto());
        contact.setAddressContacto(contacto.getAddressContacto());
        contact.setUserRegistered(contacto.getUserRegistered());
        return contactoRepository.save(contact);
    }

}
