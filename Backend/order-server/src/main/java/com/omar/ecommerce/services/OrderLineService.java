package com.omar.ecommerce.services;

import com.omar.ecommerce.dto.orderline.OrderLineRequest;
import com.omar.ecommerce.dto.orderline.OrderLineResponse;

import java.util.List;

public interface OrderLineService {


    public Integer saveOrderLine(OrderLineRequest request);

    List<OrderLineResponse> findAllByOrderId(Integer orderId);
}
