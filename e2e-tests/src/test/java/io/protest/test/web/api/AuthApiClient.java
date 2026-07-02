package io.protest.test.web.api;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.*;

import io.protest.test.web.config.Config;
import io.protest.test.web.model.TokenDtoResponse;
import okhttp3.Cookie;
import okhttp3.CookieJar;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.ResponseBody;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;

public class AuthApiClient {

    private final Map<String, List<Cookie>> cookieStore = new HashMap<>();

    private static Config CFG = Config.INSTANCE;

    private final CookieJar cookieJar = new CookieJar() {
        @Override
        public void saveFromResponse(HttpUrl url, List<Cookie> cookies) {
            List<Cookie> existing = cookieStore.getOrDefault(url.host(), new ArrayList<>());
            for (Cookie newCookie : cookies) {
                existing.removeIf(c -> c.name().equals(newCookie.name()));
                existing.add(newCookie);
            }
            cookieStore.put(url.host(), existing);
        }

        @Override
        public List<Cookie> loadForRequest(HttpUrl url) {
            return cookieStore.getOrDefault(url.host(), new ArrayList<>());
        }
    };

    private final OkHttpClient okHttpClient = new OkHttpClient.Builder().cookieJar(cookieJar).followRedirects(
            false).followSslRedirects(false).build();

    private final ObjectMapper objectMapper = new ObjectMapper().configure(
            DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    private final Retrofit retrofit = new Retrofit.Builder().baseUrl(CFG.authUrl()).client(
            okHttpClient).addConverterFactory(JacksonConverterFactory.create(objectMapper)).build();

    private final AuthApi authApi = retrofit.create(AuthApi.class);

    public String login(String username, String password) {
        try {
            String verifier = generateCodeVerifier();
            String challenge = generateCodeChallenge(verifier);

            // 1. GET oauth2/authorize с PKCE параметрами. Получаем 302 Redirect на /login
            Response<ResponseBody> authorizeResponse = authApi.authorize(
                    "code",
                    "client",
                    "openid",
                    CFG.frontUrl() + "authorized",
                    challenge,
                    "S256"
            ).execute();

            if (authorizeResponse.code() != 302) {
                throw new AssertionError("Ожидался редирект (302) на страницу входа. Код: " + authorizeResponse.code());
            }

            String loginLocation = authorizeResponse.headers().get("Location");
            if (loginLocation == null) {
                throw new AssertionError("Отсутствует Location для перехода на страницу входа");
            }

            // 1.5 GET /login для инициализации сессии и генерации XSRF-TOKEN
            Response<ResponseBody> loginFormResponse = authApi.getEndpoint(loginLocation).execute();
            if (loginFormResponse.code() != 200) {
                throw new AssertionError("Не удалось загрузить форму логина. Код: " + loginFormResponse.code());
            }

            // 2. Достаем CSRF-токен из сохраненных кук по всем хостам (localhost/127.0.0.1)
            String csrfToken = "";
            for (List<Cookie> cookieList : cookieStore.values()) {
                for (Cookie cookie : cookieList) {
                    if ("XSRF-TOKEN".equals(cookie.name())) {
                        csrfToken = cookie.value();
                        break;
                    }
                }
                if (!csrfToken.isEmpty()) {
                    break;
                }
            }

            if (csrfToken.isEmpty()) {
                throw new AssertionError(
                        "Не удалось получить XSRF-TOKEN из кук после посещения /login. Сохраненные хосты: " + cookieStore.keySet());
            }

            // 3. POST login
            Response<ResponseBody> loginResponse = authApi.login(username, password, csrfToken).execute();
            if (loginResponse.code() != 302) {
                throw new AssertionError(
                        "Не удалось выполнить вход. Статус-код: " + loginResponse.code() + ". Проверьте логин/пароль или состояние сервера авторизации.");
            }

            // 4. Переходим по первому редиректу
            String location = loginResponse.headers().get("Location");
            if (location == null) {
                throw new AssertionError("Отсутствует заголовок Location после логина");
            }

            Response<ResponseBody> redirectResponse = authApi.getEndpoint(location).execute();
            if (redirectResponse.code() != 302) {
                throw new AssertionError(
                        "Ожидался редирект (302) на redirect_uri. Получен код: " + redirectResponse.code());
            }

            // 5. Извлекаем code из Location редиректа на redirect_uri
            String finalLocation = redirectResponse.headers().get("Location");
            if (finalLocation == null) {
                throw new AssertionError("Отсутствует заголовок Location после авторизации");
            }

            HttpUrl parsedUrl = HttpUrl.parse(finalLocation);
            if (parsedUrl == null) {
                throw new AssertionError("Не удалось спарсить URL: " + finalLocation);
            }
            String code = parsedUrl.queryParameter("code");
            if (code == null) {
                throw new AssertionError("Не найден параметр code в URL: " + finalLocation);
            }

            // 6. Обмениваем code на токены
            Response<TokenDtoResponse> tokenResponse = authApi.token(
                    "client",
                    CFG.frontUrl() + "authorized",
                    "authorization_code",
                    code,
                    verifier
            ).execute();

            if (!tokenResponse.isSuccessful() || tokenResponse.body() == null) {
                throw new AssertionError("Не удалось обменять code на токен. Код: " + tokenResponse.code());
            }

            return tokenResponse.body().accessToken();

        } catch (IOException e) {
            throw new AssertionError("Ошибка при выполнении запросов авторизации", e);
        }
    }

    private static String generateCodeVerifier() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] codeVerifier = new byte[32];
        secureRandom.nextBytes(codeVerifier);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(codeVerifier);
    }

    private static String generateCodeChallenge(String codeVerifier) {
        try {
            byte[] bytes = codeVerifier.getBytes(StandardCharsets.US_ASCII);
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            byte[] digest = messageDigest.digest(bytes);
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
