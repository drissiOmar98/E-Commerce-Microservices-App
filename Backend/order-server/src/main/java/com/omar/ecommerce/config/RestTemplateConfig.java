package com.omar.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

//    @Bean
//    public RestTemplate restTemplate() {
//        return new RestTemplate();
//    }

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add((request, body, execution) -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication instanceof JwtAuthenticationToken) {
                String token = ((JwtAuthenticationToken) authentication).getToken().getTokenValue();
                request.getHeaders().set(HttpHeaders.AUTHORIZATION, "Bearer " + token);
            }
            return execution.execute(request, body);
        });
        return restTemplate;
    }
}
