package com.omar.ecommerce.repositories;

import com.omar.ecommerce.entities.ProductPicture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductPictureRepository extends JpaRepository<ProductPicture, Long> {
}
