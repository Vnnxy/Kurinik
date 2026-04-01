package com.servicioClinica.clinica.services;

import com.servicioClinica.clinica.models.Paciente;
import com.servicioClinica.clinica.repository.PacienteRepository;

import java.util.List;

import org.springframework.stereotype.Service;

/**
 * Class for the services used for pacientes.
 */
@Service
public class PacienteService {
    private final PacienteRepository pacientesRepo;

    /**
     * Constructor for the service
     * 
     * @param pacientesRepo Repo for the paciente
     */
    public PacienteService(PacienteRepository pacientesRepo) {
        this.pacientesRepo = pacientesRepo;
    }

    /**
     * Add a paciente
     * 
     * @param paciente Paciente we want to add
     */
    public int addPaciente(Paciente paciente) {
        if (paciente.getNombre() == null || paciente.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre del paciente no puede estar vacío.");
        }
        return pacientesRepo.addP(paciente);
    }

    /**
     * Getter for a specific paciente
     * 
     * @param id id of the paciente
     * @return The paciente
     */
    public Paciente getPacienteById(int id) {
        return pacientesRepo.get(id);
    }

    /**
     * Getter for all pacientes
     * 
     * @return List containing all pacientes
     */
    public List<Paciente> getAllPacientes() {
        return pacientesRepo.getAll();
    }

    /**
     * Updates an existing paciente
     * 
     * @param paciente The paciente with the new data
     */
    public void updatePaciente(Paciente paciente) {
        pacientesRepo.update(paciente);
    }

    /**
     * Deletes a paciente
     * 
     * @param id id of the paciente we want to delete
     */
    public void deletePaciente(int id) {
        pacientesRepo.delete(id);
    }
}
