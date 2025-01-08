package com.omar.favourite_service.model.id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavouriteId implements Serializable {

    private String customerId;

    private Integer productId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FavouriteId that = (FavouriteId) o;
        return Objects.equals(productId, that.productId) && Objects.equals(customerId, that.customerId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, customerId);
    }

}
