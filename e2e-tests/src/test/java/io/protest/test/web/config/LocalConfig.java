package io.protest.test.web.config;

/**
 * LocalConfig
 */
public enum LocalConfig implements Config {
    INSTANCE;

    @Override
    public String frontUrl() {
        return System.getProperty("protest.front.url", "http://localhost:3000/");
    }

    @Override
    public String authUrl() {
        return System.getProperty("protest.auth.url", "http://localhost:9000/");
    }

    @Override
    public String projectsUrl() {
        return System.getProperty("protest.projects.url", "http://localhost:8091/");
    }

    @Override
    public String testcasesUrl() {
        return System.getProperty("protest.testcases.url", "http://localhost:8092/");
    }

    @Override
    public String runsUrl() {
        return System.getProperty("protest.runs.url", "http://localhost:8093/");
    }
}
