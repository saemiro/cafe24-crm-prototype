package com.cafe24.crm.controller;

import com.cafe24.crm.client.LiteLLMClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final LiteLLMClient liteLLMClient;

    @PostMapping("/chat")
    public Mono<ResponseEntity<Map<String, String>>> chat(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        String model = request.getOrDefault("model", "cafe24-crm-llama");

        return liteLLMClient.chat(model, query, "You are a helpful CRM assistant.")
                .map(response -> ResponseEntity.ok(Map.of(
                        "response", response,
                        "model", model
                )))
                .onErrorReturn(ResponseEntity.internalServerError().build());
    }

    @PostMapping("/insight")
    public Mono<ResponseEntity<Map<String, String>>> generateInsight(@RequestBody Map<String, String> request) {
        String query = request.get("query");

        return liteLLMClient.generateCrmInsight(query)
                .map(insight -> ResponseEntity.ok(Map.of(
                        "insight", insight,
                        "query", query
                )))
                .onErrorReturn(ResponseEntity.internalServerError().build());
    }
}
