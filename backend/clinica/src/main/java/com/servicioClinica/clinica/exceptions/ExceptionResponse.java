package com.servicioClinica.clinica.exceptions;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * Exception class used for handling the errors and exceptions.
 */
public class ExceptionResponse {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd hh:mm:ss")
    private LocalDateTime timestamp;
    private Integer status;
    private HttpStatus error;
    private String message;
    private String path;

    /**
     * Gets the timestamp of the exception
     * 
     * @return A LocalDateTime object with the time stamp of the exception.
     */
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    /**
     * Gets the status of the exception
     * 
     * @return The status of the exception.
     */
    public Integer getStatus() {
        return status;
    }

    /**
     * Gets the error
     * 
     * @return HttpStatus of the error
     */
    public HttpStatus getError() {
        return error;
    }

    /**
     * Gets the message of the exception.
     * 
     * @return A string containing the message.
     */
    public String getMessage() {
        return message;
    }

    /**
     * Gets the path where the exception was thrown.
     * 
     * @return A string containing the path.
     */
    public String getPath() {
        return path;
    }

    /**
     * Setter for the exception timestamp
     * 
     * @param timestamp A LocalDateTime object containing the timestamp.
     */
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * Setter for the status of the exception.
     * 
     * @param status Status of the exception.
     */
    public void setStatus(Integer status) {
        this.status = status;
    }

    /**
     * Setter for the error
     * 
     * @param error The error of the exception.
     */
    public void setError(HttpStatus error) {
        this.error = error;
    }

    /**
     * Setter for the message in the exception.
     * 
     * @param message String containing the message.
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * Setter for the path
     * 
     * @param path String containing the path.
     */
    public void setPath(String path) {
        this.path = path;
    }
}