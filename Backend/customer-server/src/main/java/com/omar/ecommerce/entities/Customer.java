package com.omar.ecommerce.entities;


import com.omar.ecommerce.common.AbstractAuditingEntity;
import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "customer")
public class Customer extends AbstractAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "userSequenceGenerator")
    @SequenceGenerator(name = "userSequenceGenerator", sequenceName = "user_sequence", allocationSize = 1)
    @Column(name = "id")
    private Long id;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "first_name")
    private String firstName;

    @Column(nullable = false, unique = true)
    private String email;

    @Embedded
    private Address address;

    @Column(name = "image_url")
    private String imageUrl;


    @ManyToMany(fetch = FetchType.EAGER,cascade = CascadeType.DETACH)
    @JoinTable(
            name = "user_authority",
            joinColumns = {@JoinColumn(name = "user_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "authority_name", referencedColumnName = "name")}
    )
    private Set<Authority> authorities = new HashSet<>();

    public void updateFromUser(Customer user) {
        // Update basic fields
        this.email = user.getEmail();
        this.lastName = user.getLastName();
        this.firstName = user.getFirstName();
        this.imageUrl = user.getImageUrl();

        // Update address fields if user provides them
        if (user.getAddress() != null) {
            if (this.address == null) {
                this.address = new Address();
            }
            this.address.setStreet(user.getAddress().getStreet());
            this.address.setHouseNumber(user.getAddress().getHouseNumber());
            this.address.setZipCode(user.getAddress().getZipCode());
        } else {
            this.address = null; // Clear address if not provided
        }

    }




}
