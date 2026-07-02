package io.protest.gateway.model.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record RunResultDto(
    UUID id,
    UUID runId,
    UUID testcaseId,
    String status,
    UUID assigneeId,
    String comment,
    LocalDateTime executedAt,
    UUID executorId,
    String testcaseTitle
) {
}
