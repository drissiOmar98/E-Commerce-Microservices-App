package com.omar.ecommerce.dto.SubcategoryDTO;

public record SubcategoryResponse(
        Integer id,
        String name,
        Integer categoryId,
        String categoryName
) {
}
