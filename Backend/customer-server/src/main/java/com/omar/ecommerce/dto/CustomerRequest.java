package com.omar.ecommerce.dto;

import com.omar.ecommerce.entities.Address;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record CustomerRequest(
        Long id,
        @NotNull(message = "Customer firstname is required")
        String firstname,
        @NotNull(message = "Customer firstname is required")
        String lastname,
        @NotNull(message = "Customer Email is required")
        @Email(message = "Customer Email is not a valid email address")
        String email,
        Address address
) {
}
