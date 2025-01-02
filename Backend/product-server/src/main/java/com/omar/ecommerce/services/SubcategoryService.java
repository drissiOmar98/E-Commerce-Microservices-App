package com.omar.ecommerce.services;

import com.omar.ecommerce.dto.SubcategoryDTO.SubcategoryRequest;
import com.omar.ecommerce.dto.SubcategoryDTO.SubcategoryResponse;

import java.util.List;

public interface SubcategoryService {

    Integer createSubcategory(SubcategoryRequest request);

    SubcategoryResponse getSubcategoryById(Integer id);

    List<SubcategoryResponse> getAllSubcategories();

    List<SubcategoryResponse> getSubcategoriesByCategoryId(Integer categoryId);

    Integer updateSubcategory(Integer id, SubcategoryRequest request);

    void deleteSubcategory(Integer id);
}
