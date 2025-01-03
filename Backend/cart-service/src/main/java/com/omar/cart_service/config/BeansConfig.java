package com.omar.cart_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;


@Configuration
public class BeansConfig {

    @Bean
    public AuditorAware<String> auditorAware() {
        return new ApplicationAuditAware();
    }


//    @Bean
//    public CorsFilter corsFilter() {
//        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        final CorsConfiguration config = new CorsConfiguration();
//        config.setAllowCredentials(true);
//        config.setAllowedOrigins(Arrays.asList(
//                "http://localhost:4200",
//                "http://localhost:8222"
//
//
//        ));
//        config.setAllowedHeaders(Arrays.asList(
//                HttpHeaders.ORIGIN,
//                HttpHeaders.CONTENT_TYPE,
//                HttpHeaders.ACCEPT,
//                HttpHeaders.AUTHORIZATION
//        ));
//        config.setAllowedMethods(Arrays.asList(
//                "GET",
//                "POST",
//                "DELETE",
//                "PUT",
//                "PATCH"
//        ));
//        source.registerCorsConfiguration("/**", config);
//        return new CorsFilter(source);
//    }


}
