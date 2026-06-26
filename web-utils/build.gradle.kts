plugins {
    id("org.springframework.boot") version "4.1.0"
    id("io.spring.dependency-management")
    java
}
// Отключение сборки исполняемого jar-файла (bootJar)
tasks.getByName<org.springframework.boot.gradle.tasks.bundling.BootJar>("bootJar") {
    enabled = false
}
// Включение сборки обычного jar-файла (library jar)
tasks.getByName<Jar>("jar") {
    enabled = true
}
dependencies {
    // Для @RestControllerAdvice и HttpServletRequest
    implementation("org.springframework.boot:spring-boot-starter-web")
    
    // Для класса EntityNotFoundException
    implementation("jakarta.persistence:jakarta.persistence-api")

    // Зависимость для OpenAPI (compileOnly, чтобы не навязывать UI-стартер модулям без веба)
    compileOnly("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.4")
}
