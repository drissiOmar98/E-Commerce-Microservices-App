package com.omar.cart_service.client.product;

import com.omar.cart_service.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Component
@FeignClient(
        name = "product-server",
        url = "${application.config.product-url}",
        configuration = FeignConfig.class
)
public interface ProductClient {

    @GetMapping("/{id}")
    ProductDTO getProductDetailsById(@PathVariable Integer id);
}
