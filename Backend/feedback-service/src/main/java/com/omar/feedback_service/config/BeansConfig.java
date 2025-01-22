package com.omar.feedback_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;


@Configuration
public class BeansConfig {

    @Bean
    public AuditorAware<String> auditorAware() {
        return new ApplicationAuditAware();
    }

}
