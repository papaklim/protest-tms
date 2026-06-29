package io.protest.test.web.page;

import static com.codeborne.selenide.Condition.visible;
import static com.codeborne.selenide.Selectors.byText;
import static com.codeborne.selenide.Selenide.$;

import com.codeborne.selenide.SelenideElement;


public class MainPage {
    private final SelenideElement header = $("header");

    public MainPage headerShouldBeVisible() {
        header.shouldBe(visible);
        return this;
    }

    public MainPage projectShouldBeVisible(String projectName) {
        $(byText(projectName)).shouldBe(visible);
        return this;
    }
}
