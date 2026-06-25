package io.protest.projects.data.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import io.protest.projects.data.entity.ProjectEntity;

public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {

    boolean existsByName(String name);
}
