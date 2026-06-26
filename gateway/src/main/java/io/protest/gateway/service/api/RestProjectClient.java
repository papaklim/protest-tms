package io.protest.gateway.service.api;

import static java.util.Collections.emptyList;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import io.protest.gateway.config.ProtestServicesConfig;
import io.protest.gateway.model.dto.ProjectDto;
import io.protest.gateway.service.ProjectClient;

@Component
public class RestProjectClient implements ProjectClient {
    private static final String API_PROJECTS_PATH = "/api/projects";
    private final RestClient restClient;

    public RestProjectClient(RestClient.Builder restClientBuilder, ProtestServicesConfig config) {
        this.restClient = restClientBuilder.baseUrl(config.projectsUrl()).build();
    }

    @Override
    public ProjectDto createProject(ProjectDto projectDto) {
        return restClient.post().uri(API_PROJECTS_PATH).body(projectDto).retrieve().body(ProjectDto.class);
    }

    @Override
    public ProjectDto getProjectById(UUID id) {
        return restClient.get().uri(API_PROJECTS_PATH + "/{id}", id).retrieve().body(ProjectDto.class);
    }

    @Override
    public ProjectDto updateProject(UUID id, ProjectDto request) {
        return restClient.put().uri(API_PROJECTS_PATH + "/{id}", id).body(request).retrieve().body(ProjectDto.class);
    }

    @Override
    public void deleteProject(UUID id) {
        restClient.delete().uri(API_PROJECTS_PATH + "/{id}").retrieve().toBodilessEntity();
    }

    @Override
    public List<ProjectDto> getAllProjects() {
        ProjectDto[] projects = restClient.get().uri(API_PROJECTS_PATH).retrieve().body(ProjectDto[].class);
        return projects != null ? List.of(projects) : emptyList();
    }
}
