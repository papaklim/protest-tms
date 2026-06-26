package io.protest.runs.data.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import io.protest.runs.data.entity.RunResultEntity;

public interface RunResultRepository extends JpaRepository<RunResultEntity, UUID> {

}
