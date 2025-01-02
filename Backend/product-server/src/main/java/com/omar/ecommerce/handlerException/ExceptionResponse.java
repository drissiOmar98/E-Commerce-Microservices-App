package com.omar.ecommerce.handlerException;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ExceptionResponse {

    private int statusCode;
    private String message;
    private String error;
    private Map<String, String> validationErrors; // for field-level validation errors
    private LocalDateTime timestamp;


}
