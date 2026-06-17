package com.growgenie.app.repository;
import com.growgenie.app.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    java.util.List<Order> findByUserId(Long userId);
    
    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.amount) FROM Order o")
    Double calculateTotalProfit();
}
