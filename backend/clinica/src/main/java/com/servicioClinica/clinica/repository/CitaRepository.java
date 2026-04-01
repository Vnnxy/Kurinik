package com.servicioClinica.clinica.repository;

import com.servicioClinica.clinica.models.Cita;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

public class CitaRepository implements Repository<Cita> {

    private final Connection connection;

    /**
     * Constructor for the CitaRepository
     */
    public CitaRepository(Connection connection) {
        this.connection = connection;
    }

    public CitaRepository() {
        connection = null;
    }

    /**
     * Method that retrieves the appointments based on the Patient id
     * 
     * @param idPaciente Patient's id
     */
    public Cita get(int idPaciente) {
        try {
            PreparedStatement statement = connection.prepareStatement("SELECT * FROM Cita WHERE idPaciente = ?");
            statement.setInt(1, idPaciente);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return new Cita(resultSet.getInt("idCita"), resultSet.getInt("idPaciente"),
                        LocalDateTime.parse(resultSet.getString("fecha")), resultSet.getString("notas"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Method that retrieves all of the appointments
     */
    public List<Cita> getAll() {
        List<Cita> citas = new ArrayList<>();
        try {
            PreparedStatement statement = connection.prepareStatement("SELECT * FROM Cita");
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                citas.add(new Cita(resultSet.getInt("idCita"), resultSet.getInt("idPaciente"),
                        LocalDateTime.parse(resultSet.getString("fecha")), resultSet.getString("notas")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return citas;
    }

    /**
     * Method that adds an appointment
     */
    public void add(Cita cita) {
        try {
            PreparedStatement statement = connection
                    .prepareStatement("INSERT INTO Cita (idPaciente, fecha, notas) VALUES (?, ?, ?)");
            statement.setInt(1, cita.getIdPaciente());
            statement.setString(2, cita.getFecha().toString());
            statement.setString(3, cita.getNotas());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Method that deletes an appointment
     */
    public void delete(int idPaciente) {
        try {
            PreparedStatement statement = connection.prepareStatement("DELETE FROM Cita WHERE idPaciente = ?");
            statement.setInt(1, idPaciente);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Method that updates an appointment
     */
    public void update(Cita cita) {
        try {
            PreparedStatement statement = connection
                    .prepareStatement("UPDATE Cita SET idPaciente = ?, fecha = ?, notas = ? WHERE idCita = ?");
            statement.setInt(1, cita.getIdPaciente());
            statement.setString(2, cita.getFecha().toString());
            statement.setString(3, cita.getNotas());
            statement.setInt(4, cita.getId());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
