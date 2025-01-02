package com.omar.ecommerce.client.product;

import java.math.BigDecimal;

public record ProductPurchaseResponse(
        Integer productId,
        String name,
        String description,
        BigDecimal price,
        double quantity
) {
    public double getTotalPrice() {
        return price.doubleValue() * quantity;
    }
}
