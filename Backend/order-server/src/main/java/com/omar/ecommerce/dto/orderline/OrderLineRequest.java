package com.omar.ecommerce.dto.orderline;

public record OrderLineRequest(
        Integer orderId,
        Integer productId,
        double quantity
) {
}
