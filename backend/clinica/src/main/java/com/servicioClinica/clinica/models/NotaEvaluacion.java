package com.servicioClinica.clinica.models;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class NotaEvaluacion {

    // Note id
    private int id;
    // Patient id
    private int idPaciente;
    // Fecha y hora de la evaluacion
    private LocalDateTime fechaHora;
    // Peso del paciente
    private int peso;
    // Altura del paciente
    private int altura;
    // Signos del paciente
    private String signos;
    // Notas de la evaluacion
    private String notas;
    // Motivo
    private String motivo;

    /**
     * Constructor para la nota de evaluacion
     */
    public NotaEvaluacion(int id, int idPaciente, LocalDateTime fechaHora, int peso, int altura, String signos,
            String notas, String motivo) {
        this.id = id;
        this.idPaciente = idPaciente;
        this.fechaHora = fechaHora;
        this.peso = peso;
        this.altura = altura;
        this.signos = signos;
        this.notas = notas;
        this.motivo = motivo;
    }

    /**
     * Getter para el id de la nota de evaluacion
     */
    public int getId() {
        return id;
    }

    /**
     * Setter para el id de la nota de evaluacion
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
     * Getter para la fecha y hora de la evaluacion
     */
    public LocalDateTime getFechaHora() {
        return fechaHora; // Default format: "yyyy-MM-ddTHH:mm:ss"
    }

    /**
     * Setter para la fecha y hora de la evaluacion
     */
    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    /**
     * Getter para la hora de la evaluacion
     */
    public String getHora() {
        return fechaHora.toLocalTime().toString();
    }

    /**
     * Setter para la hora de la evaluacion
     */

    public void setHora(String hora) {
        // Parse the hour string (e.g., "14:30")
        LocalTime newHora = LocalTime.parse(hora, DateTimeFormatter.ofPattern("HH:mm"));
        // Combine with existing date
        this.fechaHora = LocalDateTime.of(fechaHora.toLocalDate(), newHora);
    }

    /**
     * Getter para la fecha de la evaluacion
     */

    public String getFecha() {
        return fechaHora.toLocalDate().toString(); // Default format: "yyyy-MM-dd"
    }

    /**
     * Setter para la fecha de la evaluacion
     */

    public void setFecha(String fecha) {
        // Parse the date string (e.g., "2025-01-04")
        LocalDate newFecha = LocalDate.parse(fecha, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        // Combine with existing time
        this.fechaHora = LocalDateTime.of(newFecha, fechaHora.toLocalTime());
    }

    /**
     * Getter para el peso del paciente
     */

    public int getPeso() {
        return peso;
    }

    /**
     * Setter para el peso del paciente
     */

    public void setPeso(int peso) {
        this.peso = peso;
    }

    /**
     * Getter para las notas de la evaluacion
     */

    public String getNotas() {
        return notas;
    }

    /**
     * Setter para las notas de la evaluacion
     */

    public void setNotas(String notas) {
        this.notas = notas;
    }

    /**
     * Getter para la altura del paciente
     */
    public int getAltura() {
        return altura;
    }

    /**
     * Setter para la altura del paciente
     */
    public void setAltura(int altura) {
        this.altura = altura;
    }

    /**
     * Getter para los signos del paciente
     */
    public String getSignos() {
        return signos;
    }

    /**
     * Setter para los signos del paciente
     */
    public void setSignos(String signos) {
        this.signos = signos;
    }

    /**
     * Getter para el motivo de visita del paciente
     * 
     * @return Motivo
     */
    public String getMotivo() {
        return motivo;
    }

    /**
     * Setter para el motivo
     * 
     * @param motivo Nuevo motivo
     */
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    /**
     * To string for the NotaEvaluación
     */

    public String toString() {
        return ("Hora: " + fechaHora + " Peso: " + peso + " Notas: " + notas);
    }
}
