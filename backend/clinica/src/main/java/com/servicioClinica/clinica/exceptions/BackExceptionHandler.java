package com.servicioClinica.clinica.exceptions;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import com.servicioClinica.clinica.common.ApiResponse;

/**
 * Handler for the Exceptions thrown by the Api.
 */
@RestControllerAdvice
public class BackExceptionHandler {
    /**
     * Main method that handles the exception.
     * 
     * @param e       The ApiException that was thrown
     * @param request The request for the URI
     * @return ResponseEntity with a response.
     */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ExceptionResponse> handleApiException(ApiException e, WebRequest request) {
        ExceptionResponse response = new ExceptionResponse();
        response.setTimestamp(LocalDateTime.now());
        response.setStatus(e.getStatus().value());
        response.setError(e.getStatus());
        response.setMessage(e.getMessage());
        response.setPath(((ServletWebRequest) request).getRequest().getRequestURI().toString());

        return new ResponseEntity<>(response, response.getError());
    }
}
