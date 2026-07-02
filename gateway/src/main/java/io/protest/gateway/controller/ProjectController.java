package io.protest.gateway.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import io.protest.gateway.model.dto.ProjectDto;
import io.protest.gateway.service.ProjectClient;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/bff/projects")
public class ProjectController {

    private final ProjectClient projectClient;

    public ProjectController(ProjectClient projectClient) {
        this.projectClient = projectClient;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('LEAD')")
    public ProjectDto createProject(@Valid @RequestBody ProjectDto request) {
        return projectClient.createProject(request);
    }

    @GetMapping("/{id}")
    public ProjectDto getProjectById(@PathVariable("id") UUID id) {
        return projectClient.getProjectById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('LEAD')")
    public ProjectDto updateProject(@PathVariable("id") UUID id, @Valid @RequestBody ProjectDto request) {
        return projectClient.updateProject(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('LEAD')")
    public void deleteProject(@PathVariable("id") UUID id) {
        projectClient.deleteProject(id);
    }

    @GetMapping
    public List<ProjectDto> getAllProjects() {
        return projectClient.getAllProjects();
    }
}
