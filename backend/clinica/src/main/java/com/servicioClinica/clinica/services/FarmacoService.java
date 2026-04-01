package com.servicioClinica.clinica.services;

import com.servicioClinica.clinica.models.Farmaco;
import com.servicioClinica.clinica.repository.FarmacoRepository;

import java.util.List;

import org.springframework.stereotype.Service;

/**
 * Class for the services used for farmacos.
 */
@Service
public class FarmacoService {
    private final FarmacoRepository farmacosRepo;

    /**
     * Constructor for the service
     * 
     * @param farmacosRepo Repo for the farmaco
     */
    public FarmacoService(FarmacoRepository farmacosRepo) {
        this.farmacosRepo = farmacosRepo;
    }

    /**
     * Add a farmaco
     * 
     * @param farmaco Farmaco we want to add
     */
    public void addFarmaco(Farmaco farmaco) {
        if (farmaco.getNombre() == null || farmaco.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre del fármaco no puede estar vacío.");
        }
        farmacosRepo.add(farmaco);
    }

    /**
     * Getter for a specific farmaco
     * 
     * @param id id of the farmaco
     * @return The farmaco
     */
    public Farmaco getFarmacoById(int id) {
        return farmacosRepo.get(id);
    }

    /**
     * Getter for all farmacos
     * 
     * @return List containing all farmacos
     */
    public List<Farmaco> getAllFarmacos() {
        return farmacosRepo.getAll();
    }

    /**
     * Updates an existing farmaco
     * 
     * @param farmaco The farmaco with the new data
     */
    public void updateFarmaco(Farmaco farmaco) {
        farmacosRepo.update(farmaco);
    }

    /**
     * Deletes a farmaco
     * 
     * @param id id of the farmaco we want to delete
     */
    public void deleteFarmaco(int id) {
        farmacosRepo.delete(id);
    }
}
