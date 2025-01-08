package com.omar.favourite_service.client.product.customer;

public record CustomerResponse(
        String id,
        String firstname,
        String lastname,
        String email
) {
}
