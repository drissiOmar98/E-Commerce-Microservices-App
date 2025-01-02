package com.omar.ecommerce.mapper;

import com.omar.ecommerce.dto.SubcategoryDTO.SubcategoryRequest;
import com.omar.ecommerce.dto.SubcategoryDTO.SubcategoryResponse;
import com.omar.ecommerce.entities.Subcategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SubcategoryMapper {

    @Mapping(target = "category.id", source = "categoryId")
    Subcategory toSubcategory(SubcategoryRequest request);


    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    SubcategoryResponse toSubcategoryResponse(Subcategory subcategory);

    List<SubcategoryResponse> toSubcategoryResponseList(List<Subcategory> subcategories);




}
