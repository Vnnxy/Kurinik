package com.servicioClinica.clinica.repository;

import com.servicioClinica.clinica.models.Receta;
import com.servicioClinica.clinica.models.Farmaco;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RecetaRepository implements Repository<Receta> {

    private final Connection connection;

    /**
     * Constructor for the RECETA repository
     */

    public RecetaRepository(Connection connection) {
        this.connection = connection;
    }

    /**
     * Method that adds a prescription
     */
    @Override
    public void add(Receta receta) {
        try {
            PreparedStatement statement = connection
                    .prepareStatement("INSERT INTO Receta (idNota, idPaciente, archivo) VALUES (?, ?, ?)");
            statement.setInt(1, receta.getIdNota());
            statement.setInt(2, receta.getIdPaciente());
            statement.setString(3, receta.getArchivo());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Method that links a farmaco to a receta.
     */
    public void addFarmacoToReceta(Receta receta, int idFarmaco) {
        try {
            PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO contener (idFarmaco, idNota, idPaciente, idReceta) VALUES (?, ?, ?, ?)");
            statement.setInt(1, idFarmaco);
            statement.setInt(2, receta.getIdNota());
            statement.setInt(3, receta.getIdPaciente());
            statement.setInt(4, receta.getIdReceta());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Method that deletes a farmaco linked to a receta.
     */
    public void deleteFarmacoFromReceta(int idFarmaco, int idReceta) {
        try {
            PreparedStatement statement = connection
                    .prepareStatement("DELETE FROM contener WHERE idFarmaco = ? AND idReceta = ?");
            statement.setInt(1, idFarmaco);
            statement.setInt(2, idReceta);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Method that returns a list of all the prescriptions
     */

    @Override
    public List<Receta> getAll() {
        List<Receta> recetas = new ArrayList<>();
        try {
            Statement statement = connection.createStatement();
            ResultSet result = statement.executeQuery("SELECT * FROM Receta");
            while (result.next()) {
                recetas.add(new Receta(result.getInt("idReceta"), result.getInt("idNota"), result.getInt("idPaciente"),
                        result.getString("archivo")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return recetas;
    }

    /**
     * Method that returns a prescription by its id
     */

    @Override
    public Receta get(int id) {
        try {
            PreparedStatement statement = connection.prepareStatement("SELECT * FROM Receta WHERE idPaciente = ?");
            statement.setInt(1, id);
            ResultSet result = statement.executeQuery();
            if (result.next()) {
                return new Receta(result.getInt("idReceta"), result.getInt("idNota"), result.getInt("idPaciente"),
                        result.getString("archivo"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Receta> getRecetas(int idNota) {
        List<Receta> recetas = new ArrayList<>();
        try {

            PreparedStatement statement = connection.prepareStatement("SELECT * FROM receta WHERE idNota = ?");
            statement.setInt(1, idNota);
            ResultSet result = statement.executeQuery();
            while (result.next()) {
                recetas.add(new Receta(result.getInt("idReceta"), result.getInt("idNota"), result.getInt("idPaciente"),
                        result.getString("archivo")));
            }
            return recetas;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Method that updates a prescription
     */

    @Override
    public void update(Receta receta) {
        try {
            PreparedStatement statement = connection
                    .prepareStatement("UPDATE Receta SET idNota = ?, idPaciente = ?, archivo = ? WHERE idReceta = ?");
            statement.setInt(1, receta.getIdNota());
            statement.setInt(2, receta.getIdPaciente());
            statement.setString(3, receta.getArchivo());
            statement.setInt(4, receta.getIdReceta());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Method that deletes a prescription
     */

    @Override
    public void delete(int idReceta) {
        try {
            PreparedStatement statement = connection.prepareStatement("DELETE FROM Receta WHERE idReceta = ?");
            statement.setInt(1, idReceta);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Method that returns a list of all the farmacos linked to a prescription
     */

    public List<Farmaco> getFarmacos(int idReceta) {
        Map<Integer, Farmaco> farmacoMap = new HashMap<>();
        try {
            PreparedStatement statement = connection.prepareStatement(
                    "SELECT f.idFarmaco, f.nombre, f.instruccionesPorDefecto, fd.dosis " +
                            "FROM farmaco f " +
                            "JOIN farmaco_dosis fd ON f.idFarmaco = fd.idFarmaco " +
                            "JOIN contener c ON f.idFarmaco = c.idFarmaco " +
                            "WHERE c.idReceta = ?");
            statement.setInt(1, idReceta);
            ResultSet result = statement.executeQuery();

            while (result.next()) {
                int id = result.getInt("idFarmaco");
                String nombre = result.getString("nombre");
                String instrucciones = result.getString("instruccionesPorDefecto");
                String dosis = result.getString("dosis");
                int controlado = result.getInt("controlado");
                boolean cont = controlado == 1 ? true : false;

                // If the farmaco isn't already in the map, add it
                if (!farmacoMap.containsKey(id)) {
                    farmacoMap.put(id, new Farmaco(id, nombre, new ArrayList<>(), instrucciones, cont));
                }

                // Add this dosis to the farmaco's dosis list
                farmacoMap.get(id).getDosis().add(dosis);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return new ArrayList<>(farmacoMap.values());
    }

    /**
     * Method that returns the prescriptions linked to a patient that contain a
     * specific farmaco.
     */

    public List<Receta> getRecetaByPatientIdAndFarmaco(int idPaciente, String farmacoName) {
        List<Receta> recetas = new ArrayList<>();
        try {
            PreparedStatement statement = connection.prepareStatement(
                    "SELECT r.idReceta FROM contener JOIN receta r ON contener.idReceta = r.idReceta JOIN farmaco f ON contener.idFarmaco = f.idFarmaco WHERE contener.idPaciente = ? AND f.nombre LIKE ?");
            statement.setInt(1, idPaciente);
            statement.setString(2, "%" + farmacoName + "%"); // Added the % to allow for partial matches
            ResultSet result = statement.executeQuery();
            while (result.next()) {
                Receta receta = get(result.getInt("idReceta"));
                recetas.add(receta);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return recetas;
    }
}
