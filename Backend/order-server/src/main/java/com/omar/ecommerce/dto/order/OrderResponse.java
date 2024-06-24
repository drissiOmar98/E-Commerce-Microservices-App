package com.omar.ecommerce.dto.order;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.omar.ecommerce.entities.PaymentMethod;

import java.math.BigDecimal;


@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record OrderResponse(
        Integer id,
        String reference,
        BigDecimal amount,
        PaymentMethod paymentMethod,
        String customerId
) {
}
