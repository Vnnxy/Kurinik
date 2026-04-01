package com.servicioClinica.clinica.services;

import com.servicioClinica.clinica.database.DatabaseConnection;
import com.servicioClinica.clinica.models.NotaEvaluacion;
import com.servicioClinica.clinica.repository.NotaEvaluacionRepository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Service;

/**
 * Class for the services used for notaEvaluacions.
 */
@Service
public class NotaEvaluacionService {
    private final NotaEvaluacionRepository notaEvaluacionsRepo;

    /**
     * Constructor for the service
     * 
     * @param notaEvaluacionsRepo Repo for the notaEvaluacion
     */
    public NotaEvaluacionService(NotaEvaluacionRepository notaEvaluacionsRepo) {
        this.notaEvaluacionsRepo = notaEvaluacionsRepo;
    }

    /**
     * Add a notaEvaluacion
     * 
     * @param notaEvaluacion NotaEvaluacion we want to add
     */
    public Integer addNotaEvaluacion(NotaEvaluacion notaEvaluacion) throws SQLException {
        if (!pacienteExists(notaEvaluacion.getIdPaciente())) {
            throw new IllegalArgumentException("El paciente con ID " + notaEvaluacion.getIdPaciente() + " no existe.");
        }
        return notaEvaluacionsRepo.addN(notaEvaluacion);
    }

    /**
     * Getter for a specific notaEvaluacion
     * 
     * @param id id of the notaEvaluacion
     * @return The notaEvaluacion
     */
    public NotaEvaluacion getNotaEvaluacionById(int id) {
        return notaEvaluacionsRepo.get(id);
    }

    /**
     * Getter for all notaEvaluacions
     * 
     * @return List containing all notaEvaluacions
     */
    public List<NotaEvaluacion> getAllNotaEvaluacions(int pacienteId) {
        return notaEvaluacionsRepo.getAll(pacienteId);
    }

    /**
     * Updates an existing notaEvaluacion
     * 
     * @param notaEvaluacion The notaEvaluacion with the new data
     */
    public void updateNotaEvaluacion(NotaEvaluacion notaEvaluacion) {
        notaEvaluacionsRepo.update(notaEvaluacion);
    }

    /**
     * Deletes a notaEvaluacion
     * 
     * @param id id of the notaEvaluacion we want to delete
     */
    public void deleteNotaEvaluacion(int id) {
        notaEvaluacionsRepo.delete(id);
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
