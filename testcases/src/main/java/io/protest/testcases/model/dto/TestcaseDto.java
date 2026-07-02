package io.protest.testcases.model.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import io.protest.testcases.data.entity.TestcaseEntity;
import io.protest.testcases.model.enums.Layer;
import io.protest.testcases.model.enums.TestcaseStatus;
import io.protest.testcases.model.enums.TestcaseType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record TestcaseDto(

    UUID id,
    UUID projectId,
    @NotBlank @Size(max = 255, message = "Title cannot exceed 255 characters") String title,
    @Size(max = 1000, message = "Description cannot exceed 1000 characters") String description,
    String expectedResult,
    TestcaseType testType,
    String preconditions,
    String postconditions,
    Layer layer,
    Boolean isAutomated,
    TestcaseStatus status,
    UUID authorId,
    LocalDateTime createdAt,
    LocalDateTime lastModifiedAt,
    String section,
    List<Map<String, Object>> steps) {

    public static TestcaseDto fromEntity(TestcaseEntity testCase) {
        return new TestcaseDto(
                testCase.getId(),
                testCase.getProjectId(),
                testCase.getTitle(),
                testCase.getDescription(),
                testCase.getExpectedResult(),
                testCase.getTestType(),
                testCase.getPreconditions(),
                testCase.getPostconditions(),
                testCase.getLayer(),
                testCase.isAutomated(),
                testCase.getStatus(),
                testCase.getAuthorId(),
                testCase.getCreatedAt(),
                testCase.getLastModifiedAt(),
                testCase.getSection(),
                testCase.getSteps());
    }
}
