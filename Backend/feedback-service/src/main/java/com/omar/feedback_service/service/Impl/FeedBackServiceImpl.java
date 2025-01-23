package com.omar.feedback_service.service.Impl;

import com.omar.feedback_service.dto.FeedbackRequest;
import com.omar.feedback_service.dto.FeedbackResponse;
import com.omar.feedback_service.service.FeedBackService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class FeedBackServiceImpl implements FeedBackService {

    @Override
    public Integer createFeedback(FeedbackRequest request) {
        return 0;
    }

    @Override
    public Page<FeedbackResponse> getFeedbacksByProductId(Integer productId, Pageable pageable) {
        return null;
    }
}
