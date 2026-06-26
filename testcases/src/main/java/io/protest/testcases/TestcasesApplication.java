package io.protest.testcases;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;

@SpringBootApplication
@OpenAPIDefinition(
        info = @Info(
                title = "Testcases API", version = "1.0.0", description = "Testcases API for ProTEST TMS", license = @License(
                        name = "Apache 2.0", url = "https://www.apache.org/licenses/LICENSE-2.0.html"
                )
        )
)
public class TestcasesApplication {
    public static void main(String[] args) {
        SpringApplication.run(TestcasesApplication.class, args);
    }
}
