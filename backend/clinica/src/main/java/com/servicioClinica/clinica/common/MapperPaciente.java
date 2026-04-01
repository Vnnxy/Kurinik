package com.servicioClinica.clinica.common;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.servicioClinica.clinica.models.Paciente;
import com.servicioClinica.clinica.dto.PacienteDto;

public class MapperPaciente {
    public static PacienteDto toDTO(Paciente paciente) {
        PacienteDto dto = new PacienteDto();
        dto.setId(paciente.getId());
        dto.setNombre(paciente.getNombre());
        dto.setApellido(paciente.getApellido());
        dto.setFechaNacimiento(paciente.getFechaNacimiento().toString());
        dto.setSexo(paciente.getSexo());
        dto.setCalle(paciente.getCalle());
        dto.setColonia(paciente.getColonia());
        dto.setEstado(paciente.getEstado());
        dto.setCp(paciente.getCp());

        // Convert phone numbers and emails
        dto.setTelefonos(
                paciente.getTelefonos().stream().map(String::valueOf).toList());
        dto.setCorreos(paciente.getCorreos());

        return dto;
    }

    public static Paciente fromDTO(PacienteDto dto) {
        Paciente paciente = new Paciente();
        paciente.setId(dto.getId());
        paciente.setNombre(dto.getNombre());
        paciente.setApellido(dto.getApellido());
        paciente.setFechaNacimiento(LocalDate.parse(dto.getFechaNacimiento()));
        paciente.setSexo(dto.getSexo());
        paciente.setCalle(dto.getCalle());
        paciente.setColonia(dto.getColonia());
        paciente.setEstado(dto.getEstado());
        paciente.setCp(dto.getCp());
        paciente.setTelefonos(dto.getTelefonos());
        paciente.setCorreos(dto.getCorreos());

        return paciente;
    }
}
