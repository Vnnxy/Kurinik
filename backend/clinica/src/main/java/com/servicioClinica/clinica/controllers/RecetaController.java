package com.servicioClinica.clinica.controllers;

import com.servicioClinica.clinica.models.Farmaco;
import com.servicioClinica.clinica.models.Receta;
import com.servicioClinica.clinica.services.RecetaService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Controller for the recetas
 */
@RestController
@RequestMapping("/api/recetas")
public class RecetaController {
    // Receta service
    private final RecetaService recetaService;

    // Costructor for receta controller
    public RecetaController(RecetaService recetaService) {
        this.recetaService = recetaService;
    }

    /**
     * Getter for a specific receta.
     * 
     * @param id Id of the receta we want to get
     * @return A response entity with the receta we inquired.
     */
    @GetMapping("/{idNota}")
    public ResponseEntity<List<Receta>> getReceta(@PathVariable int idNota) {
        List<Receta> receta = recetaService.getAllRecetasInNota(idNota);
        if (receta == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(receta);
    }

    @GetMapping("/farmacos/{idReceta}")
    public List<Farmaco> getFarmacosReceta(@RequestParam int idReceta) {
        return recetaService.getFarmacosInReceta(idReceta);
    }

    @GetMapping("/filterPatFar/{idPaciente}/{nombreMed}")
    public List<Receta> getFarmacosEnPaciente(@PathVariable int idPaciente, @PathVariable String nombreMed) {
        return recetaService.getRecetaConFarmacosDePaciente(idPaciente, nombreMed);
    }

    /**
     * Getter for all recetas in the db
     * 
     * @return A list of recetas.
     */
    @GetMapping
    public List<Receta> getAll() {
        return recetaService.getAllRecetas();
    }

    /**
     * Creates a receta given a json, it is not required to specify the id.
     * 
     * @param receta Receta we want to add
     * @return Response entity with a status
     */
    @PostMapping()
    public ResponseEntity<Void> addReceta(@RequestBody Receta receta) throws SQLException {
        recetaService.addReceta(receta);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/link/{idFarmaco}")
    public ResponseEntity<Void> linkFarmaco(@RequestBody Receta receta, @PathVariable int idFarmaco) {
        recetaService.addRecetaAndLink(receta, idFarmaco);
        return ResponseEntity.ok().build();
    }

    /**
     * Updates an existing receta
     * 
     * @param id     Id of the receta we want to update
     * @param receta The new data
     * @return Response entity
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateReceta(@PathVariable int id, @RequestBody Receta receta) {
        receta.setIdReceta(id);
        recetaService.updateReceta(receta);
        return ResponseEntity.ok().build();
    }

    /**
     * Deletes an existing receta from the db
     * 
     * @param id The id of the receta we want to delete
     * @return ResponseEntity
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceta(@PathVariable int id) {
        recetaService.deleteReceta(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{idFarmaco}/{idReceta}")
    public ResponseEntity<Void> unlinkFarmaco(@PathVariable int idFarmaco, @PathVariable int idReceta) {
        recetaService.unlinkFarma(idFarmaco, idReceta);
        return ResponseEntity.ok().build();

    }

}
