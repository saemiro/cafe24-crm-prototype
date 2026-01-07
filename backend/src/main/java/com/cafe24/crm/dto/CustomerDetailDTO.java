package com.cafe24.crm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for Customer 360 View
 *
 * Contains comprehensive customer information including
 * profile, order history, RFM scores, and behavior patterns.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Customer 360 degree view")
public class CustomerDetailDTO {

    // Basic Profile
    @Schema(description = "Internal ID")
    private String id;

    @Schema(description = "Customer ID", example = "CUST-001234")
    private String customerId;

    @Schema(description = "Customer name", example = "김철수")
    private String name;

    @Schema(description = "Email address", example = "customer@example.com")
    private String email;

    @Schema(description = "Phone number", example = "010-1234-5678")
    private String phone;

    @Schema(description = "Customer segment", example = "VIP")
    private String segment;

    @Schema(description = "Customer tier", example = "Gold")
    private String tier;

    @Schema(description = "Customer status", example = "active")
    private String status;

    // RFM Analysis
    @Schema(description = "Combined RFM score", example = "454")
    private String rfmScore;

    @Schema(description = "Recency score (1-5)", example = "4")
    private Integer recency;

    @Schema(description = "Frequency score (1-5)", example = "5")
    private Integer frequency;

    @Schema(description = "Monetary score (1-5)", example = "4")
    private Integer monetary;

    @Schema(description = "RFM segment name", example = "Champions")
    private String rfmSegment;

    // Financial Metrics
    @Schema(description = "Total number of orders", example = "23")
    private Integer totalOrders;

    @Schema(description = "Total revenue generated", example = "2350000")
    private Double totalRevenue;

    @Schema(description = "Formatted total revenue", example = "235만원")
    private String formattedRevenue;

    @Schema(description = "Average order value", example = "102174")
    private Double avgOrderValue;

    @Schema(description = "Customer lifetime value prediction", example = "3500000")
    private Double clv;

    @Schema(description = "Formatted CLV", example = "350만원")
    private String formattedClv;

    // Behavioral Metrics
    @Schema(description = "Days since last purchase", example = "15")
    private Integer daysSinceLastPurchase;

    @Schema(description = "First order date")
    private LocalDate firstOrderDate;

    @Schema(description = "Last order date")
    private LocalDate lastOrderDate;

    @Schema(description = "Churn probability (0-1)", example = "0.15")
    private Double churnProbability;

    @Schema(description = "Churn risk level", example = "Low")
    private String churnRisk;

    // Preferences
    @Schema(description = "Preferred product category", example = "패션/의류")
    private String preferredCategory;

    @Schema(description = "Top purchased brands")
    private List<String> preferredBrands;

    @Schema(description = "Preferred purchase channel", example = "mobile")
    private String preferredChannel;

    // Timestamps
    @Schema(description = "Customer creation date")
    private LocalDateTime createdAt;

    @Schema(description = "Last profile update")
    private LocalDateTime updatedAt;

    // Related Data
    @Schema(description = "Recent orders (last 5)")
    private List<OrderSummary> recentOrders;

    @Schema(description = "Product recommendations")
    private List<ProductRecommendationDTO> recommendations;

    @Schema(description = "Category affinities")
    private List<CategoryAffinity> categoryAffinities;

    /**
     * Order summary for customer detail view
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Order summary")
    public static class OrderSummary {

        @Schema(description = "Order ID", example = "ORD-2024-001234")
        private String orderId;

        @Schema(description = "Order date")
        private LocalDate orderDate;

        @Schema(description = "Total amount", example = "125000")
        private Double totalAmount;

        @Schema(description = "Formatted amount", example = "125,000원")
        private String formattedAmount;

        @Schema(description = "Order status", example = "delivered")
        private String status;

        @Schema(description = "Number of items", example = "3")
        private Integer itemCount;

        @Schema(description = "Product names (comma-separated)")
        private String productNames;

        /**
         * Format amount for display
         */
        public String getFormattedAmount() {
            if (totalAmount == null) return "0원";
            return String.format("%,.0f원", totalAmount);
        }
    }

    /**
     * Category affinity data
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Category purchase affinity")
    public static class CategoryAffinity {

        @Schema(description = "Category name", example = "패션/의류")
        private String category;

        @Schema(description = "Number of purchases in category", example = "12")
        private Integer purchaseCount;

        @Schema(description = "Total spent in category", example = "1250000")
        private Double totalSpent;

        @Schema(description = "Percentage of total purchases", example = "52.2")
        private Double percentage;
    }

    /**
     * Get formatted revenue
     */
    public String getFormattedRevenue() {
        return formatCurrency(totalRevenue);
    }

    /**
     * Get formatted CLV
     */
    public String getFormattedClv() {
        return formatCurrency(clv);
    }

    /**
     * Get churn risk level
     */
    public String getChurnRisk() {
        if (churnProbability == null) return "Unknown";
        if (churnProbability < 0.3) return "Low";
        if (churnProbability < 0.6) return "Medium";
        return "High";
    }

    /**
     * Get RFM segment from scores
     */
    public String getRfmSegment() {
        if (rfmSegment != null) return rfmSegment;
        if (recency == null || frequency == null || monetary == null) return "Unknown";

        int r = recency;
        int f = frequency;
        int m = monetary;

        if (r >= 4 && f >= 4 && m >= 4) return "Champions";
        if (r >= 4 && f >= 3 && m >= 3) return "Loyal";
        if (r >= 4 && f <= 2) return "New Customers";
        if (r <= 2 && f >= 4 && m >= 4) return "At Risk - High Value";
        if (r <= 2 && f >= 3) return "At Risk";
        if (r <= 2 && f <= 2) return "Hibernating";
        return "Regular";
    }

    private String formatCurrency(Double amount) {
        if (amount == null) return "0원";
        if (amount >= 100000000) {
            return String.format("%.1f억원", amount / 100000000);
        } else if (amount >= 10000) {
            return String.format("%.0f만원", amount / 10000);
        }
        return String.format("%,.0f원", amount);
    }
}
