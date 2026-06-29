package io.protest.test.web.jupiter;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.junit.jupiter.api.extension.ExtendWith;

import io.protest.test.web.jupiter.extension.ProjectExtension;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@ExtendWith(ProjectExtension.class)
public @interface Project {

    String name() default "";

    String description() default "";
}
