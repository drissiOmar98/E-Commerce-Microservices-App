package com.omar.ecommerce.entities;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import org.springframework.validation.annotation.Validated;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Validated
@Embeddable  // Indicates that this class can be embedded in another entity
public class Address {

    @Column(name = "street")
    private String street;

    @Column(name = "house_number")
    private String houseNumber;

    @Column(name = "zip_code")
    private String zipCode;

}
