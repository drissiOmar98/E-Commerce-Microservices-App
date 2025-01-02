package com.omar.ecommerce.services.Impl;

import com.omar.ecommerce.dto.SubcategoryDTO.SubcategoryRequest;
import com.omar.ecommerce.dto.SubcategoryDTO.SubcategoryResponse;
import com.omar.ecommerce.entities.Category;
import com.omar.ecommerce.entities.Subcategory;
import com.omar.ecommerce.mapper.SubcategoryMapper;
import com.omar.ecommerce.repositories.CategoryRepository;
import com.omar.ecommerce.repositories.SubcategoryRepository;
import com.omar.ecommerce.services.SubcategoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubcategoryServiceImpl implements SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;

    private final CategoryRepository categoryRepository;

    private final SubcategoryMapper subcategoryMapper;


    @Override
    public Integer createSubcategory(SubcategoryRequest request) {
        var subCategory = subcategoryMapper.toSubcategory(request);
        return subcategoryRepository.save(subCategory).getId();
    }



    @Override
    public SubcategoryResponse getSubcategoryById(Integer id) {
        return subcategoryRepository.findById(id)
                .map(subcategoryMapper::toSubcategoryResponse)
                .orElseThrow(() -> new EntityNotFoundException("Subcategory not found with ID:: " + id));
    }

    @Override
    public List<SubcategoryResponse> getAllSubcategories() {
        return subcategoryRepository.findAll()
                .stream()
                .map(subcategoryMapper::toSubcategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubcategoryResponse> getSubcategoriesByCategoryId(Integer categoryId) {
        List<Subcategory> subcategories = subcategoryRepository.findByCategoryId(categoryId);
        return subcategoryMapper.toSubcategoryResponseList(subcategories);
    }

    @Override
    public Integer updateSubcategory(Integer id, SubcategoryRequest request) {

        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subcategory not found with ID: " + id));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + request.categoryId()));

        subcategory.setName(request.name());
        subcategory.setCategory(category);

        subcategoryRepository.save(subcategory);
        return subcategory.getId();
    }

    @Override
    public void deleteSubcategory(Integer id) {
        if (!subcategoryRepository.existsById(id)) {
            throw new EntityNotFoundException("SubCategory not found");
        }
        subcategoryRepository.deleteById(id);

    }
}
