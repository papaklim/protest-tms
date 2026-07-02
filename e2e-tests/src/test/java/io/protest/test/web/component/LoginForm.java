package io.protest.test.web.component;

import static com.codeborne.selenide.Condition.visible;

import com.codeborne.selenide.SelenideElement;

import io.protest.test.web.page.MainPage;

public class LoginForm {
    private final SelenideElement self;
    private final SelenideElement usernameInput;
    private final SelenideElement passwordInput;
    private final SelenideElement loginBtn;

    public LoginForm(SelenideElement self) {
        this.self = self;
        usernameInput = self.$("#username");
        passwordInput = self.$("#password");
        loginBtn = self.$("button[type='submit']");
    }

    public LoginForm shouldBeVisible() {
        self.shouldBe(visible);
        return this;
    }

    public LoginForm setUserName(String username) {
        usernameInput.setValue(username);
        return this;
    }

    public LoginForm setPassword(String password) {
        passwordInput.setValue(password);
        return this;
    }

    public MainPage submit() {
        loginBtn.click();
        return new MainPage();
    }
}
