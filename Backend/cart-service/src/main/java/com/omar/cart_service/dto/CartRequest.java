package com.omar.cart_service.dto;

import java.util.Set;

public record CartRequest(
        Long id,
        Set<CartItemRequest> cartItems
) {
}
