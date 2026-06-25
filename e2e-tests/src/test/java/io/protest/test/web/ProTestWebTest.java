package io.protest.test.web;

import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.logevents.SelenideLogger;
import io.qameta.allure.selenide.AllureSelenide;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static com.codeborne.selenide.Condition.text;
import static com.codeborne.selenide.Condition.visible;
import static com.codeborne.selenide.Selenide.$;
import static com.codeborne.selenide.Selenide.open;

public class ProTestWebTest {

    @BeforeAll
    static void beforeAll() {
        Configuration.baseUrl = "http://localhost:3000";
        Configuration.browser = "chrome";
        SelenideLogger.addListener("AllureSelenide", new AllureSelenide()
                .screenshots(true)
                .savePageSource(true));
    }

    @BeforeEach
    void setUp() {
        open("/");
    }

    @Test
    @DisplayName("Проверка структуры главной страницы: список проектов в TMS")
    void mainPageShouldDisplayProjects() {
        // Проверяем шапку и название приложения
        $(".app-header").shouldBe(visible).shouldHave(text("ProTEST"));
        
        // Проверяем наличие проектов
        $(".project-card").shouldBe(visible);
        $(".project-title").shouldHave(text("Niffler App"));
    }
}
