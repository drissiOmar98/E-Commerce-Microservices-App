package com.omar.cart_service.dto;

import jakarta.validation.constraints.NotNull;

public record CartItemRequest(
        @NotNull(message = "Product ID is required")
        Integer productId,

        @NotNull(message = "Quantity is required")
        double quantity
) {
}
