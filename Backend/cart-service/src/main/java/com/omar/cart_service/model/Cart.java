package com.omar.cart_service.model;

import com.omar.cart_service.shared.AbstractAuditingEntity;
import jakarta.persistence.*;
import lombok.*;


import java.util.HashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "my_cart")
public class Cart extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerId;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<CartItem> items = new HashSet<>();

    public Cart(String customerId) {
        this.customerId = customerId;
    }
}
