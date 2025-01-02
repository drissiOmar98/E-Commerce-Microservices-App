package com.omar.ecommerce.services;

import com.omar.ecommerce.dto.order.OrderRequest;
import com.omar.ecommerce.dto.order.OrderResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface OrderService {
    Integer createOrder(OrderRequest request, Authentication connectedUser);

    List<OrderResponse> findAllOrders();

    OrderResponse findById(Integer orderId);
}
