package io.protest.test.web.jupiter.extension;

import java.util.UUID;

import org.jspecify.annotations.Nullable;
import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.ParameterContext;
import org.junit.jupiter.api.extension.ParameterResolutionException;
import org.junit.jupiter.api.extension.ParameterResolver;
import org.junit.platform.commons.support.AnnotationSupport;

import io.protest.test.web.api.ProjectApiClient;
import io.protest.test.web.jupiter.Project;
import io.protest.test.web.model.ProjectDto;

public class ProjectExtension implements BeforeEachCallback, AfterEachCallback, ParameterResolver {

    private static ExtensionContext.Namespace NAMESPACE = ExtensionContext.Namespace.create(ProjectExtension.class);
    private final ProjectApiClient projectApiClient = new ProjectApiClient();

    @Override
    public void beforeEach(ExtensionContext context) throws Exception {
        AnnotationSupport.findAnnotation(context.getRequiredTestMethod(), Project.class).ifPresent(anno -> {
            String name = anno.name().isEmpty() ? "Project " + UUID.randomUUID().toString() : anno.name();
            String description = anno.description().isEmpty() ? "Description " + UUID.randomUUID().toString() : anno.description();
            ProjectDto projectToCreate = new ProjectDto(null, name, description);

            String token = new io.protest.test.web.api.AuthApiClient().login("admin", "password");
            ProjectApiClient clientWithAuth = new ProjectApiClient(token);
            ProjectDto createdProject = clientWithAuth.createProject(projectToCreate);

            context.getStore(NAMESPACE).put(context.getUniqueId(), createdProject);
        });
    }

    @Override
    public void afterEach(ExtensionContext context) throws Exception {
        ProjectDto createdProject = context.getStore(NAMESPACE).get(context.getUniqueId(), ProjectDto.class);
        if (createdProject != null) {
            String token = new io.protest.test.web.api.AuthApiClient().login("admin", "password");
            ProjectApiClient clientWithAuth = new ProjectApiClient(token);
            clientWithAuth.deleteProject(createdProject.id());
        }
    }

    @Override
    public boolean supportsParameter(
            ParameterContext parameterContext,
            ExtensionContext extensionContext) throws ParameterResolutionException {
        return parameterContext.getParameter().getType() == ProjectDto.class;
    }

    @Override
    public @Nullable Object resolveParameter(
            ParameterContext parameterContext,
            ExtensionContext extensionContext) throws ParameterResolutionException {
        return extensionContext.getStore(NAMESPACE).get(extensionContext.getUniqueId(), ProjectDto.class);
    }
}
