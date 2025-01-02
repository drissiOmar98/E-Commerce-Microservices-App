package com.omar.ecommerce.dto;

import java.math.BigDecimal;


public record ProductResponse(
        Integer id,
        String name,
        String description,
        double availableQuantity,
        BigDecimal price,
        Integer categoryId,
        String categoryName,
        String categoryDescription
        //PictureDTO cover // For the cover picture in the list view
        //List<PictureDTO> allPictures // For detailed view of all images
) {
}
