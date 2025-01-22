package com.omar.feedback_service.security;


import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {


    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt source) {
        // Combine existing authorities with the roles from the token
        Set<GrantedAuthority> authorities = Stream.concat(
                new JwtGrantedAuthoritiesConverter().convert(source).stream(),
                extractResourceRoles(source).stream()
        ).collect(Collectors.toSet());

        return new JwtAuthenticationToken(source, authorities);
    }

    private Collection<? extends GrantedAuthority> extractResourceRoles(Jwt jwt) {
        // Extract roles directly from the "realm_access" claim
        List<String> roles = extractRolesFromToken(jwt);
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role))
                .collect(Collectors.toSet());
    }

    public static List<String> extractRolesFromToken(Jwt jwtToken) {
        // Extract "realm_access" claim as a Map<String, Object> to avoid LinkedTreeMap conflict
        Map<String, Object> realmAccess = (Map<String, Object>) jwtToken.getClaims().get("realm_access");

        // Check if "roles" is present and safely cast it
        if (realmAccess != null && realmAccess.containsKey("roles")) {
            // Ensure roles are a List<String> type
            Object rolesObj = realmAccess.get("roles");
            if (rolesObj instanceof List<?>) {
                List<?> rolesList = (List<?>) rolesObj;
                return rolesList.stream()
                        .filter(role -> role instanceof String)  // Filter to ensure each role is a String
                        .map(String.class::cast)  // Cast each to String
                        .filter(role -> role.contains("ROLE_"))  // Filter only roles starting with "ROLE_"
                        .collect(Collectors.toList());
            }
        }
        return Collections.emptyList();  // Return empty list if no roles are found
    }
}
