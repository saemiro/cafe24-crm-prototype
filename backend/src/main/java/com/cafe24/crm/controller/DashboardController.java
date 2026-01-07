package com.cafe24.crm.controller;

import com.cafe24.crm.dto.*;
import com.cafe24.crm.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Dashboard Controller
 *
 * REST API endpoints for CRM dashboard data including
 * statistics, charts, and recent activity.
 */
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Dashboard", description = "CRM Dashboard APIs")
@CrossOrigin(origins = {"https://crm.saemiro.com", "http://localhost:3000", "http://localhost:5173"})
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Get overall dashboard statistics
     */
    @GetMapping("/stats")
    @Operation(
            summary = "Get dashboard statistics",
            description = "Returns aggregated statistics including total customers, orders, revenue, and key metrics"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Statistics retrieved successfully",
                    content = @Content(schema = @Schema(implementation = DashboardStatsDTO.class))
            )
    })
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        log.info("GET /dashboard/stats - Fetching dashboard statistics");

        try {
            DashboardStatsDTO stats = dashboardService.getDashboardStats();
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            log.error("Error fetching dashboard stats: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("DASHBOARD_ERROR", "Failed to fetch dashboard statistics"));
        }
    }

    /**
     * Get revenue time series chart data
     */
    @GetMapping("/revenue-chart")
    @Operation(
            summary = "Get revenue chart data",
            description = "Returns monthly revenue time series data for line/bar charts"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Revenue data retrieved successfully",
                    content = @Content(schema = @Schema(implementation = RevenueChartDTO.class))
            )
    })
    public ResponseEntity<ApiResponse<RevenueChartDTO>> getRevenueChart(
            @Parameter(description = "Number of months to include (default: 12)")
            @RequestParam(defaultValue = "12") int months
    ) {
        log.info("GET /dashboard/revenue-chart?months={}", months);

        try {
            // Limit to reasonable range
            months = Math.max(1, Math.min(months, 24));
            RevenueChartDTO chartData = dashboardService.getRevenueTimeSeries(months);
            return ResponseEntity.ok(ApiResponse.success(chartData));
        } catch (Exception e) {
            log.error("Error fetching revenue chart: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("CHART_ERROR", "Failed to fetch revenue chart data"));
        }
    }

    /**
     * Get customer segment distribution for pie chart
     */
    @GetMapping("/segment-distribution")
    @Operation(
            summary = "Get segment distribution",
            description = "Returns customer segment distribution data for pie/donut charts"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Segment data retrieved successfully",
                    content = @Content(schema = @Schema(implementation = SegmentDistributionDTO.class))
            )
    })
    public ResponseEntity<ApiResponse<SegmentDistributionDTO>> getSegmentDistribution() {
        log.info("GET /dashboard/segment-distribution");

        try {
            SegmentDistributionDTO distribution = dashboardService.getCustomerSegmentDistribution();
            return ResponseEntity.ok(ApiResponse.success(distribution));
        } catch (Exception e) {
            log.error("Error fetching segment distribution: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("SEGMENT_ERROR", "Failed to fetch segment distribution"));
        }
    }

    /**
     * Get recent orders list
     */
    @GetMapping("/recent-orders")
    @Operation(
            summary = "Get recent orders",
            description = "Returns list of most recent orders with customer information"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Recent orders retrieved successfully"
            )
    })
    public ResponseEntity<ApiResponse<List<RecentOrderDTO>>> getRecentOrders(
            @Parameter(description = "Maximum number of orders to return (default: 10)")
            @RequestParam(defaultValue = "10") int limit
    ) {
        log.info("GET /dashboard/recent-orders?limit={}", limit);

        try {
            // Limit to reasonable range
            limit = Math.max(1, Math.min(limit, 50));
            List<RecentOrderDTO> orders = dashboardService.getRecentOrders(limit);
            return ResponseEntity.ok(ApiResponse.success(orders));
        } catch (Exception e) {
            log.error("Error fetching recent orders: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("ORDERS_ERROR", "Failed to fetch recent orders"));
        }
    }

    /**
     * Get top customers by revenue
     */
    @GetMapping("/top-customers")
    @Operation(
            summary = "Get top customers",
            description = "Returns list of top customers ranked by total revenue"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Top customers retrieved successfully"
            )
    })
    public ResponseEntity<ApiResponse<List<CustomerDetailDTO>>> getTopCustomers(
            @Parameter(description = "Maximum number of customers to return (default: 10)")
            @RequestParam(defaultValue = "10") int limit
    ) {
        log.info("GET /dashboard/top-customers?limit={}", limit);

        try {
            // Limit to reasonable range
            limit = Math.max(1, Math.min(limit, 50));
            List<CustomerDetailDTO> customers = dashboardService.getTopCustomers(limit);
            return ResponseEntity.ok(ApiResponse.success(customers));
        } catch (Exception e) {
            log.error("Error fetching top customers: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("CUSTOMERS_ERROR", "Failed to fetch top customers"));
        }
    }

    /**
     * Get order status distribution
     */
    @GetMapping("/order-status")
    @Operation(
            summary = "Get order status distribution",
            description = "Returns count of orders by status for status pie chart"
    )
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getOrderStatusDistribution() {
        log.info("GET /dashboard/order-status");

        try {
            List<Map<String, Object>> statusDist = dashboardService.getOrderStatusDistribution();
            return ResponseEntity.ok(ApiResponse.success(statusDist));
        } catch (Exception e) {
            log.error("Error fetching order status: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("STATUS_ERROR", "Failed to fetch order status distribution"));
        }
    }

    /**
     * Get orders by channel
     */
    @GetMapping("/orders-by-channel")
    @Operation(
            summary = "Get orders by channel",
            description = "Returns order count and revenue by sales channel"
    )
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getOrdersByChannel() {
        log.info("GET /dashboard/orders-by-channel");

        try {
            List<Map<String, Object>> channelData = dashboardService.getOrdersByChannel();
            return ResponseEntity.ok(ApiResponse.success(channelData));
        } catch (Exception e) {
            log.error("Error fetching orders by channel: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("CHANNEL_ERROR", "Failed to fetch orders by channel"));
        }
    }

    /**
     * Get top selling products
     */
    @GetMapping("/top-products")
    @Operation(
            summary = "Get top products",
            description = "Returns list of top selling products"
    )
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTopProducts(
            @Parameter(description = "Maximum number of products to return (default: 10)")
            @RequestParam(defaultValue = "10") int limit
    ) {
        log.info("GET /dashboard/top-products?limit={}", limit);

        try {
            limit = Math.max(1, Math.min(limit, 50));
            List<Map<String, Object>> products = dashboardService.getTopProducts(limit);
            return ResponseEntity.ok(ApiResponse.success(products));
        } catch (Exception e) {
            log.error("Error fetching top products: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("PRODUCTS_ERROR", "Failed to fetch top products"));
        }
    }

    /**
     * Get complete dashboard data in one call
     */
    @GetMapping
    @Operation(
            summary = "Get complete dashboard",
            description = "Returns all dashboard data in a single response for initial load optimization"
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCompleteDashboard() {
        log.info("GET /dashboard - Fetching complete dashboard");

        try {
            Map<String, Object> dashboard = Map.of(
                    "stats", dashboardService.getDashboardStats(),
                    "revenueChart", dashboardService.getRevenueTimeSeries(12),
                    "segmentDistribution", dashboardService.getCustomerSegmentDistribution(),
                    "recentOrders", dashboardService.getRecentOrders(10),
                    "topCustomers", dashboardService.getTopCustomers(5),
                    "topProducts", dashboardService.getTopProducts(5)
            );
            return ResponseEntity.ok(ApiResponse.success(dashboard));
        } catch (Exception e) {
            log.error("Error fetching complete dashboard: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("DASHBOARD_ERROR", "Failed to fetch dashboard data"));
        }
    }
}
