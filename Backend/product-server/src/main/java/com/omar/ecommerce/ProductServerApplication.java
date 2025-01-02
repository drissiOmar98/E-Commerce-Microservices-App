package com.omar.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class ProductServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductServerApplication.class, args);
	}

}
