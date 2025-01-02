package com.omar.ecommerce.services.Impl;

import com.omar.ecommerce.client.customer.CustomerClient;
import com.omar.ecommerce.client.customer.CustomerResponse;
import com.omar.ecommerce.client.payment.PaymentClient;
import com.omar.ecommerce.client.payment.PaymentRequest;
import com.omar.ecommerce.client.product.ProductClient;
import com.omar.ecommerce.client.product.PurchaseRequest;
import com.omar.ecommerce.client.product.ProductPurchaseResponse;
import com.omar.ecommerce.client.product.PurchaseResponse;
import com.omar.ecommerce.dto.order.OrderMapper;
import com.omar.ecommerce.dto.order.OrderRequest;
import com.omar.ecommerce.dto.order.OrderResponse;
import com.omar.ecommerce.dto.orderline.OrderLineRequest;
import com.omar.ecommerce.kafka.OrderConfirmation;
import com.omar.ecommerce.kafka.OrderProducer;
import com.omar.ecommerce.repositories.OrderRepository;
import com.omar.ecommerce.services.OrderLineService;
import com.omar.ecommerce.services.OrderService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final CustomerClient customerClient;
    private final ProductClient productClient;
    private final OrderLineService orderLineService;
    private final OrderProducer orderProducer;
    private final PaymentClient paymentClient;



    @Override
    @Transactional
    public Integer createOrder(OrderRequest request, Authentication connectedUser) {

//        //check if the customer exists (customer-ms)
//        var customer = this.customerClient.findCustomerById(request.customerId())
//                .orElseThrow(() -> new BusinessException("Cannot create order:: No customer exists with the provided ID"));

        // Get the authenticated customer's details
        CustomerResponse authenticatedCustomer = getAuthenticatedCustomer(connectedUser);



        // purchase the products ==> product-ms (RestTemplate)
        //var purchasedProducts = this.productClient.purchaseProducts(request.products());

        // Purchase the products ==> product-ms (RestTemplate)
        PurchaseResponse purchasedResponse = this.productClient.purchaseProducts(request.products());

        // Extract purchased products and total price from the response
        List<ProductPurchaseResponse> purchasedProducts = purchasedResponse.purchasedProducts();
        double totalPrice = purchasedResponse.totalPrice();

        // persist order
        var order = this.orderRepository.save(orderMapper.toOrder(request, totalPrice, authenticatedCustomer));



        // persist order line
        for (PurchaseRequest purchaseRequest : request.products()) {
            // Check if the productId and quantity are correct
            log.debug("Saving order line for productId: {} with quantity: {}", purchaseRequest.productId(), purchaseRequest.quantity());
            orderLineService.saveOrderLine(
                    new OrderLineRequest(
                            order.getId(),
                            purchaseRequest.productId(),
                            purchaseRequest.quantity()
                    )
            );
        }

        // start the payment
        var paymentRequest = new PaymentRequest(
                //request.amount(),
                BigDecimal.valueOf(totalPrice),
                request.paymentMethod(),
                order.getId(),
                order.getReference(),
                //customer
                authenticatedCustomer
        );
        paymentClient.requestOrderPayment(paymentRequest);


        // send the order confirmation --> notif-ms (Kafka)
        orderProducer.sendOrderConfirmation(
                new OrderConfirmation(
                        request.reference(),
                        //request.amount(),
                        BigDecimal.valueOf(totalPrice),
                        request.paymentMethod(),
                        //customer,
                        authenticatedCustomer,
                        purchasedProducts
                )
        );

        return order.getId();
    }

    @Override
    public List<OrderResponse> findAllOrders() {
        return this.orderRepository.findAll()
                .stream()
                .map(this.orderMapper::fromOrder)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse findById(Integer orderId) {
        return this.orderRepository.findById(orderId)
                .map(this.orderMapper::fromOrder)
                .orElseThrow(() -> new EntityNotFoundException(String.format("No order found with the provided ID: %d", orderId)));
    }


    private CustomerResponse getAuthenticatedCustomer(Authentication authentication) {
        // Get the JWT token from Authentication
        Jwt jwt = (Jwt) authentication.getPrincipal();

        // Extract the necessary details from the JWT token
        String customerId = jwt.getSubject();  // The 'sub' claim holds the customer ID
        String firstName = jwt.getClaimAsString("given_name");
        String lastName = jwt.getClaimAsString("family_name");
        String email = jwt.getClaimAsString("email");


        // Create and return the Customer object
        return new CustomerResponse(customerId, firstName, lastName, email);
    }
}
