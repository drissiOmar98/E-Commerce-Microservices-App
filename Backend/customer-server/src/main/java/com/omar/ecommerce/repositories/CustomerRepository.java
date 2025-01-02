package com.omar.ecommerce.repositories;

import com.omar.ecommerce.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Long> {


    Optional<Customer> findByEmail(String email);
}
