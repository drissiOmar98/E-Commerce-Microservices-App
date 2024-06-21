package com.omar.ecommerce.controllers;

import com.omar.ecommerce.dto.ProductPurchaseRequest;
import com.omar.ecommerce.dto.ProductPurchaseResponse;
import com.omar.ecommerce.dto.ProductRequest;
import com.omar.ecommerce.dto.ProductResponse;
import com.omar.ecommerce.services.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;


    @PostMapping
    public ResponseEntity<Integer> createProduct(
            @RequestBody @Valid ProductRequest request
    ) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PostMapping("/purchase")
    public ResponseEntity<List<ProductPurchaseResponse>> purchaseProducts(
            @RequestBody List<ProductPurchaseRequest> request
    ) {
        return ResponseEntity.ok(productService.purchaseProducts(request));
    }

    @GetMapping("/exists/{product-id}")
    public ResponseEntity<Boolean> existsById(
            @PathVariable("product-id") Integer productId
    ) {
        return ResponseEntity.ok(this.productService.existsById(productId));
    }

    @GetMapping("/{product-id}")
    public ResponseEntity<ProductResponse> findById(
            @PathVariable("product-id") Integer productId
    ) {
        return ResponseEntity.ok(productService.findById(productId));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> findAllProducts() {
        return ResponseEntity.ok(productService.findAllProducts());
    }



}
