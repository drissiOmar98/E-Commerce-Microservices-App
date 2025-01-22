package com.omar.feedback_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class FeedbackServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FeedbackServiceApplication.class, args);
	}

}
