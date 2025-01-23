package com.omar.feedback_service.controller;


import com.omar.feedback_service.dto.FeedbackRequest;
import com.omar.feedback_service.dto.FeedbackResponse;
import com.omar.feedback_service.service.FeedBackService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/feedbacks")
public class FeedBackController {

    private final FeedBackService feedBackService;

    public FeedBackController(FeedBackService feedBackService) {
        this.feedBackService = feedBackService;
    }

    @PostMapping("/addFeedBack")
    public ResponseEntity<Integer> saveFeedback(@Valid @RequestBody FeedbackRequest request) {
        return ResponseEntity.ok(feedBackService.createFeedback(request));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Page<FeedbackResponse>> getFeedbacksByProductId(
            @PathVariable Integer productId,
            Pageable pageable,
            Authentication authentication) {
        return ResponseEntity.ok(feedBackService.getFeedbacksByProductId(productId, pageable, authentication));
    }
}
