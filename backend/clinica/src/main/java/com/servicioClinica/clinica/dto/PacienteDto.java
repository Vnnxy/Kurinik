package com.servicioClinica.clinica.dto;

import java.util.List;

public class PacienteDto {
    private int id;
    private String nombre;
    private String apellido;
    private String fechaNacimiento; // in "yyyy-MM-dd" format
    private String sexo;
    private String calle;
    private String colonia;
    private String estado;
    private int cp;
    private List<String> telefonos;
    private List<String> correos;

    public PacienteDto() {
    }

    public int getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public String getSexo() {
        return sexo;
    }

    public String getCalle() {
        return calle;
    }

    public String getColonia() {
        return colonia;
    }

    public String getEstado() {
        return estado;
    }

    public int getCp() {
        return cp;
    }

    public List<String> getTelefonos() {
        return telefonos;
    }

    public List<String> getCorreos() {
        return correos;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public void setColonia(String colonia) {
        this.colonia = colonia;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public void setCp(int cp) {
        this.cp = cp;
    }

    public void setTelefonos(List<String> telefonos) {
        this.telefonos = telefonos;
    }

    public void setCorreos(List<String> correos) {
        this.correos = correos;
    }

}
