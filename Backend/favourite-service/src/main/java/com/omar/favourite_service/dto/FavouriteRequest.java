package com.omar.favourite_service.dto;

import jakarta.validation.constraints.NotNull;

public record FavouriteRequest(
        String customerId,
        @NotNull(message = "Product is required")
        Integer productId
) {
}
