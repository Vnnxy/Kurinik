package com.servicioClinica.clinica.models;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.time.Period;

public class Paciente {

    // ID para el paciente
    private int id;
    // Nombre del paciente
    private String nombre;
    // Apellido del paciente
    private String apellido;
    // Fecha de nacimiento del paciente
    private LocalDate fechaNacimiento;
    // Edad del paciente
    private int edad;
    // Sexo del paciente
    private String sexo;
    // Calle donde reside el paciente
    private String calle;
    // Colonia donde reside el paciente
    private String colonia;
    // Estado donde reside el paciente
    private String estado;
    // CodigoPostal donde reside el paciente
    private Integer cp;
    // Numero exterior donde reside el paciente
    private int numeroExterior;
    // Direccion completa
    private String direccion;
    // Numero de telefono del paciente
    private List<String> telefonos = new ArrayList<>();
    // Correos del paciente
    private List<String> correos = new ArrayList<>();
    // Telefonos en cadena
    @JsonIgnore
    private String telefonosString;
    // Correos en cadena
    @JsonIgnore
    private String correosString;

    /**
     * Constructor de la clase Paciente
     */
    public Paciente(int id, String nombre, String apellido, LocalDate fechaNacimiento, String sexo, String calle,
            String colonia, String estado, int cp, List<String> telefonos, List<String> correos) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
        this.sexo = sexo;
        this.calle = calle;
        this.colonia = colonia;
        this.estado = estado;
        this.cp = cp;
        this.telefonos = telefonos;
        this.correos = correos;
        this.edad = Period.between(fechaNacimiento, LocalDate.now()).getYears();
        this.direccion = calle + ", " + colonia + ", " + estado;

        telefonosString = "";
        for (String i : telefonos) {
            telefonosString += i + ", ";
        }
        correosString = "";
        for (String s : correos) {
            correosString += s + ", ";
        }
    }

    public Paciente() {
    }

    /**
     * Getter para el id del paciente
     */
    public int getId() {
        return id;
    }

    public String getTelefonosString() {
        return telefonosString;
    }

    public String getCorreosString() {
        return correosString;
    }

    /**
     * Setter for the id of the patient
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Getter para el nombre del paciente
     */
    public String getNombre() {
        return nombre;
    }

    /**
     * Setter para ell nombre del paciente
     */
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    /**
     * Getter para el apellido del paciente
     */
    public String getApellido() {
        return apellido;
    }

    /**
     * Setter para el apellido del paciente
     */
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    /**
     * Getter para la fecha de nacimiento del paciente
     */
    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    /**
     * Setter para la decha de nacimiento del paciente
     */
    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
        this.edad = Period.between(fechaNacimiento, LocalDate.now()).getYears();
    }

    /**
     * Getter para la edad del paciente
     */
    public int getEdad() {
        return edad;
    }

    /**
     * Getter para el sexo del paciente
     */
    public String getSexo() {
        return sexo;
    }

    /**
     * Setter para el sexo del paciente
     */
    public void setSexo(String sexo) {
        this.sexo = sexo;
    }

    /**
     * Getter para la direccion
     */
    public String getDireccion() {
        return direccion;
    }

    /**
     * Getter para la calle donde reside el paciente
     */
    public String getCalle() {
        return calle;
    }

    /**
     * Setter para la calle donde reside el paciente
     */
    public void setCalle(String calle) {
        this.calle = calle;
        this.direccion = calle + ", " + colonia + ", " + estado;
    }

    /**
     * Getter para la colonia donde reside el paciente
     */
    public String getColonia() {
        return colonia;
    }

    /**
     * Setter para la colonia donde reside el paciente
     */
    public void setColonia(String colonia) {
        this.colonia = colonia;
        this.direccion = calle + ", " + colonia + ", " + estado;
    }

    /**
     * Getter para el estado en donde reside el paciente
     */
    public String getEstado() {
        return estado;
    }

    /**
     * Setter para el estado en donde reside el paciente
     */
    public void setEstado(String estado) {
        this.estado = estado;
        this.direccion = calle + ", " + colonia + ", " + estado;
    }

    /**
     * Getter para el codigo postal donde reside el paciente
     */
    public Integer getCp() {
        return cp;
    }

    /**
     * Setter para el codigo postal donde reside el paciente
     */
    public void setCp(Integer cp) {
        this.cp = cp;
        this.direccion = calle + ", " + colonia + ", " + estado;
    }

    /**
     * Getter para los telefonos del paciente
     */

    public List<String> getTelefonos() {
        return telefonos;
    }

    /**
     * Setter para los telefonos del paciente
     */

    public void setTelefonos(List<String> telefonos) {
        this.telefonos = telefonos;
        for (String i : telefonos) {
            telefonosString += i + ", ";
        }
    }

    /**
     * Metodo para agregar telefonos
     */
    public void addTelefono(String telefono) {
        this.telefonos.add(telefono);
        telefonosString = "";
        for (String i : telefonos) {
            telefonosString += i + ", ";
        }
    }

    /**
     * Getter para los correos del paciente
     */
    public List<String> getCorreos() {
        return correos;
    }

    /**
     * Setter para los correos del paciente
     */

    public void setCorreos(List<String> correos) {
        this.correos = correos;
        correosString = "";
        for (String s : correos) {
            correosString += s + ", ";
        }
    }

    /**
     * Metodo para agregar correos del paciente
     */
    public void addCorreo(String correos) {
        this.correos.add(correos);
        correosString = "";
        for (String s : this.correos) {
            correosString += s + ", ";
        }
    }

    /**
     * Metodo para regresar en forma de listado (String) los numero de telefono del
     * paciente
     */
    public String telefonoToString() {
        if (telefonos.size() == 0) {
            return "No hay telefonos registrados";
        } else {
            String telefonosString = "";
            for (String i : telefonos) {
                telefonosString += i + ", ";
            }
            return telefonosString;
        }
    }

    /**
     * Metodo para regresar en forma de listado (String) los correos del paciente
     */
    public String correoToString() {
        if (correos.size() == 0) {
            return "No hay correos registrados";
        } else {
            String correoString = "";
            for (String s : correos) {
                correoString += s + ", ";
            }
            return correoString;
        }
    }

    /**
     * Metodo toString para imprimir los datos del paciente
     */
    @Override
    public String toString() {
        return "Paciente{" +
                "id='" + id + '\'' +
                "nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", fechaNacimiento=" + fechaNacimiento +
                ", calle='" + calle + '\'' +
                ", colonia='" + colonia + '\'' +
                ", estado='" + estado + '\'' +
                ", cp='" + cp + '\'' +
                '}';
    }

}