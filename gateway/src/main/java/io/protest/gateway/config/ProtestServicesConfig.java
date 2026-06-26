package io.protest.gateway.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "protest.services")
public record ProtestServicesConfig(
    String authUrl,
    String projectsUrl,
    String testcasesUrl,
    String runsUrl
) {

}
