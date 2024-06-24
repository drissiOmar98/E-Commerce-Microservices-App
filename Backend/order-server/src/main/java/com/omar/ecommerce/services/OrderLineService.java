package com.omar.ecommerce.services;

import com.omar.ecommerce.dto.orderline.OrderLineRequest;

public interface OrderLineService {


    public Integer saveOrderLine(OrderLineRequest request);
}
