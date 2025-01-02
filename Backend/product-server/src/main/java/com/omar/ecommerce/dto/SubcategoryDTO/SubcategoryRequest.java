package com.omar.ecommerce.dto.SubcategoryDTO;

import jakarta.validation.constraints.NotNull;

public record SubcategoryRequest(
        @NotNull(message = "Subcategory name is required")
        String name,

        @NotNull(message = "Category ID is required")
        Integer categoryId
) {
}
