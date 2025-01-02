package com.omar.ecommerce.dto;

import com.omar.ecommerce.entities.ProductPicture;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface ProductPictureMapper {

    /**
     * Maps a list of PictureDTO objects to a set of ProductPicture entities.
     *
     * @param pictureDTOs The list of PictureDTOs to be mapped.
     * @return A set of ListingPicture entities.
     */
    Set<ProductPicture> pictureDTOsToProductPictures(List<PictureDTO> pictureDTOs);


    /**
     * Maps a single PictureDTO to a ProductPicture entity, ignoring certain fields.
     *
     * @param pictureDTO The PictureDTO to be mapped.
     * @return A ListingPicture entity populated with the data from the DTO.
     */
    @Mapping(target = "id", ignore = true)  // Ignore 'id' during the mapping
    @Mapping(target = "product", ignore = true)  // Ignore 'product' field during the mapping
    //@Mapping(target = "createdDate", ignore = true)  // Ignore 'createdDate' field during the mapping
    //@Mapping(target = "lastModifiedDate", ignore = true)  // Ignore 'lastModifiedDate' field during the mapping
    @Mapping(target = "isCover", source = "isCover")
    ProductPicture pictureDTOToProductPicture(PictureDTO pictureDTO);


    /**
     * Maps a list of ProductPicture entities to a list of PictureDTOs.
     *
     * @param productPictures The list of ListingPicture entities to be mapped.
     * @return A list of PictureDTOs.
     */
    List<PictureDTO> productPictureToPictureDTO(List<ProductPicture> productPictures);


    /**
     * Maps a single ProductPicture entity to a PictureDTO, with a specific mapping for the 'cover' field.
     *
     * @param productPicture The productPicture entity to be mapped.
     * @return A PictureDTO populated with the data from the productPicture entity.
     */
    @Mapping(target = "isCover", source = "cover")
    PictureDTO convertToPictureDTO(ProductPicture productPicture);


    /**
     * Extracts the cover picture from a set of ProductPicture entities and converts it to a PictureDTO.
     *
     * @param pictures The set of ProductPicture entities.
     * @return The PictureDTO representing the cover picture.
     */
    @Named("extract-cover")
    default PictureDTO extractCover(Set<ProductPicture> pictures) {
        return pictures.stream().findFirst().map(this::convertToPictureDTO).orElseThrow();
    }









}
