package com.omar.ecommerce.dto;

import java.math.BigDecimal;

public record DisplayCardProductDTO(
        Integer id,
        String name,
        String description,
        double availableQuantity,
        BigDecimal price,
        Integer categoryId,
        String categoryName,
        String categoryDescription,
        Integer subcategoryId,  // New field for Subcategory ID
        String subcategoryName, // New field for Subcategory name
        PictureDTO cover // For the cover picture in the list view
) {
}
