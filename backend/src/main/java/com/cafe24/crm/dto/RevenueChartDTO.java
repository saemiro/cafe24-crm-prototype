package com.cafe24.crm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

/**
 * DTO for Revenue Time Series Chart Data
 *
 * Contains monthly revenue data for line/bar charts showing
 * revenue trends over time.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Revenue time series chart data")
public class RevenueChartDTO {

    @Schema(description = "List of monthly data points")
    private List<MonthlyData> data;

    @Schema(description = "Total revenue for the period", example = "1250000000")
    private Double totalRevenue;

    @Schema(description = "Total orders for the period", example = "45230")
    private Long totalOrders;

    @Schema(description = "Average monthly revenue", example = "104166666")
    private Double averageMonthlyRevenue;

    @Schema(description = "Highest revenue month", example = "2024-12")
    private String peakMonth;

    @Schema(description = "Peak month revenue", example = "150000000")
    private Double peakRevenue;

    @Schema(description = "Trend direction (up, down, stable)", example = "up")
    private String trend;

    @Schema(description = "Growth rate from first to last month", example = "15.5")
    private Double growthRate;

    /**
     * Monthly revenue data point
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Monthly revenue data point")
    public static class MonthlyData {

        @Schema(description = "Month in YYYY-MM format", example = "2024-12")
        private String month;

        @Schema(description = "Display label for the month", example = "12월")
        private String label;

        @Schema(description = "Total revenue for the month", example = "125000000")
        private Double revenue;

        @Schema(description = "Number of orders in the month", example = "4500")
        private Long orderCount;

        @Schema(description = "Average order value for the month", example = "27778")
        private Double avgOrderValue;

        @Schema(description = "Month-over-month growth percentage", example = "5.2")
        private Double growth;

        /**
         * Get display label from month string
         */
        public String getLabel() {
            if (month == null || month.length() < 7) return month;
            String[] parts = month.split("-");
            if (parts.length >= 2) {
                return parts[1] + "월";
            }
            return month;
        }
    }

    /**
     * Calculate trend based on data
     */
    public String getTrend() {
        if (data == null || data.size() < 2) return "stable";
        int upCount = 0;
        int downCount = 0;
        for (int i = 1; i < data.size(); i++) {
            if (data.get(i).getRevenue() != null && data.get(i - 1).getRevenue() != null) {
                if (data.get(i).getRevenue() > data.get(i - 1).getRevenue()) {
                    upCount++;
                } else if (data.get(i).getRevenue() < data.get(i - 1).getRevenue()) {
                    downCount++;
                }
            }
        }
        if (upCount > downCount + 1) return "up";
        if (downCount > upCount + 1) return "down";
        return "stable";
    }
}
