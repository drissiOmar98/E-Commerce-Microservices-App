package com.omar.ecommerce.services.Impl;

import com.omar.ecommerce.dto.*;
import com.omar.ecommerce.exception.ProductPurchaseException;
import com.omar.ecommerce.repositories.ProductRepository;
import com.omar.ecommerce.services.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final ProductMapper productMapper;


    @Override
    public Integer createProduct(ProductRequest request) {
        var product = productMapper.toProduct(request);
        return productRepository.save(product).getId();
    }

    @Override
    public List<ProductPurchaseResponse> purchaseProducts(List<ProductPurchaseRequest> request) {
        var productIds = request
                .stream()
                .map(ProductPurchaseRequest::productId)
                .toList();
        var storedProducts = productRepository.findAllByIdInOrderById(productIds);
        if (productIds.size() != storedProducts.size()) {
            throw new ProductPurchaseException("One or more products does not exist");
        }
        var sortedRequest = request
                .stream()
                .sorted(Comparator.comparing(ProductPurchaseRequest::productId))
                .toList();
        var purchasedProducts = new ArrayList<ProductPurchaseResponse>();
        for (int i = 0; i < storedProducts.size(); i++){
            var product = storedProducts.get(i);
            var productRequest = sortedRequest.get(i);
            if (product.getAvailableQuantity() < productRequest.quantity()) {
                throw new ProductPurchaseException("Insufficient stock quantity for product with ID:: " + productRequest.productId());
            }
            var newAvailableQuantity = product.getAvailableQuantity() - productRequest.quantity();
            product.setAvailableQuantity(newAvailableQuantity);
            productRepository.save(product);
            purchasedProducts.add(productMapper.toproductPurchaseResponse(product, productRequest.quantity()));
        }
        return purchasedProducts;
    }

    @Override
    public ProductResponse findById(Integer id) {
        return productRepository.findById(id)
                .map(productMapper::toProductResponse)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID:: " + id));
    }

    @Override
    public Boolean existsById(Integer productId) {
        return productRepository.findById(productId)
                .isPresent();
    }

    @Override
    public List<ProductResponse> findAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this.productMapper::toProductResponse)
                .collect(Collectors.toList());
    }


}
