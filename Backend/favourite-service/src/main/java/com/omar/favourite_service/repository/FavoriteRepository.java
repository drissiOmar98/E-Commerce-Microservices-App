package com.omar.favourite_service.repository;

import com.omar.favourite_service.model.Favourite;
import com.omar.favourite_service.model.id.FavouriteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favourite, FavouriteId> {

    boolean existsByCustomerIdAndProductId(String customerId, Integer productId);

    Optional<Favourite> findByCustomerIdAndProductId(String customerId, Integer productId);

    List<Favourite> findByCustomerId(String customerId);
}
