package io.protest.runs.model.dto;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateRunRequest(
    @NotNull(message = "Project ID cannot be null") UUID projectId,
    @NotBlank(message = "Title cannot be blank") String title,
    String description,
    @NotEmpty(message = "List of testcase IDs cannot be empty") List<UUID> testcaseIds
) {
}
