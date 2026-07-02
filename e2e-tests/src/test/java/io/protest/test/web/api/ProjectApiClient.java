package io.protest.test.web.api;

import java.io.IOException;
import java.util.UUID;

import io.protest.test.web.config.Config;
import io.protest.test.web.model.ProjectDto;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;

import okhttp3.OkHttpClient;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ProjectApiClient {

    private final ProjectApi projectApi;
    private final ObjectMapper objectMapper = new ObjectMapper().configure(
            DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    private static Config CFG = Config.INSTANCE;

    public ProjectApiClient(String token) {
        OkHttpClient client = new OkHttpClient.Builder().addInterceptor(
                chain -> chain.proceed(
                        chain.request().newBuilder().header("Authorization", "Bearer " + token).build()
                )).build();

        Retrofit retrofit = new Retrofit.Builder().baseUrl(CFG.projectsUrl()).client(client).addConverterFactory(
                JacksonConverterFactory.create(objectMapper)).build();

        this.projectApi = retrofit.create(ProjectApi.class);
    }

    public ProjectApiClient() {
        Retrofit retrofit = new Retrofit.Builder().baseUrl(CFG.projectsUrl()).addConverterFactory(
                JacksonConverterFactory.create(objectMapper)).build();

        this.projectApi = retrofit.create(ProjectApi.class);
    }

    public ProjectDto createProject(ProjectDto project) {
        try {
            Response<ProjectDto> response = projectApi.createProject(project).execute();
            if (!response.isSuccessful()) {
                throw new AssertionError("Не удалось создать проект. Статус-код: " + response.code());
            }
            return response.body();
        } catch (IOException e) {
            throw new AssertionError("Ошибка подключения к API проектов при создании проекта", e);
        }
    }

    public void deleteProject(UUID id) {
        try {
            Response<Void> response = projectApi.deleteProject(id.toString()).execute();
            if (!response.isSuccessful()) {
                throw new AssertionError("Не удалось удалить проект. Статус-код: " + response.code());
            }
        } catch (IOException e) {
            throw new AssertionError("Ошибка подключения к API проектов при удалении проекта", e);
        }
    }
}
