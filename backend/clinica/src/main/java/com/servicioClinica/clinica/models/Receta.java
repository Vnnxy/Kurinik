package com.servicioClinica.clinica.models;

import java.time.LocalDate;

public class Receta {
    private int idNota;
    private int idPaciente;
    private int idReceta;
    private String archivo;
    private LocalDate fecha;

    /**
     * Constructor for a receta
     */
    public Receta(int idReceta, NotaEvaluacion nota, String archivo) {
        this.idReceta = idReceta;
        this.idNota = nota.getId();
        this.idPaciente = nota.getIdPaciente();
        this.archivo = archivo;
        this.fecha = LocalDate.now();
    }

    /**
     * Second constructor
     */
    public Receta(int idReceta, int idNota, int idPaciente, String archivo) {
        this.idReceta = idReceta;
        this.idNota = idNota;
        this.idPaciente = idPaciente;
        this.archivo = archivo;
        this.fecha = LocalDate.now();
    }

    public Receta() {

    }

    /**
     * Getter for the Nota id that the receta is linked to
     */
    public int getIdNota() {
        return idNota;
    }

    /**
     * Setter for the idNota the receta is linked to
     */
    public void setIdNota(int idNota) {
        this.idNota = idNota;
    }

    /**
     * Getter for the paciente id that the receta is linked to
     */
    public int getIdPaciente() {
        return idPaciente;
    }

    /**
     * Setter for the idPaciente the receta is linked to
     */
    public void setIdPaciente(int idPaciente) {
        this.idPaciente = idPaciente;
    }

    /**
     * Getter for the receta id
     */
    public int getIdReceta() {
        return idReceta;
    }

    /**
     * Setter for the receta id
     */
    public void setIdReceta(int idReceta) {
        this.idReceta = idReceta;
    }

    /**
     * Getter for the file content
     */
    public String getArchivo() {
        return archivo;
    }

    /**
     * Setter for the file content
     */
    public void setArchivo(String archivo) {
        this.archivo = archivo;
    }

    /**
     * Getter for the date the receta was created
     */
    public LocalDate getFecha() {
        return fecha;
    }

    /**
     * Setter for the date the receta was created
     */
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    @Override
    public String toString() {
        return "Receta{" +
                "idNota=" + idNota +
                ", idPaciente=" + idPaciente +
                ", idReceta=" + idReceta +
                ", archivo='" + archivo + '\'' +
                ", fecha=" + fecha +
                '}';
    }
}
