package com.cafe24.crm.service;

import com.cafe24.crm.domain.neo4j.CrmCustomerNode;
import com.cafe24.crm.domain.neo4j.CrmOrderNode;
import com.cafe24.crm.dto.*;
import com.cafe24.crm.repository.neo4j.CrmCustomerNeo4jRepository;
import com.cafe24.crm.repository.neo4j.CrmOrderNeo4jRepository;
import com.cafe24.crm.repository.neo4j.CrmProductNeo4jRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Customer Service
 *
 * Provides customer data access and 360-degree customer view
 * including profile, orders, and recommendations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CustomerService {

    private final CrmCustomerNeo4jRepository customerRepository;
    private final CrmOrderNeo4jRepository orderRepository;
    private final CrmProductNeo4jRepository productRepository;
    private final RecommendationService recommendationService;

    /**
     * Get all customers with pagination
     */
    public PageResponse<CustomerDetailDTO> getCustomers(Pageable pageable) {
        log.debug("Getting customers, page: {}, size: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        try {
            Page<CrmCustomerNode> page = customerRepository.findAllCustomers(pageable);

            List<CustomerDetailDTO> customers = page.getContent().stream()
                    .map(this::mapToDetailDTO)
                    .collect(Collectors.toList());

            return PageResponse.of(
                    customers,
                    page.getNumber(),
                    page.getSize(),
                    page.getTotalElements()
            );

        } catch (Exception e) {
            log.error("Error getting customers: {}", e.getMessage(), e);
            return PageResponse.empty(pageable.getPageNumber(), pageable.getPageSize());
        }
    }

    /**
     * Get customers by segment with pagination
     */
    public PageResponse<CustomerDetailDTO> getCustomersBySegment(String segment, Pageable pageable) {
        log.debug("Getting customers by segment: {}", segment);

        try {
            Page<CrmCustomerNode> page = customerRepository.findBySegment(segment, pageable);

            List<CustomerDetailDTO> customers = page.getContent().stream()
                    .map(this::mapToDetailDTO)
                    .collect(Collectors.toList());

            return PageResponse.of(
                    customers,
                    page.getNumber(),
                    page.getSize(),
                    page.getTotalElements()
            );

        } catch (Exception e) {
            log.error("Error getting customers by segment: {}", e.getMessage(), e);
            return PageResponse.empty(pageable.getPageNumber(), pageable.getPageSize());
        }
    }

    /**
     * Get customer 360-degree view by ID
     */
    public Optional<CustomerDetailDTO> getCustomer360View(String customerId) {
        log.debug("Getting 360 view for customer: {}", customerId);

        try {
            Optional<CrmCustomerNode> customerOpt = customerRepository.findByCustomerId(customerId);

            if (customerOpt.isEmpty()) {
                return Optional.empty();
            }

            CrmCustomerNode customer = customerOpt.get();
            CustomerDetailDTO dto = mapToDetailDTO(customer);

            // Get recent orders
            List<CrmOrderNode> orders = orderRepository.findByCustomerId(customerId);
            if (orders != null && !orders.isEmpty()) {
                List<CustomerDetailDTO.OrderSummary> orderSummaries = orders.stream()
                        .limit(5)
                        .map(this::mapToOrderSummary)
                        .collect(Collectors.toList());
                dto.setRecentOrders(orderSummaries);
            }

            // Get category affinities
            List<Map<String, Object>> affinities = productRepository
                    .getCustomerAffinities(customerId);
            if (affinities != null && !affinities.isEmpty()) {
                List<CustomerDetailDTO.CategoryAffinity> categoryAffinities = affinities.stream()
                        .map(a -> CustomerDetailDTO.CategoryAffinity.builder()
                                .category((String) a.get("category"))
                                .purchaseCount(a.get("purchaseCount") != null ?
                                        ((Number) a.get("purchaseCount")).intValue() : 0)
                                .totalSpent(a.get("totalSpent") != null ?
                                        ((Number) a.get("totalSpent")).doubleValue() : 0.0)
                                .percentage(a.get("percentage") != null ?
                                        ((Number) a.get("percentage")).doubleValue() : 0.0)
                                .build())
                        .collect(Collectors.toList());
                dto.setCategoryAffinities(categoryAffinities);
            }

            // Get product recommendations
            List<ProductRecommendationDTO> recommendations = recommendationService
                    .getProductRecommendations(customerId, 5);
            dto.setRecommendations(recommendations);

            return Optional.of(dto);

        } catch (Exception e) {
            log.error("Error getting customer 360 view: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    /**
     * Get customer by ID (basic info)
     */
    public Optional<CustomerDetailDTO> getCustomerById(String customerId) {
        log.debug("Getting customer by ID: {}", customerId);

        try {
            return customerRepository.findByCustomerId(customerId)
                    .map(this::mapToDetailDTO);
        } catch (Exception e) {
            log.error("Error getting customer by ID: {}", e.getMessage(), e);
            return Optional.empty();
        }
    }

    /**
     * Get customer orders
     */
    public List<RecentOrderDTO> getCustomerOrders(String customerId) {
        log.debug("Getting orders for customer: {}", customerId);

        try {
            List<CrmOrderNode> orders = orderRepository.findByCustomerId(customerId);

            if (orders == null || orders.isEmpty()) {
                return List.of();
            }

            return orders.stream()
                    .map(this::mapToRecentOrderDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting customer orders: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Search customers by name or email
     */
    public List<CustomerDetailDTO> searchCustomers(String query, int limit) {
        log.debug("Searching customers with query: {}", query);

        try {
            List<CrmCustomerNode> customers = customerRepository.searchCustomers(query, limit);

            if (customers == null || customers.isEmpty()) {
                return List.of();
            }

            return customers.stream()
                    .map(this::mapToDetailDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error searching customers: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Get at-risk customers (high churn probability)
     */
    public List<CustomerDetailDTO> getAtRiskCustomers(int limit) {
        log.debug("Getting at-risk customers, limit: {}", limit);

        try {
            List<CrmCustomerNode> customers = customerRepository.getAtRiskCustomers(limit);

            if (customers == null || customers.isEmpty()) {
                return List.of();
            }

            return customers.stream()
                    .map(this::mapToDetailDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting at-risk customers: {}", e.getMessage(), e);
            return List.of();
        }
    }

    /**
     * Get customers by tier
     */
    public List<CustomerDetailDTO> getCustomersByTier(String tier) {
        log.debug("Getting customers by tier: {}", tier);

        try {
            List<CrmCustomerNode> customers = customerRepository.findByTier(tier);

            if (customers == null || customers.isEmpty()) {
                return List.of();
            }

            return customers.stream()
                    .map(this::mapToDetailDTO)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting customers by tier: {}", e.getMessage(), e);
            return List.of();
        }
    }

    // Helper methods

    private CustomerDetailDTO mapToDetailDTO(CrmCustomerNode customer) {
        return CustomerDetailDTO.builder()
                .id(customer.getId())
                .customerId(customer.getCustomerId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .segment(customer.getSegment())
                .tier(customer.getTier())
                .status(customer.getStatus())
                .rfmScore(customer.getRfmScore())
                .recency(customer.getRecency())
                .frequency(customer.getFrequency())
                .monetary(customer.getMonetary())
                .totalOrders(customer.getTotalOrders())
                .totalRevenue(customer.getTotalRevenue())
                .avgOrderValue(customer.getAvgOrderValue())
                .clv(customer.getClv())
                .daysSinceLastPurchase(customer.getDaysSinceLastPurchase())
                .firstOrderDate(customer.getFirstOrderDate())
                .lastOrderDate(customer.getLastOrderDate())
                .churnProbability(customer.getChurnProbability())
                .preferredCategory(customer.getPreferredCategory())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }

    private CustomerDetailDTO.OrderSummary mapToOrderSummary(CrmOrderNode order) {
        return CustomerDetailDTO.OrderSummary.builder()
                .orderId(order.getOrderId())
                .orderDate(order.getOrderDate())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .itemCount(order.getItemCount())
                .productNames(order.getItems())
                .build();
    }

    private RecentOrderDTO mapToRecentOrderDTO(CrmOrderNode order) {
        return RecentOrderDTO.builder()
                .orderId(order.getOrderId())
                .customerId(order.getCustomerId())
                .orderDate(order.getOrderDate())
                .createdAt(order.getCreatedAt())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .itemCount(order.getItemCount())
                .paymentMethod(order.getPaymentMethod())
                .channel(order.getChannel())
                .build();
    }
}
