package com.omar.ecommerce.repositories;

import com.omar.ecommerce.entities.OrderLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderLineRepository extends JpaRepository<OrderLine, Integer> {


    List<OrderLine> findAllByOrderId(Integer orderId);

}
