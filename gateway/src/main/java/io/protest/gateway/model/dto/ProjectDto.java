package io.protest.gateway.model.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProjectDto(
    UUID id,

    @NotBlank(message = "Project name cannot be empty") @Size(min = 3, max = 50, message = "Project name must be between 3 and 50 characters") String name,

    @Size(max = 255, message = "Description cannot exceed 255 characters") String description,

    Boolean isActive,

    LocalDateTime createdAt,

    LocalDateTime lastModifiedAt
) {
}
