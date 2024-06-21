package com.omar.ecommerce.dto;

import com.omar.ecommerce.entities.Address;

public record CustomerResponse(
        String id,
        String firstname,
        String lastname,
        String email,
        Address address
) {

}
