package com.cafe24.crm.repository.neo4j;

import com.cafe24.crm.domain.neo4j.CrmProductNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Neo4j Repository for CRM Product operations
 *
 * Provides custom Cypher queries for product analytics,
 * recommendations, and collaborative filtering.
 */
@Repository
public interface CrmProductNeo4jRepository extends Neo4jRepository<CrmProductNode, String> {

    /**
     * Find product by productId
     */
    Optional<CrmProductNode> findByProductId(String productId);

    /**
     * Find products by category
     */
    @Query("""
            MATCH (p:CRM_Product)
            WHERE p.category = $category
            RETURN p
            ORDER BY p.total_sold DESC
            """)
    List<CrmProductNode> findByCategory(@Param("category") String category);

    /**
     * Get top selling products
     */
    @Query("""
            MATCH (p:CRM_Product)
            WHERE p.total_sold IS NOT NULL
            RETURN p
            ORDER BY p.total_sold DESC
            LIMIT $limit
            """)
    List<CrmProductNode> findTopSellingProducts(@Param("limit") int limit);

    /**
     * Get product recommendations for a customer using collaborative filtering
     * Finds products purchased by similar customers (who bought the same items)
     */
    @Query("""
            MATCH (c:CRM_Customer {customer_id: $customerId})-[:PURCHASED]->(p:CRM_Product)
            WITH c, collect(p) AS purchasedProducts
            MATCH (similar:CRM_Customer)-[:PURCHASED]->(p:CRM_Product)
            WHERE p IN purchasedProducts AND similar <> c
            WITH c, similar, purchasedProducts, count(p) AS commonProducts
            WHERE commonProducts >= 1
            MATCH (similar)-[:PURCHASED]->(rec:CRM_Product)
            WHERE NOT rec IN purchasedProducts
            RETURN rec.product_id AS productId,
                   rec.name AS name,
                   rec.category AS category,
                   rec.price AS price,
                   rec.image_url AS imageUrl,
                   count(DISTINCT similar) AS recommendationScore,
                   'collaborative' AS recommendationType
            ORDER BY recommendationScore DESC
            LIMIT $limit
            """)
    List<Map<String, Object>> getProductRecommendations(
            @Param("customerId") String customerId,
            @Param("limit") int limit);

    /**
     * Get related products (frequently bought together)
     */
    @Query("""
            MATCH (p:CRM_Product {product_id: $productId})<-[:CONTAINS]-(o:CRM_Order)-[:CONTAINS]->(related:CRM_Product)
            WHERE related.product_id <> $productId
            RETURN related.product_id AS productId,
                   related.name AS name,
                   related.category AS category,
                   related.price AS price,
                   related.image_url AS imageUrl,
                   count(o) AS coOccurrence,
                   'frequently_bought_together' AS recommendationType
            ORDER BY coOccurrence DESC
            LIMIT $limit
            """)
    List<Map<String, Object>> getRelatedProducts(
            @Param("productId") String productId,
            @Param("limit") int limit);

    /**
     * Get customer affinities (preferred categories/brands)
     */
    @Query("""
            MATCH (c:CRM_Customer {customer_id: $customerId})-[:PURCHASED]->(p:CRM_Product)
            WITH c,
                 p.category AS category,
                 count(p) AS purchaseCount,
                 sum(p.price) AS totalSpent
            RETURN category,
                   purchaseCount,
                   totalSpent,
                   round(toFloat(purchaseCount) * 100 / sum(purchaseCount) OVER ()) AS percentage
            ORDER BY purchaseCount DESC
            """)
    List<Map<String, Object>> getCustomerAffinities(@Param("customerId") String customerId);

    /**
     * Get customer brand preferences
     */
    @Query("""
            MATCH (c:CRM_Customer {customer_id: $customerId})-[:PURCHASED]->(p:CRM_Product)
            WHERE p.brand IS NOT NULL
            WITH p.brand AS brand, count(p) AS purchaseCount
            RETURN brand, purchaseCount
            ORDER BY purchaseCount DESC
            LIMIT 10
            """)
    List<Map<String, Object>> getCustomerBrandPreferences(@Param("customerId") String customerId);

    /**
     * Get products by performance (revenue)
     */
    @Query("""
            MATCH (p:CRM_Product)
            WHERE p.total_revenue IS NOT NULL
            RETURN p
            ORDER BY p.total_revenue DESC
            LIMIT $limit
            """)
    List<CrmProductNode> findTopProductsByRevenue(@Param("limit") int limit);

