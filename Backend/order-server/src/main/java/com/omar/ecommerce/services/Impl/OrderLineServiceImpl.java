package com.omar.ecommerce.services.Impl;

import com.omar.ecommerce.dto.orderline.OrderLineMapper;
import com.omar.ecommerce.dto.orderline.OrderLineRequest;
import com.omar.ecommerce.repositories.OrderLineRepository;
import com.omar.ecommerce.services.OrderLineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderLineServiceImpl implements OrderLineService {


    private final OrderLineRepository orderLineRepository;

    private final OrderLineMapper orderLineMapper;


    @Override
    public Integer saveOrderLine(OrderLineRequest request) {
        var orderLine = this.orderLineMapper.toOrderLine(request);
        return orderLineRepository.save(orderLine).getId();

    }
}
