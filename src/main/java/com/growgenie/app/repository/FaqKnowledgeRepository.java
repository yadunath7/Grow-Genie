package com.growgenie.app.repository;
import com.growgenie.app.entity.FaqKnowledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FaqKnowledgeRepository extends JpaRepository<FaqKnowledge, Long> {
    java.util.List<FaqKnowledge> findByUserId(Long userId);
}
