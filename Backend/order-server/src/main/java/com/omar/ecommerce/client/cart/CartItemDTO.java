package com.omar.ecommerce.client.cart;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Long id;
    private Integer productId;  // Product ID from the Product Service
    private double quantity;
    private String productName;  // Populated from the Product Service
    private double availableQuantity;
    private PictureDTO cover;  // Populated from the Product Service
    private BigDecimal price;  // Price from the Product Service
    private double totalPrice;
}
