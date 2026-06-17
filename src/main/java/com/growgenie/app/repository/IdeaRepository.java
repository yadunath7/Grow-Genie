package com.growgenie.app.repository;
import com.growgenie.app.entity.Idea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IdeaRepository extends JpaRepository<Idea, Long> {
    java.util.List<Idea> findByUserIdOrderByIdDesc(Long userId);
}
