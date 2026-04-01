package com.servicioClinica.clinica.controllers;

import com.servicioClinica.clinica.models.Paciente;
import com.servicioClinica.clinica.services.PacienteService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

/**
 * Controller for the pacientes
 */
@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {
    // Paciente service
    private final PacienteService pacienteService;

    // Costructor for paciente controller
    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    /**
     * Getter for a specific paciente.
     * 
     * @param id Id of the paciente we want to get
     * @return A response entity with the paciente we inquired.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Paciente> getPaciente(@PathVariable int id) {
        Paciente paciente = pacienteService.getPacienteById(id);
        if (paciente == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(paciente);
    }

    /**
     * Getter for all pacientes in the db
     * 
     * @return A list of pacientes.
     */
    @GetMapping
    public List<Paciente> getAll() {
        return pacienteService.getAllPacientes();
    }

    private static class PacienteIdResponse {
        private int id;

        public PacienteIdResponse(int id) {
            this.id = id;
        }

        public int getId() {
            return id;
        }
    }

    /**
     * Creates a paciente given a json, it is not required to specify the id.
     * 
     * @param paciente Paciente we want to add
     * @return Response entity with a status
     */
    @PostMapping()
    public ResponseEntity<PacienteIdResponse> addPaciente(@RequestBody Paciente paciente) {
        int i = pacienteService.addPaciente(paciente);
        PacienteIdResponse response = new PacienteIdResponse(i);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Updates an existing paciente
     * 
     * @param id       Id of the paciente we want to update
     * @param paciente The new data
     * @return Response entity
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> updatePaciente(@PathVariable int id, @RequestBody Paciente paciente) {
        paciente.setId(id);
        pacienteService.updatePaciente(paciente);
        return ResponseEntity.ok().build();
    }

    /**
     * Deletes an existing paciente from the db
     * 
     * @param id The id of the paciente we want to delete
     * @return ResponseEntity
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaciente(@PathVariable int id) {
        pacienteService.deletePaciente(id);
        return ResponseEntity.ok().build();
    }

}
