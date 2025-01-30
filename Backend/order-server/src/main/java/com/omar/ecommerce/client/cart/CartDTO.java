package com.omar.ecommerce.client.cart;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Long id;
    private String customerId;
    private Set<CartItemDTO> cartItems;
    private double totalAmount;
}
