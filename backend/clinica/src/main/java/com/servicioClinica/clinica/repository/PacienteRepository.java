package com.servicioClinica.clinica.repository;

import com.servicioClinica.clinica.models.Paciente;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.ArrayList;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.HashMap;

public class PacienteRepository implements Repository<Paciente> {
    private final Connection connection;

    public PacienteRepository(Connection connection) {
        this.connection = connection;
    }

    @Override
    /**
     * Method to add a new Paciente to the database-
     * 
     * @param paciente The Paciente object to be added to the database.
     */
    public void add(Paciente paciente) {
        String sqlPaciente = "INSERT INTO paciente(nombre, apellido, fechaNacimiento,sexo, calle, colonia, estado, cp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        String sqlPhone = "INSERT INTO telefonoPaciente(idPaciente, telefono) VALUES (?, ?)";
        String sqlCorreo = "INSERT INTO correoPaciente(idPaciente, correo) VALUES (?, ?)";

        try {
            LocalDate fechaNacimiento = paciente.getFechaNacimiento();
            String fechaNacimientoString = fechaNacimiento.toString();
            // Insert into Paciente table
            PreparedStatement statement = connection.prepareStatement(sqlPaciente);
            statement.setString(1, paciente.getNombre());
            statement.setString(2, paciente.getApellido());
            statement.setString(3, fechaNacimientoString);
            statement.setString(4, paciente.getSexo());
            statement.setString(5, paciente.getCalle());
            statement.setString(6, paciente.getColonia());
            statement.setString(7, paciente.getEstado());
            statement.setInt(8, paciente.getCp());
            statement.executeUpdate();

            // Retrieve the generated ID
            PreparedStatement getIdStatement = connection.prepareStatement("SELECT last_insert_rowid()");
            ResultSet resultSet = getIdStatement.executeQuery();
            int pacienteId = -1;
            if (resultSet.next()) {
                pacienteId = resultSet.getInt(1);
            }

            // Insert into TelefonoPaciente table
            PreparedStatement phoneStatement = connection.prepareStatement(sqlPhone);
            for (String telefono : paciente.getTelefonos()) { // Assuming telefonos is a List<String>
                phoneStatement.setInt(1, pacienteId);
                phoneStatement.setString(2, telefono);
                phoneStatement.executeUpdate();
            }

            // Insert into CorreoPaciente table
            PreparedStatement correoStatement = connection.prepareStatement(sqlCorreo);
            for (String correo : paciente.getCorreos()) { // Assuming correos is a List<String>
                correoStatement.setInt(1, pacienteId);
                correoStatement.setString(2, correo);
                correoStatement.executeUpdate();
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public int addP(Paciente paciente) {
        String sqlPaciente = "INSERT INTO paciente(nombre, apellido, fechaNacimiento, sexo, calle, colonia, estado, cp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        String sqlPhone = "INSERT INTO telefonoPaciente(idPaciente, telefono) VALUES (?, ?)";
        String sqlCorreo = "INSERT INTO correoPaciente(idPaciente, correo) VALUES (?, ?)";
        int pacienteId = -1;

        try {
            LocalDate fechaNacimiento = paciente.getFechaNacimiento();
            String fechaNacimientoString = fechaNacimiento.toString();

            PreparedStatement statement = connection.prepareStatement(sqlPaciente);
            statement.setString(1, paciente.getNombre());
            statement.setString(2, paciente.getApellido());
            statement.setString(3, fechaNacimientoString);
            statement.setString(4, paciente.getSexo());
            statement.setString(5, paciente.getCalle());
            statement.setString(6, paciente.getColonia());
            statement.setString(7, paciente.getEstado());

            if (paciente.getCp() != null) {
                statement.setInt(8, paciente.getCp());
            } else {
                statement.setNull(8, java.sql.Types.INTEGER);
            }

            statement.executeUpdate();

            PreparedStatement getIdStatement = connection.prepareStatement("SELECT last_insert_rowid()");
            ResultSet resultSet = getIdStatement.executeQuery();
            if (resultSet.next()) {
                pacienteId = resultSet.getInt(1);
            }

            // Insert phone numbers only if list is not null
            if (paciente.getTelefonos() != null) {
                PreparedStatement phoneStatement = connection.prepareStatement(sqlPhone);
                for (String telefono : paciente.getTelefonos()) {
                    phoneStatement.setInt(1, pacienteId);
                    phoneStatement.setString(2, telefono);
                    phoneStatement.executeUpdate();
                }
            }

            // Insert emails only if list is not null
            if (paciente.getCorreos() != null) {
                PreparedStatement correoStatement = connection.prepareStatement(sqlCorreo);
                for (String correo : paciente.getCorreos()) {
                    correoStatement.setInt(1, pacienteId);
                    correoStatement.setString(2, correo);
                    correoStatement.executeUpdate();
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return pacienteId;
    }

    @Override
    /**
     * Method to get a Paciente based on the id.
     * 
     * @param id The id of the Paciente to be retrieved.
     */
    public Paciente get(int id) {
        String sql = "SELECT * FROM paciente where idPaciente = ?";
        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setInt(1, id);
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                // Create a Paciente object from the result set
                // We handle the date as a string
                Paciente paciente = new Paciente();
                // Populate Paciente details only once
                paciente.setId(id);
                paciente.setNombre(resultSet.getString("nombre"));
                paciente.setApellido(resultSet.getString("apellido"));
                String fechaNacimientoString = resultSet.getString("fechaNacimiento");
                LocalDate fechaNacimiento = LocalDate.parse(fechaNacimientoString, DateTimeFormatter.ISO_DATE);
                paciente.setFechaNacimiento(fechaNacimiento);
                paciente.setSexo(resultSet.getString("sexo"));
                paciente.setCalle(resultSet.getString("calle"));
                paciente.setColonia(resultSet.getString("colonia"));
                paciente.setEstado(resultSet.getString("estado"));
                paciente.setCp(resultSet.getInt("cp"));
                // Get the phone numbers
                PreparedStatement phoneStatement = connection
                        .prepareStatement("SELECT telefono FROM telefonoPaciente WHERE idPaciente = ?");
                phoneStatement.setInt(1, id);
                ResultSet phoneResultSet = phoneStatement.executeQuery();
                while (phoneResultSet.next()) {
                    paciente.addTelefono(phoneResultSet.getString("telefono"));
                }

                // Get the emails
                PreparedStatement correoStatement = connection
                        .prepareStatement("SELECT correo FROM correoPaciente WHERE idPaciente = ?");
                correoStatement.setInt(1, id);
                ResultSet correoResultSet = correoStatement.executeQuery();
                while (correoResultSet.next()) {
                    paciente.addCorreo(correoResultSet.getString("correo"));
                }
                return paciente;
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Method to get all Pacientes
     */
    @Override
    public List<Paciente> getAll() {
        String sql = "SELECT p.idPaciente, p.nombre, p.apellido, p.fechaNacimiento,p.sexo, p.calle, p.colonia, p.estado, p.cp, "
                +
                "t.telefono, c.correo " +
                "FROM paciente p " +
                "LEFT JOIN telefonoPaciente t ON p.idPaciente = t.idPaciente " +
                "LEFT JOIN correoPaciente c ON p.idPaciente = c.idPaciente " +
                "ORDER BY p.idPaciente";

        Map<Integer, Paciente> pacienteMap = new HashMap<>(); // Map to avoid duplicates
        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                int idPaciente = resultSet.getInt("idPaciente");

                // Get or create the Paciente object
                Paciente paciente = pacienteMap.getOrDefault(idPaciente, new Paciente());
                if (!pacienteMap.containsKey(idPaciente)) {
                    // Populate Paciente details only once
                    paciente.setId(idPaciente);
                    paciente.setNombre(resultSet.getString("nombre"));
                    paciente.setApellido(resultSet.getString("apellido"));
                    String fechaNacimientoString = resultSet.getString("fechaNacimiento");
                    LocalDate fechaNacimiento = LocalDate.parse(fechaNacimientoString, DateTimeFormatter.ISO_DATE);
                    paciente.setFechaNacimiento(fechaNacimiento);
                    paciente.setSexo(resultSet.getString("sexo"));
                    paciente.setCalle(resultSet.getString("calle"));
                    paciente.setColonia(resultSet.getString("colonia"));
                    paciente.setEstado(resultSet.getString("estado"));
                    paciente.setCp(resultSet.getInt("cp"));
                    pacienteMap.put(idPaciente, paciente);
                }

                // Add phone number if present
                String telefono = resultSet.getString("telefono");
                if (!resultSet.wasNull() && !paciente.getTelefonos().contains(telefono)) {
                    paciente.addTelefono(telefono);
                }

                // Add email if present
                String correo = resultSet.getString("correo");
                if (correo != null && !paciente.getCorreos().contains(correo)) {
                    paciente.addCorreo(correo);
                }
            }
            resultSet.close();
            statement.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Convert the map values to a list
        return new ArrayList<>(pacienteMap.values());
    }

    @Override
    /**
     * Method to delete a Paciente based on the id.
     * 
     * @param id The id of the Paciente to be deleted.
     */
    public void delete(int id) {
        String sql = "DELETE FROM paciente where idPaciente = ?";
        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setInt(1, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Method to update a Paciente
     * 
     * @param paciente The Paciente object to be updated.
     */
    @Override
    public void update(Paciente paciente) {
        String sqlUpdatePaciente = "UPDATE paciente SET nombre = ?, apellido = ?, fechaNacimiento = ?, sexo=?, calle = ?, colonia = ?, estado = ?, cp = ? WHERE idPaciente = ?";
        String sqlDeletePhones = "DELETE FROM telefonoPaciente WHERE idPaciente = ?";
        String sqlDeleteEmails = "DELETE FROM correoPaciente WHERE idPaciente = ?";
        String sqlInsertPhone = "INSERT INTO telefonoPaciente(idPaciente, telefono) VALUES (?, ?)";
        String sqlInsertEmail = "INSERT INTO correoPaciente(idPaciente, correo) VALUES (?, ?)";

        try {
            connection.setAutoCommit(false); // Begin transaction

            LocalDate fechaNacimiento = paciente.getFechaNacimiento();
            String fechaNacimientoString = fechaNacimiento.toString();

            // Update the paciente table
            PreparedStatement updatePacienteStmt = connection.prepareStatement(sqlUpdatePaciente);
            updatePacienteStmt.setString(1, paciente.getNombre());
            updatePacienteStmt.setString(2, paciente.getApellido());
            updatePacienteStmt.setString(3, fechaNacimientoString);
            updatePacienteStmt.setString(4, paciente.getSexo());
            updatePacienteStmt.setString(5, paciente.getCalle());
            updatePacienteStmt.setString(6, paciente.getColonia());
            updatePacienteStmt.setString(7, paciente.getEstado());
            updatePacienteStmt.setInt(8, paciente.getCp());
            updatePacienteStmt.setInt(9, paciente.getId());
            updatePacienteStmt.executeUpdate();

            // Delete existing phone numbers
            PreparedStatement deletePhonesStmt = connection.prepareStatement(sqlDeletePhones);
            deletePhonesStmt.setInt(1, paciente.getId());
            deletePhonesStmt.executeUpdate();

            // Delete existing emails
            PreparedStatement deleteEmailsStmt = connection.prepareStatement(sqlDeleteEmails);
            deleteEmailsStmt.setInt(1, paciente.getId());
            deleteEmailsStmt.executeUpdate();

            // Insert updated phone numbers
            PreparedStatement insertPhoneStmt = connection.prepareStatement(sqlInsertPhone);
            for (String telefono : paciente.getTelefonos()) {
                insertPhoneStmt.setInt(1, paciente.getId());
                insertPhoneStmt.setString(2, telefono);
                insertPhoneStmt.executeUpdate();
            }

            // Insert updated emails
            PreparedStatement insertEmailStmt = connection.prepareStatement(sqlInsertEmail);
            for (String correo : paciente.getCorreos()) {
                insertEmailStmt.setInt(1, paciente.getId());
                insertEmailStmt.setString(2, correo);
                insertEmailStmt.executeUpdate();
            }

            connection.commit(); // Commit transaction
        } catch (SQLException e) {
            try {
                connection.rollback(); // Rollback in case of error
            } catch (SQLException rollbackEx) {
                rollbackEx.printStackTrace();
            }
            e.printStackTrace();
        } finally {
            try {
                connection.setAutoCommit(true); // Restore default behavior
            } catch (SQLException autoCommitEx) {
                autoCommitEx.printStackTrace();
            }
        }
    }
}
