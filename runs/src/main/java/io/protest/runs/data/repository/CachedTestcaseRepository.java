package io.protest.runs.data.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import io.protest.runs.data.entity.CachedTestcaseEntity;

public interface CachedTestcaseRepository extends JpaRepository<CachedTestcaseEntity, UUID> {

}
