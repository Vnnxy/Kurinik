package com.servicioClinica.clinica.controllers;

import com.servicioClinica.clinica.models.Cita;
import com.servicioClinica.clinica.services.CitaService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

/**
 * Controller for the citas
 */
@RestController
@RequestMapping("/api/citas")
public class CitaController {
    // Cita service
    private final CitaService citaService;

    // Costructor for cita controller
    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    public CitaController() {
        citaService = null;
    }

    /**
     * Getter for a specific cita.
     * 
     * @param id Id of the cita we want to get
     * @return A response entity with the cita we inquired.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Cita> getCita(@PathVariable int id) {
        Cita cita = citaService.getCitaById(id);
        if (cita == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cita);
    }

    /**
     * Getter for all citas in the db
     * 
     * @return A list of citas.
     */
    @GetMapping
    public List<Cita> getAll() {
        return citaService.getAllCitas();
    }

    /**
     * Creates a cita given a json, it is not required to specify the id.
     * 
     * @param cita Cita we want to add
     * @return Response entity with a status
     */
    @PostMapping()
    public ResponseEntity<Void> addCita(@RequestBody Cita cita) throws SQLException {
        citaService.addCita(cita);
        return ResponseEntity.ok().build();
    }

    /**
     * Updates an existing cita
     * 
     * @param id   Id of the cita we want to update
     * @param cita The new data
     * @return Response entity
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateCita(@PathVariable int id, @RequestBody Cita cita) {
        cita.setId(id);
        citaService.updateCita(cita);
        return ResponseEntity.ok().build();
    }

    /**
     * Deletes an existing cita from the db
     * 
     * @param id The id of the cita we want to delete
     * @return ResponseEntity
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCita(@PathVariable int id) {
        citaService.deleteCita(id);
        return ResponseEntity.ok().build();
    }

}
