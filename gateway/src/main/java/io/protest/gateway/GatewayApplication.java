package io.protest.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;

@SpringBootApplication
@ConfigurationPropertiesScan
@OpenAPIDefinition(
    info = @Info(
        title = "Gateway API", version = "1.0.0", description = "Gateway API for ProTEST TMS", license = @License(
            name = "Apache 2.0", url = "https://www.apache.org/licenses/LICENSE-2.0.html"
        )
    )
)
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
