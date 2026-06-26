package io.protest.gateway.controller;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.protest.gateway.model.dto.CreateRunRequest;
import io.protest.gateway.model.dto.RunDto;
import io.protest.gateway.model.dto.RunResultDto;
import io.protest.gateway.model.dto.TestcaseDto;
import io.protest.gateway.model.dto.UpdateResultRequest;
import io.protest.gateway.service.TestcaseClient;
import io.protest.gateway.service.api.RunClient;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/bff/runs")
public class RunController {
    private final RunClient runClient;
    private final TestcaseClient testcaseClient;


    public RunController(RunClient runClient, TestcaseClient testcaseClient) {
        this.runClient = runClient;
        this.testcaseClient = testcaseClient;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RunDto createRun(@Valid @RequestBody CreateRunRequest request) {
        // 1. Получение списка всех тест-кейсов, которые принадлежат проекту
        List<TestcaseDto> projectTestcases = testcaseClient.getAllTestcasesByProjectId(request.projectId());
        Set<UUID> existingIds = projectTestcases.stream().map(TestcaseDto::id).collect(Collectors.toSet());
        // 2. Проверка, что все переданные в запуск тест-кейсы существуют в проекте
        if (request.testcaseIds() != null) {
            for (UUID testcaseId : request.testcaseIds()) {
                if (!existingIds.contains(testcaseId)) {
                    throw new IllegalArgumentException(
                            "Testcase with ID " + testcaseId + " does not exist in project " + request.projectId()
                    );
                }
            }
        }
        return runClient.createRun(request);
    }

    @GetMapping("/{id}")
    public RunDto getRunById(@PathVariable("id") UUID id) {
        return runClient.getRunById(id);
    }

    @GetMapping
    public List<RunDto> getRunsByProjectId(@RequestParam("project_id") UUID projectId) {
        return runClient.getRunsByProjectId(projectId);
    }

    @PutMapping("/{runId}/results/{testcaseId}")
    public RunResultDto updateResult(
            @PathVariable("runId") UUID runId, @PathVariable("testcaseId") UUID testcaseId, @Valid @RequestBody UpdateResultRequest request
    ) {
        return runClient.updateResult(runId, testcaseId, request);
    }
}
