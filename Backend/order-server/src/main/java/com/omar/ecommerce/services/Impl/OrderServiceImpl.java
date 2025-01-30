package com.omar.ecommerce.services.Impl;

import com.omar.ecommerce.client.cart.CartClient;
import com.omar.ecommerce.client.cart.CartDTO;
import com.omar.ecommerce.client.cart.CartItemDTO;
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
import java.util.UUID;
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
    private final CartClient cartClient;



    @Override
    @Transactional
    public Integer createOrder(OrderRequest request, Authentication connectedUser) {

        // 🔹 Fetch the authenticated customer
        CustomerResponse authenticatedCustomer = getAuthenticatedCustomer(connectedUser);

        // 🔹 Retrieve the cart
        CartDTO cart = cartClient.getCart();
        if (cart == null || cart.getCartItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty. Cannot create an order.");
        }

        // 🔹 Extract purchase requests from cart items
        List<PurchaseRequest> purchaseRequests = cart.getCartItems().stream()
                .map(item -> new PurchaseRequest(item.getProductId(), item.getQuantity()))
                .toList();

        // 🔹 Purchase products from product-service (RestTemplate)
        PurchaseResponse purchasedResponse = this.productClient.purchaseProducts(purchaseRequests);
        List<ProductPurchaseResponse> purchasedProducts = purchasedResponse.purchasedProducts();
        double totalPrice = purchasedResponse.totalPrice();

        // 🔹 Generate a unique order reference (UUID can be used as a unique identifier)
        String orderReference = UUID.randomUUID().toString();

        // 🔹 persist order and Use OrderMapper to map the OrderRequest to an Order entity
        var order = this.orderRepository
                .save
                (orderMapper.toOrder(request, totalPrice, authenticatedCustomer, orderReference));


        // 🔹 Persist order lines based on cart items
        for (CartItemDTO cartItem : cart.getCartItems()) {
            // Create an OrderLineRequest for each item in the cart
            orderLineService.saveOrderLine(new OrderLineRequest(
                    order.getId(),
                    cartItem.getProductId(),
                    cartItem.getQuantity()
            ));

        }


        // 🔹 Start the payment process
        var paymentRequest = new PaymentRequest(
                BigDecimal.valueOf(totalPrice),
                request.paymentMethod(),
                order.getId(),
                order.getReference(),
                authenticatedCustomer
        );
        paymentClient.requestOrderPayment(paymentRequest);


        // 🔹 Send order confirmation notification (Kafka)
        orderProducer.sendOrderConfirmation(
                new OrderConfirmation(
                        orderReference,
                        BigDecimal.valueOf(totalPrice),
                        request.paymentMethod(),
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
