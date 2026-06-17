package com.growgenie.repository;

import com.growgenie.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findAllByUserIdOrderByDateDesc(Long userId);
    long countByUserId(Long userId);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Invoice i WHERE i.userId = :userId")
    BigDecimal sumAmountByUserId(@Param("userId") Long userId);
}

