package io.protest.gateway.ex;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<Map> handleHttpClientErrorException(HttpClientErrorException ex) {
        Map originalErrorBody = ex.getResponseBodyAs(Map.class);

        return ResponseEntity.status(ex.getStatusCode()).body(originalErrorBody);
    }
}
