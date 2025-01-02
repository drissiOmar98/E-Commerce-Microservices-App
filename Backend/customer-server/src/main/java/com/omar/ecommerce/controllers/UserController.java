package com.omar.ecommerce.controllers;

import com.omar.ecommerce.dto.RestUser;
import com.omar.ecommerce.entities.Customer;
import com.omar.ecommerce.services.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final CustomerService customerService;

    @GetMapping("/get-authenticated-user")
    public ResponseEntity<RestUser> getAuthenticatedUser(@AuthenticationPrincipal Jwt user,
                                                         @RequestParam boolean forceResync) {
        Customer authenticatedUser = customerService.getAuthenticatedCustomerWithSync(user, forceResync);
        RestUser restUser = RestUser.from(authenticatedUser);
        return ResponseEntity.ok(restUser);
    }






}
