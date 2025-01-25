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
        PictureDTO cover, // For the cover picture in the list view
        Double rate // New field for the product rate
) {
    public DisplayCardProductDTO withRate(Double rate) {
        return new DisplayCardProductDTO(
                id, name, description, availableQuantity, price, categoryId,
                categoryName, categoryDescription, subcategoryId, subcategoryName, cover, rate
        );
    }
}
