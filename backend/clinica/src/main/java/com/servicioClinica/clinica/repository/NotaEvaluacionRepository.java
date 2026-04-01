package com.servicioClinica.clinica.repository;

import com.servicioClinica.clinica.models.NotaEvaluacion;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.sql.Statement;

public class NotaEvaluacionRepository implements Repository<NotaEvaluacion> {
    private final Connection connection;

    /**
     * Constructor for the repository NotaEvaluacion
     */
    public NotaEvaluacionRepository(Connection connection) {
        this.connection = connection;
    }

    /**
     * Method that adds an evaluation note
     */
    @Override
    public void add(NotaEvaluacion notaEvaluacion) {
        try {
            PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO notaEvaluacion (idPaciente, fechaHora, peso, altura, signos, notas,motivo) VALUES (?, ?, ?, ?, ?, ?, ?)");
            statement.setInt(1, notaEvaluacion.getIdPaciente());
            statement.setString(2, notaEvaluacion.getFechaHora().toString());
            statement.setInt(3, notaEvaluacion.getPeso());
            statement.setInt(4, notaEvaluacion.getAltura());
            statement.setString(5, notaEvaluacion.getSignos());
            statement.setString(6, notaEvaluacion.getNotas());
            statement.setString(7, notaEvaluacion.getMotivo());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public Integer addN(NotaEvaluacion notaEvaluacion) {
        Integer generatedId = null;
        try {
            PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO notaEvaluacion (idPaciente, fechaHora, peso, altura, signos, notas,motivo) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            statement.setInt(1, notaEvaluacion.getIdPaciente());
            statement.setString(2, notaEvaluacion.getFechaHora().toString());
            statement.setInt(3, notaEvaluacion.getPeso());
            statement.setInt(4, notaEvaluacion.getAltura());
            statement.setString(5, notaEvaluacion.getSignos());
            statement.setString(6, notaEvaluacion.getNotas());
            statement.setString(7, notaEvaluacion.getMotivo());
            statement.executeUpdate();
            ResultSet rs = statement.getGeneratedKeys();
            if (rs.next()) {
                // Assuming the ID is an integer and is the first column in the ResultSet
                generatedId = rs.getInt(1);
            }

            // Close the ResultSet and Statement
            rs.close();
            statement.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return generatedId;
    }

    /**
     * Method that retrieves an evaluation note based on the Patient id
     */

    @Override
    public NotaEvaluacion get(int idNota) {
        try {
            PreparedStatement statement = connection
                    .prepareStatement("SELECT * FROM notaEvaluacion WHERE idNota = ?");
            statement.setInt(1, idNota);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return new NotaEvaluacion(resultSet.getInt("idNota"), resultSet.getInt("idPaciente"),
                        LocalDateTime.parse(resultSet.getString("fechaHora")), resultSet.getInt("peso"),
                        resultSet.getInt("altura"), resultSet.getString("signos"), resultSet.getString("notas"),
                        resultSet.getString("motivo"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Method that retrieves all of the evaluation notes from a given paciente
     */

    @Override
    public List<NotaEvaluacion> getAll() {
        List<NotaEvaluacion> notas = new ArrayList<>();
        try {
            PreparedStatement statement = connection.prepareStatement("SELECT * FROM notaEvaluacion");
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                notas.add(new NotaEvaluacion(resultSet.getInt("idNota"), resultSet.getInt("idPaciente"),
                        LocalDateTime.parse(resultSet.getString("fechaHora")), resultSet.getInt("peso"),
                        resultSet.getInt("altura"), resultSet.getString("signos"), resultSet.getString("notas"),
                        resultSet.getString("motivo")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return notas;
    }

    public List<NotaEvaluacion> getAll(int idPaciente) {
        List<NotaEvaluacion> notas = new ArrayList<>();

        try {
            PreparedStatement statement = connection
                    .prepareStatement("SELECT * FROM notaEvaluacion WHERE idPaciente = ?");
            statement.setInt(1, idPaciente);
            ResultSet resultSet = statement.executeQuery();

            while (resultSet.next()) {
                NotaEvaluacion nota = new NotaEvaluacion(
                        resultSet.getInt("idNota"),
                        resultSet.getInt("idPaciente"),
                        LocalDateTime.parse(resultSet.getString("fechaHora")),
                        resultSet.getInt("peso"),
                        resultSet.getInt("altura"),
                        resultSet.getString("signos"),
                        resultSet.getString("notas"),
                        resultSet.getString("motivo"));
                notas.add(nota);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return notas;
    }

    /**
     * Method that deletes a notaEvaluacion based on the id.
     */
    @Override
    public void delete(int id) {
        try {
            PreparedStatement statement = connection.prepareStatement("DELETE FROM notaEvaluacion WHERE idNota = ?");
            statement.setInt(1, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Method that updates the evaluation note
     */
    @Override
    public void update(NotaEvaluacion notaEvaluacion) {
        try {
            PreparedStatement statement = connection.prepareStatement(
                    "UPDATE notaEvaluacion SET idPaciente = ?, fechaHora = ?, peso = ?, altura = ?, signos = ?, notas = ?, motivo = ? WHERE idNota = ?");
            statement.setInt(1, notaEvaluacion.getIdPaciente());
            statement.setString(2, notaEvaluacion.getFechaHora().toString());
            statement.setInt(3, notaEvaluacion.getPeso());
            statement.setInt(4, notaEvaluacion.getAltura());
            statement.setString(5, notaEvaluacion.getSignos());
            statement.setString(6, notaEvaluacion.getNotas());
            statement.setString(7, notaEvaluacion.getMotivo());
            statement.setInt(8, notaEvaluacion.getId());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
