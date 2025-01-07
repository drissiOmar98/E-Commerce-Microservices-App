package com.omar.cart_service.mapper;


import com.omar.cart_service.dto.CartItemDTO;
import com.omar.cart_service.dto.CartItemRequest;
import com.omar.cart_service.model.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring", uses = {CartItemCustomMapper.class})
public interface CartItemMapper {



    @Mapping(target = "productName", source = "productId", qualifiedByName = "fetchProductName")
    @Mapping(target = "cover", source = "productId", qualifiedByName = "fetchProductCover")
    @Mapping(target = "price", source = "productId", qualifiedByName = "fetchProductPrice")
    @Mapping(target = "availableQuantity", source = "productId", qualifiedByName = "fetchProductStockQuantity")
    @Mapping(target = "totalPrice", source = "cartItem", qualifiedByName = "calculateTotalPrice")
    CartItemDTO toCartItemDTO(CartItem cartItem);


    @Mapping(target = "cart", ignore = true)
    CartItem toCartItem(CartItemDTO cartItemDTO);


    @Mapping(target = "productId", source = "productId")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cart", ignore = true)
    CartItem toCartItem(CartItemRequest cartItemRequest);


}
