package io.protest.runs.model.dto;

import java.util.UUID;

import io.protest.runs.model.enums.RunResultStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateResultRequest(
    @NotNull(message = "Status cannot be null") RunResultStatus status,
    String comment,
    UUID assigneeId
) {
}
