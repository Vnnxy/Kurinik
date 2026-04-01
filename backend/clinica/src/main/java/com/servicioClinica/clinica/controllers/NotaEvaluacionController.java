package com.servicioClinica.clinica.controllers;

import com.servicioClinica.clinica.models.NotaEvaluacion;
import com.servicioClinica.clinica.services.NotaEvaluacionService;

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
 * Controller for the notaEvaluacions
 */
@RestController
@RequestMapping("/api/notaEvaluacion")
public class NotaEvaluacionController {
    // NotaEvaluacion service
    private final NotaEvaluacionService notaEvaluacionService;

    // Costructor for notaEvaluacion controller
    public NotaEvaluacionController(NotaEvaluacionService notaEvaluacionService) {
        this.notaEvaluacionService = notaEvaluacionService;
    }

    /**
     * Getter for a specific notaEvaluacion.
     * 
     * @param id Id of the notaEvaluacion we want to get
     * @return A response entity with the notaEvaluacion we inquired.
     */
    @GetMapping("/nota/{id}")
    public ResponseEntity<NotaEvaluacion> getNotaEvaluacion(@PathVariable int id) {
        NotaEvaluacion notaEvaluacion = notaEvaluacionService.getNotaEvaluacionById(id);
        if (notaEvaluacion == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(notaEvaluacion);
    }

    /**
     * Getter for all notaEvaluacions in the db
     * 
     * @return A list of notaEvaluacions.
     */
    @GetMapping("/{id}")
    public List<NotaEvaluacion> getAll(@PathVariable int id) {
        return notaEvaluacionService.getAllNotaEvaluacions(id);
    }

    /**
     * Creates a notaEvaluacion given a json, it is not required to specify the id.
     * 
     * @param notaEvaluacion NotaEvaluacion we want to add
     * @return Response entity with a status
     */
    @PostMapping()
    public ResponseEntity<Integer> addNotaEvaluacion(@RequestBody NotaEvaluacion notaEvaluacion) throws SQLException {
        Integer notaId = notaEvaluacionService.addNotaEvaluacion(notaEvaluacion);
        return ResponseEntity.ok(notaId);
    }

    /**
     * Updates an existing notaEvaluacion
     * 
     * @param id             Id of the notaEvaluacion we want to update
     * @param notaEvaluacion The new data
     * @return Response entity
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateNotaEvaluacion(@PathVariable int id, @RequestBody NotaEvaluacion notaEvaluacion) {
        notaEvaluacion.setId(id);
        notaEvaluacionService.updateNotaEvaluacion(notaEvaluacion);
        return ResponseEntity.ok().build();
    }

    /**
     * Deletes an existing notaEvaluacion from the db
     * 
     * @param id The id of the notaEvaluacion we want to delete
     * @return ResponseEntity
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotaEvaluacion(@PathVariable int id) {
        notaEvaluacionService.deleteNotaEvaluacion(id);
        return ResponseEntity.ok().build();
    }

}
