package com.growgenie.app.repository;
import com.growgenie.app.entity.BusinessProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessProfileRepository extends JpaRepository<BusinessProfile, Long> {
    java.util.List<BusinessProfile> findByUserId(Long userId);
}
