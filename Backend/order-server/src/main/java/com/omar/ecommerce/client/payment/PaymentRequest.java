package com.omar.ecommerce.client.payment;

import com.omar.ecommerce.client.customer.CustomerResponse;
import com.omar.ecommerce.entities.PaymentMethod;

import java.math.BigDecimal;

public record PaymentRequest(
        BigDecimal amount,
        PaymentMethod paymentMethod,
        Integer orderId,
        String orderReference,
        CustomerResponse customer
) {
}
