package com.cafe24.crm.service;

import com.cafe24.crm.dto.*;
import com.cafe24.crm.repository.neo4j.CrmCustomerNeo4jRepository;
import com.cafe24.crm.repository.neo4j.CrmOrderNeo4jRepository;
import com.cafe24.crm.repository.neo4j.CrmProductNeo4jRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Dashboard Service
 *
 * Aggregates data from Neo4j repositories for dashboard views
 * including statistics, charts, and recent activity.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardService {

    private final CrmCustomerNeo4jRepository customerRepository;
    private final CrmOrderNeo4jRepository orderRepository;
    private final CrmProductNeo4jRepository productRepository;

    /**
     * Get overall dashboard statistics
     * Each query is wrapped in try-catch to handle missing properties gracefully
     */
    public DashboardStatsDTO getDashboardStats() {
        log.debug("Fetching dashboard statistics");

        Long totalCustomers = safeQuery(() -> customerRepository.getTotalCustomerCount(), 0L, "totalCustomers");
        Long activeCustomers = safeQuery(() -> customerRepository.getActiveCustomerCount(), 0L, "activeCustomers");
        Long totalOrders = safeQuery(() -> orderRepository.getTotalOrderCount(), 0L, "totalOrders");
        Double totalRevenue = safeQuery(() -> orderRepository.getTotalRevenue(), 0.0, "totalRevenue");
        Double avgOrderValue = safeQuery(() -> orderRepository.getAverageOrderValue(), 0.0, "avgOrderValue");
        Double avgClv = safeQuery(() -> customerRepository.getAverageClv(), 0.0, "avgClv");
        Long totalProducts = safeQuery(() -> productRepository.getTotalProductCount(), 0L, "totalProducts");

        // Get segment count
        int segmentCount = 0;
        try {
            List<Map<String, Object>> segments = customerRepository.countBySegment();
            segmentCount = segments != null ? segments.size() : 0;
        } catch (Exception e) {
            log.warn("Failed to fetch segment count: {}", e.getMessage());
        }

        // Get repeat purchase rate
        Double repeatPurchaseRate = 0.0;
        try {
            Map<String, Object> repeatRate = orderRepository.getRepeatPurchaseRate();
            if (repeatRate != null) {
                repeatPurchaseRate = ((Number) repeatRate.getOrDefault("repeatRate", 0)).doubleValue();
            }
        } catch (Exception e) {
            log.warn("Failed to fetch repeat purchase rate: {}", e.getMessage());
        }

        // Get at-risk customers count
        Long atRiskCount = 0L;
        try {
            List<?> atRiskCustomers = customerRepository.getAtRiskCustomers(1000);
            atRiskCount = atRiskCustomers != null ? (long) atRiskCustomers.size() : 0L;
        } catch (Exception e) {
            log.warn("Failed to fetch at-risk customers: {}", e.getMessage());
        }

        return DashboardStatsDTO.builder()
                .totalCustomers(totalCustomers != null ? totalCustomers : 0L)
                .activeCustomers(activeCustomers != null ? activeCustomers : 0L)
                .totalOrders(totalOrders != null ? totalOrders : 0L)
                .totalRevenue(totalRevenue != null ? totalRevenue : 0.0)
                .averageOrderValue(avgOrderValue != null ? Math.round(avgOrderValue * 100) / 100.0 : 0.0)
                .averageClv(avgClv != null ? Math.round(avgClv * 100) / 100.0 : 0.0)
                .segmentCount(segmentCount)
                .repeatPurchaseRate(repeatPurchaseRate)
                .totalProducts(totalProducts != null ? totalProducts : 0L)
                .atRiskCustomers(atRiskCount)
                .build();
    }

    /**
     * Safe query wrapper that catches exceptions and returns default value
     */
    private <T> T safeQuery(java.util.function.Supplier<T> query, T defaultValue, String queryName) {
        try {
            T result = query.get();
            return result != null ? result : defaultValue;
        } catch (Exception e) {
            log.warn("Failed to execute query '{}': {}", queryName, e.getMessage());
            return defaultValue;
        }
    }

    /**
     * Get revenue time series data for charts
     */
    public RevenueChartDTO getRevenueTimeSeries(int months) {
        log.debug("Fetching revenue time series for {} months", months);

        try {
            List<Map<String, Object>> rawData = orderRepository.getOrdersByMonth(months);

            if (rawData == null || rawData.isEmpty()) {
                return RevenueChartDTO.builder()
                        .data(List.of())
                        .totalRevenue(0.0)
                        .totalOrders(0L)
                        .build();
            }

            // Reverse to chronological order
            Collections.reverse(rawData);

            List<RevenueChartDTO.MonthlyData> monthlyData = new ArrayList<>();
            Double totalRevenue = 0.0;
            Long totalOrders = 0L;
            Double peakRevenue = 0.0;
            String peakMonth = null;
            Double previousRevenue = null;

            for (Map<String, Object> row : rawData) {
                String month = (String) row.get("month");
                Double revenue = row.get("totalRevenue") != null ?
                        ((Number) row.get("totalRevenue")).doubleValue() : 0.0;
                Long orderCount = row.get("orderCount") != null ?
                        ((Number) row.get("orderCount")).longValue() : 0L;
                Double avgValue = row.get("avgOrderValue") != null ?
                        ((Number) row.get("avgOrderValue")).doubleValue() : 0.0;

                Double growth = null;
                if (previousRevenue != null && previousRevenue > 0) {
                    growth = Math.round((revenue - previousRevenue) / previousRevenue * 1000) / 10.0;
                }

                monthlyData.add(RevenueChartDTO.MonthlyData.builder()
                        .month(month)
                        .revenue(revenue)
                        .orderCount(orderCount)
                        .avgOrderValue(Math.round(avgValue * 100) / 100.0)
                        .growth(growth)
                        .build());

                totalRevenue += revenue;
                totalOrders += orderCount;

                if (revenue > peakRevenue) {
                    peakRevenue = revenue;
                    peakMonth = month;
                }

                previousRevenue = revenue;
            }

            // Calculate growth rate
            Double growthRate = null;
            if (monthlyData.size() >= 2) {
                Double firstRevenue = monthlyData.get(0).getRevenue();
                Double lastRevenue = monthlyData.get(monthlyData.size() - 1).getRevenue();
                if (firstRevenue != null && firstRevenue > 0) {
                    growthRate = Math.round((lastRevenue - firstRevenue) / firstRevenue * 1000) / 10.0;
                }
            }

            return RevenueChartDTO.builder()
                    .data(monthlyData)
                    .totalRevenue(totalRevenue)
                    .totalOrders(totalOrders)
                    .averageMonthlyRevenue(monthlyData.isEmpty() ? 0.0 :
                            Math.round(totalRevenue / monthlyData.size() * 100) / 100.0)
                    .peakMonth(peakMonth)
                    .peakRevenue(peakRevenue)
                    .growthRate(growthRate)
                    .build();

        } catch (Exception e) {
            log.error("Error fetching revenue time series: {}", e.getMessage(), e);
            return RevenueChartDTO.builder()
                    .data(List.of())
                    .totalRevenue(0.0)
                    .totalOrders(0L)
                    .build();
        }
    }

    /**
     * Get customer segment distribution for pie chart
     */
    public SegmentDistributionDTO getCustomerSegmentDistribution() {
        log.debug("Fetching customer segment distribution");

        try {
            List<Map<String, Object>> segmentData = customerRepository.countBySegment();
            List<Map<String, Object>> segmentStats = customerRepository.getSegmentStats();

            if (segmentData == null || segmentData.isEmpty()) {
                return SegmentDistributionDTO.builder()
                        .segments(List.of())
                        .totalCustomers(0L)
                        .segmentCount(0)
                        .build();
            }

            // Create a map for stats lookup
            Map<String, Map<String, Object>> statsMap = new HashMap<>();
            if (segmentStats != null) {
                for (Map<String, Object> stat : segmentStats) {
                    String segment = (String) stat.get("segment");
                    if (segment != null) {
                        statsMap.put(segment.toLowerCase(), stat);
                    }
                }
            }

            Long totalCustomers = segmentData.stream()
                    .mapToLong(s -> ((Number) s.getOrDefault("count", 0)).longValue())
                    .sum();

            List<SegmentDistributionDTO.SegmentData> segments = new ArrayList<>();
            String largestSegment = null;
            Double largestPercentage = 0.0;

            for (Map<String, Object> row : segmentData) {
                String segment = (String) row.get("segment");
                Long count = ((Number) row.getOrDefault("count", 0)).longValue();
                Double percentage = totalCustomers > 0 ?
                        Math.round((double) count / totalCustomers * 1000) / 10.0 : 0.0;

                // Get additional stats
                Map<String, Object> stats = statsMap.get(segment != null ? segment.toLowerCase() : "");
                Double totalRevenue = stats != null && stats.get("totalRevenue") != null ?
                        ((Number) stats.get("totalRevenue")).doubleValue() : null;
                Double avgRevenue = stats != null && stats.get("avgRevenue") != null ?
                        ((Number) stats.get("avgRevenue")).doubleValue() : null;
                Double avgClv = stats != null && stats.get("avgClv") != null ?
                        ((Number) stats.get("avgClv")).doubleValue() : null;

                segments.add(SegmentDistributionDTO.SegmentData.builder()
                        .segment(segment)
                        .count(count)
                        .percentage(percentage)
                        .totalRevenue(totalRevenue)
                        .avgRevenue(avgRevenue != null ? Math.round(avgRevenue * 100) / 100.0 : null)
                        .avgClv(avgClv != null ? Math.round(avgClv * 100) / 100.0 : null)
                        .build());

                if (percentage > largestPercentage) {
                    largestPercentage = percentage;
                    largestSegment = segment;
                }
            }

            return SegmentDistributionDTO.builder()
                    .segments(segments)
                    .totalCustomers(totalCustomers)
                    .segmentCount(segments.size())
                    .largestSegment(largestSegment)
                    .largestSegmentPercentage(largestPercentage)
                    .build();

        } catch (Exception e) {
            log.error("Error fetching segment distribution: {}", e.getMessage(), e);
            return SegmentDistributionDTO.builder()
                    .segments(List.of())
                    .totalCustomers(0L)
                    .segmentCount(0)
                    .build();
        }
    }

    /**
     * Get recent orders with customer information
     */
    public List<RecentOrderDTO> getRecentOrders(int limit) {
        log.debug("Fetching {} recent orders", limit);

        try {
            List<Map<String, Object>> rawOrders = orderRepository.findRecentOrdersWithCustomer(limit);

            if (rawOrders == null || rawOrders.isEmpty()) {
                return List.of();
            }

            return rawOrders.stream()
                    .map(this::mapToRecentOrderDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error fetching recent orders: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Get top customers by revenue
     */
    public List<CustomerDetailDTO> getTopCustomers(int limit) {
        log.debug("Fetching top {} customers", limit);

        try {
            var customers = customerRepository.findTopByRevenue(limit);

            if (customers == null || customers.isEmpty()) {
                return List.of();
            }

            return customers.stream()
                    .map(c -> CustomerDetailDTO.builder()
                            .customerId(c.getCustomerId())
                            .name(c.getName())
                            .email(c.getEmail())
                            .segment(c.getSegment())
                            .tier(c.getTier())
                            .rfmScore(c.getRfmScore())
                            .recency(c.getRecency())
                            .frequency(c.getFrequency())
                            .monetary(c.getMonetary())
                            .totalOrders(c.getTotalOrders())
                            .totalRevenue(c.getTotalRevenue())
                            .avgOrderValue(c.getAvgOrderValue())
                            .clv(c.getClv())
                            .daysSinceLastPurchase(c.getDaysSinceLastPurchase())
                            .lastOrderDate(c.getLastOrderDate())
                            .churnProbability(c.getChurnProbability())
                            .build())
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error fetching top customers: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Get order status distribution
     */
    public List<Map<String, Object>> getOrderStatusDistribution() {
        log.debug("Fetching order status distribution");

        try {
            return orderRepository.getOrdersByStatus();
        } catch (Exception e) {
            log.error("Error fetching order status distribution: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Get orders by channel
     */
    public List<Map<String, Object>> getOrdersByChannel() {
        log.debug("Fetching orders by channel");

        try {
            return orderRepository.getOrdersByChannel();
        } catch (Exception e) {
            log.error("Error fetching orders by channel: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Get top selling products
     */
    public List<Map<String, Object>> getTopProducts(int limit) {
        log.debug("Fetching top {} products", limit);

        try {
            var products = productRepository.findTopSellingProducts(limit);

            if (products == null || products.isEmpty()) {
                return List.of();
            }

            return products.stream()
                    .map(p -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("productId", p.getProductId());
                        map.put("name", p.getName());
                        map.put("category", p.getCategory());
                        map.put("price", p.getPrice());
                        map.put("totalSold", p.getTotalSold());
                        map.put("totalRevenue", p.getTotalRevenue());
                        map.put("imageUrl", p.getImageUrl());
                        return map;
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error fetching top products: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Helper to map raw order data to DTO
     */
    private RecentOrderDTO mapToRecentOrderDTO(Map<String, Object> row) {
        LocalDate orderDate = null;
        Object dateObj = row.get("orderDate");
        if (dateObj instanceof LocalDate) {
            orderDate = (LocalDate) dateObj;
        }

        return RecentOrderDTO.builder()
                .orderId((String) row.get("orderId"))
                .customerId((String) row.get("customerId"))
                .customerName((String) row.get("customerName"))
                .customerSegment((String) row.get("customerSegment"))
                .orderDate(orderDate)
                .totalAmount(row.get("totalAmount") != null ?
                        ((Number) row.get("totalAmount")).doubleValue() : null)
                .status((String) row.get("status"))
                .itemCount(row.get("itemCount") != null ?
                        ((Number) row.get("itemCount")).intValue() : null)
                .build();
    }
}
