package com.omar.favourite_service.service.Impl;

import com.omar.favourite_service.client.product.ProductClient;
import com.omar.favourite_service.client.product.ProductDTO;
import com.omar.favourite_service.client.product.customer.CustomerResponse;
import com.omar.favourite_service.dto.FavouriteRequest;
import com.omar.favourite_service.dto.FavouriteResponse;
import com.omar.favourite_service.exception.FavouriteAlreadyExistsException;
import com.omar.favourite_service.exception.FavouriteNotFoundException;
import com.omar.favourite_service.exception.ProductNotFoundException;
import com.omar.favourite_service.mapper.FavouriteMapper;
import com.omar.favourite_service.model.Favourite;
import com.omar.favourite_service.repository.FavoriteRepository;
import com.omar.favourite_service.service.FavouriteService;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavouriteServiceImpl implements FavouriteService {

    private final FavoriteRepository favoriteRepository;
    private final FavouriteMapper favouriteMapper;
    private final ProductClient productClient;

    public FavouriteServiceImpl(FavoriteRepository favoriteRepository, FavouriteMapper favouriteMapper, ProductClient productClient) {
        this.favoriteRepository = favoriteRepository;
        this.favouriteMapper = favouriteMapper;
        this.productClient = productClient;
    }

    @Override
    public void addToFavourites(FavouriteRequest request, Authentication authentication) {
        CustomerResponse customer = getAuthenticatedCustomer(authentication);

        // Verify if the product exists
        try {
            productClient.getProductDetailsById(request.productId());
        } catch (Exception e) {
            throw new ProductNotFoundException("Product with ID " + request.productId() + " does not exist.");
        }

        // Check if the product is already a favourite
        boolean exists = favoriteRepository.existsByCustomerIdAndProductId(customer.id(), request.productId());
        if (exists) {
            throw new FavouriteAlreadyExistsException("Product with ID " + request.productId() + " is already in the customer's favourites.");
        }

        Favourite favourite = favouriteMapper.toEntity(request, customer.id());
        favoriteRepository.save(favourite);
    }


    @Override
    public void removeFromFavourites(Integer productId, Authentication authentication) {
        CustomerResponse customer = getAuthenticatedCustomer(authentication);

        Favourite favourite = favoriteRepository.findByCustomerIdAndProductId(customer.id(), productId)
                .orElseThrow(() -> new FavouriteNotFoundException("Product with ID " + productId + " not found in the customer's favourites."));

        favoriteRepository.delete(favourite);
    }

    @Override
    public List<FavouriteResponse> getWishlist(Authentication authentication) {
        CustomerResponse customer = getAuthenticatedCustomer(authentication);
        List<Favourite> favourites = favoriteRepository.findByCustomerId(customer.id());
        return favourites.stream()
                .map(favourite -> {
                    ProductDTO productDTO = productClient.getProductDetailsById(favourite.getProductId());
                    return favouriteMapper.toResponse(favourite, productDTO);
                })
                .collect(Collectors.toList());
    }

    @Override
    public void clearFavourites(Authentication authentication) {
        // Get the authenticated customer's information
        CustomerResponse customer = getAuthenticatedCustomer(authentication);

        // Find all favourites for this customer
        List<Favourite> favourites = favoriteRepository.findByCustomerId(customer.id());

        // Check if the customer has any favourites, then delete them
        if (favourites.isEmpty()) {
            throw new FavouriteNotFoundException("No favourites found for the customer.");
        }
        // Delete all favourites for the authenticated customer
        favoriteRepository.deleteAll(favourites);
    }

    @Override
    public boolean isFavourite(Integer productId, Authentication authentication) {
        CustomerResponse customer = getAuthenticatedCustomer(authentication);
        return favoriteRepository.existsByCustomerIdAndProductId(customer.id(), productId);
    }

    private CustomerResponse getAuthenticatedCustomer(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String customerId = jwt.getSubject();
        String firstName = jwt.getClaimAsString("given_name");
        String lastName = jwt.getClaimAsString("family_name");
        String email = jwt.getClaimAsString("email");

        return new CustomerResponse(customerId, firstName, lastName, email);
    }
}
