package io.protest.runs.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.protest.runs.data.entity.RunEntity;
import io.protest.runs.data.entity.RunResultEntity;
import io.protest.runs.data.repository.CachedTestcaseRepository;
import io.protest.runs.data.repository.RunRepository;
import io.protest.runs.model.dto.CreateRunRequest;
import io.protest.runs.model.dto.RunDto;
import io.protest.runs.model.dto.RunResultDto;
import io.protest.runs.model.dto.UpdateResultRequest;
import io.protest.runs.model.enums.RunResultStatus;
import io.protest.runs.model.enums.RunStatus;
import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class RunService {
    private final RunRepository runRepository;

    private final CachedTestcaseRepository cachedTestcaseRepository;

    public RunService(RunRepository runRepository, CachedTestcaseRepository cachedTestcaseRepository) {
        this.runRepository = runRepository;
        this.cachedTestcaseRepository = cachedTestcaseRepository;
    }

    public RunDto createRun(CreateRunRequest request, UUID creatorId) {
        RunEntity run = new RunEntity();
        run.setProjectId(request.projectId());
        run.setTitle(request.title());
        run.setDescription(request.description());
        run.setStatus(RunStatus.CREATED);
        run.setCreatorId(creatorId);
        for (UUID testcaseId : request.testcaseIds()) {
            RunResultEntity result = new RunResultEntity();
            result.setTestcaseId(testcaseId);
            result.setStatus(RunResultStatus.UNTESTED);
            cachedTestcaseRepository.findById(testcaseId).ifPresent(result::setCachedTestcase);
            run.addResult(result);
        }
        RunEntity saved = runRepository.saveAndFlush(run);
        return RunDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public RunDto getRunById(UUID id) {
        return runRepository.findById(id).map(RunDto::fromEntity).orElseThrow(
                () -> new EntityNotFoundException("Test run not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<RunDto> getRunsByProjectId(UUID projectId) {
        return runRepository.findByProjectId(projectId).stream().map(RunDto::fromEntity).toList();
    }

    public RunResultDto updateResult(UUID runId, UUID testcaseId, UpdateResultRequest request, UUID executorId) {
        RunEntity run = runRepository.findById(runId).orElseThrow(
                () -> new EntityNotFoundException("Test run not found with id: " + runId));
        RunResultEntity result = run.getResults().stream().filter(
                r -> r.getTestcaseId().equals(testcaseId)).findFirst().orElseThrow(
                        () -> new EntityNotFoundException(
                                "Result not found for testcase " + testcaseId + " in run " + runId));
        result.setStatus(request.status());
        result.setComment(request.comment());
        if (request.assigneeId() != null) {
            result.setAssigneeId(request.assigneeId());
        }
        result.setExecutedAt(LocalDateTime.now());
        result.setExecutorId(executorId);
        // Жизненный цикл запуска: при первом прохождении теста переводится в IN_PROGRESS
        if (run.getStatus() == RunStatus.CREATED) {
            run.setStatus(RunStatus.IN_PROGRESS);
            run.setStartedAt(LocalDateTime.now());
        }
        // Если не осталось тестов со статусом UNTESTED - запуск закрывается
        boolean allFinished = run.getResults().stream().noneMatch(r -> r.getStatus() == RunResultStatus.UNTESTED);
        if (allFinished && run.getStatus() != RunStatus.COMPLETED) {
            run.setStatus(RunStatus.COMPLETED);
            run.setCompletedAt(LocalDateTime.now());
        }
        runRepository.save(run);
        return RunResultDto.fromEntity(result);
    }

}
