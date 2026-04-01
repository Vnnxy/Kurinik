package com.servicioClinica.clinica.models;

import java.time.LocalDateTime;

public class Cita {

    // Id de la cita
    private int id;
    // Id paciente
    private int idPaciente;
    // Fecha de la cita
    private LocalDateTime fecha;
    // Notas de la cita;
    private String notas;

    /**
     * Constructor de la clase Cita
     */
    public Cita(int id, int idPaciente, LocalDateTime fecha, String notas) {
        this.id = id;
        this.idPaciente = idPaciente;
        this.fecha = fecha;
        this.notas = notas;
    }

    /**
     * Getter para el id de la cita
     */
    public int getId() {
        return id;
    }

    /**
     * Setter para el id de la cita
     */

    public void setId(int id) {
        this.id = id;
    }

    /**
     * Getter para el id del paciente
     */

    public int getIdPaciente() {
        return idPaciente;
    }

    /**
     * Setter para el id del paciente
     */

    public void setIdPaciente(int idPaciente) {
        this.idPaciente = idPaciente;
    }

    /**
     * Getter para la fecha de la cita
     */
    public LocalDateTime getFecha() {
        return fecha;
    }

    /**
     * Setter para la fecha de la cita
     */

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    /**
     * Getter para las notas de la cita
     */

    public String getNotas() {
        return notas;
    }

    /**
     * Setter para las notas de la cita
     */

    public void setNotas(String notas) {
        this.notas = notas;
    }

}
