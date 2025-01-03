package com.omar.cart_service.dto.customer;

public record CustomerResponse(
        String id,
        String firstname,
        String lastname,
        String email
) {
}
