package io.protest.projects.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.protest.projects.data.entity.ProjectEntity;
import io.protest.projects.data.repository.ProjectRepository;
import io.protest.projects.model.dto.ProjectDto;
import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public ProjectDto createProject(ProjectDto request) {
        if (projectRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("Project with this name already exists");
        }
        ProjectEntity entity = new ProjectEntity();
        entity.setName(request.name());
        entity.setDescription(request.description());

        if (request.isActive() != null) {
            entity.setIsActive(request.isActive());
        }

        ProjectEntity saved = projectRepository.save(entity);
        return ProjectDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public ProjectDto getProjectById(UUID id) {
        return projectRepository.findById(id).map(ProjectDto::fromEntity).orElseThrow(
                () -> new EntityNotFoundException("Project not found"));
    }

    public ProjectDto updateProject(UUID id, ProjectDto project) {
        ProjectEntity projectEntity = projectRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Project not found"));

        projectEntity.setName(project.name());
        projectEntity.setDescription(project.description());

        if (project.isActive() != null) {
            projectEntity.setIsActive(project.isActive());
        }

        ProjectEntity updated = projectRepository.save(projectEntity);
        return ProjectDto.fromEntity(updated);
    }

    public void deleteProject(UUID id) {
        if (!projectRepository.existsById(id)) {
            throw new EntityNotFoundException("Project not found");
        }
        projectRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream().map(ProjectDto::fromEntity).toList();
    }
}
