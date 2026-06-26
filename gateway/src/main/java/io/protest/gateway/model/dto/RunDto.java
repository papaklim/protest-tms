package io.protest.gateway.model.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record RunDto(
    UUID id,
    UUID projectId,
    String title,
    String description,
    String status,
    UUID creatorId,
    LocalDateTime createdAt,
    LocalDateTime startedAt,
    LocalDateTime completedAt,
    List<RunResultDto> results) {
}
