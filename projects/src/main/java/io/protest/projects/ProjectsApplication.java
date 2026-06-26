package io.protest.projects;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;

@SpringBootApplication
@OpenAPIDefinition(
                info = @Info(
                                title = "Projects API", version = "1.0.0", description = "Projects API for ProTEST TMS", license = @License(
                                                name = "Apache 2.0", url = "https://www.apache.org/licenses/LICENSE-2.0.html"
                                )
                )
)
public class ProjectsApplication {
        public static void main(String[] args) {
                SpringApplication.run(ProjectsApplication.class, args);
        }
}
