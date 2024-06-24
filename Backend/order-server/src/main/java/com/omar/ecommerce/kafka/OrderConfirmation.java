package com.omar.ecommerce.kafka;

import com.omar.ecommerce.client.customer.CustomerResponse;
import com.omar.ecommerce.client.product.PurchaseResponse;
import com.omar.ecommerce.entities.PaymentMethod;

import java.math.BigDecimal;
import java.util.List;

public record OrderConfirmation(
        String orderReference,
        BigDecimal totalAmount,
        PaymentMethod paymentMethod,
        CustomerResponse customer,
        List<PurchaseResponse> products
) {
}
