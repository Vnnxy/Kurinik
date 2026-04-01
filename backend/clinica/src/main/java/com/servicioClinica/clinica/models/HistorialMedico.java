package com.servicioClinica.clinica.models;

public class HistorialMedico {
    // Id del Historial Medico
    private int id;
    // Id del paciente
    private int idPaciente;
    // grupo sanguineo del paciente
    private String grupoSanguineo;
    // Antecedentes personales patológicos
    private String apPatologicos;
    // Antecedentes personales no patológicos
    private String apNoPatologicos;
    // Antecedentes personales heredo familiares
    private String apHeredoFam;
    // Antecedentes personales quirugicos
    private String apQuirugicos;
    // Antecedentes personales gineco obstreticos
    private String apGinecoObs;
    // Exploracion Fisica
    private String exploracionFisica;

    /**
     * Constructor para el historial médico del paciente
     */
    public HistorialMedico(int id, int idPaciente, String grupoSanguineo, String apPatologicos, String apNoPatologicos,
            String apHeredoFam, String apQuirugicos, String apGinecoObs, String exploracionFisica) {
        this.id = id;
        this.idPaciente = idPaciente;
        this.grupoSanguineo = grupoSanguineo;
        this.apPatologicos = apPatologicos;
        this.apNoPatologicos = apNoPatologicos;
        this.apHeredoFam = apHeredoFam;
        this.apQuirugicos = apQuirugicos;
        this.apGinecoObs = apGinecoObs;
        this.exploracionFisica = exploracionFisica;
    }

    /**
     * Getter for the id of the medical history
     */
    public int getId() {
        return id;
    }

    /**
     * Setter for the id of the medical history
     */

    public void setId(int id) {
        this.id = id;
    }

    /**
     * Getter for the idPaciente
     */
    public int getIdPaciente() {
        return idPaciente;
    }

    /**
     * Setter for the id of the paciente
     */
    public void setIdPaciente(int idPaciente) {
        this.idPaciente = idPaciente;
    }

    /** Getter para el grupo sanguineo del paciente */
    public String getGrupoSanguineo() {
        return grupoSanguineo;
    }

    /**
     * Setter para el grupo sanguineo
     */
    public void setGrupo(String grupoSanguineo) {
        this.grupoSanguineo = grupoSanguineo;
    }

    /**
     * Getter para los a.p. patologicos
     * 
     * @return los antecedentes patologicos del paciente
     */
    public String getApPatologicos() {
        return apPatologicos;
    }

    /**
     * Setter para los a.p. patologicos
     * 
     * @param apPatologicos los antecedentes patologicos del paciente
     */
    public void setApPatologicos(String apPatologicos) {
        this.apPatologicos = apPatologicos;
    }

    /**
     * Getter para los a.p. no patologicos
     * 
     * @return los antecedentes no patologicos del paciente
     */
    public String getApNoPatologicos() {
        return apNoPatologicos;
    }

    /**
     * Setter para los a.p. no patologicos
     * 
     * @param apNoPatologicos los antecedentes no patologicos del paciente
     */

    public void setApNoPatologicos(String apNoPatologicos) {
        this.apNoPatologicos = apNoPatologicos;
    }

    /**
     * Getter para los a.p. heredo familiares
     * 
     * @return los antecedentes heredo familiares del paciente
     */

    public String getApHeredoFam() {
        return apHeredoFam;
    }

    /**
     * Setter para los a.p. heredo familiares
     * 
     * @param apHeredoFam los antecedentes heredo familiares del paciente
     */

    public void setApHeredoFam(String apHeredoFam) {
        this.apHeredoFam = apHeredoFam;
    }

    /**
     * Getter para los a.p. quirugicos
     * 
     * @return los antecedentes quirugicos del paciente
     */

    public String getApQuirugicos() {
        return apQuirugicos;
    }

    /**
     * Setter para los a.p. quirugicos
     * 
     * @param apQuirugicos los antecedentes quirugicos del paciente
     */

    public void setApQuirugicos(String apQuirugicos) {
        this.apQuirugicos = apQuirugicos;
    }

    /**
     * Getter para los a.p. gineco obstreticos
     * 
     * @return los antecedentes gineco obstreticos del paciente
     */

    public String getApGinecoObstreticos() {
        return apGinecoObs;
    }

    /**
     * Setter para los a.p. gineco obstreticos
     * 
     * @param apGinecoObs los antecedentes gineco obstreticos del paciente
     */

    public void setApGinecoObstreticos(String apGinecoObs) {
        this.apGinecoObs = apGinecoObs;
    }

    /**
     * Getter para la exploracion fisica
     */

    public String getExploracionFisica() {
        return exploracionFisica;
    }

    /**
     * Setter para la exploracion fisica
     * 
     * @param exploracionFisica la exploracion fisica del paciente
     */

    public void setExploracionFisica(String exploracionFisica) {
        this.exploracionFisica = exploracionFisica;
    }

    /**
     * To string for the historial medico
     */
    public String toString() {
        return "Historial Medico:";
    }

}
