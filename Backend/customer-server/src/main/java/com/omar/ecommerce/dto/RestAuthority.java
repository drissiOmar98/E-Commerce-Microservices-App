package com.omar.ecommerce.dto;


import com.omar.ecommerce.entities.Authority;
import lombok.Builder;

import java.util.Set;
import java.util.stream.Collectors;

@Builder
public record RestAuthority(String name) {

    public static Set<RestAuthority> fromSet(Set<Authority> authorities) {
        return authorities.stream()
                .map(authority -> RestAuthority.builder().name(authority.getName()).build())
                .collect(Collectors.toSet());
    }
}

