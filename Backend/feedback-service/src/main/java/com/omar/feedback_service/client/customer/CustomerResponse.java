package com.omar.feedback_service.client.customer;

public record CustomerResponse(
        String id,
        String firstname,
        String lastname,
        String email
) {
}
