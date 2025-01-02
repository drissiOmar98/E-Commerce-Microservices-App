package com.omar.ecommerce.dto.CategoryDTO;

import jakarta.validation.constraints.NotNull;

public record CategoryRequest(
        @NotNull(message = "Category Name is mandatory")
        String name,
        @NotNull(message = "Category description is required")
        String description
) {
}
