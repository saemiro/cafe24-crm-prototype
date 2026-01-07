package com.cafe24.crm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;
import java.util.Map;

/**
 * DTO for Cohort Analysis Data
 *
 * Contains cohort retention data for heatmap visualization
 * showing customer retention over time by acquisition cohort.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Cohort retention analysis data")
public class CohortDataDTO {

    @Schema(description = "List of cohorts with retention data")
    private List<CohortRow> cohorts;

    @Schema(description = "Period labels (Month 0, Month 1, etc.)", example = "[\"M0\", \"M1\", \"M2\", ...]")
    private List<String> periodLabels;

    @Schema(description = "Number of periods tracked", example = "12")
    private Integer periodCount;

    @Schema(description = "Average retention rate at Month 1", example = "45.2")
    private Double avgRetentionMonth1;

    @Schema(description = "Average retention rate at Month 3", example = "32.1")
    private Double avgRetentionMonth3;

    @Schema(description = "Average retention rate at Month 6", example = "22.5")
    private Double avgRetentionMonth6;

    @Schema(description = "Average retention rate at Month 12", example = "15.3")
    private Double avgRetentionMonth12;

    @Schema(description = "Best performing cohort", example = "2024-06")
    private String bestCohort;

    @Schema(description = "Best cohort's Month 1 retention", example = "52.3")
    private Double bestCohortRetention;

    /**
     * Individual cohort row data
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Cohort row with retention percentages")
    public static class CohortRow {

        @Schema(description = "Cohort identifier (YYYY-MM)", example = "2024-06")
        private String cohort;

        @Schema(description = "Display label", example = "2024년 6월")
        private String label;

        @Schema(description = "Initial cohort size", example = "1250")
        private Integer cohortSize;

        @Schema(description = "Retention percentages by period [M0, M1, M2, ...]")
        private List<Double> retentionRates;

        @Schema(description = "Absolute counts by period [M0, M1, M2, ...]")
        private List<Integer> retentionCounts;

        @Schema(description = "Average retention across all periods", example = "35.2")
        private Double avgRetention;

        @Schema(description = "Lifetime value for this cohort", example = "125000")
        private Double cohortLtv;

        /**
         * Get display label
         */
        public String getLabel() {
            if (label != null) return label;
            if (cohort == null) return "Unknown";
            String[] parts = cohort.split("-");
            if (parts.length >= 2) {
                return parts[0] + "년 " + Integer.parseInt(parts[1]) + "월";
            }
            return cohort;
        }

        /**
         * Calculate average retention
         */
        public Double getAvgRetention() {
            if (avgRetention != null) return avgRetention;
            if (retentionRates == null || retentionRates.isEmpty()) return 0.0;

            // Skip M0 (always 100%) for average calculation
            double sum = 0;
            int count = 0;
            for (int i = 1; i < retentionRates.size(); i++) {
                if (retentionRates.get(i) != null) {
                    sum += retentionRates.get(i);
                    count++;
                }
            }
            return count > 0 ? Math.round(sum / count * 10) / 10.0 : 0.0;
        }
    }

    /**
     * Retention cell data for detailed view
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Individual retention cell data")
    public static class RetentionCell {

        @Schema(description = "Cohort identifier", example = "2024-06")
        private String cohort;

        @Schema(description = "Period number (0 = acquisition month)", example = "3")
        private Integer period;

        @Schema(description = "Number of active customers", example = "450")
        private Integer activeCount;

        @Schema(description = "Retention percentage", example = "36.0")
        private Double retentionRate;

        @Schema(description = "Revenue from cohort in this period", example = "38250000")
        private Double revenue;
    }

    /**
     * Static helper to generate period labels
     */
    public static List<String> generatePeriodLabels(int count) {
        return java.util.stream.IntStream.range(0, count)
                .mapToObj(i -> "M" + i)
                .toList();
    }
}
