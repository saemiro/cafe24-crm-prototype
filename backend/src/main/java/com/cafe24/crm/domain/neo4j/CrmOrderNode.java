package com.cafe24.crm.domain.neo4j;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Neo4j Node Entity for CRM Order
 *
 * Represents an order in the CRM graph database with order details,
 * associated products, and customer relationship.
 */
@Node("CRM_Order")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"customer", "products"})
@EqualsAndHashCode(of = "orderId")
public class CrmOrderNode {

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    private String id;

    /**
     * Unique order identifier from source system
     */
    @Property("order_id")
    private String orderId;

    /**
     * Reference to the customer who placed the order
     */
    @Property("customer_id")
    private String customerId;

    /**
     * Order date
     */
    @Property("order_date")
    private LocalDate orderDate;

    /**
     * Order creation timestamp
     */
    @Property("created_at")
    private LocalDateTime createdAt;

    /**
     * Total order amount
     */
    @Property("total_amount")
    private Double totalAmount;

    /**
     * Subtotal before discounts and shipping
     */
    @Property("subtotal")
    private Double subtotal;

    /**
     * Discount amount applied
     */
    @Property("discount_amount")
    private Double discountAmount;

    /**
     * Shipping cost
     */
    @Property("shipping_cost")
    private Double shippingCost;

    /**
     * Tax amount
     */
    @Property("tax_amount")
    private Double taxAmount;

    /**
     * Order status (pending, confirmed, shipped, delivered, cancelled, returned)
     */
    @Property("status")
    private String status;

    /**
     * Payment method used
     */
    @Property("payment_method")
    private String paymentMethod;

    /**
     * Payment status
     */
    @Property("payment_status")
    private String paymentStatus;

    /**
     * Shipping method
     */
    @Property("shipping_method")
    private String shippingMethod;

    /**
     * Number of items in the order
     */
    @Property("item_count")
    private Integer itemCount;

    /**
     * Comma-separated list of product IDs (for simple queries)
     */
    @Property("items")
    private String items;

    /**
     * Shipping address (city level for analytics)
     */
    @Property("shipping_city")
    private String shippingCity;

    /**
     * Coupon code used (if any)
     */
    @Property("coupon_code")
    private String couponCode;

    /**
     * Order notes
     */
    @Property("notes")
    private String notes;

    /**
     * Source channel (web, mobile, app)
     */
    @Property("channel")
    private String channel;

    /**
     * Device type used for order
     */
    @Property("device_type")
    private String deviceType;

    /**
     * Order completion timestamp
     */
    @Property("completed_at")
    private LocalDateTime completedAt;

    /**
     * Order year-month for time series (e.g., "2025-01")
     */
    @Property("order_month")
    private String orderMonth;

    // Relationships

    /**
     * Customer who placed this order
     */
    @Relationship(type = "PLACED_ORDER", direction = Relationship.Direction.INCOMING)
    private CrmCustomerNode customer;

    /**
     * Products included in this order
     */
    @Relationship(type = "CONTAINS", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private Set<CrmProductNode> products = new HashSet<>();

    /**
     * Get formatted order date string
     */
    public String getFormattedOrderDate() {
        return orderDate != null ? orderDate.toString() : null;
    }

    /**
     * Check if order is completed
     */
    public boolean isCompleted() {
        return "delivered".equalsIgnoreCase(status) || "completed".equalsIgnoreCase(status);
    }

    /**
     * Check if order is active
     */
    public boolean isActive() {
        return !"cancelled".equalsIgnoreCase(status) && !"returned".equalsIgnoreCase(status);
    }
}
