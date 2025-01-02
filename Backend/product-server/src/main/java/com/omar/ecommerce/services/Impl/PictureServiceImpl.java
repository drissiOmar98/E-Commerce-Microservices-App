package com.omar.ecommerce.services.Impl;

import com.omar.ecommerce.dto.PictureDTO;
import com.omar.ecommerce.dto.ProductPictureMapper;
import com.omar.ecommerce.entities.Product;
import com.omar.ecommerce.entities.ProductPicture;
import com.omar.ecommerce.repositories.ProductPictureRepository;
import com.omar.ecommerce.services.PictureService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class PictureServiceImpl implements PictureService {

    private final ProductPictureRepository productPictureRepository;

    private final ProductPictureMapper productPictureMapper;

    public PictureServiceImpl(ProductPictureRepository productPictureRepository, ProductPictureMapper productPictureMapper) {
        this.productPictureRepository = productPictureRepository;
        this.productPictureMapper = productPictureMapper;
    }


    /**
     * Saves all pictures associated with a product and marks the first picture as the cover.
     *
     * @param pictures List of PictureDTO objects to be converted and saved.
     * @param product The product associated with the pictures.
     * @return List of PictureDTO objects after saving them as ProductPicture entities.
     */

    @Override
    public List<PictureDTO> saveAll(List<PictureDTO> pictures, Product product) {

        Set<ProductPicture> productPictures = productPictureMapper.pictureDTOsToProductPictures(pictures);
        boolean isFirst = true;

        for (ProductPicture productPicture : productPictures) {
            productPicture.setCover(isFirst);
            productPicture.setProduct(product);
            isFirst = false;
        }

        productPictureRepository.saveAll(productPictures);


        return productPictureMapper.productPictureToPictureDTO(productPictures.stream().toList());
    }
}
