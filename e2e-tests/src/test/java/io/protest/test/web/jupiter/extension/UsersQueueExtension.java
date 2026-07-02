package io.protest.test.web.jupiter.extension;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.jspecify.annotations.Nullable;
import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.ParameterContext;
import org.junit.jupiter.api.extension.ParameterResolutionException;
import org.junit.jupiter.api.extension.ParameterResolver;
import org.junit.platform.commons.support.AnnotationSupport;

import io.protest.test.web.jupiter.annotation.User;
import io.protest.test.web.model.UserDto;
import io.protest.test.web.model.enums.UserType;

public class UsersQueueExtension implements AfterEachCallback, ParameterResolver {

    public static final ExtensionContext.Namespace NAMESPACE = ExtensionContext.Namespace.create(
            UsersQueueExtension.class);

    private static ConcurrentLinkedQueue<UserDto> ADMINS = new ConcurrentLinkedQueue<UserDto>();
    private static ConcurrentLinkedQueue<UserDto> LEADS = new ConcurrentLinkedQueue<UserDto>();
    private static ConcurrentLinkedQueue<UserDto> TESTERS = new ConcurrentLinkedQueue<UserDto>();
    private static ConcurrentLinkedQueue<UserDto> GUESTS = new ConcurrentLinkedQueue<UserDto>();

    static {
        ADMINS.add(new UserDto("admin", "password", UserType.ADMIN));
        LEADS.add(new UserDto("lead", "password", UserType.LEAD));
        TESTERS.add(new UserDto("tester", "password", UserType.TESTER));
        GUESTS.add(new UserDto("guest", "password", UserType.GUEST));
    }

    @Override
    public boolean supportsParameter(
            ParameterContext parameterContext,
            ExtensionContext extensionContext) throws ParameterResolutionException {
        return parameterContext.getParameter().getType().isAssignableFrom(
                UserDto.class) && AnnotationSupport.isAnnotated(parameterContext.getParameter(), User.class);
    }

    @Override
    public @Nullable Object resolveParameter(
            ParameterContext parameterContext,
            ExtensionContext extensionContext) {

        // 1. Получение типа запрашиваемой роли
        UserType userType = parameterContext.findAnnotation(User.class).orElseThrow(
                () -> new ParameterResolutionException("Annotation @User not found")).value();

        // 2. Получение или создание Map в JUnit Store для теста
        Map<UserType, UserDto> userMap = extensionContext.getStore(
                NAMESPACE).computeIfAbsent(
                        extensionContext.getUniqueId(), key -> new UserMapHolder(new HashMap<>()),
                        UserMapHolder.class).users();
        // 3. Выбор пользователя из нужной очереди в зависимости от роли
        UserDto selectedUser;
        switch (userType) {
            case ADMIN -> selectedUser = ADMINS.poll();
            case LEAD -> selectedUser = LEADS.poll();
            case TESTER -> selectedUser = TESTERS.poll();
            case GUEST -> selectedUser = GUESTS.poll();

            default -> throw new ParameterResolutionException("Unknown UserType: " + userType);
        }
        // 4. Проверка, что пользователь действительно был в очереди
        if (selectedUser == null) {
            throw new ParameterResolutionException("No more free users with role: " + userType);
        }
        // 5. Сохранение в карту для последующего возврата в afterEach и возвращаем в тест
        userMap.put(userType, selectedUser);
        return selectedUser;
    }


    @Override
    public void afterEach(ExtensionContext context) throws Exception {
        // 1. Получение карты из Store
        UserMapHolder holder = context.getStore(NAMESPACE).get(context.getUniqueId(), UserMapHolder.class);
        // 2. Если карта существует, возвращение каждого пользователя в его очередь
        if (holder != null && holder.users() != null) {
            for (UserDto user : holder.users().values()) {
                switch (user.userType()) {
                    case ADMIN -> ADMINS.add(user);
                    case LEAD -> LEADS.add(user);
                    case TESTER -> TESTERS.add(user);
                    case GUEST -> GUESTS.add(user);
                }
            }
        }
    }

    private record UserMapHolder(Map<UserType, UserDto> users) {
    }
}
