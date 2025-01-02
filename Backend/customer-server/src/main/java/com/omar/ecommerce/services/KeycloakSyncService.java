package com.omar.ecommerce.services;


import com.omar.ecommerce.entities.Customer;
import com.omar.ecommerce.mapper.UserMapper;
import com.omar.ecommerce.shared.AuthenticatedUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.Instant;

import java.util.List;
import java.util.Map;
import java.util.Optional;

//@Service
//public class KeycloakSyncService {
//
//    private final CustomerService customerService;
//    private final UserMapper userMapper;
//    private static final String UPDATE_AT_KEY = "updated_at";
//
//    public KeycloakSyncService(CustomerService customerService, UserMapper userMapper) {
//        this.customerService = customerService;
//        this.userMapper = userMapper;
//    }
//
//
//    /**
//     * Sync user information with Keycloak
//     *
//     * @param jwtToken   The JWT token from Keycloak
//     * @param forceResync Whether to force resynchronization
//     */
//
//    public void syncWithIdp(Jwt jwtToken, boolean forceResync) {
//        Map<String, Object> attributes = jwtToken.getClaims();
//        List<String> rolesFromToken = AuthenticatedUser.extractRolesFromToken(jwtToken);
//        Customer customer = userMapper.fromTokenAttributes(attributes, rolesFromToken);
//        Optional<Customer> existingCustomer = customerService.getOneByEmail(customer.getEmail());
//
//        if (existingCustomer.isPresent()) {
//            if (attributes.get(UPDATE_AT_KEY) != null) {
//                Instant lastModifiedDate = existingCustomer.orElseThrow().getLastModifiedDate();
//                Instant idpModifiedDate;
//                if (attributes.get(UPDATE_AT_KEY) instanceof Instant instant) {
//                    idpModifiedDate = instant;
//                } else {
//                    idpModifiedDate = Instant.ofEpochSecond((Integer) attributes.get(UPDATE_AT_KEY));
//                }
//                if (idpModifiedDate.isAfter(lastModifiedDate) || forceResync) {
//                    updateCustomer(customer, existingCustomer.get());
//                }
//            }
//        } else {
//            // Handle new customer registration
//            customerService.save(customer);
//        }
//    }
//
//    private void updateCustomer(Customer customer, Customer existingCustomer) {
//        existingCustomer.updateFromUser(customer);
//        customerService.save(existingCustomer);
//    }
//
//
//
//
//
//
//
//}
