package com.servicioClinica.clinica.controllers;

import com.servicioClinica.clinica.models.HistorialMedico;
import com.servicioClinica.clinica.services.HistorialMedicoService;

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
 * Controller for the historialMedicos
 */
@RestController
@RequestMapping("/api/historialMedicos")
public class HistorialMedicoController {
    // HistorialMedico service
    private final HistorialMedicoService historialMedicoService;

    // Costructor for historialMedico controller
    public HistorialMedicoController(HistorialMedicoService historialMedicoService) {
        this.historialMedicoService = historialMedicoService;
    }

    /**
     * Getter for a specific historialMedico.
     * 
     * @param id Id of the historialMedico we want to get
     * @return A response entity with the historialMedico we inquired.
     */
    @GetMapping("/{id}")
    public ResponseEntity<HistorialMedico> getHistorialMedico(@PathVariable int id) {
        HistorialMedico historialMedico = historialMedicoService.getHistorialMedicoById(id);
        if (historialMedico == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(historialMedico);
    }

    /**
     * Getter for all historialMedicos in the db
     * 
     * @return A list of historialMedicos.
     */
    @GetMapping
    public List<HistorialMedico> getAll() {
        return historialMedicoService.getAllHistorialMedicos();
    }

    /**
     * Creates a historialMedico given a json, it is not required to specify the id.
     * 
     * @param historialMedico HistorialMedico we want to add
     * @return Response entity with a status
     */
    @PostMapping()
    public ResponseEntity<Void> addHistorialMedico(@RequestBody HistorialMedico historialMedico) throws SQLException {
        historialMedicoService.addHistorialMedico(historialMedico);
        return ResponseEntity.ok().build();
    }

    /**
     * Updates an existing historialMedico
     * 
     * @param id              Id of the historialMedico we want to update
     * @param historialMedico The new data
     * @return Response entity
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateHistorialMedico(@PathVariable int id,
            @RequestBody HistorialMedico historialMedico) {
        historialMedico.setId(id);
        historialMedicoService.updateHistorialMedico(historialMedico);
        return ResponseEntity.ok().build();
    }

    /**
     * Deletes an existing historialMedico from the db
     * 
     * @param id The id of the historialMedico we want to delete
     * @return ResponseEntity
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistorialMedico(@PathVariable int id) {
        historialMedicoService.deleteHistorialMedico(id);
        return ResponseEntity.ok().build();
    }

}
