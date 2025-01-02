package com.omar.ecommerce.repositories;

import com.omar.ecommerce.entities.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubcategoryRepository extends JpaRepository<Subcategory, Integer> {


    List<Subcategory> findByCategoryId(Integer categoryId);
}
