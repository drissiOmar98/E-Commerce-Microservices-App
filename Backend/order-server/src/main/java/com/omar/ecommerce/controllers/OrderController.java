package com.omar.ecommerce.controllers;

import com.omar.ecommerce.dto.order.OrderRequest;
import com.omar.ecommerce.dto.order.OrderResponse;
import com.omar.ecommerce.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Integer> createOrder(
            @RequestBody @Valid OrderRequest request, Authentication connectedUser
    ) {
        return ResponseEntity.ok(this.orderService.createOrder(request,connectedUser));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> findAll() {
        return ResponseEntity.ok(this.orderService.findAllOrders());
    }

    @GetMapping("/{order-id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<OrderResponse> findById(
            @PathVariable("order-id") Integer orderId
    ) {
        return ResponseEntity.ok(this.orderService.findById(orderId));
    }


}
