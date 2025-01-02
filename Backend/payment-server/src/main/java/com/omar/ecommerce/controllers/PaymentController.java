package com.omar.ecommerce.controllers;

import com.omar.ecommerce.dto.payment.PaymentRequest;
import com.omar.ecommerce.services.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Integer> createPayment(
            @RequestBody @Valid PaymentRequest request
    ) {
        return ResponseEntity.ok(this.paymentService.createPayment(request));
    }
}
