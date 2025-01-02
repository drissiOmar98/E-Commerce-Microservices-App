package com.omar.ecommerce.services;

import com.omar.ecommerce.dto.CategoryDTO.CategoryRequest;
import com.omar.ecommerce.dto.CategoryDTO.CategoryResponse;

import java.util.List;

public interface CategoryService {

    Integer createCategory(CategoryRequest request);

    CategoryResponse getCategoryById(Integer id);

    List<CategoryResponse> getAllCategories();

    void deleteCategory(Integer id);

    public CategoryResponse updateCategory(Integer id, CategoryRequest request);
}
