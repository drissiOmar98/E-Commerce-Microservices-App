package com.omar.ecommerce.services;

import com.omar.ecommerce.entities.Customer;
import org.springframework.security.oauth2.jwt.Jwt;


import java.util.Optional;

public interface CustomerService {

//    public String createCustomer(CustomerRequest request);
//
//    public void updateCustomer(CustomerRequest request);
//
//    public List<CustomerResponse> findAllCustomers();
//
//    public Boolean existsById(String customerId);
//
//    public CustomerResponse findById(String customerId);
//
//    public void deleteCustomer(String customerId);

    Optional<Customer> getOneByEmail(String userEmail);

    void save(Customer user);

    public Customer getAuthenticatedCustomerWithSync(Jwt oauth2User, boolean forceResync);


}
