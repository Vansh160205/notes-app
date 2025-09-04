package com.example.notes.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Map<String, String> response = new HashMap<>();
        String message = ex.getMostSpecificCause().getMessage();

        if (message != null && message.contains("slug")) {
            response.put("error", "Slug already exists. Please use a different title.");
        } else {
            response.put("error", "Database error: " + message);
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }
}
