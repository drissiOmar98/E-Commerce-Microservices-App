package com.omar.cart_service.service;


import com.omar.cart_service.dto.CartDTO;
import com.omar.cart_service.dto.CartItemRequest;
import com.omar.cart_service.dto.customer.CustomerResponse;
import com.omar.cart_service.exception.CartItemNotFoundException;
import com.omar.cart_service.exception.CartNotFoundException;
import com.omar.cart_service.mapper.CartItemMapper;
import com.omar.cart_service.mapper.CartMapper;
import com.omar.cart_service.model.Cart;
import com.omar.cart_service.model.CartItem;
import com.omar.cart_service.repository.CartItemRepository;
import com.omar.cart_service.repository.CartRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService{

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CartMapper cartMapper;
    private final CartItemMapper cartItemMapper;


    public CartServiceImpl(CartRepository cartRepository,CartItemRepository cartItemRepository, CartMapper cartMapper, CartItemMapper cartItemMapper) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartMapper = cartMapper;
        this.cartItemMapper = cartItemMapper;

    }


    @Override
    public CartDTO getCart(Authentication authentication) {
        CustomerResponse customer = getAuthenticatedCustomer(authentication);
        // Fetch the cart for the authenticated customer
        Cart cart = cartRepository.findByCustomerId(customer.id())
                .orElseThrow(() -> new CartNotFoundException("Cart not found for customer"));
        return cartMapper.toCartDTO(cart);
    }

    @Override
    public void clearCart(Authentication authentication) {
        CustomerResponse customer = getAuthenticatedCustomer(authentication);
        Cart cart = cartRepository.findByCustomerId(customer.id())
                .orElseThrow(() -> new CartNotFoundException("Cart not found for customer"));
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Override
    public CartDTO removeItemFromCart(Long cartItemId, Authentication authentication) {
        CustomerResponse customer = getAuthenticatedCustomer(authentication);
        Cart cart = cartRepository.findByCustomerId(customer.id())
                .orElseThrow(() -> new CartNotFoundException("Cart not found for customer"));
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found"));

        cart.getItems().remove(cartItem);
        cartRepository.save(cart);
        return cartMapper.toCartDTO(cart);
    }

    @Override
    public CartDTO addItemToCart(CartItemRequest cartItemRequest, Authentication authentication) {
        // Fetch the authenticated customer details
        CustomerResponse customer = getAuthenticatedCustomer(authentication);

        // Try to find the cart for the customer; if not found, create a new cart
        Cart cart = cartRepository.findByCustomerId(customer.id())
                .orElseGet(() -> new Cart(customer.id())); // If cart is not found, create a new one

        // Convert CartItemRequest to CartItem entity
        CartItem cartItem = cartItemMapper.toCartItem(cartItemRequest);
        cartItem.setCart(cart);  // Associate the cart item with the found or newly created cart

        // Add the CartItem to the cart
        cart.getItems().add(cartItem); // Assuming 'cart.getItems()' is a Set<CartItem>
        cartRepository.save(cart);

        // Return the CartDTO which includes totalAmount computation
        return cartMapper.toCartDTO(cart);
    }



    @Override
    public CartDTO updateCartItemQuantity(Long cartItemId, CartItemRequest cartItemRequest, Authentication authentication) {
        CustomerResponse customer = getAuthenticatedCustomer(authentication);
        Cart cart = cartRepository.findByCustomerId(customer.id())
                .orElseThrow(() -> new CartNotFoundException("Cart not found for customer"));
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new CartItemNotFoundException("Cart item not found"));
        cartItem.setQuantity(cartItemRequest.quantity());
        cartItemRepository.save(cartItem);
        return cartMapper.toCartDTO(cart);
    }

    @Override
    public boolean isProductInCart(Integer productId, Authentication authentication) {
        CustomerResponse customer = getAuthenticatedCustomer(authentication);
        Cart cart = cartRepository.findByCustomerId(customer.id())
                .orElseThrow(() -> new CartNotFoundException("Cart not found"));
        return cart.getItems().stream()
                .anyMatch(item -> item.getProductId().equals(productId));
    }


    // Helper method to get customer details from JWT token
    private CustomerResponse getAuthenticatedCustomer(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String customerId = jwt.getSubject();
        String firstName = jwt.getClaimAsString("given_name");
        String lastName = jwt.getClaimAsString("family_name");
        String email = jwt.getClaimAsString("email");

        return new CustomerResponse(customerId, firstName, lastName, email);
    }
}
