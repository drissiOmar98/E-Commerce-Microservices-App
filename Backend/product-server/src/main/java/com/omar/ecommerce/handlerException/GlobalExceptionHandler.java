package com.omar.ecommerce.handlerException;


import com.omar.ecommerce.exception.CategoryNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.validation.FieldError;

/*
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleCategoryNotFoundException(CategoryNotFoundException ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.NOT_FOUND.value()) // 404
                .message("Category not found")
                .error(ex.getMessage())
                .timestamp(LocalDateTime.now()) // Add timestamp
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleGenericException(Exception ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()) // 500
                .message("An unexpected error occurred")
                .error(ex.getMessage())
                .timestamp(LocalDateTime.now()) // Add timestamp
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "No message provided"
                ));

        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.BAD_REQUEST.value()) // 400
                .message("Validation failed")
                .validationErrors(errors)
                .timestamp(LocalDateTime.now()) // Add timestamp
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}*/
