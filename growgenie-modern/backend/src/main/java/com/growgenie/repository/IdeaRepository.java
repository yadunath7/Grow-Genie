package com.growgenie.repository;

import com.growgenie.model.Idea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IdeaRepository extends JpaRepository<Idea, Long> {

    long countByUserId(Long userId);

    List<Idea> findAllByUserIdOrderByCreatedAtDesc(Long userId);
}