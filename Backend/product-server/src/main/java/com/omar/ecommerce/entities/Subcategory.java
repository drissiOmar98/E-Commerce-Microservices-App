package com.omar.ecommerce.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
public class Subcategory {

    @Id
    @GeneratedValue
    private Integer id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;


    @OneToMany(mappedBy = "subcategory", cascade = CascadeType.REMOVE)
    private List<Product> products;



}
