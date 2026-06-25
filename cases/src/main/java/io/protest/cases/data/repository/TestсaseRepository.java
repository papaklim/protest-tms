package io.protest.cases.data.repository;

import java.util.UUID;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import io.protest.cases.data.entity.TestcaseEntity;

public interface TestсaseRepository extends JpaRepository<TestcaseEntity, UUID> {
    List<TestcaseEntity> findAllByProjectId(UUID projectId);

    boolean existsByProjectIdAndTitle(UUID projectId, String title);
}
