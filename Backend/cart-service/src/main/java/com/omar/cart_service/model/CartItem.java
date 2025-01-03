package com.omar.cart_service.model;

import com.omar.cart_service.shared.AbstractAuditingEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "cart_item")
public class CartItem extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer productId; // The ID of the product

    @Column(nullable = false)
    private double quantity; // The quantity of the product in the cart

    @ManyToOne
    @JoinColumn(name = "cart_fk")
    private Cart cart;


}
