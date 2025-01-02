package com.omar.gateway.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

/**
 * TokenFilter is a custom Spring WebFlux filter that processes JWT authentication tokens.
 * It extracts the user ID (sub claim) from the JWT token and adds it as a custom header to the request.
 * This header can then be used by downstream filters or services.
 */
public class TokenFilter implements WebFilter {


    /**
     * Filters incoming requests to extract the JWT token and add a custom 'User-ID' header.
     *
     * @param exchange The current ServerWebExchange representing the request-response exchange.
     * @param chain The WebFilterChain to continue the processing of the request.
     * @return A Mono<Void> indicating the completion of the filter chain.
     */
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // Log the invocation of the filter
        System.out.println("TokenFilter invoked");

        // Retrieve the principal (authenticated user) from the exchange
        return exchange.getPrincipal()
                .cast(Authentication.class)  // Cast the principal to an Authentication object
                .flatMap(auth -> {
                    // Check if the authentication is a JWT token
                    if (auth instanceof JwtAuthenticationToken jwtAuth) {
                        System.out.println("JWT token found");

                        // Extract the JWT token from the authentication object
                        Jwt jwt = jwtAuth.getToken();

                        // Extract the 'sub' claim (user ID) from the JWT token
                        String userId = jwt.getClaimAsString("sub");

                        // Log the extracted user ID for debugging purposes
                        System.out.println("User ID: " + userId);

                        // Mutate the ServerWebExchange to add the 'User-ID' header to the request
                        ServerWebExchange mutatedExchange = exchange.mutate()
                                .request(r -> r.headers(headers -> {
                                    // Add the 'User-ID' header with the extracted user ID
                                    headers.add("User-ID", userId);
                                }))
                                .build();

                        // Continue processing the request with the mutated exchange (new headers)
                        return chain.filter(mutatedExchange);
                    } else {
                        // If the principal is not a JwtAuthenticationToken, continue with the original exchange
                        System.out.println("JwtAuthenticationToken not found");
                        return chain.filter(exchange);
                    }
                })
                .switchIfEmpty(chain.filter(exchange));  // In case the principal is empty, continue with the original exchange
    }
}
