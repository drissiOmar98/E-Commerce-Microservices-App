package com.omar.ecommerce.client.FeedBack;

import com.omar.ecommerce.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Component
@FeignClient(
        name = "feedback-service",
        url = "${application.config.feedback-url}",
        configuration = FeignConfig.class
)
public interface FeedbackClient {

    @GetMapping("/product/{productId}")
    Page<FeedbackResponse> getFeedbacksByProductId(@PathVariable("productId") Integer productId, Pageable pageable);

}
