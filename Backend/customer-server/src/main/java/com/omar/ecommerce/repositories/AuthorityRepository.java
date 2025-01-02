package com.omar.ecommerce.repositories;

import com.omar.ecommerce.entities.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface AuthorityRepository extends JpaRepository<Authority,String> {
    Optional<Authority> findByName(String name);

}
