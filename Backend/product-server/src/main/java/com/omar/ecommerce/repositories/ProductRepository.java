package com.omar.ecommerce.repositories;

import com.omar.ecommerce.entities.Category;
import com.omar.ecommerce.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {


    List<Product> findAllByIdInOrderById(List<Integer> productIds);


    /**
     * Retrieves a paginated list of products by category, fetching only the cover picture.
     *
     * This query performs a left join fetch to load the associated cover picture for each product
     * and filters the results based on the specified product category.
     *
     * @param pageable A `Pageable` object representing pagination information.
     * @param categoryId The `ProductCategoryId` to filter product by.
     * @return A paginated list of `product` entities with only the cover picture loaded.
     */
    @Query("SELECT product" +
            " from Product product " +
            "LEFT JOIN FETCH product.pictures picture" +
            " WHERE picture.isCover = true AND product.category.id = :categoryId")
    Page<Product> findAllByCategoryWithCoverOnly(Pageable pageable, Integer categoryId);


    @Query("SELECT product from Product product LEFT JOIN FETCH product.pictures picture" +
            " WHERE picture.isCover = true")
    Page<Product> findAllWithCoverOnly(Pageable pageable);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.pictures pictures WHERE p.id = :id AND pictures.isCover = true")
    Optional<Product> findProductWithCoverOnly(@Param("id") Integer id);


    @Query("SELECT product from Product product LEFT JOIN FETCH product.pictures picture" +
            " WHERE picture.isCover = true")
    List<Product> findAllWithCoverPictureOnly(UUID landlordPublicId);

    // Fetch products by category and subcategory with a cover image
    @Query("SELECT product from Product product " +
            "LEFT JOIN FETCH product.pictures picture " +
            "WHERE picture.isCover = true " +
            "AND product.category.name = :categoryName " +
            "AND product.subcategory.name = :subcategoryName")
    Page<Product> findAllByCategoryAndSubcategoryWithCoverOnly(
            Pageable pageable,
            @Param("categoryName") String categoryName,
            @Param("subcategoryName") String subcategoryName);


    @Query("SELECT product FROM Product product " +
            "LEFT JOIN FETCH product.pictures picture " +
            "WHERE picture.isCover = true " +
            "AND product.category.name IN :categoryNames " +
            "AND (:subcategoryNames IS NULL OR product.subcategory.name IN :subcategoryNames)")
    Page<Product> findAllByMultipleCategoriesAndSubcategories(
            Pageable pageable,
            @Param("categoryNames") List<String> categoryNames,
            @Param("subcategoryNames") List<String> subcategoryNames);



    @Query("SELECT product FROM Product product " +
            "LEFT JOIN FETCH product.pictures picture " +
            "WHERE picture.isCover = true " +
            "AND product.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findProductsByPriceRange(Pageable pageable, @Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);



    @Query("SELECT product FROM Product product " +
            "LEFT JOIN FETCH product.pictures picture " +
            "WHERE product.id != :productId " +
            "AND product.category.id = :categoryId " +
            "AND (:subcategoryId IS NULL OR product.subcategory.id = :subcategoryId) " +
            "AND picture.isCover = true")
    Page<Product> findRelatedProducts(@Param("productId") Integer productId,
                                      @Param("categoryId") Integer categoryId,
                                      @Param("subcategoryId") Integer subcategoryId,
                                      Pageable pageable);



}
