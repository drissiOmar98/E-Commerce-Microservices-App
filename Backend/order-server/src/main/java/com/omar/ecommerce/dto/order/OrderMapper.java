package com.omar.ecommerce.dto.order;

import com.omar.ecommerce.client.customer.CustomerResponse;
import com.omar.ecommerce.entities.Order;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class OrderMapper {

    public Order toOrder(OrderRequest request, double totalPrice, CustomerResponse authenticatedCustomer){
        if (request == null){
            return null;
        }
        return Order.builder()
                .id(request.id())
                .reference(request.reference())
                .totalAmount(BigDecimal.valueOf(totalPrice))
                .paymentMethod(request.paymentMethod())
                //.customerId(request.customerId())
                .customerId(authenticatedCustomer.id())
                .build();

    }

    public OrderResponse fromOrder(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getReference(),
                order.getTotalAmount(),
                order.getPaymentMethod(),
                order.getCustomerId()
        );
    }
}
