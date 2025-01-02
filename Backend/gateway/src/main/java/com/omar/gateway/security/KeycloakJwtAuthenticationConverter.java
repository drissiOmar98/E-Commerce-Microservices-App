package com.omar.gateway.security;


import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import reactor.core.publisher.Mono;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

//public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, Mono<AbstractAuthenticationToken>> {
//
//    @Override
//    public Mono<AbstractAuthenticationToken> convert(Jwt source) {
//        return Mono.just(new JwtAuthenticationToken(
//                source,
//                Stream.concat(
//                                new JwtGrantedAuthoritiesConverter().convert(source).stream(),
//                                extractResourceRoles(source).stream())
//                        .collect(toSet())
//        ));
//    }
//
//    private Collection<SimpleGrantedAuthority> extractResourceRoles(Jwt jwt) {
//        Map<String, Object> resourceAccess = new HashMap<>(jwt.getClaim("resource_access"));
//        Map<String, List<String>> rolesMap = (Map<String, List<String>>) resourceAccess.get("account");
//        List<String> roles = rolesMap != null ? rolesMap.get("roles") : List.of();
//
//        return roles.stream()
//                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.replace("-", "_")))
//                .collect(toList());
//    }
//}
