package com.cafe24.crm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

/**
 * DTO for Customer Lifetime Value Prediction
 *
 * Contains CLV analysis data including predicted values,
 * distribution, and segment breakdowns.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Customer Lifetime Value prediction and analysis")
public class ClvPredictionDTO {

    @Schema(description = "Average CLV across all customers", example = "450000")
    private Double avgClv;

    @Schema(description = "Formatted average CLV", example = "45만원")
    private String formattedAvgClv;

    @Schema(description = "Median CLV", example = "320000")
    private Double medianClv;

    @Schema(description = "Total predicted lifetime value", example = "6930000000")
    private Double totalClv;

    @Schema(description = "Formatted total CLV", example = "69.3억원")
    private String formattedTotalClv;

    @Schema(description = "Maximum CLV customer value", example = "5500000")
    private Double maxClv;

    @Schema(description = "Minimum CLV customer value", example = "15000")
    private Double minClv;

    @Schema(description = "Standard deviation of CLV", example = "280000")
    private Double stdDevClv;

    @Schema(description = "CLV distribution by ranges")
    private List<ClvRange> distribution;

    @Schema(description = "CLV by customer segment")
    private List<SegmentClv> segmentClv;

    @Schema(description = "Top CLV customers")
    private List<TopCustomerClv> topCustomers;

    @Schema(description = "CLV prediction model info")
    private ModelInfo modelInfo;

    /**
     * CLV distribution range
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "CLV distribution range")
    public static class ClvRange {

        @Schema(description = "Range identifier", example = "high")
        private String range;

        @Schema(description = "Range label", example = "100만원 이상")
        private String label;

        @Schema(description = "Minimum value in range", example = "1000000")
        private Double minValue;

        @Schema(description = "Maximum value in range", example = "10000000")
        private Double maxValue;

        @Schema(description = "Number of customers in range", example = "1520")
        private Integer customerCount;

        @Schema(description = "Percentage of total customers", example = "9.9")
        private Double percentage;

        @Schema(description = "Total CLV in this range", example = "2280000000")
        private Double totalClv;

        @Schema(description = "Color for visualization", example = "#4CAF50")
        private String color;
    }

    /**
     * CLV by segment
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "CLV statistics by segment")
    public static class SegmentClv {

        @Schema(description = "Segment name", example = "VIP")
        private String segment;

        @Schema(description = "Average CLV for segment", example = "850000")
        private Double avgClv;

        @Schema(description = "Formatted average CLV", example = "85만원")
        private String formattedAvgClv;

        @Schema(description = "Total CLV for segment", example = "1275000000")
        private Double totalClv;

        @Schema(description = "Customer count in segment", example = "1500")
        private Integer customerCount;

        @Schema(description = "Percentage of total CLV", example = "18.4")
        private Double clvPercentage;

        /**
         * Format average CLV
         */
        public String getFormattedAvgClv() {
            return formatCurrency(avgClv);
        }

        private String formatCurrency(Double amount) {
            if (amount == null) return "0원";
            if (amount >= 10000) {
                return String.format("%.0f만원", amount / 10000);
            }
            return String.format("%,.0f원", amount);
        }
    }

    /**
     * Top customer by CLV
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Top customer CLV entry")
    public static class TopCustomerClv {

        @Schema(description = "Customer ID", example = "CUST-001234")
        private String customerId;

        @Schema(description = "Customer name", example = "김철수")
        private String name;

        @Schema(description = "Customer segment", example = "VIP")
        private String segment;

        @Schema(description = "Predicted CLV", example = "5500000")
        private Double clv;

        @Schema(description = "Formatted CLV", example = "550만원")
        private String formattedClv;

        @Schema(description = "Total orders placed", example = "45")
        private Integer totalOrders;

        @Schema(description = "Total revenue so far", example = "4250000")
        private Double totalRevenue;

        @Schema(description = "CLV realization percentage", example = "77.3")
        private Double realizationRate;

        /**
         * Format CLV
         */
        public String getFormattedClv() {
            if (clv == null) return "0원";
            if (clv >= 10000) {
                return String.format("%.0f만원", clv / 10000);
            }
            return String.format("%,.0f원", clv);
        }

        /**
         * Calculate realization rate
         */
        public Double getRealizationRate() {
            if (clv == null || clv == 0 || totalRevenue == null) return 0.0;
            return Math.round(totalRevenue / clv * 1000) / 10.0;
        }
    }

    /**
     * Model information
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "CLV prediction model information")
    public static class ModelInfo {

        @Schema(description = "Model type", example = "BG/NBD + Gamma-Gamma")
        private String modelType;

        @Schema(description = "Model version", example = "1.2.0")
        private String version;

        @Schema(description = "Last training date", example = "2024-12-15")
        private String lastTrainedDate;

        @Schema(description = "Prediction horizon in months", example = "12")
        private Integer predictionHorizonMonths;

        @Schema(description = "Model accuracy (R-squared)", example = "0.85")
        private Double accuracy;

        @Schema(description = "Training data points", example = "15420")
        private Integer trainingDataPoints;
    }

    /**
     * Format average CLV
     */
    public String getFormattedAvgClv() {
        return formatCurrency(avgClv);
    }

    /**
     * Format total CLV
     */
    public String getFormattedTotalClv() {
        if (totalClv == null) return "0원";
        if (totalClv >= 100000000) {
            return String.format("%.1f억원", totalClv / 100000000);
        }
        return formatCurrency(totalClv);
    }

    private String formatCurrency(Double amount) {
        if (amount == null) return "0원";
        if (amount >= 10000) {
            return String.format("%.0f만원", amount / 10000);
        }
        return String.format("%,.0f원", amount);
    }
}
