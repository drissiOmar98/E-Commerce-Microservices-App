package com.omar.ecommerce.dto;


import com.omar.ecommerce.entities.Category;
import com.omar.ecommerce.entities.Product;
import com.omar.ecommerce.entities.Subcategory;
import org.springframework.stereotype.Service;

//
//@Service
//public class ProductMapper {
//
////    private final ProductPictureMapper productPictureMapper;
////
////    public ProductMapper(ProductPictureMapper productPictureMapper) {
////        this.productPictureMapper = productPictureMapper;
////    }
//
//    public Product toProduct(ProductRequest request) {
//        return Product.builder()
//                .id(request.id())
//                .name(request.name())
//                .description(request.description())
//                .availableQuantity(request.availableQuantity())
//                .price(request.price())
//                .category(
//                        Category.builder()
//                                .id(request.categoryId())
//                                .build()
//                )
//                .subcategory(
//                        Subcategory.builder()
//                                .id(request.subcategoryId())
//                                .build()
//
//                )
//                .build();
//    }
//
//    public ProductResponse toProductResponse(Product product) {
//        return new ProductResponse(
//                product.getId(),
//                product.getName(),
//                product.getDescription(),
//                product.getAvailableQuantity(),
//                product.getPrice(),
//                product.getCategory().getId(),
//                product.getCategory().getName(),
//                product.getCategory().getDescription()
//                //productPictureMapper.extractCover(product.getPictures())
//                /*productPictureMapper.productPictureToPictureDTO(
//                        product.getPictures().stream().toList()
//                )*/
////                productPictureMapper.extractCover(product.getPictures()), // Cover picture for list view
////                includeAllPictures ? productPictureMapper.productPictureToPictureDTO(
////                        new ArrayList<>(product.getPictures())
////                ) : null // All pictures only for detailed view
//        );
//    }
//
//
//
////    public ProductPurchaseResponse toproductPurchaseResponse(Product product, double quantity) {
////        return new ProductPurchaseResponse(
////                product.getId(),
////                product.getName(),
////                product.getDescription(),
////                product.getPrice(),
////                quantity
////        );
////    }
//}
