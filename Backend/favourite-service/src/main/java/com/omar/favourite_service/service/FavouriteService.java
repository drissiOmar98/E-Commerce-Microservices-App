package com.omar.favourite_service.service;

import com.omar.favourite_service.dto.FavouriteRequest;
import com.omar.favourite_service.dto.FavouriteResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface FavouriteService {


    void addToFavourites(FavouriteRequest request, Authentication authentication);

    void removeFromFavourites(Integer productId, Authentication authentication);

    List<FavouriteResponse> getWishlist(Authentication authentication);

    void clearFavourites(Authentication authentication);

    boolean isFavourite(Integer productId, Authentication authentication);
}
