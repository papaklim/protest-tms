package io.protest.test.web;

import static com.codeborne.selenide.Condition.text;
import static com.codeborne.selenide.Selenide.open;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import io.protest.test.web.config.Config;
import io.protest.test.web.jupiter.annotation.Project;
import io.protest.test.web.jupiter.annotation.Web;
import io.protest.test.web.model.ProjectDto;
import io.protest.test.web.page.LoginPage;
import io.protest.test.web.page.RegisterPage;


@Web
public class ProTestWebTest {

    private static Config CFG = Config.INSTANCE;

    @BeforeEach
    void setUp() {
        open("/");
    }

    @Test
    @DisplayName("Проверка структуры главной страницы: список проектов в TMS")
    void mainPageShouldDisplayProjects() {
        LoginPage loginPage = new LoginPage();
        loginPage.getLoginForm().setUserName("admin").setPassword("password").submit().headerShouldBeVisible();
    }

    @Test
    @DisplayName("Ошибка регистрации: имя пользователя уже занято")
    void shouldNotRegisterUserWithExistingUsername() {
        open(CFG.authUrl() + "register");
        RegisterPage registerPage = new RegisterPage();
        String username = "admin";
        String password = "password";
        registerPage.getRegisterForm().setUserName(username).setPassword(password).submitPassword(
                "password").submit();

        registerPage.getRegisterForm().getErrorBanner().shouldHave(
                text(String.format("Пользователь с именем %s уже существует", username)));
    }

    @Test
    @Project
    @DisplayName("Отображение созданного через API проекта на главной странице")
    void shouldDisplayCreatedProject(ProjectDto project) {
        LoginPage loginPage = new LoginPage();
        loginPage.getLoginForm().setUserName("admin").setPassword("password").submit().projectShouldBeVisible(
                project.name());
    }
}
