package com.growgenie.app.repository;
import com.growgenie.app.entity.PlatformProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatformProductRepository extends JpaRepository<PlatformProduct, Long> {
}
