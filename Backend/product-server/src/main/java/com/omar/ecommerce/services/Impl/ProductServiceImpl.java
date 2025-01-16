package com.omar.ecommerce.services.Impl;

import com.omar.ecommerce.common.state.State;
import com.omar.ecommerce.dto.*;


import com.omar.ecommerce.entities.Product;
import com.omar.ecommerce.exception.ProductNotFoundException;
import com.omar.ecommerce.exception.ProductPurchaseException;
import com.omar.ecommerce.mapper.ProductMapper;
import com.omar.ecommerce.repositories.ProductRepository;
import com.omar.ecommerce.services.PictureService;
import com.omar.ecommerce.services.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final ProductMapper productMapper;

    private final PictureService pictureService;


    @Override
    public Integer createProduct(ProductRequest request) {
        var product = productMapper.toProduct(request);
        product = productRepository.save(product);

        // Delegate picture handling to PictureService
        if (request.pictures() != null && !request.pictures().isEmpty()) {
            pictureService.saveAll(request.pictures(), product);
        }

        return product.getId();
    }

    @Override
    public List<ProductPurchaseResponse> purchaseProducts(List<ProductPurchaseRequest> request) {
        // Extract the product IDs from the request
        var productIds = request
                .stream()
                .map(ProductPurchaseRequest::productId)
                .toList();
        // Retrieve the stored products based on the extracted product IDs
        var storedProducts = productRepository.findAllByIdInOrderById(productIds);

        // Check if all requested products exist
        if (productIds.size() != storedProducts.size()) {
            throw new ProductPurchaseException("One or more products does not exist");
        }

        // Sort the request by product ID to match the order of products in the database
        var sortedRequest = request
                .stream()
                .sorted(Comparator.comparing(ProductPurchaseRequest::productId))
                .toList();

        var purchasedProducts = new ArrayList<ProductPurchaseResponse>();

        double totalPrice = 0.0; // Initialize total price




        // Process each product in the request
        for (int i = 0; i < storedProducts.size(); i++){
            var product = storedProducts.get(i);
            var productRequest = sortedRequest.get(i);
            // Check if there is enough stock for the requested quantity
            if (product.getAvailableQuantity() < productRequest.quantity()) {
                throw new ProductPurchaseException("Insufficient stock quantity for product with ID:: " + productRequest.productId());
            }
            // Update the available quantity of the product
            var newAvailableQuantity = product.getAvailableQuantity() - productRequest.quantity();
            product.setAvailableQuantity(newAvailableQuantity);
            productRepository.save(product);

            ProductPurchaseResponse productResponse = productMapper.toProductPurchaseResponse(product, productRequest.quantity());

            purchasedProducts.add(productResponse);

            totalPrice += productResponse.getTotalPrice();

        }
        return purchasedProducts;
    }

//    @Override
//    public ProductResponse findById(Integer id) {
//        return productRepository.findById(id)
//                .map(productMapper::toProductResponse)
//                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID:: " + id));
//    }

    @Override
    public Boolean existsById(Integer productId) {
        return productRepository.findById(productId)
                .isPresent();
    }

    @Override
    public Page<DisplayCardProductDTO> getAllByCategory(Pageable pageable, Integer categoryId) {
        Page<Product> allOrProductsCategory;
        if (categoryId != null) {
            // Fetch products by category with cover image only
            allOrProductsCategory = productRepository.findAllByCategoryWithCoverOnly(pageable,categoryId);
        } else {
            // Fetch all products with cover image only
            allOrProductsCategory = productRepository.findAllWithCoverOnly(pageable);
        }
        // Map the products to DisplayCardProductDTO
        return allOrProductsCategory.map(productMapper::productToDisplayCardProductDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public State<DisplayProductDTO, String> getOne(Integer productId) {
        Optional<Product> productById = productRepository.findById(productId);
        if (productById.isEmpty()) {
            return State.<DisplayProductDTO, String>builder()
                    .forError(String.format("product doesn't with this Id: %s", productId));
        }

        DisplayProductDTO displayProductDTO = productMapper.productToDisplayProductDTO(productById.get());

        return State.<DisplayProductDTO, String>builder().forSuccess(displayProductDTO);

    }

    /*@Override
    public Page<DisplayCardProductDTO> getAllByCategoryAndSubcategory(Pageable pageable, String categoryName, String subcategoryName) {
        // Validate that categoryName is provided
        if (categoryName == null || categoryName.isEmpty()) {
            throw new IllegalArgumentException("Category name is required.");
        }

        Page<Product> products;

        if (subcategoryName != null && !subcategoryName.isEmpty()) {
            // Fetch products by category and subcategory
            products = productRepository.findAllByCategoryAndSubcategoryWithCoverOnly(pageable, categoryName, subcategoryName);
        } else {
            // Fetch products by category only
            products = productRepository.findAllByCategoryWithCoverOnly(pageable, categoryName);
        }

        // Map the products to DisplayCardProductDTO
        return products.map(productMapper::productToDisplayCardProductDTO);
    }*/

    @Override
    public Page<DisplayCardProductDTO> getAllByMultipleCategoriesAndSubcategories(Pageable pageable, List<String> categoryNames, List<String> subcategoryNames) {
        Page<Product> products = productRepository.findAllByMultipleCategoriesAndSubcategories(
                pageable,
                categoryNames,
                subcategoryNames
        );

        // Map the products to DisplayCardProductDTO and return
        return products.map(productMapper::productToDisplayCardProductDTO);
    }

    @Override
    public Page<DisplayCardProductDTO> filterProductsByPriceRange(Pageable pageable, BigDecimal minPrice, BigDecimal maxPrice) {
        Page<Product> products = productRepository.findProductsByPriceRange(pageable, minPrice, maxPrice);
        return products.map(productMapper::productToDisplayCardProductDTO);
    }

    @Override
    public DisplayCardProductDTO getProductDetailsWithCover(Integer productId) {
        Product product = productRepository.findProductWithCoverOnly(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with ID: " + productId));
        return productMapper.productToDisplayCardProductDTO(product);
    }

    @Override
    public Page<DisplayCardProductDTO> findRelatedProducts(Integer productId, Pageable pageable) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));

        Integer categoryId = product.getCategory().getId();
        Integer subcategoryId = product.getSubcategory() != null ? product.getSubcategory().getId() : null;

        Page<Product> relatedProductsPage = productRepository.findRelatedProducts(
                productId,
                categoryId,
                subcategoryId,
                pageable
        );

        return relatedProductsPage.map(productMapper::productToDisplayCardProductDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DisplayCardProductDTO> searchProducts(Pageable pageable, String query) {
        Page<Product> products = productRepository.searchProducts(pageable, query);
        return products.map(productMapper::productToDisplayCardProductDTO);
    }


//    @Override
//    public List<ProductResponse> findAllProducts() {
//        return productRepository.findAll()
//                .stream()
//                .map(this.productMapper::toProductResponse)
//                .collect(Collectors.toList());
//    }




}
