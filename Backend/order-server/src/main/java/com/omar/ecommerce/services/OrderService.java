package com.omar.ecommerce.services;

import com.omar.ecommerce.dto.order.OrderRequest;

public interface OrderService {
    Integer createOrder(OrderRequest request);
}
