package com.cafe24.crm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

/**
 * DTO for Product Recommendation
 *
 * Contains recommended product information with
 * recommendation score and type.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Product recommendation")
public class ProductRecommendationDTO {

    @Schema(description = "Product ID", example = "PROD-001234")
    private String productId;

    @Schema(description = "Product name", example = "프리미엄 니트 스웨터")
    private String name;

    @Schema(description = "Product category", example = "패션/의류")
    private String category;

    @Schema(description = "Product price", example = "89000")
    private Double price;

    @Schema(description = "Formatted price", example = "89,000원")
    private String formattedPrice;

    @Schema(description = "Original price (if discounted)", example = "129000")
    private Double originalPrice;

    @Schema(description = "Product image URL")
    private String imageUrl;

    @Schema(description = "Average rating (1-5)", example = "4.5")
    private Double rating;

    @Schema(description = "Number of reviews", example = "127")
    private Integer reviewCount;

    @Schema(description = "Recommendation score (higher = more relevant)", example = "0.85")
    private Double recommendationScore;

    @Schema(description = "Recommendation type", example = "collaborative")
    private String recommendationType;

    @Schema(description = "Recommendation reason", example = "비슷한 고객들이 구매했습니다")
    private String reason;

    @Schema(description = "Is currently on sale", example = "true")
    private Boolean onSale;

    @Schema(description = "Discount percentage", example = "31")
    private Integer discountPercent;

    @Schema(description = "Stock status", example = "in_stock")
    private String stockStatus;

    /**
     * Get formatted price
     */
    public String getFormattedPrice() {
        if (price == null) return "가격 미정";
        return String.format("%,.0f원", price);
    }

    /**
     * Get discount percentage
     */
    public Integer getDiscountPercent() {
        if (originalPrice == null || price == null || originalPrice <= 0) {
            return 0;
        }
        return (int) Math.round((originalPrice - price) / originalPrice * 100);
    }

    /**
     * Check if product is on sale
     */
    public Boolean getOnSale() {
        return originalPrice != null && price != null && price < originalPrice;
    }

    /**
     * Get recommendation reason based on type
     */
    public String getReason() {
        if (reason != null) return reason;
        if (recommendationType == null) return "";

        return switch (recommendationType.toLowerCase()) {
            case "collaborative" -> "비슷한 고객들이 구매했습니다";
            case "frequently_bought_together" -> "함께 많이 구매하는 상품";
            case "content_based" -> "관심 있을 만한 상품";
            case "trending" -> "현재 인기 상품";
            case "personalized" -> "고객님을 위한 추천";
            case "similar" -> "비슷한 상품";
            case "upsell" -> "업그레이드 추천";
            case "cross_sell" -> "함께 보면 좋은 상품";
            default -> "추천 상품";
        };
    }

    /**
     * Get display label for recommendation type
     */
    public String getRecommendationTypeLabel() {
        if (recommendationType == null) return "추천";

        return switch (recommendationType.toLowerCase()) {
            case "collaborative" -> "협업 필터링";
            case "frequently_bought_together" -> "연관 상품";
            case "content_based" -> "컨텐츠 기반";
            case "trending" -> "트렌딩";
            case "personalized" -> "개인화";
            case "similar" -> "유사 상품";
            default -> recommendationType;
        };
    }
}
