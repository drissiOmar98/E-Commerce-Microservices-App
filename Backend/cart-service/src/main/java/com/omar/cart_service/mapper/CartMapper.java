package com.omar.cart_service.mapper;

import com.omar.cart_service.dto.CartDTO;
import com.omar.cart_service.dto.CartItemDTO;
import com.omar.cart_service.model.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring", uses = {CartItemMapper.class})
public interface CartMapper {

    @Mapping(target = "cartItems", source = "items")
    @Mapping(target = "totalAmount", expression = "java(calculateTotalAmount(cart, cartItemMapper))")
    CartDTO toCartDTO(Cart cart);


    @Mapping(target = "items", source = "cartItems")
    Cart toCart(CartDTO cartDTO);



    /**
     * Delegates the total amount calculation to CartItemMapper by using the converted DTOs.
     *
     * @param cart The cart entity.
     * @param cartItemMapper The injected mapper for converting CartItem to CartItemDTO.
     * @return The calculated total amount.
     */
    default double calculateTotalAmount(Cart cart, CartItemMapper cartItemMapper) {
        return cart.getItems().stream()  // Iterate over the items in the cart
                .mapToDouble(item -> {
                    CartItemDTO cartItemDTO = cartItemMapper.toCartItemDTO(item);  // Convert CartItem to CartItemDTO
                    return cartItemDTO.getTotalPrice();  // Calculate total price from the CartItemDTO
                }).sum();  // Return the sum of total prices for all items
    }



}
