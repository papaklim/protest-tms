package io.protest.testcases.data.repository;

import java.util.UUID;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import io.protest.testcases.data.entity.TestcaseEntity;

public interface TestcaseRepository extends JpaRepository<TestcaseEntity, UUID> {
    List<TestcaseEntity> findAllByProjectId(UUID projectId);

    boolean existsByProjectIdAndTitle(UUID projectId, String title);
}
