package com.omar.feedback_service.service;

import com.omar.feedback_service.dto.FeedbackRequest;
import com.omar.feedback_service.dto.FeedbackResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

public interface FeedBackService {

    public Integer createFeedback(FeedbackRequest request);

    Page<FeedbackResponse> getFeedbacksByProductId(Integer productId, Pageable pageable,Authentication connectedUser);


}
