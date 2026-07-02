package io.protest.runs.model.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import io.protest.runs.data.entity.RunResultEntity;
import io.protest.runs.model.enums.RunResultStatus;

public record RunResultDto(
    UUID id,
    UUID runId,
    UUID testcaseId,
    RunResultStatus status,
    UUID assigneeId,
    String comment,
    LocalDateTime executedAt,
    UUID executorId,
    String testcaseTitle
) {

    public static RunResultDto fromEntity(RunResultEntity entity) {
        String title = entity.getCachedTestcase() != null ? entity.getCachedTestcase().getTitle() : "Unknown Testcase";
        return new RunResultDto(
                entity.getId(),
                entity.getRun().getId(),
                entity.getTestcaseId(),
                entity.getStatus(),
                entity.getAssigneeId(),
                entity.getComment(),
                entity.getExecutedAt(),
                entity.getExecutorId(),
                title
        );
    }
}
