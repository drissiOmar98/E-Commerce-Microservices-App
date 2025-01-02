package com.omar.ecommerce.dto;

import com.omar.ecommerce.dto.ProductDTO.ProductInfoDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest (
        Integer id,
        @NotNull(message = "Product info is required")
        ProductInfoDTO infos,
        @Positive(message = "Price should be positive")
        BigDecimal price,
        @NotNull(message = "Product category is required")
        Integer categoryId,
        @NotNull(message = "Product subcategory is required")
        Integer subcategoryId,
        List<PictureDTO> pictures

        //        @NotNull(message = "Product name is required")
//        String name,
//        @NotNull(message = "Product description is required")
//        String description,
//        @Positive(message = "Available quantity should be positive")
//        double availableQuantity,
){
}
