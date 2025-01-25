package com.omar.ecommerce.mapper;


import com.omar.ecommerce.dto.*;
import com.omar.ecommerce.entities.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductPictureMapper.class})
public interface ProductMapper {

    @Mapping(target = "name", source = "infos.name")
    @Mapping(target = "description", source = "infos.description")
    @Mapping(target = "availableQuantity", source = "infos.availableQuantity")
    @Mapping(target = "category.id", source = "categoryId")
    @Mapping(target = "subcategory.id", source = "subcategoryId")
    Product toProduct(ProductRequest request);


    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "quantity", source = "quantity")
    ProductPurchaseResponse toProductPurchaseResponse(Product product, double quantity);


    @Mapping(target = "cover", source = "pictures")
    @Mapping(target = "categoryId", source = "category.id")  // Map category ID from Product's Category
    @Mapping(target = "categoryName", source = "category.name")  // Map category name from Product's Category
    @Mapping(target = "categoryDescription", source = "category.description")  // Map category description from Product's Category
    @Mapping(target = "subcategoryId", source = "subcategory.id")  // Map subcategory ID
    @Mapping(target = "subcategoryName", source = "subcategory.name") // Map subcategory name
    List<DisplayCardProductDTO> productToDisplayCardProductDTOs(List<Product> products);

    @Mapping(target = "cover", source = "pictures", qualifiedByName = "extract-cover")
    @Mapping(target = "subcategoryId", source = "subcategory.id")  // Map subcategory ID
    @Mapping(target = "subcategoryName", source = "subcategory.name") // Map subcategory name
    @Mapping(target = "categoryId", source = "category.id")  // Map category ID from Product's Category
    @Mapping(target = "categoryName", source = "category.name")  // Map category name from Product's Category
    @Mapping(target = "categoryDescription", source = "category.description")  // Map category description from Product's Category
    @Mapping(target = "rate", ignore = true)
    DisplayCardProductDTO productToDisplayCardProductDTO(Product product);


    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "categoryDescription", source = "category.description")
    @Mapping(target = "subcategoryId", source = "subcategory.id") // Map subcategory ID
    @Mapping(target = "subcategoryName", source = "subcategory.name") // Map subcategory name
    DisplayProductDTO productToDisplayProductDTO(Product product);




}
