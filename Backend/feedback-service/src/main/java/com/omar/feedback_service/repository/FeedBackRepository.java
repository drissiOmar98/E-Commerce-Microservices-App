package com.omar.feedback_service.repository;


import com.omar.feedback_service.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FeedBackRepository extends JpaRepository<Feedback, Integer> {

    @Query("""
          SELECT feedback
          FROM Feedback  feedback
          WHERE feedback.productId = :productId
          """)
    Page<Feedback> findAllByproductId(@Param("productId")Integer productId, Pageable pageable);


}
