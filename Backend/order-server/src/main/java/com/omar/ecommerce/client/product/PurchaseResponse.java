package com.omar.ecommerce.client.product;

import java.util.List;

public record PurchaseResponse(
        List<ProductPurchaseResponse> purchasedProducts,
        double totalPrice
) {
}
