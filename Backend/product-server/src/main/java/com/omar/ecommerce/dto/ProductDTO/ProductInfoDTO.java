package com.omar.ecommerce.dto.ProductDTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ProductInfoDTO(
        @NotNull(message = "Product name is required")
        String name,
        @NotNull(message = "Product description is required")
        String description,
        @Positive(message = "Available quantity should be positive")
        double availableQuantity
) {
}
