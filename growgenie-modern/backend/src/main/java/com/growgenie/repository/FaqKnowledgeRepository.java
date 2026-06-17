package com.growgenie.repository;

import com.growgenie.model.FaqKnowledge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FaqKnowledgeRepository extends JpaRepository<FaqKnowledge, Long> {
    Optional<FaqKnowledge> findByUserId(Long userId);
}
