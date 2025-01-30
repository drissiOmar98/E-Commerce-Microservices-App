package com.omar.ecommerce.client.cart;

import com.omar.ecommerce.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;


@FeignClient(
        name = "cart-service",
        url = "${application.config.cart-url}",
        configuration = FeignConfig.class
)
public interface CartClient {

    @GetMapping
    CartDTO getCart();
}
