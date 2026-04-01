package com.servicioClinica.clinica.repository;

import com.servicioClinica.clinica.models.Farmaco;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.ArrayList;

public class FarmacoRepository implements Repository<Farmaco> {

    private final Connection connection;

    /**
     * Constructor for the farmacos repository
     */
    public FarmacoRepository(Connection connection) {
        this.connection = connection;
    }

    /**
     * Method that adds a drug
     */
    @Override
    public void add(Farmaco farmaco) {
        String sql = "INSERT INTO farmaco(nombre, instruccionesPorDefecto, controlado) VALUES (?,?,?)";
        String sqlDosis = "INSERT INTO farmaco_dosis(idFarmaco, dosis) VALUES (?, ?)";

        try {
            connection.setAutoCommit(false);

            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, farmaco.getNombre());
            statement.setString(2, farmaco.getInstruccionesPorDefecto());
            statement.setInt(3, farmaco.getControladoInt());
            statement.executeUpdate();

            ResultSet generatedKeys = statement.getGeneratedKeys();
            if (generatedKeys.next()) {
                int idFarmaco = generatedKeys.getInt(1);

                PreparedStatement stmtDosis = connection.prepareStatement(sqlDosis);
                for (String d : farmaco.getDosis()) {
                    stmtDosis.setInt(1, idFarmaco);
                    stmtDosis.setString(2, d);
                    stmtDosis.addBatch();
                }
                stmtDosis.executeBatch();
            }

            connection.commit();

        } catch (SQLException e) {
            try {
                connection.rollback();
            } catch (SQLException ignored) {
            }
            e.printStackTrace();
        } finally {
            try {
                connection.setAutoCommit(true);
            } catch (SQLException ignored) {
            }
        }

    }

    /**
     * Method that retrieves a drug based on the drug id
     */
    @Override
    public Farmaco get(int idFarmaco) {
        String sqlFarmaco = "SELECT * FROM farmaco WHERE idFarmaco = ?";
        String sqlDosis = "SELECT dosis FROM farmaco_dosis WHERE idFarmaco = ?";

        try {
            PreparedStatement stmtFarmaco = connection.prepareStatement(sqlFarmaco);
            stmtFarmaco.setInt(1, idFarmaco);
            ResultSet rsFarmaco = stmtFarmaco.executeQuery();

            if (rsFarmaco.next()) {
                String nombre = rsFarmaco.getString("nombre");
                String instrucciones = rsFarmaco.getString("instruccionesPorDefecto");
                Integer controlado = rsFarmaco.getInt("controlado");

                boolean cont = controlado == 1 ? true : false;
                List<String> dosisList = new ArrayList<>();
                PreparedStatement stmtDosis = connection.prepareStatement(sqlDosis);
                stmtDosis.setInt(1, idFarmaco);
                ResultSet rsDosis = stmtDosis.executeQuery();
                while (rsDosis.next()) {
                    dosisList.add(rsDosis.getString("dosis"));
                }

                return new Farmaco(idFarmaco, nombre, dosisList, instrucciones, cont);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Method that retrieves all of the drugs
     */
    @Override
    public List<Farmaco> getAll() {
        List<Farmaco> farmacos = new ArrayList<>();

        try {
            PreparedStatement stmtFarmacos = connection.prepareStatement("SELECT * FROM farmaco");
            ResultSet rs = stmtFarmacos.executeQuery();

            while (rs.next()) {
                int idFarmaco = rs.getInt("idFarmaco");
                String nombre = rs.getString("nombre");
                String instrucciones = rs.getString("instruccionesPorDefecto");
                Integer controlado = rs.getInt("controlado");

                boolean cont = controlado == 1 ? true : false;

                // Fetch doses
                List<String> dosisList = new ArrayList<>();
                PreparedStatement stmtDosis = connection.prepareStatement(
                        "SELECT dosis FROM farmaco_dosis WHERE idFarmaco = ?");
                stmtDosis.setInt(1, idFarmaco);
                ResultSet rsDosis = stmtDosis.executeQuery();
                while (rsDosis.next()) {
                    dosisList.add(rsDosis.getString("dosis"));
                }

                farmacos.add(new Farmaco(idFarmaco, nombre, dosisList, instrucciones, cont));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return farmacos;
    }

    /**
     * Method that updates a drug
     */
    @Override
    public void update(Farmaco farmaco) {
        String sqlUpdateFarmaco = "UPDATE farmaco SET nombre = ?, instruccionesPorDefecto = ? , controlado = ? WHERE idFarmaco = ?";
        String sqlDeleteDosis = "DELETE FROM farmaco_dosis WHERE idFarmaco = ?";
        String sqlInsertDosis = "INSERT INTO farmaco_dosis(idFarmaco, dosis) VALUES (?, ?)";

        try {
            connection.setAutoCommit(false);

            PreparedStatement stmt = connection.prepareStatement(sqlUpdateFarmaco);
            stmt.setString(1, farmaco.getNombre());
            stmt.setString(2, farmaco.getInstruccionesPorDefecto());
            stmt.setInt(3, farmaco.getControladoInt());
            stmt.setInt(4, farmaco.getIdFarmaco());
            stmt.executeUpdate();

            PreparedStatement deleteStmt = connection.prepareStatement(sqlDeleteDosis);
            deleteStmt.setInt(1, farmaco.getIdFarmaco());
            deleteStmt.executeUpdate();

            PreparedStatement insertStmt = connection.prepareStatement(sqlInsertDosis);
            for (String d : farmaco.getDosis()) {
                insertStmt.setInt(1, farmaco.getIdFarmaco());
                insertStmt.setString(2, d);
                insertStmt.addBatch();
            }
            insertStmt.executeBatch();

            connection.commit();
        } catch (SQLException e) {
            try {
                connection.rollback();
            } catch (SQLException ignored) {
            }
            e.printStackTrace();
        } finally {
            try {
                connection.setAutoCommit(true);
            } catch (SQLException ignored) {
            }
        }
    }

    /**
     * Method that deletes a drug based on the drug id
     */
    @Override
    public void delete(int idFarmaco) {
        try {
            PreparedStatement statement = connection.prepareStatement("DELETE FROM farmaco WHERE idFarmaco = ?");
            statement.setInt(1, idFarmaco);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}
