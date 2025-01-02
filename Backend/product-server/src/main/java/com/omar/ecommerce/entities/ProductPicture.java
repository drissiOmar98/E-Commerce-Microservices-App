package com.omar.ecommerce.entities;


import com.omar.ecommerce.common.AbstractAuditingEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.Arrays;
import java.util.Objects;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "product_picture")
@Builder
public class ProductPicture extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "productPictureSequenceGenerator")
    @SequenceGenerator(name = "productPictureSequenceGenerator", sequenceName = "product_picture_seq", allocationSize = 50)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_fk", referencedColumnName = "id")
    private Product product;

    @Lob
    @Column(name = "file", nullable = false)
    private byte[] file;

    @Column(name = "file_content_type")
    private String fileContentType;

    @Column(name = "is_cover")
    private boolean isCover;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductPicture that = (ProductPicture) o;
        return isCover == that.isCover && Objects.deepEquals(file, that.file) && Objects.equals(fileContentType, that.fileContentType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(Arrays.hashCode(file), fileContentType, isCover);
    }

    @Override
    public String toString() {
        return "ProductPicture{" +
                "file=" + Arrays.toString(file) +
                ", fileContentType='" + fileContentType + '\'' +
                ", isCover=" + isCover +
                '}';
    }

}
