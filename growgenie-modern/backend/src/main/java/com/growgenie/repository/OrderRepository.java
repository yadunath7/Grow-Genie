package com.growgenie.repository;

import com.growgenie.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT COALESCE(SUM(o.amount), 0) FROM Order o")
    BigDecimal sumTotalProfit();
}
