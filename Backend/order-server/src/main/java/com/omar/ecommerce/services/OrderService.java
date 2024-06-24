package com.omar.ecommerce.services;

import com.omar.ecommerce.dto.order.OrderRequest;
import com.omar.ecommerce.dto.order.OrderResponse;

import java.util.List;

public interface OrderService {
    Integer createOrder(OrderRequest request);

    List<OrderResponse> findAllOrders();

    OrderResponse findById(Integer orderId);
}
