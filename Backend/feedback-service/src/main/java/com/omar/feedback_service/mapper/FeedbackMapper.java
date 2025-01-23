package com.omar.feedback_service.mapper;

import com.omar.feedback_service.dto.FeedbackRequest;
import com.omar.feedback_service.dto.FeedbackResponse;
import com.omar.feedback_service.model.Feedback;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface FeedbackMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    Feedback toEntity(FeedbackRequest feedbackRequest);


    @Mapping(target = "ownFeedback", expression = "java(isOwnFeedback(feedback, id))")
    FeedbackResponse toFeedbackResponse(Feedback feedback, @Context String id);


    default boolean isOwnFeedback(Feedback feedback, String id) {
        return feedback.getCreatedBy() != null && feedback.getCreatedBy().equals(id);
    }

}
