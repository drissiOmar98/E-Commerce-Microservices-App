package com.omar.ecommerce.dto;

import com.omar.ecommerce.entities.Customer;
import lombok.Builder;

import java.util.Set;

@Builder
public record RestUser(Long id,
                       String firstName,
                       String lastName,
                       String email,
                       String imageUrl,
                       String street,
                       String houseNumber,
                       String zipCode,
                       Set<RestAuthority> authorities) {

    public static RestUser from(Customer user) {
        RestUserBuilder restUserBuilder = RestUser.builder();

        restUserBuilder.id(user.getId());

        if(user.getImageUrl() != null) {
            restUserBuilder.imageUrl(user.getImageUrl());
        }
        // Handle address fields from the embedded Address
        if (user.getAddress() != null) {
            restUserBuilder
                    .street(user.getAddress().getStreet())
                    .houseNumber(user.getAddress().getHouseNumber())
                    .zipCode(user.getAddress().getZipCode());
        }

        return restUserBuilder
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .authorities(RestAuthority.fromSet(user.getAuthorities()))
                .build();
    }
}

