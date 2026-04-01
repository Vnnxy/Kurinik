package com.servicioClinica.clinica.repository;

import com.servicioClinica.clinica.models.HistorialMedico;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class HistorialMedicoRepository implements Repository<HistorialMedico> {

    private final Connection connection;

    /**
     * Constructor dor the repository HistorialMedico
     */
    public HistorialMedicoRepository(Connection connection) {
        this.connection = connection;
    }

    /**
     * Method that adds a medical History
     */
    @Override
    public void add(HistorialMedico historialMedico) {
        try {
            PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO historialMedico (idPaciente, grupoSanguineo, apPatologicos, apNoPatologicos, apHeredoFam, apQuirugicos, apGinecoObstreticos, exploracionFisica) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            statement.setInt(1, historialMedico.getIdPaciente());
            statement.setString(2, historialMedico.getGrupoSanguineo());
            statement.setString(3, historialMedico.getApPatologicos());
            statement.setString(4, historialMedico.getApNoPatologicos());
            statement.setString(5, historialMedico.getApHeredoFam());
            statement.setString(6, historialMedico.getApQuirugicos());
            statement.setString(7, historialMedico.getApGinecoObstreticos());
            statement.setString(8, historialMedico.getExploracionFisica());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Method that retrieves a medical history by id
     */

    @Override
    public HistorialMedico get(int idPaciente) {
        try {
            PreparedStatement statement = connection
                    .prepareStatement("SELECT * FROM historialMedico WHERE idPaciente = ?");
            statement.setInt(1, idPaciente);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return new HistorialMedico(resultSet.getInt("idHistorial"), resultSet.getInt("idPaciente"),
                        resultSet.getString("grupoSanguineo"), resultSet.getString("apPatologicos"),
                        resultSet.getString("apNoPatologicos"), resultSet.getString("apHeredoFam"),
                        resultSet.getString("apQuirugicos"), resultSet.getString("apGinecoObstreticos"),
                        resultSet.getString("exploracionFisica"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Method that retrieves all medica histories (Won't be used)
     */
    @Override
    public List<HistorialMedico> getAll() {
        return null;
    }

    /**
     * Method that deletes a medical history assigned to a patient.
     */
    @Override
    public void delete(int id) {
        try {
            PreparedStatement statement = connection
                    .prepareStatement("DELETE FROM historialMedico WHERE idHistorial = ?");
            statement.setInt(1, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Method that updates a medical history
     */
    @Override
    public void update(HistorialMedico historialMedico) {
        try {
            PreparedStatement statement = connection.prepareStatement(
                    "UPDATE historialMedico SET grupoSanguineo = ?, apPatologicos = ?, apNoPatologicos = ?, apHeredoFam = ?, apQuirugicos = ?, apGinecoObstreticos = ?, exploracionFisica = ? WHERE idHistorial = ?");
            statement.setString(1, historialMedico.getGrupoSanguineo());
            statement.setString(2, historialMedico.getApPatologicos());
            statement.setString(3, historialMedico.getApNoPatologicos());
            statement.setString(4, historialMedico.getApHeredoFam());
            statement.setString(5, historialMedico.getApQuirugicos());
            statement.setString(6, historialMedico.getApGinecoObstreticos());
            statement.setString(7, historialMedico.getExploracionFisica());
            statement.setInt(8, historialMedico.getId());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}
