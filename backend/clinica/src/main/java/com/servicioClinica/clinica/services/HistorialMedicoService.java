package com.servicioClinica.clinica.services;

import com.servicioClinica.clinica.database.DatabaseConnection;
import com.servicioClinica.clinica.models.HistorialMedico;
import com.servicioClinica.clinica.repository.HistorialMedicoRepository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Service;
import java.sql.Connection;

/**
 * Class for the services used for historialMedicos.
 */
@Service
public class HistorialMedicoService {
    private final HistorialMedicoRepository histRepo;

    /**
     * Constructor for the service
     * 
     * @param histRepo Repo for the historial Medico
     */
    public HistorialMedicoService(HistorialMedicoRepository histRepo) {
        this.histRepo = histRepo;
    }

    /**
     * Add a historial
     * 
     * @param historial historial we want to add
     */
    public void addHistorialMedico(HistorialMedico historial) throws SQLException {
        if (!pacienteExists(historial.getIdPaciente())) {
            throw new IllegalArgumentException("El paciente con ID " + historial.getIdPaciente() + " no existe.");
        }

        histRepo.add(historial);
    }

    /**
     * Getter for a specific historialMedico
     * 
     * @param id id of the historialMedico
     * @return The historialMedico
     */
    public HistorialMedico getHistorialMedicoById(int id) {
        return histRepo.get(id);
    }

    /**
     * Getter for all historialMedicos
     * 
     * @return List containing all historialMedicos
     */
    public List<HistorialMedico> getAllHistorialMedicos() {
        return histRepo.getAll();
    }

    /**
     * Updates an existing historialMedico
     * 
     * @param historialMedico The historialMedico with the new data
     */
    public void updateHistorialMedico(HistorialMedico historialMedico) {
        histRepo.update(historialMedico);
    }

    /**
     * Deletes a historialMedico
     * 
     * @param id id of the historialMedico we want to delete
     */
    public void deleteHistorialMedico(int id) {
        histRepo.delete(id);
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
