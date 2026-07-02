package io.protest.gateway.service.api;

import java.util.List;
import java.util.UUID;

import io.protest.gateway.model.dto.CreateRunRequest;
import io.protest.gateway.model.dto.RunDto;
import io.protest.gateway.model.dto.RunResultDto;
import io.protest.gateway.model.dto.UpdateResultRequest;

public interface RunClient {
    RunDto createRun(CreateRunRequest request);

    RunDto getRunById(UUID id);

    List<RunDto> getRunsByProjectId(UUID projectId);

    RunResultDto updateResult(UUID runId, UUID testcaseId, UpdateResultRequest request);
}
