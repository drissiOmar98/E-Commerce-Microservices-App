package com.omar.ecommerce.services.Impl;

import com.omar.ecommerce.client.customer.CustomerClient;
import com.omar.ecommerce.client.product.ProductClient;
import com.omar.ecommerce.client.product.PurchaseRequest;
import com.omar.ecommerce.dto.order.OrderMapper;
import com.omar.ecommerce.dto.order.OrderRequest;
import com.omar.ecommerce.dto.orderline.OrderLineRequest;
import com.omar.ecommerce.exception.BusinessException;
import com.omar.ecommerce.repositories.OrderRepository;
import com.omar.ecommerce.services.OrderLineService;
import com.omar.ecommerce.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final CustomerClient customerClient;
    private final ProductClient productClient;
    private final OrderLineService orderLineService;



    @Override
    @Transactional
    public Integer createOrder(OrderRequest request) {

        //check if the customer exists (customer-ms)
        var customer = this.customerClient.findCustomerById(request.customerId())
                .orElseThrow(() -> new BusinessException("Cannot create order:: No customer exists with the provided ID"));

        // purchase the products ==> product-ms (RestTemplate)
        var purchasedProducts = this.productClient.purchaseProducts(request.products());

        // persist order
        var order = this.orderRepository.save(orderMapper.toOrder(request));

        // persist order line
        for (PurchaseRequest purchaseRequest : request.products()) {
            orderLineService.saveOrderLine(
                    new OrderLineRequest(
                            null,
                            order.getId(),
                            purchaseRequest.productId(),
                            purchaseRequest.quantity()
                    )
            );
        }

        // todo start the payment


        // todo send the order confirmation --> notif-ms (Kafka)

        return order.getId();
    }
}
