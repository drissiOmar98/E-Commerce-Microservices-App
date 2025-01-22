package com.omar.feedback_service.config;




import com.omar.feedback_service.security.KeycloakJwtAuthenticationConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final String[] freeResourceUrls = {
            "/api/public/**",
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for stateless APIs
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                freeResourceUrls)
                        .permitAll() // Public endpoints
                        .anyRequest().authenticated()// All other endpoints require authentication
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Stateless sessions
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(token -> token
                                .jwtAuthenticationConverter(new KeycloakJwtAuthenticationConverter())
                        )
                )
                .build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        // Replace with your Keycloak issuer URI
        String issuerUri = "http://localhost:9098/realms/Ecommerce-microservices";
        return JwtDecoders.fromIssuerLocation(issuerUri);
    }

}
