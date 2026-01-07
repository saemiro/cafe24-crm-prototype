package com.cafe24.crm.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class Cafe24AuthClient {

    @Value("${cafe24.client-id}")
    private String clientId;

    @Value("${cafe24.client-secret}")
    private String clientSecret;

    @Value("${cafe24.callback-url:https://crm-api.saemiro.com/api/auth/cafe24/callback}")
    private String callbackUrl;

    private final WebClient.Builder webClientBuilder;

    private static final String CAFE24_SCOPE = "mall.read_store,mall.read_product,mall.read_order,mall.read_customer";

    /**
     * 카페24 OAuth 인증 URL 생성
     * state 파라미터에 mallId를 넣어서 콜백에서 식별
     */
    public String getAuthorizationUrl(String mallId, String redirectUri) {
        String finalRedirectUri = redirectUri != null ? redirectUri : callbackUrl;
        return String.format(
            "https://%s.cafe24api.com/api/v2/oauth/authorize?response_type=code&client_id=%s&redirect_uri=%s&scope=%s&state=%s",
            mallId, clientId, finalRedirectUri, CAFE24_SCOPE, mallId
        );
    }

    /**
     * 인증 코드로 액세스 토큰 교환
     */
    public Mono<Map<String, Object>> getAccessToken(String mallId, String code) {
        String tokenUrl = String.format("https://%s.cafe24api.com/api/v2/oauth/token", mallId);
        String auth = Base64.getEncoder().encodeToString(
            (clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8)
        );

        WebClient client = webClientBuilder.build();

        String body = String.format(
            "grant_type=authorization_code&code=%s&redirect_uri=%s",
            code, callbackUrl
        );

        log.info("Exchanging code for token. Mall: {}, URL: {}", mallId, tokenUrl);

        return client.post()
            .uri(tokenUrl)
            .header("Authorization", "Basic " + auth)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .bodyValue(body)
            .retrieve()
            .bodyToMono(Map.class)
            .map(response -> (Map<String, Object>) response)
            .doOnSuccess(r -> log.info("Successfully obtained access token for mall: {}", mallId))
            .doOnError(e -> log.error("Failed to get access token for mall {}: {}", mallId, e.getMessage()));
    }

    /**
     * 리프레시 토큰으로 액세스 토큰 갱신
     */
    public Mono<Map<String, Object>> refreshToken(String mallId, String refreshToken) {
        String tokenUrl = String.format("https://%s.cafe24api.com/api/v2/oauth/token", mallId);
        String auth = Base64.getEncoder().encodeToString(
            (clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8)
        );

        WebClient client = webClientBuilder.build();

        return client.post()
            .uri(tokenUrl)
            .header("Authorization", "Basic " + auth)
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .bodyValue("grant_type=refresh_token&refresh_token=" + refreshToken)
            .retrieve()
            .bodyToMono(Map.class)
            .map(response -> (Map<String, Object>) response)
            .doOnSuccess(r -> log.info("Successfully refreshed token for mall: {}", mallId))
            .doOnError(e -> log.error("Failed to refresh token for mall {}: {}", mallId, e.getMessage()));
    }
}
