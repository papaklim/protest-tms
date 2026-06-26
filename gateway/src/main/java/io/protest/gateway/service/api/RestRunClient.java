package io.protest.gateway.service.api;

import java.util.List;
import java.util.UUID;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import io.protest.gateway.config.ProtestServicesConfig;
import io.protest.gateway.model.dto.CreateRunRequest;
import io.protest.gateway.model.dto.RunDto;
import io.protest.gateway.model.dto.RunResultDto;
import io.protest.gateway.model.dto.UpdateResultRequest;

@Component
public class RestRunClient implements RunClient {
    private final RestClient restClient;

    public RestRunClient(RestClient.Builder restClientBuilder, ProtestServicesConfig servicesConfig) {
        this.restClient = restClientBuilder.baseUrl(servicesConfig.runsUrl()).build();
    }

    @Override
    public RunDto createRun(CreateRunRequest request) {
        return restClient.post().uri("/api/runs").body(request).retrieve().body(RunDto.class);
    }

    @Override
    public RunDto getRunById(UUID id) {
        return restClient.get().uri("/api/runs/{id}", id).retrieve().body(RunDto.class);
    }

    @Override
    public List<RunDto> getRunsByProjectId(UUID projectId) {
        return restClient.get().uri(
                uriBuilder -> uriBuilder.path("/api/runs").queryParam("project_id", projectId).build()).retrieve().body(
                        new ParameterizedTypeReference<List<RunDto>>() {
                        });
    }

    @Override
    public RunResultDto updateResult(UUID runId, UUID testcaseId, UpdateResultRequest request) {
        return restClient.put().uri("/api/runs/{runId}/results/{testcaseId}", runId, testcaseId).body(
                request).retrieve().body(RunResultDto.class);
    }
}
