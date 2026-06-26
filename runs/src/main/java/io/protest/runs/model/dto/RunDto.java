package io.protest.runs.model.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import io.protest.runs.data.entity.RunEntity;
import io.protest.runs.model.enums.RunStatus;

public record RunDto(
    UUID id,
    UUID projectId,
    String title,
    String description,
    RunStatus status,
    UUID creatorId,
    LocalDateTime createdAt,
    LocalDateTime startedAt,
    LocalDateTime completedAt,
    List<RunResultDto> results) {

    public static RunDto fromEntity(RunEntity entity) {
        List<RunResultDto> resultDtos = entity.getResults() != null ? entity.getResults().stream().map(
                RunResultDto::fromEntity).toList() : List.of();
        return new RunDto(
                entity.getId(),
                entity.getProjectId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getStatus(),
                entity.getCreatorId(),
                entity.getCreatedAt(),
                entity.getStartedAt(),
                entity.getCompletedAt(),
                resultDtos
        );
    }
}
