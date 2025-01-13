package com.omar.ecommerce.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omar.ecommerce.common.state.State;
import com.omar.ecommerce.common.state.StatusNotification;
import com.omar.ecommerce.dto.*;
import com.omar.ecommerce.exception.FileProcessingException;
import com.omar.ecommerce.services.ProductService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    private ObjectMapper objectMapper = new ObjectMapper();

    private final Validator validator;



    /**
     * Endpoint for creating a new Product. Expects a multipart form data with product details and pictures.
     *
     * @param request The multipart HTTP request containing file data.
     * @param productRequestString The string representation of the ProductRequest.
     * @return ResponseEntity containing the id of created product or error details.
     * @throws IOException If there's an issue parsing the input data.
     */
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Integer> createProduct(
            MultipartHttpServletRequest request,
            @RequestPart(name = "productRequest") String productRequestString
    ) throws IOException {
        // Map the uploaded files to PictureDTO objects
        List<PictureDTO> pictures = request.getFileMap()
                .values()
                .stream()
                .map(mapMultipartFileToPictureDTO()) // Convert each file to a PictureDTO.
                .toList();

        // Convert the string representation of SaveListingDTO to an actual SaveListingDTO object.
        ProductRequest productRequest = objectMapper.readValue(productRequestString, ProductRequest.class);
        // Create a new ProductRequest with the pictures list
        productRequest = new ProductRequest(
                productRequest.id(),
//                productRequest.name(),
//                productRequest.description(),
//                productRequest.availableQuantity(),
                productRequest.infos(),
                productRequest.price(),
                productRequest.categoryId(),
                productRequest.subcategoryId(),
                pictures
        );

        // Validate the SaveListingDTO and collect any violations.
        Set<ConstraintViolation<ProductRequest>> violations = validator.validate(productRequest);
        if (!violations.isEmpty()) {
            // Concatenate all the violations into a single string.
            String violationsJoined = violations.stream()
                    .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                    .collect(Collectors.joining());
            // Create a ProblemDetail object with the violation details.
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, violationsJoined);
            return ResponseEntity.of(problemDetail).build();
        } else {
            return ResponseEntity.ok(productService.createProduct(productRequest));
        }
    }




    @PostMapping("/purchase")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PurchaseResponse> purchaseProducts(
            @RequestBody List<ProductPurchaseRequest> request
    ) {
        List<ProductPurchaseResponse> purchasedProducts = productService.purchaseProducts(request);

        // Calculate the total price
        double totalPrice = purchasedProducts.stream()
                .mapToDouble(ProductPurchaseResponse::getTotalPrice)
                .sum();

        // Prepare the response
        PurchaseResponse response = new PurchaseResponse();
        response.setPurchasedProducts(purchasedProducts);
        response.setTotalPrice(totalPrice);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/exists/{product-id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Boolean> existsById(
            @PathVariable("product-id") Integer productId
    ) {
        return ResponseEntity.ok(this.productService.existsById(productId));
    }


    @GetMapping("/get-all-by-category")
    public ResponseEntity<Page<DisplayCardProductDTO>> getAllByCategory(
            @RequestParam(value = "categoryId", required = false) Integer categoryId, // categoryName is optional
            Pageable pageable
    ) {
        // Pass the categoryName (null if not provided) to the service
        return ResponseEntity.ok(productService.getAllByCategory(pageable,categoryId));
    }

    @GetMapping("/{productId}/related")
    public ResponseEntity<Page<DisplayCardProductDTO>> getRelatedProducts(
            @PathVariable Integer productId,
            Pageable pageable) {
        Page<DisplayCardProductDTO> relatedProducts = productService.findRelatedProducts(productId, pageable);
        return ResponseEntity.ok(relatedProducts);
    }


//    @GetMapping("/get-all-by-categoryAndSub")
//    public ResponseEntity<Page<DisplayCardProductDTO>> getAllByCategoryAndSubcategory(
//            @RequestParam String categoryName,
//            @RequestParam(required = false) String subcategoryName, // subcategoryName is optional// categoryName is optional
//            Pageable pageable
//    ) {
//        // Pass the categoryName (null if not provided) to the service
//        return ResponseEntity.ok(productService.getAllByCategoryAndSubcategory(pageable,categoryName,subcategoryName));
//    }
//
//    @GetMapping("/{product-id}")
//    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
//    public ResponseEntity<ProductResponse> findById(
//            @PathVariable("product-id") Integer productId
//    ) {
//        return ResponseEntity.ok(productService.findById(productId));
//    }
//
//    @GetMapping
//    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
//    public ResponseEntity<List<ProductResponse>> findAllProducts() {
//        return ResponseEntity.ok(productService.findAllProducts());
//    }



    /**
     * Utility function to map a MultipartFile to a PictureDTO.
     *
     * @return A function that converts MultipartFile to PictureDTO.
     */
    private static Function<MultipartFile, PictureDTO> mapMultipartFileToPictureDTO() {
        return multipartFile -> {
            try {
                // Convert the multipart file into a PictureDTO with byte data, content type, and set cover to false.
                return new PictureDTO(multipartFile.getBytes(), multipartFile.getContentType(), false);
            } catch (IOException ioe) {
                throw new FileProcessingException(String.format("Cannot parse multipart file: %s", multipartFile.getOriginalFilename()));
            }
        };
    }






    @GetMapping("/get-one/{productId}")
    public ResponseEntity<DisplayProductDTO> getOne(@PathVariable Integer productId) {
        State<DisplayProductDTO, String> displayProductState = productService.getOne(productId);
        if (displayProductState.getStatus().equals(StatusNotification.OK)) {
            return ResponseEntity.ok(displayProductState.getValue());
        } else {
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, displayProductState.getError());
            return ResponseEntity.of(problemDetail).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayCardProductDTO> getProductDetailsById(@PathVariable Integer id) {
        DisplayCardProductDTO productDetails = productService.getProductDetailsWithCover(id);
        return ResponseEntity.ok(productDetails);
    }

}
