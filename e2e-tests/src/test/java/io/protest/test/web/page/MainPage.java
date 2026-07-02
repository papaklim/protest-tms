package io.protest.test.web.page;

import static com.codeborne.selenide.Condition.visible;
import static com.codeborne.selenide.Selectors.byText;
import static com.codeborne.selenide.Selenide.$;

import com.codeborne.selenide.SelenideElement;

public class MainPage {
    private final SelenideElement header = $("header");
    private final SelenideElement createProjectBtn = $("[data-testid='create-project-btn']");
    private final SelenideElement submitCreateProjectBtn = $("button[type='submit']");
    private final SelenideElement cancelCreateProjectBtn = $("button[type='button']");
    private final SelenideElement editProjectBtn = $("[data-testid='edit-project-btn']");
    private final SelenideElement deleteProjectBtn = $("[data-testid='delete-project-btn']");
    private final SelenideElement projectNameInput = $("input[placeholder='Название проекта']");
    private final SelenideElement projectDescriptionInput = $("input[placeholder='Описание']");

    public MainPage headerShouldBeVisible() {
        header.shouldBe(visible);
        return this;
    }

    public MainPage createdProjectShouldBeVisible(String projectName) {
        $(byText(projectName)).shouldBe(visible);
        return this;
    }

    public MainPage projectShouldBeVisible(String projectName) {
        return createdProjectShouldBeVisible(projectName);
    }

    public MainPage createProjectButtonShouldBeVisible() {
        createProjectBtn.shouldBe(visible);
        return this;
    }


    public MainPage createProjectButtonShouldNotBeVisible() {
        createProjectBtn.shouldNotBe(visible);
        return this;
    }

    public MainPage controlProjectButtonsShouldBeVisible() {
        editProjectBtn.shouldBe(visible);
        deleteProjectBtn.shouldBe(visible);
        return this;
    }

    public MainPage controlProjectButtonsShouldNotBeVisible() {
        editProjectBtn.shouldNotBe(visible);
        deleteProjectBtn.shouldNotBe(visible);
        return this;
    }
}
