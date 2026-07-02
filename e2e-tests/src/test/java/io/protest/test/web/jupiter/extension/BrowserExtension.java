package io.protest.test.web.jupiter.extension;

import java.io.ByteArrayInputStream;

import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestExecutionExceptionHandler;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;

import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.WebDriverRunner;
import com.codeborne.selenide.logevents.SelenideLogger;

import io.protest.test.web.config.Config;
import io.qameta.allure.Allure;
import io.qameta.allure.selenide.AllureSelenide;

public class BrowserExtension implements BeforeEachCallback, TestExecutionExceptionHandler {

    private static Config CFG = Config.INSTANCE;

    @Override
    public void beforeEach(ExtensionContext context) throws Exception {
        Configuration.baseUrl = CFG.frontUrl();
        Configuration.browser = "chrome";
        SelenideLogger.addListener("AllureSelenide", new AllureSelenide().screenshots(true).savePageSource(true));

        // Если браузер уже был запущен в предыдущих тестах — очищаем его куки и локальное хранилище
        if (WebDriverRunner.hasWebDriverStarted()) {
            com.codeborne.selenide.Selenide.clearBrowserCookies();
            com.codeborne.selenide.Selenide.clearBrowserLocalStorage();
        }
    }

    @Override
    public void handleTestExecutionException(ExtensionContext context, Throwable throwable) throws Throwable {
        if (WebDriverRunner.hasWebDriverStarted()) {
            byte[] screenshotBytes = ((TakesScreenshot) WebDriverRunner.getWebDriver()).getScreenshotAs(
                    OutputType.BYTES);
            Allure.addAttachment("Скриншот при падении", new ByteArrayInputStream(screenshotBytes));
        }
        throw throwable;
    }
}
