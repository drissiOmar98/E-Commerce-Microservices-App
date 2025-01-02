package com.omar.ecommerce.services;

import com.omar.ecommerce.dto.PictureDTO;
import com.omar.ecommerce.entities.Product;

import java.util.List;

public interface PictureService {

    List<PictureDTO> saveAll(List<PictureDTO> pictures, Product product);
}
