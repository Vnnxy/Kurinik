package com.servicioClinica.clinica.repository;

import java.util.List;

/**
 * Interface that defines the methods that a repository should have
 */
public interface Repository<T> {
    /**
     * Method that add an entry to the databasse
     */
    void add(T model);

    /**
     * Method that retrieves an entry by id
     */
    T get(int id);

    /**
     * Method that retrieves all entries
     */
    List<T> getAll();

    /**
     * Method that updates an entry
     */
    void update(T model);

    /**
     * Method that deletes an entry
     */
    void delete(int id);
}
