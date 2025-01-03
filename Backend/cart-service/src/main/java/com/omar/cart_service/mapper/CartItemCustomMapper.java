package com.omar.cart_service.mapper;

import com.omar.cart_service.client.product.PictureDTO;
import com.omar.cart_service.client.product.ProductClient;
import com.omar.cart_service.client.product.ProductDTO;
import com.omar.cart_service.model.CartItem;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class CartItemCustomMapper {

    @Autowired
    private ProductClient productClient;


    @Named("fetchProductName")
    public String fetchProductName(Integer productId) {
        ProductDTO product = productClient.getProductDetailsById(productId);
        return product.name();
    }

    @Named("fetchProductCover")
    public PictureDTO fetchProductCover(Integer productId) {
        ProductDTO product = productClient.getProductDetailsById(productId);
        return product.cover();
    }

    @Named("fetchProductPrice")
    public BigDecimal fetchProductPrice(Integer productId) {
        ProductDTO product = productClient.getProductDetailsById(productId);
        return product.price();
    }

    @Named("calculateTotalPrice")
    public Double calculateTotalPrice(CartItem cartItem) {
        BigDecimal price = fetchProductPrice(cartItem.getProductId());
        return cartItem.getQuantity() * price.doubleValue();
    }

}
