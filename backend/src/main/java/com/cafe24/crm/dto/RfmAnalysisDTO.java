package com.cafe24.crm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;
import java.util.Map;

/**
 * DTO for RFM Analysis Data
 *
 * Contains Recency-Frequency-Monetary analysis data for
 * customer segmentation heatmaps and matrices.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "RFM (Recency, Frequency, Monetary) analysis data")
public class RfmAnalysisDTO {

    @Schema(description = "RFM distribution data points")
    private List<RfmDataPoint> distribution;

    @Schema(description = "RFM segment summary")
    private List<RfmSegment> segments;

    @Schema(description = "RFM matrix for heatmap (R x F)")
    private List<List<Integer>> matrix;

    @Schema(description = "Recency labels (row headers)", example = "[\"5\", \"4\", \"3\", \"2\", \"1\"]")
    private List<String> recencyLabels;

    @Schema(description = "Frequency labels (column headers)", example = "[\"1\", \"2\", \"3\", \"4\", \"5\"]")
    private List<String> frequencyLabels;

    @Schema(description = "Total customers analyzed", example = "15420")
    private Long totalCustomers;

    @Schema(description = "Average recency score", example = "3.2")
    private Double avgRecency;

    @Schema(description = "Average frequency score", example = "2.8")
    private Double avgFrequency;

    @Schema(description = "Average monetary score", example = "3.1")
    private Double avgMonetary;

    /**
     * RFM data point for 3D visualization
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "RFM data point")
    public static class RfmDataPoint {

        @Schema(description = "Recency score (1-5)", example = "4")
        private Integer recency;

        @Schema(description = "Frequency score (1-5)", example = "3")
        private Integer frequency;

        @Schema(description = "Monetary score (1-5)", example = "5")
        private Integer monetary;

        @Schema(description = "Number of customers with this RFM combination", example = "245")
        private Integer customerCount;

        @Schema(description = "Combined RFM score string", example = "435")
        private String rfmScore;

        @Schema(description = "Derived segment name", example = "Champions")
        private String segmentName;

        /**
         * Get combined RFM score string
         */
        public String getRfmScore() {
            if (rfmScore != null) return rfmScore;
            return String.valueOf(recency != null ? recency : 0)
                    + (frequency != null ? frequency : 0)
                    + (monetary != null ? monetary : 0);
        }

        /**
         * Derive segment name from RFM scores
         */
        public String getSegmentName() {
            if (segmentName != null) return segmentName;
            int r = recency != null ? recency : 0;
            int f = frequency != null ? frequency : 0;
            int m = monetary != null ? monetary : 0;

            if (r >= 4 && f >= 4 && m >= 4) return "Champions";
            if (r >= 4 && f >= 3 && m >= 3) return "Loyal";
            if (r >= 4 && f <= 2) return "New Customers";
            if (r >= 3 && f >= 3) return "Potential Loyalists";
            if (r <= 2 && f >= 4 && m >= 4) return "At Risk - High Value";
            if (r <= 2 && f >= 3) return "At Risk";
            if (r <= 2 && f <= 2 && m <= 2) return "Lost";
            return "Regular";
        }
    }

    /**
     * RFM segment summary
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "RFM segment summary")
    public static class RfmSegment {

        @Schema(description = "Segment name", example = "Champions")
        private String segment;

        @Schema(description = "Display label in Korean", example = "챔피언")
        private String label;

        @Schema(description = "Segment description", example = "최근 구매, 자주 구매, 많이 지출하는 최고 가치 고객")
        private String description;

        @Schema(description = "Number of customers", example = "1520")
        private Integer customerCount;

        @Schema(description = "Percentage of total", example = "9.9")
        private Double percentage;

        @Schema(description = "Total revenue from segment", example = "450000000")
        private Double totalRevenue;

        @Schema(description = "Average CLV", example = "296052")
        private Double avgClv;

        @Schema(description = "Recommended action", example = "Reward them. They can become evangelists")
        private String recommendedAction;

        @Schema(description = "Color for visualization", example = "#4CAF50")
        private String color;

        /**
         * Get Korean label for segment
         */
        public String getLabel() {
            if (label != null) return label;
            if (segment == null) return "Unknown";

            return switch (segment) {
                case "Champions" -> "챔피언";
                case "Loyal" -> "충성 고객";
                case "Potential Loyalists" -> "잠재 충성 고객";
                case "New Customers" -> "신규 고객";
                case "Promising" -> "유망 고객";
                case "Needs Attention" -> "관심 필요";
                case "About to Sleep" -> "이탈 조짐";
                case "At Risk" -> "이탈 위험";
                case "At Risk - High Value" -> "고가치 이탈 위험";
                case "Can't Lose" -> "놓치면 안되는 고객";
                case "Hibernating" -> "휴면 고객";
                case "Lost" -> "이탈 고객";
                default -> segment;
            };
        }

        /**
         * Get recommended action for segment
         */
        public String getRecommendedAction() {
            if (recommendedAction != null) return recommendedAction;
            if (segment == null) return "";

            return switch (segment) {
                case "Champions" -> "보상 프로그램, 추천인 혜택, VIP 전용 상품";
                case "Loyal" -> "업셀링, 크로스셀링, 충성도 프로그램";
                case "Potential Loyalists" -> "멤버십 가입 유도, 번들 할인";
                case "New Customers" -> "온보딩 이메일, 첫 구매 할인";
                case "At Risk" -> "재방문 유도 캠페인, 개인화 오퍼";
                case "At Risk - High Value" -> "긴급 윈백 캠페인, 1:1 연락";
                case "Hibernating" -> "재활성화 캠페인, 대폭 할인";
                case "Lost" -> "설문조사, 재가입 특별 혜택";
                default -> "분석 필요";
            };
        }
    }
}
