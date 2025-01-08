package com.omar.favourite_service.model;


import com.omar.favourite_service.model.id.FavouriteId;
import com.omar.favourite_service.shared.AbstractAuditingEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "favorite_product")
@IdClass(FavouriteId.class)
public class Favourite extends AbstractAuditingEntity<FavouriteId> {

    @Id
    private String customerId;

    @Id
    private Integer productId;

    @Override
    public FavouriteId getId() {
        return new FavouriteId(customerId, productId);
    }


}
