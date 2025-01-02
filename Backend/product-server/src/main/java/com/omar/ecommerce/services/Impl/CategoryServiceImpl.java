package com.omar.ecommerce.services.Impl;

import com.omar.ecommerce.dto.CategoryDTO.CategoryRequest;
import com.omar.ecommerce.dto.CategoryDTO.CategoryResponse;
import com.omar.ecommerce.entities.Category;
import com.omar.ecommerce.mapper.CategoryMapper;
import com.omar.ecommerce.repositories.CategoryRepository;
import com.omar.ecommerce.services.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;


    @Override
    public Integer createCategory(CategoryRequest request) {
        Category category = categoryMapper.toCategory(request);
        category = categoryRepository.save(category);
        return category.getId();
    }

    @Override
    public CategoryResponse getCategoryById(Integer id) {
       return categoryRepository.findById(id)
               .map(categoryMapper::toCategoryResponse)
               .orElseThrow(() -> new EntityNotFoundException("Category not found with ID:: " + id));
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public CategoryResponse updateCategory(Integer id, CategoryRequest request) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        categoryMapper.updateCategoryFromRequest(request, existingCategory);
        Category updatedCategory = categoryRepository.save(existingCategory);
        return categoryMapper.toCategoryResponse(updatedCategory);
    }
}
