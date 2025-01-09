package com.omar.favourite_service.dto;

import jakarta.validation.constraints.NotNull;

public record FavouriteRequest(
        @NotNull(message = "Product is required")
        Integer productId
) {
}
