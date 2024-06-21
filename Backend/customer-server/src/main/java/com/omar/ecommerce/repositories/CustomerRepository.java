package com.omar.ecommerce.repositories;

import com.omar.ecommerce.entities.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends MongoRepository<Customer,String> {
}
