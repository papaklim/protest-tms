package io.protest.cases;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "Testcase API", version = "1.0.0", description = "Testcase API for ProTEST TMS", license = @License(
            name = "Apache 2.0", url = "https://www.apache.org/licenses/LICENSE-2.0.html"
        )
    )
)
public class TestcaseApplication {
    public static void main(String[] args) {
        SpringApplication.run(TestcaseApplication.class, args);
    }
}
