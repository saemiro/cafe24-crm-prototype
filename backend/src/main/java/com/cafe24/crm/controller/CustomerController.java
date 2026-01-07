package com.cafe24.crm.controller;

import com.cafe24.crm.dto.*;
import com.cafe24.crm.service.CustomerService;
import com.cafe24.crm.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Customer Controller
 *
 * REST API endpoints for customer data access including
 * listing, details, orders, and recommendations.
 */
@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Customers", description = "CRM Customer APIs")
@CrossOrigin(origins = {"https://crm.saemiro.com", "http://localhost:3000", "http://localhost:5173"})
public class CustomerController {

    private final CustomerService customerService;
    private final RecommendationService recommendationService;

    /**
     * List customers with pagination
     */
    @GetMapping
    @Operation(
            summary = "List customers",
            description = "Returns paginated list of customers with optional filtering by segment"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Customers retrieved successfully"
            )
    })
    public ResponseEntity<ApiResponse<PageResponse<CustomerDetailDTO>>> listCustomers(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size,

            @Parameter(description = "Filter by segment")
            @RequestParam(required = false) String segment,

            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "totalRevenue") String sortBy,

            @Parameter(description = "Sort direction (asc/desc)")
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        log.info("GET /customers?page={}&size={}&segment={}&sortBy={}&sortDir={}",
                page, size, segment, sortBy, sortDir);

        try {
            // Validate and limit
            page = Math.max(0, page);
            size = Math.max(1, Math.min(size, 100));

            Sort sort = "asc".equalsIgnoreCase(sortDir)
                    ? Sort.by(sortBy).ascending()
                    : Sort.by(sortBy).descending();
            Pageable pageable = PageRequest.of(page, size, sort);

            PageResponse<CustomerDetailDTO> customers;
            if (segment != null && !segment.isBlank()) {
                customers = customerService.getCustomersBySegment(segment, pageable);
            } else {
                customers = customerService.getCustomers(pageable);
            }

            return ResponseEntity.ok(ApiResponse.success(customers));

        } catch (Exception e) {
            log.error("Error listing customers: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("CUSTOMERS_ERROR", "Failed to fetch customers"));
        }
    }

    /**
     * Get customer 360-degree view
     */
    @GetMapping("/{customerId}")
    @Operation(
            summary = "Get customer 360 view",
            description = "Returns comprehensive customer information including profile, orders, affinities, and recommendations"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Customer retrieved successfully",
                    content = @Content(schema = @Schema(implementation = CustomerDetailDTO.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Customer not found"
            )
    })
    public ResponseEntity<ApiResponse<CustomerDetailDTO>> getCustomer(
            @Parameter(description = "Customer ID", required = true)
            @PathVariable String customerId,

            @Parameter(description = "Include full 360 view with orders and recommendations")
            @RequestParam(defaultValue = "true") boolean full
    ) {
        log.info("GET /customers/{}?full={}", customerId, full);

        try {
            Optional<CustomerDetailDTO> customer = full
                    ? customerService.getCustomer360View(customerId)
                    : customerService.getCustomerById(customerId);

            return customer
                    .map(c -> ResponseEntity.ok(ApiResponse.success(c)))
                    .orElse(ResponseEntity.status(404)
                            .body(ApiResponse.notFound("Customer " + customerId)));

        } catch (Exception e) {
            log.error("Error getting customer {}: {}", customerId, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("CUSTOMER_ERROR", "Failed to fetch customer"));
        }
    }

    /**
     * Get customer orders
     */
    @GetMapping("/{customerId}/orders")
    @Operation(
            summary = "Get customer orders",
            description = "Returns order history for a specific customer"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Orders retrieved successfully"
            )
    })
    public ResponseEntity<ApiResponse<List<RecentOrderDTO>>> getCustomerOrders(
            @Parameter(description = "Customer ID", required = true)
            @PathVariable String customerId
    ) {
        log.info("GET /customers/{}/orders", customerId);

        try {
            List<RecentOrderDTO> orders = customerService.getCustomerOrders(customerId);
            return ResponseEntity.ok(ApiResponse.success(orders));
        } catch (Exception e) {
            log.error("Error getting orders for customer {}: {}", customerId, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("ORDERS_ERROR", "Failed to fetch customer orders"));
        }
    }

    /**
     * Get product recommendations for customer
     */
    @GetMapping("/{customerId}/recommendations")
    @Operation(
            summary = "Get product recommendations",
            description = "Returns personalized product recommendations for a customer based on purchase history and similar customers"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Recommendations retrieved successfully"
            )
    })
    public ResponseEntity<ApiResponse<List<ProductRecommendationDTO>>> getRecommendations(
            @Parameter(description = "Customer ID", required = true)
            @PathVariable String customerId,

            @Parameter(description = "Maximum number of recommendations")
            @RequestParam(defaultValue = "10") int limit
    ) {
        log.info("GET /customers/{}/recommendations?limit={}", customerId, limit);

        try {
            limit = Math.max(1, Math.min(limit, 50));
            List<ProductRecommendationDTO> recommendations =
                    recommendationService.getProductRecommendations(customerId, limit);
            return ResponseEntity.ok(ApiResponse.success(recommendations));
        } catch (Exception e) {
            log.error("Error getting recommendations for customer {}: {}", customerId, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("RECOMMENDATIONS_ERROR", "Failed to fetch recommendations"));
        }
    }

    /**
     * Get customer category affinities
     */
    @GetMapping("/{customerId}/affinities")
    @Operation(
            summary = "Get customer affinities",
            description = "Returns category and brand purchase affinities for a customer"
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCustomerAffinities(
            @Parameter(description = "Customer ID", required = true)
            @PathVariable String customerId
    ) {
        log.info("GET /customers/{}/affinities", customerId);

        try {
            List<Map<String, Object>> categoryAffinities =
                    recommendationService.getCustomerAffinities(customerId);
            List<Map<String, Object>> brandPreferences =
                    recommendationService.getCustomerBrandPreferences(customerId);

            Map<String, Object> affinities = Map.of(
                    "categories", categoryAffinities,
                    "brands", brandPreferences
            );
            return ResponseEntity.ok(ApiResponse.success(affinities));
        } catch (Exception e) {
            log.error("Error getting affinities for customer {}: {}", customerId, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("AFFINITIES_ERROR", "Failed to fetch customer affinities"));
        }
    }

    /**
     * Search customers
     */
    @GetMapping("/search")
    @Operation(
            summary = "Search customers",
            description = "Search customers by name or email"
    )
    public ResponseEntity<ApiResponse<List<CustomerDetailDTO>>> searchCustomers(
            @Parameter(description = "Search query", required = true)
            @RequestParam String q,

            @Parameter(description = "Maximum results")
            @RequestParam(defaultValue = "20") int limit
    ) {
        log.info("GET /customers/search?q={}&limit={}", q, limit);

        try {
            if (q == null || q.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.validationError("Search query is required"));
            }

            limit = Math.max(1, Math.min(limit, 100));
            List<CustomerDetailDTO> customers = customerService.searchCustomers(q, limit);
            return ResponseEntity.ok(ApiResponse.success(customers));
        } catch (Exception e) {
            log.error("Error searching customers: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("SEARCH_ERROR", "Failed to search customers"));
        }
    }

    /**
     * Get at-risk customers
     */
    @GetMapping("/at-risk")
    @Operation(
            summary = "Get at-risk customers",
            description = "Returns customers with high churn probability"
    )
    public ResponseEntity<ApiResponse<List<CustomerDetailDTO>>> getAtRiskCustomers(
            @Parameter(description = "Maximum results")
            @RequestParam(defaultValue = "50") int limit
    ) {
        log.info("GET /customers/at-risk?limit={}", limit);

        try {
            limit = Math.max(1, Math.min(limit, 100));
            List<CustomerDetailDTO> customers = customerService.getAtRiskCustomers(limit);
            return ResponseEntity.ok(ApiResponse.success(customers));
        } catch (Exception e) {
            log.error("Error getting at-risk customers: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("AT_RISK_ERROR", "Failed to fetch at-risk customers"));
        }
    }

    /**
     * Get customers by tier
     */
    @GetMapping("/tier/{tier}")
    @Operation(
            summary = "Get customers by tier",
            description = "Returns customers belonging to a specific tier"
    )
    public ResponseEntity<ApiResponse<List<CustomerDetailDTO>>> getCustomersByTier(
            @Parameter(description = "Customer tier", required = true)
            @PathVariable String tier
    ) {
        log.info("GET /customers/tier/{}", tier);

        try {
            List<CustomerDetailDTO> customers = customerService.getCustomersByTier(tier);
            return ResponseEntity.ok(ApiResponse.success(customers));
        } catch (Exception e) {
            log.error("Error getting customers by tier {}: {}", tier, e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("TIER_ERROR", "Failed to fetch customers by tier"));
        }
    }

    /**
     * Get mixed recommendations (for homepage/dashboard)
     */
    @GetMapping("/{customerId}/recommendations/mixed")
    @Operation(
            summary = "Get mixed recommendations",
            description = "Returns mixed recommendations combining collaborative filtering, related products, and trending items"
    )
    public ResponseEntity<ApiResponse<List<ProductRecommendationDTO>>> getMixedRecommendations(
            @Parameter(description = "Customer ID", required = true)
            @PathVariable String customerId,

            @Parameter(description = "Product ID for related items")
            @RequestParam(required = false) String productId,

            @Parameter(description = "Maximum results")
            @RequestParam(defaultValue = "12") int limit
    ) {
        log.info("GET /customers/{}/recommendations/mixed?productId={}&limit={}",
                customerId, productId, limit);

        try {
            limit = Math.max(1, Math.min(limit, 50));
            List<ProductRecommendationDTO> recommendations =
                    recommendationService.getMixedRecommendations(customerId, productId, limit);
            return ResponseEntity.ok(ApiResponse.success(recommendations));
        } catch (Exception e) {
            log.error("Error getting mixed recommendations: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("RECOMMENDATIONS_ERROR", "Failed to fetch recommendations"));
        }
    }

    /**
     * Get new products for customer discovery
     */
    @GetMapping("/{customerId}/discover")
    @Operation(
            summary = "Get discovery products",
            description = "Returns products the customer hasn't purchased yet"
    )
    public ResponseEntity<ApiResponse<List<ProductRecommendationDTO>>> getDiscoveryProducts(
            @Parameter(description = "Customer ID", required = true)
            @PathVariable String customerId,

            @Parameter(description = "Maximum results")
            @RequestParam(defaultValue = "10") int limit
    ) {
        log.info("GET /customers/{}/discover?limit={}", customerId, limit);

        try {
            limit = Math.max(1, Math.min(limit, 50));
            List<ProductRecommendationDTO> products =
                    recommendationService.getNewProductsForCustomer(customerId, limit);
            return ResponseEntity.ok(ApiResponse.success(products));
        } catch (Exception e) {
            log.error("Error getting discovery products: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("DISCOVERY_ERROR", "Failed to fetch discovery products"));
        }
    }
}
