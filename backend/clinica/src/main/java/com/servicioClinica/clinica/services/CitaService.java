package com.servicioClinica.clinica.services;

import com.servicioClinica.clinica.database.DatabaseConnection;
import com.servicioClinica.clinica.models.Cita;
import com.servicioClinica.clinica.repository.CitaRepository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Service;
import java.sql.Connection;

/**
 * Class for the services used for citas.
 */
@Service
public class CitaService {
    private final CitaRepository citaRepo;

    /**
     * Constructor for the service
     * 
     * @param citaRepo Repo for the historial Medico
     */
    public CitaService(CitaRepository citaRepo) {
        this.citaRepo = citaRepo;
    }

    public CitaService() {
        citaRepo = null;
    }

    /**
     * Add a historial
     * 
     * @param historial historial we want to add
     */
    public void addCita(Cita historial) throws SQLException {
        if (!pacienteExists(historial.getIdPaciente())) {
            throw new IllegalArgumentException("El paciente con ID " + historial.getIdPaciente() + " no existe.");
        }

        citaRepo.add(historial);
    }

    /**
     * Getter for a specific cita
     * 
     * @param id id of the cita
     * @return The cita
     */
    public Cita getCitaById(int id) {
        return citaRepo.get(id);
    }

    /**
     * Getter for all citas
     * 
     * @return List containing all citas
     */
    public List<Cita> getAllCitas() {
        return citaRepo.getAll();
    }

    /**
     * Updates an existing cita
     * 
     * @param cita The cita with the new data
     */
    public void updateCita(Cita cita) {
        citaRepo.update(cita);
    }

    /**
     * Deletes a cita
     * 
     * @param id id of the cita we want to delete
     */
    public void deleteCita(int id) {
        citaRepo.delete(id);
    }

    private boolean pacienteExists(int idPaciente) throws SQLException {
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT 1 FROM Paciente WHERE idPaciente = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idPaciente);
                try (ResultSet rs = stmt.executeQuery()) {
                    return rs.next(); // true if a row is returned
                }
            }
        }
    }

}
