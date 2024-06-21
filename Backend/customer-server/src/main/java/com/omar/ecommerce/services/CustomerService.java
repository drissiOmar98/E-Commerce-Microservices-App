package com.omar.ecommerce.services;

import com.omar.ecommerce.dto.CustomerRequest;
import com.omar.ecommerce.dto.CustomerResponse;

import java.util.List;

public interface CustomerService {

    public String createCustomer(CustomerRequest request);

    public void updateCustomer(CustomerRequest request);

    public List<CustomerResponse> findAllCustomers();

    public Boolean existsById(String customerId);

    public CustomerResponse findById(String customerId);

    public void deleteCustomer(String customerId);
}
