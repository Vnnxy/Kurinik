package com.servicioClinica.clinica.services;

import com.servicioClinica.clinica.database.DatabaseConnection;
import com.servicioClinica.clinica.models.Receta;
import com.servicioClinica.clinica.models.Farmaco;
import com.servicioClinica.clinica.repository.RecetaRepository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Service;

/**
 * Class for the services used for recetas.
 */
@Service
public class RecetaService {
    private final RecetaRepository recetasRepo;

    /**
     * Constructor for the service
     * 
     * @param recetasRepo Repo for the receta
     */
    public RecetaService(RecetaRepository recetasRepo) {
        this.recetasRepo = recetasRepo;
    }

    /**
     * Add a receta
     * 
     * @param receta Receta we want to add
     */
    public void addReceta(Receta receta) throws SQLException {
        if (!notaExists(receta.getIdNota()) || !pacienteExists(receta.getIdPaciente())) {
            throw new IllegalArgumentException("Error en los datos");
        }
        recetasRepo.add(receta);
    }

    public void addRecetaAndLink(Receta receta, int idFarmaco) {
        recetasRepo.addFarmacoToReceta(receta, idFarmaco);
    }

    public void unlinkFarma(int idFarmaco, int idReceta) {
        recetasRepo.deleteFarmacoFromReceta(idFarmaco, idReceta);
    }

    public List<Farmaco> getFarmacosInReceta(int idReceta) {
        return recetasRepo.getFarmacos(idReceta);
    }

    public List<Receta> getRecetaConFarmacosDePaciente(int idPaciente, String farmaco) {
        return recetasRepo.getRecetaByPatientIdAndFarmaco(idPaciente, farmaco);
    }

    /**
     * Getter for a specific receta
     * 
     * @param id id of the receta
     * @return The receta
     */
    public Receta getRecetaById(int id) {
        return recetasRepo.get(id);
    }

    /**
     * Getter for all recetas
     * 
     * @return List containing all recetas
     */
    public List<Receta> getAllRecetas() {
        return recetasRepo.getAll();
    }

    public List<Receta> getAllRecetasInNota(int idNota) {
        return recetasRepo.getRecetas(idNota);
    }

    /**
     * Updates an existing receta
     * 
     * @param receta The receta with the new data
     */
    public void updateReceta(Receta receta) {
        recetasRepo.update(receta);
    }

    /**
     * Deletes a receta
     * 
     * @param id id of the receta we want to delete
     */
    public void deleteReceta(int id) {
        recetasRepo.delete(id);
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

    private boolean notaExists(int idNota) throws SQLException {
        try (Connection conn = DatabaseConnection.getConnection()) {
            String sql = "SELECT 1 FROM NotaEvaluacion WHERE idNota = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, idNota);
                try (ResultSet rs = stmt.executeQuery()) {
                    return rs.next(); // true if a row is returned
                }
            }
        }
    }
}
