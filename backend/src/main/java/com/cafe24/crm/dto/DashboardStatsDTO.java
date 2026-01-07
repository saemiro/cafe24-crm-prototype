package com.cafe24.crm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

/**
 * DTO for Dashboard Statistics Overview
 *
 * Contains aggregated metrics for the main dashboard view including
 * customer counts, order totals, revenue, and key performance indicators.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dashboard statistics overview")
public class DashboardStatsDTO {

    @Schema(description = "Total number of customers", example = "15420")
    private Long totalCustomers;

    @Schema(description = "Number of active customers (ordered in last 90 days)", example = "3250")
    private Long activeCustomers;

    @Schema(description = "Total number of orders", example = "45230")
    private Long totalOrders;

    @Schema(description = "Total revenue in KRW", example = "1250000000")
    private Double totalRevenue;

    @Schema(description = "Formatted total revenue", example = "12.5억")
    private String formattedRevenue;

    @Schema(description = "Average order value", example = "85000")
    private Double averageOrderValue;

    @Schema(description = "Number of distinct customer segments", example = "6")
    private Integer segmentCount;

    @Schema(description = "Average customer lifetime value", example = "450000")
    private Double averageClv;

    @Schema(description = "Repeat purchase rate percentage", example = "32.5")
    private Double repeatPurchaseRate;

    @Schema(description = "New customers this month", example = "145")
    private Long newCustomersThisMonth;

    @Schema(description = "Revenue growth percentage (month over month)", example = "12.5")
    private Double revenueGrowth;

    @Schema(description = "Order growth percentage (month over month)", example = "8.3")
    private Double orderGrowth;

    @Schema(description = "Active customer percentage", example = "21.1")
    private Double activeCustomerPercentage;

    @Schema(description = "Total products in catalog", example = "2500")
    private Long totalProducts;

    @Schema(description = "At-risk customer count (high churn probability)", example = "230")
    private Long atRiskCustomers;

    /**
     * Format revenue for display
     */
    public String getFormattedRevenue() {
        if (totalRevenue == null) return "0";
        if (totalRevenue >= 100000000) {
            return String.format("%.1f억", totalRevenue / 100000000);
        } else if (totalRevenue >= 10000) {
            return String.format("%.0f만", totalRevenue / 10000);
        }
        return String.format("%.0f", totalRevenue);
    }

    /**
     * Calculate active customer percentage
     */
    public Double getActiveCustomerPercentage() {
        if (totalCustomers == null || totalCustomers == 0 || activeCustomers == null) {
            return 0.0;
        }
        return Math.round((double) activeCustomers / totalCustomers * 1000) / 10.0;
    }
}
