package com.omar.ecommerce.controllers;

import com.omar.ecommerce.dto.SubcategoryDTO.SubcategoryRequest;
import com.omar.ecommerce.dto.SubcategoryDTO.SubcategoryResponse;
import com.omar.ecommerce.services.SubcategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subcategories")
@RequiredArgsConstructor
public class SubcategoryController {
    private final SubcategoryService subcategoryService;



    @PostMapping
    public ResponseEntity<Integer> createSubcategory(@RequestBody @Valid SubcategoryRequest request){
        return ResponseEntity.ok(subcategoryService.createSubcategory(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubcategoryResponse> getSubcategoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(subcategoryService.getSubcategoryById(id));
    }

    @GetMapping
    public ResponseEntity<List<SubcategoryResponse>> getAllSubcategories() {
        return ResponseEntity.ok(subcategoryService.getAllSubcategories());
    }

    @GetMapping("/by-category/{categoryId}")
    public ResponseEntity<List<SubcategoryResponse>> getSubcategoriesByCategoryId(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(subcategoryService.getSubcategoriesByCategoryId(categoryId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubcategory(@PathVariable Integer id) {
        subcategoryService.deleteSubcategory(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updateSubcategory(
            @PathVariable Integer id,
            @RequestBody @Valid SubcategoryRequest request) {
        Integer updatedSubcategoryId = subcategoryService.updateSubcategory(id, request);
        return ResponseEntity.ok(updatedSubcategoryId);
    }


}
