package com.omar.ecommerce.services;

import com.omar.ecommerce.dto.payment.PaymentRequest;

public interface PaymentService {
    Integer createPayment(PaymentRequest request);
}
