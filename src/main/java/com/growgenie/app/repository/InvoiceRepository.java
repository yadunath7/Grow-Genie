package com.growgenie.app.repository;
import com.growgenie.app.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    java.util.List<Invoice> findByUserId(Long userId);
}
