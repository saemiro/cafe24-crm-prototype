package com.cafe24.crm.controller;

import com.cafe24.crm.dto.*;
import com.cafe24.crm.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Product Controller
 *
 * REST API endpoints for product data and recommendations.
 */
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Products", description = "CRM Product APIs")
@CrossOrigin(origins = {"https://crm.saemiro.com", "http://localhost:3000", "http://localhost:5173"})
public class ProductController {

    private final RecommendationService recommendationService;

    /**
     * Get related products (frequently bought together)
     */
    @GetMapping("/{productId}/related")
    @Operation(
            summary = "Get related products",
            description = "Returns products frequently purchased together with the specified product"
    )
    public ResponseEntity<ApiResponse<List<ProductRecommendationDTO>>> getRelatedProducts(
            @Parameter(description = "Product ID", required = true)
            @PathVariable String productId,

            @Parameter(description = "Maximum results")
            @RequestParam(defaultValue = "10") int limit
    ) {
        log.info("GET /products/{}/related?limit={}", productId, limit);

        try {
            limit = Math.max(1, Math.min(limit, 50));
            List<ProductRecommendationDTO> related =
                    recommendationService.getRelatedProducts(productId, limit);
            return ResponseEntity.ok(ApiResponse.success(related));
        } catch (Exception e) {
            log.error("Error getting related products for {}: {}", productId, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("RELATED_ERROR", "Failed to fetch related products"));
        }
    }

    /**
     * Get content-based recommendations (similar products)
     */
    @GetMapping("/{productId}/similar")
    @Operation(
            summary = "Get similar products",
            description = "Returns products similar to the specified product based on category and price"
    )
    public ResponseEntity<ApiResponse<List<ProductRecommendationDTO>>> getSimilarProducts(
            @Parameter(description = "Product ID", required = true)
            @PathVariable String productId,

            @Parameter(description = "Maximum results")
            @RequestParam(defaultValue = "10") int limit
    ) {
        log.info("GET /products/{}/similar?limit={}", productId, limit);

        try {
            limit = Math.max(1, Math.min(limit, 50));
            List<ProductRecommendationDTO> similar =
                    recommendationService.getContentBasedRecommendations(productId, limit);
            return ResponseEntity.ok(ApiResponse.success(similar));
        } catch (Exception e) {
            log.error("Error getting similar products for {}: {}", productId, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("SIMILAR_ERROR", "Failed to fetch similar products"));
        }
    }

    /**
     * Get trending products
     */
    @GetMapping("/trending")
    @Operation(
            summary = "Get trending products",
            description = "Returns currently trending products based on recent sales"
    )
    public ResponseEntity<ApiResponse<List<ProductRecommendationDTO>>> getTrendingProducts(
            @Parameter(description = "Maximum results")
            @RequestParam(defaultValue = "10") int limit
    ) {
        log.info("GET /products/trending?limit={}", limit);

        try {
            limit = Math.max(1, Math.min(limit, 50));
            List<ProductRecommendationDTO> trending =
                    recommendationService.getTrendingProducts(limit);
            return ResponseEntity.ok(ApiResponse.success(trending));
        } catch (Exception e) {
            log.error("Error getting trending products: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("TRENDING_ERROR", "Failed to fetch trending products"));
        }
    }

    /**
     * Get top selling products
     */
    @GetMapping("/top-selling")
    @Operation(
            summary = "Get top selling products",
            description = "Returns best-selling products of all time"
    )
    public ResponseEntity<ApiResponse<List<ProductRecommendationDTO>>> getTopSellingProducts(
            @Parameter(description = "Maximum results")
            @RequestParam(defaultValue = "10") int limit
    ) {
        log.info("GET /products/top-selling?limit={}", limit);

        try {
            limit = Math.max(1, Math.min(limit, 50));
            List<ProductRecommendationDTO> topSelling =
                    recommendationService.getTopSellingProducts(limit);
            return ResponseEntity.ok(ApiResponse.success(topSelling));
        } catch (Exception e) {
            log.error("Error getting top selling products: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("TOP_SELLING_ERROR", "Failed to fetch top selling products"));
        }
    }

    /**
     * Get category performance statistics
     */
    @GetMapping("/categories/performance")
    @Operation(
            summary = "Get category performance",
            description = "Returns sales performance statistics by product category"
    )
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getCategoryPerformance() {
        log.info("GET /products/categories/performance");

        try {
            List<Map<String, Object>> performance =
                    recommendationService.getCategoryPerformance();
            return ResponseEntity.ok(ApiResponse.success(performance));
        } catch (Exception e) {
            log.error("Error getting category performance: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("CATEGORY_ERROR", "Failed to fetch category performance"));
        }
    }

    /**
     * Get combined recommendations for product page
     */
    @GetMapping("/{productId}/recommendations")
    @Operation(
            summary = "Get product page recommendations",
            description = "Returns combined recommendations for a product detail page (related + similar)"
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductRecommendations(
            @Parameter(description = "Product ID", required = true)
            @PathVariable String productId,

            @Parameter(description = "Maximum results per type")
            @RequestParam(defaultValue = "6") int limit
    ) {
        log.info("GET /products/{}/recommendations?limit={}", productId, limit);

        try {
            limit = Math.max(1, Math.min(limit, 20));

            List<ProductRecommendationDTO> related =
                    recommendationService.getRelatedProducts(productId, limit);
            List<ProductRecommendationDTO> similar =
                    recommendationService.getContentBasedRecommendations(productId, limit);

            Map<String, Object> recommendations = Map.of(
                    "frequentlyBoughtTogether", related,
                    "similarProducts", similar
            );

            return ResponseEntity.ok(ApiResponse.success(recommendations));
        } catch (Exception e) {
            log.error("Error getting product recommendations: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("RECOMMENDATIONS_ERROR", "Failed to fetch recommendations"));
        }
    }
}
