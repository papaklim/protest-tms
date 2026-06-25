package io.protest.gateway.service;

import java.util.List;
import java.util.UUID;

import io.protest.gateway.model.dto.TestcaseDto;

public interface TestcaseClient {
    TestcaseDto createTestcase(TestcaseDto testcaseDto);

    TestcaseDto getTestcaseById(UUID id);

    TestcaseDto updateTestcase(UUID id, TestcaseDto request);

    void deleteTestcase(UUID id);

    List<TestcaseDto> getAllTestcasesByProjectId(UUID projectId);
}
