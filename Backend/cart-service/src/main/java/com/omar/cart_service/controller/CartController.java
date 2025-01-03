package com.omar.cart_service.controller;

import com.omar.cart_service.dto.CartDTO;
import com.omar.cart_service.dto.CartItemRequest;
import com.omar.cart_service.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getCart(Authentication authentication) {
        CartDTO cartDTO = cartService.getCart(authentication);
        return ResponseEntity.ok(cartDTO);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/add/item")
    public ResponseEntity<CartDTO> addItemToCart(@RequestBody @Valid CartItemRequest cartItemRequest,
                                                 Authentication authentication) {
        CartDTO updatedCart = cartService.addItemToCart(cartItemRequest, authentication);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/remove/item/{cartItemId}")
    public ResponseEntity<CartDTO> removeItemFromCart(@PathVariable Long cartItemId,
                                                      Authentication authentication) {
        CartDTO updatedCart = cartService.removeItemFromCart(cartItemId, authentication);
        return ResponseEntity.ok(updatedCart);
    }

    @PutMapping("/update/item/{cartItemId}")
    public ResponseEntity<CartDTO> updateCartItemQuantity(@PathVariable Long cartItemId,
                                                          @RequestBody CartItemRequest cartItemRequest,
                                                          Authentication authentication) {
        CartDTO updatedCart = cartService.updateCartItemQuantity(cartItemId, cartItemRequest, authentication);
        return ResponseEntity.ok(updatedCart);
    }

    @GetMapping("/items/check")
    public ResponseEntity<Map<String, Boolean>> isProductInCart(@RequestParam Integer productId,
                                                                Authentication authentication) {
        boolean productInCart = cartService.isProductInCart(productId, authentication);
        Map<String, Boolean> response = new HashMap<>();
        response.put("productInCart", productInCart);
        return ResponseEntity.ok(response);
    }


}
