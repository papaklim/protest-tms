package io.protest.gateway.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.protest.gateway.model.dto.TestcaseDto;
import io.protest.gateway.service.ProjectClient;
import io.protest.gateway.service.TestcaseClient;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/bff/testcases")
public class TestcaseController {

    private final TestcaseClient testcaseClient;
    private final ProjectClient projectClient;

    public TestcaseController(TestcaseClient testcaseClient, ProjectClient projectClient) {
        this.testcaseClient = testcaseClient;
        this.projectClient = projectClient;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TestcaseDto createTestcase(@Valid @RequestBody TestcaseDto testcaseDto) {
        projectClient.getProjectById(testcaseDto.projectId());
        return testcaseClient.createTestcase(testcaseDto);
    }

    @GetMapping("/{id}")
    public TestcaseDto getTestcaseById(@PathVariable("id") UUID id) {
        return testcaseClient.getTestcaseById(id);

    }

    @PutMapping("/{id}")
    public TestcaseDto updateTestcaseById(@PathVariable("id") UUID id, @Valid @RequestBody TestcaseDto request) {
        return testcaseClient.updateTestcase(id, request);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeTestcaseById(@PathVariable("id") UUID id) {
        testcaseClient.deleteTestcase(id);
    }

    @GetMapping
    public List<TestcaseDto> getAllTestCaseByProjectId(@RequestParam("project_id") UUID projectId) {
        return testcaseClient.getAllTestcasesByProjectId(projectId);
    }
}
