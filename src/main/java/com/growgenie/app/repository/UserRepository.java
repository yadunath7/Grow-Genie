package com.growgenie.app.repository;
import com.growgenie.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    long countBySubscriptionStatus(String status);
    
    @org.springframework.cache.annotation.Cacheable("users")
    java.util.Optional<User> findById(Long id);
    
    @org.springframework.cache.annotation.CacheEvict(value = "users", key = "#p0.id")
    <S extends User> S save(S entity);
}
