package io.protest.runs.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.protest.runs.model.dto.CreateRunRequest;
import io.protest.runs.model.dto.RunDto;
import io.protest.runs.model.dto.RunResultDto;
import io.protest.runs.model.dto.UpdateResultRequest;
import io.protest.runs.service.RunService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/runs")
public class RunController {
    private final RunService runService;

    public RunController(RunService runService) {
        this.runService = runService;
    }

    @PostMapping
    public RunDto createRun(@Valid @RequestBody CreateRunRequest request, @AuthenticationPrincipal Jwt jwt) {
        UUID creatorId = getUserId(jwt);
        return runService.createRun(request, creatorId);
    }

    @GetMapping("/{id}")
    public RunDto getRunById(@PathVariable("id") UUID id) {
        return runService.getRunById(id);
    }

    @GetMapping
    public List<RunDto> getRunsByProjectId(@RequestParam("project_id") UUID projectId) {
        return runService.getRunsByProjectId(projectId);
    }

    @PutMapping("/{runId}/results/{testcaseId}")
    public RunResultDto updateResult(
            @PathVariable("runId") UUID runId, @PathVariable("testcaseId") UUID testcaseId, @Valid @RequestBody UpdateResultRequest request, @AuthenticationPrincipal Jwt jwt
    ) {
        UUID executorId = getUserId(jwt);
        return runService.updateResult(runId, testcaseId, request, executorId);
    }

    private UUID getUserId(Jwt jwt) {
        String subject = jwt.getSubject();
        if ("gateway-client".equals(subject)) {
            // Маркер 'Система' для запросов от технических клиентов шлюза
            return UUID.fromString("00000000-0000-0000-0000-000000000000");
        }
        return UUID.fromString(subject); // Для пользователей всегда будет валидный UUID
    }
}
