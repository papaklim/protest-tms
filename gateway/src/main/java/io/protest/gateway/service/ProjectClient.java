package io.protest.gateway.service;

import java.util.List;
import java.util.UUID;

import io.protest.gateway.model.dto.ProjectDto;

public interface ProjectClient {
    ProjectDto createProject(ProjectDto projectDto);

    ProjectDto getProjectById(UUID id);

    ProjectDto updateProject(UUID id, ProjectDto request);

    void deleteProject(UUID id);

    List<ProjectDto> getAllProjects();
}
