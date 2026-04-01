package com.servicioClinica.clinica.common;

/**
 * Api response class, this handles the responses when handling with the api
 * access points.
 */
public class ApiResponse {
    /* Message */
    private String message;

    /**
     * Constructor for ApiResponse
     * 
     * @param message String containg the message.
     */
    public ApiResponse(String message) {
        super();
        this.message = message;
    }

    /**
     * Getter for the message.
     * 
     * @return Returns the message.
     */
    public String getMessage() {
        return message;
    }

    /**
     * Setter for the message.
     * 
     * @param message The string containing the message.
     */
    public void setMessage(String message) {
        this.message = message;
    }
}