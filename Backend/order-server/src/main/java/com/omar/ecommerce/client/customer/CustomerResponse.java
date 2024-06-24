package com.omar.ecommerce.client.customer;

public record CustomerResponse(
        String id,
        String firstname,
        String lastname,
        String email
) {
}
