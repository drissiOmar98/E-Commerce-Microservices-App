package com.omar.ecommerce.services.Impl;

import com.omar.ecommerce.dto.CustomerMapper;
import com.omar.ecommerce.dto.CustomerRequest;
import com.omar.ecommerce.dto.CustomerResponse;
import com.omar.ecommerce.entities.Customer;
import com.omar.ecommerce.exception.CustomerNotFoundException;
import com.omar.ecommerce.repositories.CustomerRepository;
import com.omar.ecommerce.services.CustomerService;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    private final CustomerMapper customerMapper;


    @Override
    public String createCustomer(CustomerRequest request) {
        var customer = this.customerRepository.save(customerMapper.toCustomer(request));
        return  customer.getId();
    }

    @Override
    public void updateCustomer(CustomerRequest request) {
        var customer = this.customerRepository.findById(request.id())
                .orElseThrow(() -> new CustomerNotFoundException(
                        String.format("Cannot update customer:: No customer found with the provided ID: %s", request.id())
                ));
        mergeCustomer(customer, request);
        this.customerRepository.save(customer);
    }

    @Override
    public List<CustomerResponse> findAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(this.customerMapper::fromCustomer)
                .collect(Collectors.toList());
    }

    @Override
    public Boolean existsById(String customerId) {
        return this.customerRepository.findById(customerId)
                .isPresent();
    }

    @Override
    public CustomerResponse findById(String customerId) {
        return this.customerRepository.findById(customerId)
                .map(customerMapper::fromCustomer)
                .orElseThrow(() -> new CustomerNotFoundException(String.format("No customer found with the provided ID: %s", customerId)));
    }

    @Override
    public void deleteCustomer(String customerId) {
        this.customerRepository.deleteById(customerId);
    }

    private void mergeCustomer(Customer customer, CustomerRequest request) {
        if (StringUtils.isNotBlank(request.firstname())) {
            customer.setFirstname(request.firstname());
        }
        if (StringUtils.isNotBlank(request.email())) {
            customer.setEmail(request.email());
        }
        if (request.address() != null) {
            customer.setAddress(request.address());
        }
    }

}
