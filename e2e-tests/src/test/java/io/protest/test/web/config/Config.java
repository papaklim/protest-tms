package io.protest.test.web.config;

public interface Config {

    Config INSTANCE = LocalConfig.INSTANCE;

    String frontUrl();

    String authUrl();

    String projectsUrl();

    String testcasesUrl();

    String runsUrl();

}
