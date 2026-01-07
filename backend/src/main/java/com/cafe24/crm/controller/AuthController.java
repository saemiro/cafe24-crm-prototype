package com.cafe24.crm.controller;

import com.cafe24.crm.client.Cafe24AuthClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final Cafe24AuthClient cafe24AuthClient;

    @Value("${cafe24.frontend-url:https://crm.saemiro.com}")
    private String frontendUrl;

    /**
     * 카페24 앱 설치 URL (앱 설치 시 최초 통신)
     * 카페24 개발자센터에 등록: https://crm-api.saemiro.com/auth/cafe24/install
     *
     * 카페24에서 mall_id 파라미터와 함께 이 URL로 리다이렉트함
     */
    @GetMapping("/cafe24/install")
    public void installApp(
            @RequestParam("mall_id") String mallId,
            HttpServletResponse response) throws IOException {

        log.info("App install request from mall: {}", mallId);

        // 카페24 OAuth 인증 페이지로 리다이렉트
        String authUrl = cafe24AuthClient.getAuthorizationUrl(mallId, null);
        response.sendRedirect(authUrl);
    }

    /**
     * 카페24 OAuth 콜백 URL (토큰 교환)
     * 카페24 개발자센터에 등록: https://crm-api.saemiro.com/auth/cafe24/callback
     *
     * 사용자가 인증 완료 후 code와 state(mall_id)와 함께 리다이렉트됨
     */
    @GetMapping("/cafe24/callback")
    public void oauthCallback(
            @RequestParam("code") String code,
            @RequestParam("state") String mallId,
            HttpServletResponse response) throws IOException {

        log.info("OAuth callback for mall: {} with code: {}...", mallId, code.substring(0, Math.min(10, code.length())));

        try {
            Map<String, Object> tokenResponse = cafe24AuthClient.getAccessToken(mallId, code).block();

            if (tokenResponse == null) {
                throw new RuntimeException("Failed to get token response");
            }

            String accessToken = (String) tokenResponse.get("access_token");
            String refreshToken = (String) tokenResponse.get("refresh_token");
            Number expiresIn = (Number) tokenResponse.get("expires_in");

            // 프론트엔드로 토큰 정보와 함께 리다이렉트
            String redirectUrl = String.format(
                "%s/auth/success?mall_id=%s&access_token=%s&refresh_token=%s&expires_in=%d",
                frontendUrl,
                URLEncoder.encode(mallId, StandardCharsets.UTF_8),
                URLEncoder.encode(accessToken, StandardCharsets.UTF_8),
                URLEncoder.encode(refreshToken, StandardCharsets.UTF_8),
                expiresIn != null ? expiresIn.longValue() : 0
            );

            log.info("OAuth success for mall: {}, redirecting to frontend", mallId);
            response.sendRedirect(redirectUrl);

        } catch (Exception e) {
            log.error("OAuth callback error for mall {}: {}", mallId, e.getMessage());
            String errorUrl = String.format(
                "%s/auth/error?mall_id=%s&error=%s",
                frontendUrl,
                URLEncoder.encode(mallId, StandardCharsets.UTF_8),
                URLEncoder.encode(e.getMessage() != null ? e.getMessage() : "Unknown error", StandardCharsets.UTF_8)
            );
            response.sendRedirect(errorUrl);
        }
    }

    // === API 엔드포인트 (프론트엔드에서 호출) ===

    @GetMapping("/cafe24/authorize")
    public ResponseEntity<Map<String, String>> getAuthorizationUrl(
            @RequestParam String mallId,
            @RequestParam(required = false) String redirectUri) {

        String authUrl = cafe24AuthClient.getAuthorizationUrl(mallId, redirectUri);
        return ResponseEntity.ok(Map.of("authorization_url", authUrl));
    }

    @PostMapping("/cafe24/token")
    public Mono<ResponseEntity<Map<String, Object>>> exchangeToken(
            @RequestBody Map<String, String> request) {

        String mallId = request.get("mall_id");
        String code = request.get("code");

        return cafe24AuthClient.getAccessToken(mallId, code)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.badRequest().build());
    }

    @PostMapping("/cafe24/refresh")
    public Mono<ResponseEntity<Map<String, Object>>> refreshToken(
            @RequestBody Map<String, String> request) {

        String mallId = request.get("mall_id");
        String refreshToken = request.get("refresh_token");

        return cafe24AuthClient.refreshToken(mallId, refreshToken)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.badRequest().build());
    }
}
