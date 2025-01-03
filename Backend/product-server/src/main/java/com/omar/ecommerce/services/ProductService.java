package com.omar.ecommerce.services;

import com.omar.ecommerce.common.state.State;
import com.omar.ecommerce.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ProductService {
    Integer createProduct(ProductRequest request);

    List<ProductPurchaseResponse> purchaseProducts(List<ProductPurchaseRequest> request);

    //ProductResponse findById(Integer productId);

    Boolean existsById(Integer productId);

    //List<ProductResponse>  findAllProducts();

    Page<DisplayCardProductDTO> getAllByCategory(Pageable pageable, Integer categoryId);

    public State<DisplayProductDTO, String> getOne(Integer productId);

//    Page<DisplayCardProductDTO> getAllByCategoryAndSubcategory(
//            Pageable pageable,
//            String categoryName,
//            String subcategoryName);

    Page<DisplayCardProductDTO> getAllByMultipleCategoriesAndSubcategories(
            Pageable pageable,
            List<String> categoryNames,
            List<String> subcategoryNames);

    public Page<DisplayCardProductDTO> filterProductsByPriceRange(Pageable pageable, BigDecimal minPrice, BigDecimal maxPrice);

    DisplayCardProductDTO getProductDetailsWithCover(Integer productId);
}
