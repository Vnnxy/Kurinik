package com.servicioClinica.clinica.config;

import java.sql.Connection;
import java.sql.SQLException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.servicioClinica.clinica.database.DatabaseConnection;
import com.servicioClinica.clinica.repository.*;

/**
 * Class that handles the initial setup for the spring app.
 */
@Configuration
public class AppConfig {

    @Bean
    public Connection sqliteConnection() throws SQLException {
        DatabaseConnection.connectAndInitialze();
        return DatabaseConnection.getConnection();
    }

    @Bean
    public FarmacoRepository farmacosRepository(Connection connection) {
        return new FarmacoRepository(connection);
    }

    @Bean
    public CitaRepository citaRepository(Connection connection) {
        return new CitaRepository(connection);
    }

    @Bean
    public PacienteRepository pacienteRepository(Connection connection) {
        return new PacienteRepository(connection);
    }

    @Bean
    public HistorialMedicoRepository historiaMedicoRepository(Connection connection) {
        return new HistorialMedicoRepository(connection);
    }

    @Bean
    public NotaEvaluacionRepository notaEvaluacionRepository(Connection connection) {
        return new NotaEvaluacionRepository(connection);
    }

    @Bean
    public RecetaRepository recetaRepository(Connection connection) {
        return new RecetaRepository(connection);
    }

}
