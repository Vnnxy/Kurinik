package com.servicioClinica.clinica.controllers;

import com.servicioClinica.clinica.models.Farmaco;
import com.servicioClinica.clinica.services.FarmacoService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

/**
 * Controller for the farmacos
 */
@RestController
@RequestMapping("/api/farmacos")
public class FarmacoController {
    // Farmaco service
    private final FarmacoService farmacoService;

    // Costructor for farmaco controller
    public FarmacoController(FarmacoService farmacoService) {
        this.farmacoService = farmacoService;
    }

    /**
     * Getter for a specific farmaco.
     * 
     * @param id Id of the farmaco we want to get
     * @return A response entity with the farmaco we inquired.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Farmaco> getFarmaco(@PathVariable int id) {
        Farmaco farmaco = farmacoService.getFarmacoById(id);
        if (farmaco == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(farmaco);
    }

    /**
     * Getter for all farmacos in the db
     * 
     * @return A list of farmacos.
     */
    @GetMapping
    public List<Farmaco> getAll() {
        return farmacoService.getAllFarmacos();
    }

    /**
     * Creates a farmaco given a json, it is not required to specify the id.
     * 
     * @param farmaco Farmaco we want to add
     * @return Response entity with a status
     */
    @PostMapping()
    public ResponseEntity<Void> addFarmaco(@RequestBody Farmaco farmaco) {
        farmacoService.addFarmaco(farmaco);
        return ResponseEntity.ok().build();
    }

    /**
     * Updates an existing farmaco
     * 
     * @param id      Id of the farmaco we want to update
     * @param farmaco The new data
     * @return Response entity
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateFarmaco(@PathVariable int id, @RequestBody Farmaco farmaco) {
        farmaco.setIdFarmaco(id);
        farmacoService.updateFarmaco(farmaco);
        return ResponseEntity.ok().build();
    }

    /**
     * Deletes an existing farmaco from the db
     * 
     * @param id The id of the farmaco we want to delete
     * @return ResponseEntity
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFarmaco(@PathVariable int id) {
        farmacoService.deleteFarmaco(id);
        return ResponseEntity.ok().build();
    }

}
