package io.protest.projects.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.UUID;

import io.protest.projects.data.entity.ProjectEntity;

public record ProjectDto(
    UUID id,

    @NotBlank(message = "Project name cannot be empty") @Size(min = 3, max = 50, message = "Project name must be between 3 and 50 characters") String name,

    @Size(max = 255, message = "Description cannot exceed 255 characters") String description,

    Boolean isActive,

    LocalDateTime createdAt,

    LocalDateTime lastModifiedAt
) {
    public static ProjectDto fromEntity(ProjectEntity entity) {
        return new ProjectDto(
            entity.getId(),
            entity.getName(),
            entity.getDescription(),
            entity.getIsActive(),
            entity.getCreatedAt(),
            entity.getLastModifiedAt()
        );
    }
}
