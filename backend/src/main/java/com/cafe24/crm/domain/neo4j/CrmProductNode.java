package com.cafe24.crm.domain.neo4j;

import lombok.*;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Neo4j Node Entity for CRM Product
 *
 * Represents a product in the CRM graph database with product details,
 * categorization, and relationships to orders and customers.
 */
@Node("CRM_Product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"orders", "viewedBy", "purchasedBy", "relatedProducts"})
@EqualsAndHashCode(of = "productId")
public class CrmProductNode {

    @Id
    @GeneratedValue(UUIDStringGenerator.class)
    private String id;

    /**
     * Unique product identifier from source system
     */
    @Property("product_id")
    private String productId;

    /**
     * Product name
     */
    @Property("name")
    private String name;

    /**
     * Product description
     */
    @Property("description")
    private String description;

    /**
     * Product category
     */
    @Property("category")
    private String category;

    /**
     * Product subcategory
     */
    @Property("subcategory")
    private String subcategory;

    /**
     * Current price
     */
    @Property("price")
    private Double price;

    /**
     * Original price (before discount)
     */
    @Property("original_price")
    private Double originalPrice;

    /**
     * Cost price (for margin calculation)
     */
    @Property("cost_price")
    private Double costPrice;

    /**
     * Product SKU
     */
    @Property("sku")
    private String sku;

    /**
     * Brand name
     */
    @Property("brand")
    private String brand;

    /**
     * Product image URL
     */
    @Property("image_url")
    private String imageUrl;

    /**
     * Product status (active, inactive, discontinued)
     */
    @Property("status")
    private String status;

    /**
     * Current stock quantity
     */
    @Property("stock_quantity")
    private Integer stockQuantity;

    /**
     * Total units sold
     */
    @Property("total_sold")
    private Integer totalSold;

    /**
     * Total revenue generated
     */
    @Property("total_revenue")
    private Double totalRevenue;

    /**
     * Average rating (1-5)
     */
    @Property("avg_rating")
    private Double avgRating;

    /**
     * Number of reviews
     */
    @Property("review_count")
    private Integer reviewCount;

    /**
     * Product tags (comma-separated)
     */
    @Property("tags")
    private String tags;

    /**
     * Product creation timestamp
     */
    @Property("created_at")
    private LocalDateTime createdAt;

    /**
     * Last update timestamp
     */
    @Property("updated_at")
    private LocalDateTime updatedAt;

    /**
     * View count
     */
    @Property("view_count")
    private Integer viewCount;

    /**
     * Cart add count
     */
    @Property("cart_add_count")
    private Integer cartAddCount;

    /**
     * Conversion rate (purchases / views)
     */
    @Property("conversion_rate")
    private Double conversionRate;

    // Relationships

    /**
     * Orders containing this product
     */
    @Relationship(type = "CONTAINS", direction = Relationship.Direction.INCOMING)
    @Builder.Default
    private Set<CrmOrderNode> orders = new HashSet<>();

    /**
     * Customers who viewed this product
     */
    @Relationship(type = "VIEWED", direction = Relationship.Direction.INCOMING)
    @Builder.Default
    private Set<CrmCustomerNode> viewedBy = new HashSet<>();

    /**
     * Customers who purchased this product
     */
    @Relationship(type = "PURCHASED", direction = Relationship.Direction.INCOMING)
    @Builder.Default
    private Set<CrmCustomerNode> purchasedBy = new HashSet<>();

    /**
     * Related products (similar or frequently bought together)
     */
    @Relationship(type = "RELATED_TO", direction = Relationship.Direction.OUTGOING)
    @Builder.Default
    private Set<CrmProductNode> relatedProducts = new HashSet<>();

    /**
     * Calculate profit margin percentage
     */
    public Double getProfitMargin() {
        if (price == null || costPrice == null || price == 0) {
            return null;
        }
        return ((price - costPrice) / price) * 100;
    }

    /**
     * Calculate discount percentage
     */
    public Double getDiscountPercentage() {
        if (originalPrice == null || price == null || originalPrice == 0) {
            return 0.0;
        }
        return ((originalPrice - price) / originalPrice) * 100;
    }

    /**
     * Check if product is in stock
     */
    public boolean isInStock() {
        return stockQuantity != null && stockQuantity > 0;
    }

    /**
     * Check if product is on sale
     */
    public boolean isOnSale() {
        return originalPrice != null && price != null && price < originalPrice;
    }
}
