package com.omar.favourite_service.mapper;

import com.omar.favourite_service.client.product.ProductDTO;
import com.omar.favourite_service.dto.FavouriteRequest;
import com.omar.favourite_service.dto.FavouriteResponse;
import com.omar.favourite_service.model.Favourite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FavouriteMapper {


    /**
     * Maps FavouriteRequest to Favourite entity.
     *
     * @param request    FavouriteRequest
     * @param customerId The authenticated customer ID
     * @return Favourite
     */
    @Mapping(target = "customerId", source = "customerId")
    @Mapping(target = "productId", source = "request.productId")
    Favourite toEntity(FavouriteRequest request, String customerId);


    /**
     * Maps Favourite entity and ProductDTO to FavouriteResponse.
     *
     * @param favourite  Favourite entity
     * @param productDTO Product details from the product-service
     * @return FavouriteResponse
     */
    @Mapping(target = "productName", source = "productDTO.name")
    @Mapping(target = "price", source = "productDTO.price")
    @Mapping(target = "categoryName", source = "productDTO.categoryName")
    @Mapping(target = "description", source = "productDTO.description")
    @Mapping(target = "subcategoryName", source = "productDTO.subcategoryName")
    @Mapping(target = "cover", source = "productDTO.cover")
    @Mapping(target = "availableQuantity", source = "productDTO.availableQuantity")
    FavouriteResponse toResponse(Favourite favourite, ProductDTO productDTO);


}
