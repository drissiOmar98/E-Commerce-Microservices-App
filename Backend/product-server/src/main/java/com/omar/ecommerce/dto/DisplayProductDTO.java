package com.omar.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class DisplayProductDTO {
    private Integer id;
    private String name;
    private String description;
    private double availableQuantity;
    private BigDecimal price;
    private Integer categoryId;
    private String categoryName;
    private String categoryDescription;
    private Integer subcategoryId;  // New field for Subcategory ID
    private String subcategoryName; // New field for Subcategory name
    private List<PictureDTO> pictures ;// For detailed view of all images
}
