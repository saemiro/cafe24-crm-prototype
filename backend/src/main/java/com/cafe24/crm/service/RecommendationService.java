package com.cafe24.crm.service;

import com.cafe24.crm.dto.ProductRecommendationDTO;
import com.cafe24.crm.repository.neo4j.CrmCustomerNeo4jRepository;
import com.cafe24.crm.repository.neo4j.CrmProductNeo4jRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Recommendation Service
 *
 * Provides product recommendations using Neo4j graph relationships
 * including collaborative filtering, related products, and customer affinities.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RecommendationService {

    private final CrmProductNeo4jRepository productRepository;
    private final CrmCustomerNeo4jRepository customerRepository;

    /**
     * Get personalized product recommendations for a customer
     * Uses collaborative filtering based on similar customers' purchases
     */
    public List<ProductRecommendationDTO> getProductRecommendations(String customerId, int limit) {
        log.debug("Getting product recommendations for customer: {}", customerId);

        try {
            // Get collaborative filtering recommendations
            List<Map<String, Object>> collaborative = productRepository
                    .getProductRecommendations(customerId, limit);

            if (collaborative == null || collaborative.isEmpty()) {
                // Fall back to trending products if no collaborative data
                log.debug("No collaborative recommendations, falling back to trending");
                return getTrendingProducts(limit);
            }

            return collaborative.stream()
                    .map(this::mapToRecommendationDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting product recommendations for customer {}: {}",
                    customerId, e.getMessage(), e);
            return getTrendingProducts(limit);
        }
    }

    /**
     * Get related products (frequently bought together)
     */
    public List<ProductRecommendationDTO> getRelatedProducts(String productId, int limit) {
        log.debug("Getting related products for product: {}", productId);

        try {
            List<Map<String, Object>> related = productRepository
                    .getRelatedProducts(productId, limit);

            if (related == null || related.isEmpty()) {
                // Fall back to content-based recommendations
                log.debug("No related products, falling back to content-based");
                return getContentBasedRecommendations(productId, limit);
            }

            return related.stream()
                    .map(this::mapToRecommendationDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting related products for {}: {}",
                    productId, e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Get content-based recommendations (similar category/price)
     */
    public List<ProductRecommendationDTO> getContentBasedRecommendations(String productId, int limit) {
        log.debug("Getting content-based recommendations for product: {}", productId);

        try {
            List<Map<String, Object>> recommendations = productRepository
                    .getContentBasedRecommendations(productId, limit);

            if (recommendations == null) {
                return List.of();
            }

            return recommendations.stream()
                    .map(this::mapToRecommendationDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting content-based recommendations: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Get customer category affinities
     */
    public List<Map<String, Object>> getCustomerAffinities(String customerId) {
        log.debug("Getting customer affinities for: {}", customerId);

        try {
            List<Map<String, Object>> affinities = productRepository
                    .getCustomerAffinities(customerId);

            return affinities != null ? affinities : List.of();

        } catch (Exception e) {
            log.error("Error getting customer affinities: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Get customer brand preferences
     */
    public List<Map<String, Object>> getCustomerBrandPreferences(String customerId) {
        log.debug("Getting brand preferences for customer: {}", customerId);

        try {
            List<Map<String, Object>> preferences = productRepository
                    .getCustomerBrandPreferences(customerId);

            return preferences != null ? preferences : List.of();

        } catch (Exception e) {
            log.error("Error getting brand preferences: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Get trending products
     */
    public List<ProductRecommendationDTO> getTrendingProducts(int limit) {
        log.debug("Getting trending products, limit: {}", limit);

        try {
            List<Map<String, Object>> trending = productRepository.getTrendingProducts(limit);

            if (trending == null || trending.isEmpty()) {
                // Fall back to top selling
                return getTopSellingProducts(limit);
            }

            return trending.stream()
                    .map(this::mapToRecommendationDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting trending products: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Get top selling products
     */
    public List<ProductRecommendationDTO> getTopSellingProducts(int limit) {
        log.debug("Getting top selling products, limit: {}", limit);

        try {
            var products = productRepository.findTopSellingProducts(limit);

            if (products == null || products.isEmpty()) {
                return List.of();
            }

            return products.stream()
                    .map(p -> ProductRecommendationDTO.builder()
                            .productId(p.getProductId())
                            .name(p.getName())
                            .category(p.getCategory())
                            .price(p.getPrice())
                            .originalPrice(p.getOriginalPrice())
                            .imageUrl(p.getImageUrl())
                            .rating(p.getAvgRating())
                            .reviewCount(p.getReviewCount())
                            .recommendationType("popular")
                            .reason("베스트셀러 상품")
                            .stockStatus(p.isInStock() ? "in_stock" : "out_of_stock")
                            .build())
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting top selling products: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Get mixed recommendations (combining multiple strategies)
     */
    public List<ProductRecommendationDTO> getMixedRecommendations(
            String customerId, String productId, int limit) {
        log.debug("Getting mixed recommendations for customer: {}, product: {}",
                customerId, productId);

        List<ProductRecommendationDTO> recommendations = new ArrayList<>();
        Set<String> addedProductIds = new HashSet<>();

        try {
            int targetPerType = limit / 3;

            // 1. Collaborative filtering (if customer provided)
            if (customerId != null && !customerId.isBlank()) {
                List<ProductRecommendationDTO> collaborative =
                        getProductRecommendations(customerId, targetPerType);
                for (ProductRecommendationDTO rec : collaborative) {
                    if (addedProductIds.add(rec.getProductId())) {
                        recommendations.add(rec);
                    }
                }
            }

            // 2. Related products (if product provided)
            if (productId != null && !productId.isBlank()) {
                List<ProductRecommendationDTO> related =
                        getRelatedProducts(productId, targetPerType);
                for (ProductRecommendationDTO rec : related) {
                    if (addedProductIds.add(rec.getProductId())) {
                        recommendations.add(rec);
                    }
                }
            }

            // 3. Fill remaining with trending
            int remaining = limit - recommendations.size();
            if (remaining > 0) {
                List<ProductRecommendationDTO> trending = getTrendingProducts(remaining + 5);
                for (ProductRecommendationDTO rec : trending) {
                    if (recommendations.size() >= limit) break;
                    if (addedProductIds.add(rec.getProductId())) {
                        recommendations.add(rec);
                    }
                }
            }

            // Normalize recommendation scores
            normalizeScores(recommendations);

            return recommendations;

        } catch (Exception e) {
            log.error("Error getting mixed recommendations: {}", e.getMessage(), e);
            return getTrendingProducts(limit);
        }
    }

    /**
     * Get new products for customer (products they haven't purchased)
     */
    public List<ProductRecommendationDTO> getNewProductsForCustomer(String customerId, int limit) {
        log.debug("Getting new products for customer: {}", customerId);

        try {
            var products = productRepository.getNewProductsForCustomer(customerId, limit);

            if (products == null || products.isEmpty()) {
                return List.of();
            }

            return products.stream()
                    .map(p -> ProductRecommendationDTO.builder()
                            .productId(p.getProductId())
                            .name(p.getName())
                            .category(p.getCategory())
                            .price(p.getPrice())
                            .originalPrice(p.getOriginalPrice())
                            .imageUrl(p.getImageUrl())
                            .rating(p.getAvgRating())
                            .reviewCount(p.getReviewCount())
                            .recommendationType("discovery")
                            .reason("새로운 상품 발견")
                            .stockStatus(p.isInStock() ? "in_stock" : "out_of_stock")
                            .build())
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting new products for customer: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Get category performance for recommendation tuning
     */
    public List<Map<String, Object>> getCategoryPerformance() {
        log.debug("Getting category performance stats");

        try {
            return productRepository.getCategoryPerformance();
        } catch (Exception e) {
            log.error("Error getting category performance: {}", e.getMessage(), e);
            return List.of();
        }
    }

    // Helper methods

    private ProductRecommendationDTO mapToRecommendationDTO(Map<String, Object> data) {
        Double score = null;
        Object scoreObj = data.get("recommendationScore");
        if (scoreObj == null) scoreObj = data.get("coOccurrence");
        if (scoreObj == null) scoreObj = data.get("recentSales");
        if (scoreObj != null) {
            score = ((Number) scoreObj).doubleValue();
        }

        return ProductRecommendationDTO.builder()
                .productId((String) data.get("productId"))
                .name((String) data.get("name"))
                .category((String) data.get("category"))
                .price(data.get("price") != null ?
                        ((Number) data.get("price")).doubleValue() : null)
                .imageUrl((String) data.get("imageUrl"))
                .rating(data.get("rating") != null ?
                        ((Number) data.get("rating")).doubleValue() : null)
                .recommendationScore(score)
                .recommendationType((String) data.get("recommendationType"))
                .build();
    }

    private void normalizeScores(List<ProductRecommendationDTO> recommendations) {
        if (recommendations.isEmpty()) return;

        // Find max score
        double maxScore = recommendations.stream()
                .filter(r -> r.getRecommendationScore() != null)
                .mapToDouble(ProductRecommendationDTO::getRecommendationScore)
                .max()
                .orElse(1.0);

        if (maxScore > 0) {
            for (ProductRecommendationDTO rec : recommendations) {
                if (rec.getRecommendationScore() != null) {
                    rec.setRecommendationScore(
                            Math.round(rec.getRecommendationScore() / maxScore * 100) / 100.0);
                }
            }
        }
    }
}
