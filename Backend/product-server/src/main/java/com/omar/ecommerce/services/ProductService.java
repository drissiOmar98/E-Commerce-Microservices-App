package com.omar.ecommerce.services;

import com.omar.ecommerce.dto.ProductPurchaseRequest;
import com.omar.ecommerce.dto.ProductPurchaseResponse;
import com.omar.ecommerce.dto.ProductRequest;
import com.omar.ecommerce.dto.ProductResponse;

import java.util.List;

public interface ProductService {
    Integer createProduct(ProductRequest request);

    List<ProductPurchaseResponse> purchaseProducts(List<ProductPurchaseRequest> request);

    ProductResponse findById(Integer productId);

    Boolean existsById(Integer productId);

    List<ProductResponse>  findAllProducts();
}
