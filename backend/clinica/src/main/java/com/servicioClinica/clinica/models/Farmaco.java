package com.servicioClinica.clinica.models;

import java.util.List;

public class Farmaco {
    // id del farmaco
    private int idFarmaco;
    // Nombre del farmaco
    private String nombre;
    // Dosis del farmaco
    private List<String> dosis;
    // Instrucciones por defecto
    private String instruccionesPorDefecto;

    private boolean controlado;

    /**
     * Constructor para la clase farmaco
     */

    public Farmaco(int idFarmaco, String nombre, List<String> dosis, String instruccionesPorDefecto,
            boolean controlado) {

        this.idFarmaco = idFarmaco;
        this.nombre = nombre;
        this.dosis = dosis;
        this.instruccionesPorDefecto = instruccionesPorDefecto;
        this.controlado = controlado;
    }

    /**
     * Getter para el id del farmaco
     */
    public int getIdFarmaco() {
        return idFarmaco;
    }

    /**
     * Setter para el id del farmaco
     */

    public void setIdFarmaco(int idFarmaco) {
        this.idFarmaco = idFarmaco;
    }

    /**
     * Getter para el nombre del farmaco
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Setter para el nombre del farmaco
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Getter para la dosis del farmaco
     */
    public List<String> getDosis() {
        return dosis;
    }

    /**
     * Setter para la dosis del farmaco
     */

    public void setDosis(List<String> dosis) {
        this.dosis = dosis;
    }

    public String getInstruccionesPorDefecto() {
        return instruccionesPorDefecto;
    }

    public void setInstruccionesPorDefecto(String instruccionesPorDefecto) {
        this.instruccionesPorDefecto = instruccionesPorDefecto;
    }

    public boolean getControlado() {
        return controlado;
    }

    public int getControladoInt() {
        if (controlado == true)
            return 1;
        else
            return 0;
    }

    public void setControlado(boolean controlado) {
        this.controlado = controlado;
    }

    /**
     * Metodo toString para la clase farmaco
     */
    @Override
    public String toString() {
        return "Farmaco{" +
                "idFarmaco=" + idFarmaco +
                ", nombre='" + nombre + '\'' +
                ", dosis=" + dosis +
                '}';
    }
}