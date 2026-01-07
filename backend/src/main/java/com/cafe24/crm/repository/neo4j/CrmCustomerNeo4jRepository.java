package com.cafe24.crm.repository.neo4j;

import com.cafe24.crm.domain.neo4j.CrmCustomerNode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Neo4j Repository for CRM Customer operations
 *
 * Provides custom Cypher queries for customer analytics,
 * RFM analysis, segmentation, and revenue insights.
 */
@Repository
public interface CrmCustomerNeo4jRepository extends Neo4jRepository<CrmCustomerNode, String> {

    /**
     * Find customer by customerId
     */
    Optional<CrmCustomerNode> findByCustomerId(String customerId);

    /**
     * Find all customers with pagination
     */
    @Query(value = """
            MATCH (c:CRM_Customer)
            RETURN c
            ORDER BY c.total_revenue DESC
            SKIP $skip LIMIT $limit
            """,
            countQuery = """
            MATCH (c:CRM_Customer)
            RETURN count(c)
            """)
    Page<CrmCustomerNode> findAllCustomers(Pageable pageable);

    /**
     * Find customers by segment
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WHERE c.segment = $segment
            RETURN c
            ORDER BY c.total_revenue DESC
            """)
    List<CrmCustomerNode> findBySegment(@Param("segment") String segment);

    /**
     * Find customers by segment with pagination
     */
    @Query(value = """
            MATCH (c:CRM_Customer)
            WHERE c.segment = $segment
            RETURN c
            ORDER BY c.total_revenue DESC
            SKIP $skip LIMIT $limit
            """,
            countQuery = """
            MATCH (c:CRM_Customer)
            WHERE c.segment = $segment
            RETURN count(c)
            """)
    Page<CrmCustomerNode> findBySegment(@Param("segment") String segment, Pageable pageable);

    /**
     * Find top customers by revenue
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WHERE c.total_revenue IS NOT NULL
            RETURN c
            ORDER BY c.total_revenue DESC
            LIMIT $limit
            """)
    List<CrmCustomerNode> findTopByRevenue(@Param("limit") int limit);

    /**
     * Get customer count by segment for pie chart
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WHERE c.segment IS NOT NULL
            RETURN c.segment AS segment, count(c) AS count
            ORDER BY count DESC
            """)
    List<Map<String, Object>> countBySegment();

    /**
     * Get RFM distribution data
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WHERE c.recency IS NOT NULL AND c.frequency IS NOT NULL AND c.monetary IS NOT NULL
            RETURN
                c.recency AS recency,
                c.frequency AS frequency,
                c.monetary AS monetary,
                count(c) AS customerCount
            ORDER BY c.recency, c.frequency, c.monetary
            """)
    List<Map<String, Object>> getRfmDistribution();

    /**
     * Get RFM segment distribution
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WHERE c.rfm_score IS NOT NULL
            RETURN c.rfm_score AS rfmScore, count(c) AS count
            ORDER BY count DESC
            """)
    List<Map<String, Object>> getRfmSegmentDistribution();

    /**
     * Get total customer count
     */
    @Query("""
            MATCH (c:CRM_Customer)
            RETURN count(c) AS totalCustomers
            """)
    Long getTotalCustomerCount();

    /**
     * Get active customer count (with orders in last 90 days)
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WHERE c.days_since_last_purchase IS NOT NULL
              AND c.days_since_last_purchase <= 90
            RETURN count(c) AS activeCustomers
            """)
    Long getActiveCustomerCount();

    /**
     * Get total revenue from all customers
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WHERE c.total_revenue IS NOT NULL
            RETURN sum(c.total_revenue) AS totalRevenue
            """)
    Double getTotalRevenue();

    /**
     * Get average CLV
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WHERE c.clv IS NOT NULL
            RETURN avg(c.clv) AS avgClv
            """)
    Double getAverageClv();

    /**
     * Get customers at risk of churn
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WHERE c.churn_probability IS NOT NULL
              AND c.churn_probability > 0.5
            RETURN c
            ORDER BY c.churn_probability DESC
            LIMIT $limit
            """)
    List<CrmCustomerNode> getAtRiskCustomers(@Param("limit") int limit);

    /**
     * Get customer with orders and products (360 view)
     */
    @Query("""
            MATCH (c:CRM_Customer {customer_id: $customerId})
            OPTIONAL MATCH (c)-[r:PLACED_ORDER]->(o:CRM_Order)
            OPTIONAL MATCH (c)-[p:PURCHASED]->(pr:CRM_Product)
            RETURN c, collect(DISTINCT o) AS orders, collect(DISTINCT pr) AS products
            """)
    Map<String, Object> getCustomer360View(@Param("customerId") String customerId);

    /**
     * Search customers by name or email
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WHERE toLower(c.name) CONTAINS toLower($query)
               OR toLower(c.email) CONTAINS toLower($query)
            RETURN c
            ORDER BY c.total_revenue DESC
            LIMIT $limit
            """)
    List<CrmCustomerNode> searchCustomers(@Param("query") String query, @Param("limit") int limit);

    /**
     * Get customers by tier
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WHERE c.tier = $tier
            RETURN c
            ORDER BY c.total_revenue DESC
            """)
    List<CrmCustomerNode> findByTier(@Param("tier") String tier);

    /**
     * Get customer segments with revenue stats
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WHERE c.segment IS NOT NULL
            RETURN c.segment AS segment,
                   count(c) AS customerCount,
                   sum(c.total_revenue) AS totalRevenue,
                   avg(c.total_revenue) AS avgRevenue,
                   avg(c.clv) AS avgClv
            ORDER BY totalRevenue DESC
            """)
    List<Map<String, Object>> getSegmentStats();

    /**
     * Get new customers count by month
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WHERE c.created_at IS NOT NULL
            WITH c,
                 toString(c.created_at.year) + '-' +
                 CASE WHEN c.created_at.month < 10
                      THEN '0' + toString(c.created_at.month)
                      ELSE toString(c.created_at.month) END AS month
            RETURN month, count(c) AS newCustomers
            ORDER BY month DESC
            LIMIT 12
            """)
    List<Map<String, Object>> getNewCustomersByMonth();

    /**
     * Get customer purchase patterns (day of week)
     */
    @Query("""
            MATCH (c:CRM_Customer)-[:PLACED_ORDER]->(o:CRM_Order)
            WHERE o.order_date IS NOT NULL
            WITH o.order_date.dayOfWeek AS dayOfWeek, count(o) AS orderCount
            RETURN dayOfWeek, orderCount
            ORDER BY dayOfWeek
            """)
    List<Map<String, Object>> getPurchasePatternsByDayOfWeek();
}
