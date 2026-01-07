package com.cafe24.crm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

/**
 * DTO for Customer Segment Distribution
 *
 * Contains segment breakdown data for pie/donut charts showing
 * customer distribution across different segments.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Customer segment distribution for charts")
public class SegmentDistributionDTO {

    @Schema(description = "List of segment data")
    private List<SegmentData> segments;

    @Schema(description = "Total customer count", example = "15420")
    private Long totalCustomers;

    @Schema(description = "Number of distinct segments", example = "6")
    private Integer segmentCount;

    @Schema(description = "Largest segment name", example = "VIP")
    private String largestSegment;

    @Schema(description = "Largest segment percentage", example = "35.5")
    private Double largestSegmentPercentage;

    /**
     * Individual segment data
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Segment data for charts")
    public static class SegmentData {

        @Schema(description = "Segment name", example = "VIP")
        private String segment;

        @Schema(description = "Display label for segment", example = "VIP 고객")
        private String label;

        @Schema(description = "Number of customers in segment", example = "5478")
        private Long count;

        @Schema(description = "Percentage of total customers", example = "35.5")
        private Double percentage;

        @Schema(description = "Total revenue from this segment", example = "750000000")
        private Double totalRevenue;

        @Schema(description = "Average revenue per customer in segment", example = "137000")
        private Double avgRevenue;

        @Schema(description = "Average CLV for this segment", example = "450000")
        private Double avgClv;

        @Schema(description = "Color code for chart (hex)", example = "#4CAF50")
        private String color;

        /**
         * Get display label for segment
         */
        public String getLabel() {
            if (label != null) return label;
            if (segment == null) return "Unknown";

            return switch (segment.toLowerCase()) {
                case "vip" -> "VIP 고객";
                case "premium" -> "프리미엄";
                case "regular" -> "일반 고객";
                case "new" -> "신규 고객";
                case "at-risk", "at_risk", "atrisk" -> "이탈 위험";
                case "churned" -> "이탈 고객";
                case "champions" -> "챔피언";
                case "loyal" -> "충성 고객";
                case "hibernating" -> "휴면 고객";
                default -> segment;
            };
        }

        /**
         * Get color for segment
         */
        public String getColor() {
            if (color != null) return color;
            if (segment == null) return "#9E9E9E";

            return switch (segment.toLowerCase()) {
                case "vip", "champions" -> "#4CAF50";
                case "premium", "loyal" -> "#2196F3";
                case "regular" -> "#FF9800";
                case "new" -> "#00BCD4";
                case "at-risk", "at_risk", "atrisk" -> "#FF5722";
                case "churned" -> "#F44336";
                case "hibernating" -> "#9E9E9E";
                default -> "#607D8B";
            };
        }
    }
}