    /**
     * Get category performance stats
     */
    @Query("""
            MATCH (p:CRM_Product)
            WHERE p.category IS NOT NULL
            RETURN p.category AS category,
                   count(p) AS productCount,
                   sum(p.total_sold) AS totalUnitsSold,
                   sum(p.total_revenue) AS totalRevenue,
                   avg(p.price) AS avgPrice
            ORDER BY totalRevenue DESC
            """)
    List<Map<String, Object>> getCategoryPerformance();

    /**
     * Get product conversion funnel
     */
    @Query("""
            MATCH (p:CRM_Product)
            WHERE p.view_count IS NOT NULL
            RETURN p.product_id AS productId,
                   p.name AS name,
                   p.view_count AS views,
                   p.cart_add_count AS cartAdds,
                   p.total_sold AS purchases,
                   CASE WHEN p.view_count > 0
                        THEN round(toFloat(p.total_sold) / p.view_count * 10000) / 100
                        ELSE 0 END AS conversionRate
            ORDER BY p.total_sold DESC
            LIMIT $limit
            """)
    List<Map<String, Object>> getProductConversionFunnel(@Param("limit") int limit);

    /**
     * Get content-based recommendations (same category, similar price)
     */
    @Query("""
            MATCH (source:CRM_Product {product_id: $productId})
            MATCH (p:CRM_Product)
            WHERE p.product_id <> $productId
              AND p.category = source.category
              AND p.price >= source.price * 0.7
              AND p.price <= source.price * 1.3
            RETURN p.product_id AS productId,
                   p.name AS name,
                   p.category AS category,
                   p.price AS price,
                   p.image_url AS imageUrl,
                   p.avg_rating AS rating,
                   'content_based' AS recommendationType
            ORDER BY p.total_sold DESC
            LIMIT $limit
            """)
    List<Map<String, Object>> getContentBasedRecommendations(
            @Param("productId") String productId,
            @Param("limit") int limit);

    /**
     * Get trending products (recent sales velocity)
     */
    @Query("""
            MATCH (o:CRM_Order)-[:CONTAINS]->(p:CRM_Product)
            WHERE o.order_date >= date() - duration({days: 30})
            WITH p, count(o) AS recentSales
            RETURN p.product_id AS productId,
                   p.name AS name,
                   p.category AS category,
                   p.price AS price,
                   p.image_url AS imageUrl,
                   recentSales,
                   'trending' AS recommendationType
            ORDER BY recentSales DESC
            LIMIT $limit
            """)
    List<Map<String, Object>> getTrendingProducts(@Param("limit") int limit);

    /**
     * Get total product count
     */
    @Query("""
            MATCH (p:CRM_Product)
            RETURN count(p)
            """)
    Long getTotalProductCount();

    /**
     * Get products with low stock
     */
    @Query("""
            MATCH (p:CRM_Product)
            WHERE p.stock_quantity IS NOT NULL AND p.stock_quantity < 10
            RETURN p
            ORDER BY p.stock_quantity ASC
            LIMIT $limit
            """)
    List<CrmProductNode> getLowStockProducts(@Param("limit") int limit);

    /**
     * Search products by name
     */
    @Query("""
            MATCH (p:CRM_Product)
            WHERE toLower(p.name) CONTAINS toLower($query)
               OR toLower(p.category) CONTAINS toLower($query)
               OR toLower(p.brand) CONTAINS toLower($query)
            RETURN p
            ORDER BY p.total_sold DESC
            LIMIT $limit
            """)
    List<CrmProductNode> searchProducts(@Param("query") String query, @Param("limit") int limit);

    /**
     * Get products not purchased by customer (for new recommendations)
     */
    @Query("""
            MATCH (c:CRM_Customer {customer_id: $customerId})
            OPTIONAL MATCH (c)-[:PURCHASED]->(purchased:CRM_Product)
            WITH collect(purchased.product_id) AS purchasedIds
            MATCH (p:CRM_Product)
            WHERE NOT p.product_id IN purchasedIds
            RETURN p
            ORDER BY p.total_sold DESC
            LIMIT $limit
            """)
    List<CrmProductNode> getNewProductsForCustomer(
            @Param("customerId") String customerId,
            @Param("limit") int limit);
}
