package com.cafe24.crm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

/**
 * DTO for Conversion Funnel Data
 *
 * Contains funnel metrics for visualizing the customer journey
 * from visit to purchase.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Conversion funnel analysis data")
public class FunnelDataDTO {

    @Schema(description = "Funnel stages in order")
    private List<FunnelStage> stages;

    @Schema(description = "Overall conversion rate (visitors to purchasers)", example = "3.2")
    private Double overallConversionRate;

    @Schema(description = "Total visitors/sessions", example = "125000")
    private Long totalVisitors;

    @Schema(description = "Total conversions (purchases)", example = "4000")
    private Long totalConversions;

    @Schema(description = "Average order value for conversions", example = "85000")
    private Double avgOrderValue;

    @Schema(description = "Total revenue from conversions", example = "340000000")
    private Double totalRevenue;

    @Schema(description = "Biggest drop-off stage", example = "Cart")
    private String biggestDropoff;

    @Schema(description = "Biggest drop-off rate", example = "62.5")
    private Double biggestDropoffRate;

    /**
     * Individual funnel stage
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Funnel stage data")
    public static class FunnelStage {

        @Schema(description = "Stage identifier", example = "product_view")
        private String stage;

        @Schema(description = "Display name", example = "상품 조회")
        private String label;

        @Schema(description = "Number of users at this stage", example = "85000")
        private Long count;

        @Schema(description = "Percentage of initial visitors", example = "68.0")
        private Double percentageOfTotal;

        @Schema(description = "Conversion rate from previous stage", example = "75.5")
        private Double conversionFromPrevious;

        @Schema(description = "Drop-off rate from previous stage", example = "24.5")
        private Double dropoffFromPrevious;

        @Schema(description = "Drop-off count from previous stage", example = "40000")
        private Long dropoffCount;

        @Schema(description = "Stage order (1-based)", example = "2")
        private Integer order;

        @Schema(description = "Color for visualization", example = "#4CAF50")
        private String color;

        /**
         * Get Korean label for stage
         */
        public String getLabel() {
            if (label != null) return label;
            if (stage == null) return "Unknown";

            return switch (stage.toLowerCase()) {
                case "visit", "visitors", "sessions" -> "방문";
                case "product_view", "view", "viewed" -> "상품 조회";
                case "cart", "add_to_cart", "cart_add" -> "장바구니 추가";
                case "checkout", "checkout_start" -> "결제 시작";
                case "purchase", "conversion", "order" -> "구매 완료";
                default -> stage;
            };
        }

        /**
         * Calculate drop-off rate
         */
        public Double getDropoffFromPrevious() {
            if (conversionFromPrevious == null) return null;
            return Math.round((100 - conversionFromPrevious) * 10) / 10.0;
        }
    }

    /**
     * Builder helper to calculate funnel metrics
     */
    public static FunnelDataDTO fromStages(List<FunnelStage> stages) {
        if (stages == null || stages.isEmpty()) {
            return FunnelDataDTO.builder()
                    .stages(List.of())
                    .overallConversionRate(0.0)
                    .totalVisitors(0L)
                    .totalConversions(0L)
                    .build();
        }

        Long visitors = stages.get(0).getCount();
        Long conversions = stages.get(stages.size() - 1).getCount();

        // Find biggest drop-off
        String biggestDropoff = null;
        Double biggestDropoffRate = 0.0;

        for (FunnelStage stage : stages) {
            if (stage.getDropoffFromPrevious() != null && stage.getDropoffFromPrevious() > biggestDropoffRate) {
                biggestDropoffRate = stage.getDropoffFromPrevious();
                biggestDropoff = stage.getLabel();
            }
        }

        return FunnelDataDTO.builder()
                .stages(stages)
                .totalVisitors(visitors)
                .totalConversions(conversions)
                .overallConversionRate(visitors > 0 ?
                        Math.round((double) conversions / visitors * 1000) / 10.0 : 0.0)
                .biggestDropoff(biggestDropoff)
                .biggestDropoffRate(biggestDropoffRate)
                .build();
    }
}
