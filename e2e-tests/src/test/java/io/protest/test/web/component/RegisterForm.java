package io.protest.test.web.component;

import static com.codeborne.selenide.Condition.visible;
import static com.codeborne.selenide.Selenide.$;

import com.codeborne.selenide.SelenideElement;

import io.protest.test.web.page.LoginPage;

public class RegisterForm {
    private final SelenideElement self;
    private final SelenideElement usernameInput;
    private final SelenideElement passwordInput;
    private final SelenideElement submitmPasswordInput;
    private final SelenideElement registerBtn;
    private final SelenideElement errorBanner;
    private final SelenideElement loginBtn;

    public RegisterForm(SelenideElement self) {
        this.self = self;
        this.usernameInput = self.$("#username");
        this.passwordInput = self.$("#password");
        this.submitmPasswordInput = self.$("#passwordSubmit");
        this.registerBtn = self.$("button[type='submit']");
        this.errorBanner = self.$(".field-error");
        this.loginBtn = $("a[href = '/login']");
    }


    public RegisterForm shouldBeVisible() {
        self.shouldBe(visible);
        return this;
    }

    public RegisterForm setUserName(String username) {
        usernameInput.setValue(username);
        return this;
    }

    public RegisterForm setPassword(String password) {
        passwordInput.setValue(password);
        return this;
    }

    public RegisterForm submitPassword(String password) {
        submitmPasswordInput.setValue(password);
        return this;
    }

    public RegisterForm submit() {
        registerBtn.click();
        return this;
    }

    public LoginPage proccedToLogin() {
        loginBtn.click();
        return new LoginPage();
    }

    public SelenideElement getErrorBanner() {
        return errorBanner;
    }
}
