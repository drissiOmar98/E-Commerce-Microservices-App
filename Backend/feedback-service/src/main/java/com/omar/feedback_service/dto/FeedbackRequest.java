package com.omar.feedback_service.dto;

import jakarta.validation.constraints.*;

public record FeedbackRequest(

        @Positive(message = "200")
        @Min(value = 0, message = "Note must be at least 0.")
        @Max(value = 5, message = "Note must not exceed 5.")
        Double note,

        @NotBlank(message = "Comment cannot be blank.")
        @Size(max = 500, message = "Comment must not exceed 500 characters.")
        String comment,

        @NotNull(message = "PRODUCT ID cannot be null.")
        @Positive(message = "PRODUCT ID must be a positive number.")
        Integer productId
) {
}
