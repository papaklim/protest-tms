package io.protest.gateway.model.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import io.protest.gateway.model.enums.TestCaseType;
import io.protest.gateway.model.enums.Layer;
import io.protest.gateway.model.enums.TestCaseStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record TestcaseDto(
    UUID id, UUID projectId,
    @NotBlank @Size(max = 255, message = "Title cannot exceed 255 characters") String title,
    @Size(max = 1000, message = "Description cannot exceed 1000 characters") String description, String expectedResult,
    TestCaseType testType,
    String preconditions, String postconditions,
    Layer layer,
    Boolean isAutomated,
    TestCaseStatus status,
    UUID authorId,
    LocalDateTime createdAt,
    LocalDateTime lastModifiedAt) {

}
