package io.protest.gateway.service.api;

import io.protest.gateway.model.dto.ProjectDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import io.protest.gateway.config.ProtestServicesConfig;
import io.protest.gateway.model.dto.TestcaseDto;
import io.protest.gateway.service.TestcaseClient;

import java.util.List;
import java.util.UUID;

import static java.util.Collections.emptyList;

@Component
public class RestTestcaseClient implements TestcaseClient {
    private static final String API_TESTCASES_PATH = "/api/testcases";
    private final RestClient restClient;

    public RestTestcaseClient(ProtestServicesConfig config) {
        this.restClient = RestClient.builder().baseUrl(config.casesUrl()).build();
    }

    @Override
    public TestcaseDto createTestcase(TestcaseDto testcaseDto) {
        return restClient.post().uri(API_TESTCASES_PATH).body(testcaseDto).retrieve().body(TestcaseDto.class);
    }

    @Override
    public TestcaseDto getTestcaseById(UUID id) {
        return restClient.get().uri(API_TESTCASES_PATH + "/{id}", id).retrieve().body(TestcaseDto.class);
    }

    @Override
    public TestcaseDto updateTestcase(UUID id, TestcaseDto request) {
        return restClient.put().uri(API_TESTCASES_PATH + "/{id}", id).body(request).retrieve().body(TestcaseDto.class);
    }

    @Override
    public void deleteTestcase(UUID id) {
        restClient.delete().uri(API_TESTCASES_PATH + "/{id}").retrieve().toBodilessEntity();
    }

    @Override
    public List<TestcaseDto> getAllTestcasesByProjectId(UUID projectId) {
        TestcaseDto[] testcases = restClient.get().uri(
                uriBuilder -> uriBuilder.path(API_TESTCASES_PATH).queryParam(
                        "project_id", projectId).build()).retrieve().body(TestcaseDto[].class);
        return testcases != null ? List.of(testcases) : emptyList();
    }
}
