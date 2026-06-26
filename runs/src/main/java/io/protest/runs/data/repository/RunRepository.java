package io.protest.runs.data.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import io.protest.runs.data.entity.RunEntity;

public interface RunRepository extends JpaRepository<RunEntity, UUID> {

    List<RunEntity> findByProjectId(UUID projectId);
}
