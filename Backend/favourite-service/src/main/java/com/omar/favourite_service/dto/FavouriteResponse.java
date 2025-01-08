package com.omar.favourite_service.dto;

import com.omar.favourite_service.client.product.PictureDTO;

import java.math.BigDecimal;

public record FavouriteResponse(
        String customerId,
        Integer productId,
        String productName,
        BigDecimal price,
        String categoryName,
        String description,
        String subcategoryName,
        PictureDTO cover,
        double availableQuantity

) {
}
