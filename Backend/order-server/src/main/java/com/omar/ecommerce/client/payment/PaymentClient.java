package com.omar.ecommerce.client.payment;


import com.omar.ecommerce.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "payment-server",
        url = "${application.config.payment-url}",
        configuration = FeignConfig.class
)
public interface PaymentClient {
    @PostMapping
    Integer requestOrderPayment(@RequestBody PaymentRequest request);
}
