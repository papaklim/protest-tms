package io.protest.testcases.controller;

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

import io.protest.testcases.data.entity.TestcaseEntity;
import io.protest.testcases.model.dto.TestcaseDto;
import io.protest.testcases.service.TestcaseService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/testcases")
public class TestcaseController {
    private final TestcaseService testcaseService;

    public TestcaseController(TestcaseService testcaseService) {
        this.testcaseService = testcaseService;
    }

    @PostMapping
    public TestcaseDto createTestcase(@RequestBody TestcaseDto testcaseDto) {
        return testcaseService.createTestcase(testcaseDto);
    }

    @GetMapping("/{id}")
    public TestcaseDto getTestcaseById(@PathVariable("id") UUID id) {
        return testcaseService.getTestcaseById(id);
    }

    @PutMapping("/{id}")
    public TestcaseDto updateTestcaseById(@PathVariable("id") UUID id, @Valid @RequestBody TestcaseDto request) {
        return testcaseService.updateTestcase(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeTestcaseById(@PathVariable("id") UUID id) {
        testcaseService.deleteTestcase(id);
    }

    @GetMapping
    public List<TestcaseDto> getAllTestCaseByProjectId(@RequestParam("project_id") UUID projectId) {
        return testcaseService.getAllTestcasesByProjectId(projectId);
    }
}
