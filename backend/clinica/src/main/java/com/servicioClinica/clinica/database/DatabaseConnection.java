package com.servicioClinica.clinica.database;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * The class used to create the database and connect to it.
 */
public class DatabaseConnection {
    // The path of the sqlite database
    private static final String dbUrl = System.getenv().getOrDefault("DB_PATH", "../../db/clinica.db");

    /**
     * Method that tries to connect to the database and if its not created, it
     * creates it by executing the schema.sql that is provided.
     */
    public static void connectAndInitialze() {
        boolean dbExists = new File(dbUrl).exists();

        try (Connection connection = DriverManager.getConnection("jdbc:sqlite:" + dbUrl)) {
            Statement statement = connection.createStatement();
            statement.execute("PRAGMA foreign_keys = ON;");
            System.out.println("Connection to SQLite has been established.");
            if (!dbExists) {
                System.out.println("Database not found. Creating new database...");
                // Read the schema SQL file
                String schemaScript = "";
                try (InputStream inputStream = DatabaseConnection.class.getClassLoader()
                        .getResourceAsStream("schema.sql")) {
                    if (inputStream == null) {
                        System.err.println("Could not find schema.sql in resources.");
                        return;
                    }
                    schemaScript = new String(inputStream.readAllBytes());
                    statement.executeUpdate(schemaScript);
                    System.out.println("Database initialized successfully.");
                }

                // Schema script ecxecution
                try {
                    statement.executeUpdate(schemaScript);
                    System.out.println("Database initialized successfully.");
                } catch (SQLException e) {
                    System.err.println("Error executing schema script: " + e.getMessage());
                }
            }
        } catch (SQLException e) {
            System.err.println("Database connection error: " + e.getMessage());
        } catch (IOException e) {
            System.err.println("Error reading schema file: " + e.getMessage());
        }

    }

    /**
     * Method that returns a connection to the database for CRUD operations.
     */
    public static Connection getConnection() throws SQLException {
        Connection connection = DriverManager.getConnection("jdbc:sqlite:" + dbUrl);
        Statement statement = connection.createStatement();
        statement.execute("PRAGMA foreign_keys = ON;");
        return connection;
    }

}
