package com.servicioClinica.clinica.exceptions;

import org.springframework.http.HttpStatus;

/**
 * Custom exception class for API-related errors.
 * Represents an API exception with an associated HTTP status code.
 * 
 */
public class ApiException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    private HttpStatus status;

    /**
     * Constructs a new ApiException with the specified HTTP status and detail
     * message.
     * 
     * @param status  the HTTP status code
     * @param message the detail message
     */
    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    /**
     * Returns the serial version UID.
     * 
     * @return the serial version UID
     */
    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    /**
     * Returns the HTTP status code associated with this exception.
     * 
     * @return the HTTP status code
     */
    public HttpStatus getStatus() {
        return status;
    }

    /**
     * Sets the HTTP status code for this exception.
     * 
     * @param status the new HTTP status code
     */
    public void setStatus(HttpStatus status) {
        this.status = status;
    }

}