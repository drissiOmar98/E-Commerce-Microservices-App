package com.omar.ecommerce.mapper;

import com.omar.ecommerce.dto.CategoryDTO.CategoryRequest;
import com.omar.ecommerce.dto.CategoryDTO.CategoryResponse;
import com.omar.ecommerce.entities.Category;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    Category toCategory(CategoryRequest request);

    CategoryResponse toCategoryResponse(Category category);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCategoryFromRequest(CategoryRequest request, @MappingTarget Category category);
}
