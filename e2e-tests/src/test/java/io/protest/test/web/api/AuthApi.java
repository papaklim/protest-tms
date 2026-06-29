package io.protest.test.web.api;

import io.protest.test.web.model.TokenDtoResponse;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface AuthApi {

    // 1. Инициализация OIDC (запрос с code_challenge)
    @GET("oauth2/authorize")
    Call<ResponseBody> authorize(
            @Query("response_type") String responseType,
            @Query("client_id") String clientId,
            @Query("scope") String scope,
            @Query("redirect_uri") String redirectUri,
            @Query("code_challenge") String codeChallenge,
            @Query("code_challenge_method") String codeChallengeMethod);

    // 2. Ввод логина/пароля и CSRF (через HTML-форму)
    @POST("login")

    @FormUrlEncoded
    Call<ResponseBody> login(
            @Field("username") String username,
            @Field("password") String password,
            @Field("_csrf") String csrf
    );

    // 3. Обмен полученного code на JWT-токены
    @POST("oauth2/token")
    @FormUrlEncoded
    Call<TokenDtoResponse> token(
            @Field("client_id") String clientId,
            @Field("redirect_uri") String redirectUri,
            @Field("grant_type") String grantType,
            @Field("code") String code,
            @Field("code_verifier") String codeVerifier
    );

    // 4. Свободный GET-запрос для ручного следования редиректам
    @GET
    Call<ResponseBody> getEndpoint(@retrofit2.http.Url String url);
}
