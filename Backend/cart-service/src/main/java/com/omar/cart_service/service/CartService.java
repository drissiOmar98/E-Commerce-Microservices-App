package com.omar.cart_service.service;

import com.omar.cart_service.dto.CartDTO;
import com.omar.cart_service.dto.CartItemRequest;
import org.springframework.security.core.Authentication;
public interface CartService {

    CartDTO getCart(Authentication authentication);

    void clearCart(Authentication authentication);

    CartDTO removeItemFromCart(Long cartItemId, Authentication authentication);

    CartDTO addItemToCart(CartItemRequest cartItemRequest, Authentication authentication);

    CartDTO updateCartItemQuantity(Long cartItemId, CartItemRequest cartItemRequest, Authentication authentication);

    boolean isProductInCart(Integer productId, Authentication authentication);

}
