package io.protest.test.web.api;

import io.protest.test.web.model.ProjectDto;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ProjectApi {
    @POST("api/projects")
    Call<ProjectDto> createProject(@Body ProjectDto project);

    @DELETE("api/projects/{id}")
    Call<Void> deleteProject(@Path("id") String id);
}
