package com.omar.ecommerce.services.Impl;


import com.omar.ecommerce.entities.Customer;
import com.omar.ecommerce.mapper.UserMapper;
import com.omar.ecommerce.repositories.CustomerRepository;
import com.omar.ecommerce.services.CustomerService;
import com.omar.ecommerce.shared.AuthenticatedUser;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    private final UserMapper userMapper;
    private static final String UPDATE_AT_KEY = "updated_at";



    @Override
    public Optional<Customer> getOneByEmail(String userEmail) {
        return customerRepository.findByEmail(userEmail);
    }

    @Override
    public void save(Customer user) {
        if (user.getId() != null) { // Check if the user has an ID (for updates)
            Optional<Customer> userToUpdateOpt = customerRepository.findById(user.getId());
            if (userToUpdateOpt.isPresent()) {
                Customer userToUpdate = userToUpdateOpt.get();
                userToUpdate.updateFromUser(user); // Update the fields
                customerRepository.save(userToUpdate); // Save the updated entity
            }
        } else {
            customerRepository.save(user); // Save the new user
        }

    }



    @Override
    @Transactional
    public Customer getAuthenticatedCustomerWithSync(Jwt oauth2User, boolean forceResync) {
        syncWithIdp(oauth2User, forceResync); // Sync with Keycloak directly here
        return customerRepository.findByEmail(AuthenticatedUser.username().get()).orElseThrow();
    }

    /**
     * Sync user information with Keycloak
     *
     * @param jwtToken   The JWT token from Keycloak
     * @param forceResync Whether to force resynchronization
     */
    private void syncWithIdp(Jwt jwtToken, boolean forceResync) {
        Map<String, Object> attributes = jwtToken.getClaims();
        List<String> rolesFromToken = AuthenticatedUser.extractRolesFromToken(jwtToken);
        Customer customer = userMapper.fromTokenAttributes(attributes, rolesFromToken);
        Optional<Customer> existingCustomer = customerRepository.findByEmail(customer.getEmail());

        if (existingCustomer.isPresent()) {
            if (attributes.get(UPDATE_AT_KEY) != null) {
                Instant lastModifiedDate = existingCustomer.orElseThrow().getLastModifiedDate();
                Instant idpModifiedDate;
                if (attributes.get(UPDATE_AT_KEY) instanceof Instant instant) {
                    idpModifiedDate = instant;
                } else {
                    idpModifiedDate = Instant.ofEpochSecond((Integer) attributes.get(UPDATE_AT_KEY));
                }
                if (idpModifiedDate.isAfter(lastModifiedDate) || forceResync) {
                    updateCustomer(customer, existingCustomer.get());
                }
            }
        } else {
            // Handle new customer registration
            save(customer);
        }
    }

    private void updateCustomer(Customer customer, Customer existingCustomer) {
        existingCustomer.updateFromUser(customer);
        customerRepository.save(existingCustomer);
    }


//    private void mergeCustomer(Customer customer, CustomerRequest request) {
//        if (StringUtils.isNotBlank(request.firstname())) {
//            customer.setFirstname(request.firstname());
//        }
//        if (StringUtils.isNotBlank(request.email())) {
//            customer.setEmail(request.email());
//        }
//        if (request.address() != null) {
//            customer.setAddress(request.address());
//        }
//    }



//    private final CustomerMapper customerMapper;
//
//
//    @Override
//    public String createCustomer(CustomerRequest request) {
//        var customer = this.customerRepository.save(customerMapper.toCustomer(request));
//        return  customer.getId();
//    }
//
//    @Override
//    public void updateCustomer(CustomerRequest request) {
//        var customer = this.customerRepository.findById(request.id())
//                .orElseThrow(() -> new CustomerNotFoundException(
//                        String.format("Cannot update customer:: No customer found with the provided ID: %s", request.id())
//                ));
//        mergeCustomer(customer, request);
//        this.customerRepository.save(customer);
//    }
//
//    @Override
//    public List<CustomerResponse> findAllCustomers() {
//        return customerRepository.findAll()
//                .stream()
//                .map(this.customerMapper::fromCustomer)
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public Boolean existsById(String customerId) {
//        return this.customerRepository.findById(customerId)
//                .isPresent();
//    }
//
//    @Override
//    public CustomerResponse findById(String customerId) {
//        return this.customerRepository.findById(customerId)
//                .map(customerMapper::fromCustomer)
//                .orElseThrow(() -> new CustomerNotFoundException(String.format("No customer found with the provided ID: %s", customerId)));
//    }
//
//    @Override
//    public void deleteCustomer(String customerId) {
//        this.customerRepository.deleteById(customerId);
//    }
//
//    @Override
//    public Optional<Customer> getOneByEmail(String userEmail) {
//        return  customerRepository.findByEmail(userEmail);
//    }
}
