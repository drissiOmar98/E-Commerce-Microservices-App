package com.omar.feedback_service.service.Impl;

import com.omar.feedback_service.client.customer.CustomerResponse;
import com.omar.feedback_service.client.product.ProductClient;
import com.omar.feedback_service.client.product.ProductDTO;
import com.omar.feedback_service.dto.FeedbackRequest;
import com.omar.feedback_service.dto.FeedbackResponse;
import com.omar.feedback_service.exception.InsufficientStockException;
import com.omar.feedback_service.exception.ProductNotFoundException;
import com.omar.feedback_service.mapper.FeedbackMapper;
import com.omar.feedback_service.model.Feedback;
import com.omar.feedback_service.repository.FeedBackRepository;
import com.omar.feedback_service.service.FeedBackService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedBackServiceImpl implements FeedBackService {

    private final FeedBackRepository feedBackRepository;
    private final FeedbackMapper feedbackMapper;
    private final ProductClient productClient;

    public FeedBackServiceImpl(FeedBackRepository feedBackRepository, FeedbackMapper feedbackMapper, ProductClient productClient) {
        this.feedBackRepository = feedBackRepository;
        this.feedbackMapper = feedbackMapper;
        this.productClient = productClient;
    }


    @Override
    public Integer createFeedback(FeedbackRequest request) {

        ProductDTO  product = productClient.getProductDetailsById(request.productId());

        if (product== null) {
            throw new ProductNotFoundException("Product not found with ID: " + request.productId());
        }

        if (product.availableQuantity() <= 0) {
            throw new InsufficientStockException("No available quantity for product ID: "
                    + request.productId() + ". Feedback cannot be created.");
        }

        Feedback feedback = feedbackMapper.toEntity(request);

        return feedBackRepository.save(feedback).getId();
    }

    @Override
    public Page<FeedbackResponse> getFeedbacksByProductId(Integer productId,
                                                          Pageable pageable,
                                                          Authentication connectedUser ) {

        CustomerResponse authenticatedCustomer = getAuthenticatedCustomer(connectedUser);

        Page<Feedback> feedbacks = feedBackRepository.findAllByproductId(productId, pageable);

        List<FeedbackResponse> feedbackResponses = feedbacks.stream()
                .map(feedback -> feedbackMapper.toFeedbackResponse(feedback, authenticatedCustomer.id()))
                .toList();

        return new PageImpl<>(feedbackResponses, pageable, feedbacks.getTotalElements());
    }


    private CustomerResponse getAuthenticatedCustomer(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String customerId = jwt.getSubject();
        String firstName = jwt.getClaimAsString("given_name");
        String lastName = jwt.getClaimAsString("family_name");
        String email = jwt.getClaimAsString("email");

        return new CustomerResponse(customerId, firstName, lastName, email);
    }


}
