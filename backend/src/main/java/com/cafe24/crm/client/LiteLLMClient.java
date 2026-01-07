package com.cafe24.crm.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class LiteLLMClient {

    @Value("${external.litellm.base-url}")
    private String baseUrl;

    @Value("${external.litellm.api-key:}")
    private String apiKey;

    @Value("${external.cf-access.client-id:}")
    private String cfAccessClientId;

    @Value("${external.cf-access.client-secret:}")
    private String cfAccessClientSecret;

    private final WebClient.Builder webClientBuilder;

    public Mono<String> chat(String model, String userMessage, String systemPrompt) {
        WebClient.Builder builder = webClientBuilder
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey);

        // Add Cloudflare Access headers if configured
        if (cfAccessClientId != null && !cfAccessClientId.isEmpty()) {
            builder.defaultHeader("CF-Access-Client-Id", cfAccessClientId)
                   .defaultHeader("CF-Access-Client-Secret", cfAccessClientSecret);
        }

        WebClient client = builder.build();

        Map<String, Object> request = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userMessage)
                ),
                "max_tokens", 2000,
                "temperature", 0.7
        );

        return client.post()
                .uri("/v1/chat/completions")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                    if (choices != null && !choices.isEmpty()) {
                        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                        return (String) message.get("content");
                    }
                    return "";
                })
                .doOnError(e -> log.error("LiteLLM chat error: {}", e.getMessage()));
    }

    public Mono<String> generateCrmInsight(String query) {
        String systemPrompt = """
            You are a Cafe24 CRM AI assistant specialized in e-commerce customer relationship management.
            Provide actionable insights based on customer data, order patterns, and campaign effectiveness.
            Always include specific recommendations for improving customer retention and revenue.
            """;

        return chat("cafe24-crm-llama", query, systemPrompt);
    }
}
