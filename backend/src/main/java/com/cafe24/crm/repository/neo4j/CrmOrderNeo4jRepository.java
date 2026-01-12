package com.cafe24.crm.repository.neo4j;

import com.cafe24.crm.domain.neo4j.CrmOrderNode;
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
 * Neo4j Repository for CRM Order operations
 *
 * Provides custom Cypher queries for order analytics,
 * time series data, funnel metrics, and cohort analysis.
 */
@Repository
public interface CrmOrderNeo4jRepository extends Neo4jRepository<CrmOrderNode, String> {

    /**
     * Find order by orderId
     */
    Optional<CrmOrderNode> findByOrderId(String orderId);

    /**
     * Find orders by customer ID
     */
    @Query("""
            MATCH (o:CRM_Order)
            WHERE o.customer_id = $customerId
            RETURN o
            ORDER BY o.order_date DESC
            """)
    List<CrmOrderNode> findByCustomerId(@Param("customerId") String customerId);

    /**
     * Find recent orders with limit
     */
    @Query("""
            MATCH (o:CRM_Order)
            RETURN o
            ORDER BY o.order_date DESC, o.created_at DESC
            LIMIT $limit
            """)
    List<CrmOrderNode> findRecentOrders(@Param("limit") int limit);

    /**
     * Find recent orders with customer info
     */
    @Query("""
            MATCH (c:CRM_Customer)-[:PLACED_ORDER]->(o:CRM_Order)
            RETURN o.order_id AS orderId,
                   o.order_date AS orderDate,
                   o.total_amount AS totalAmount,
                   o.status AS status,
                   o.item_count AS itemCount,
                   c.customer_id AS customerId,
                   c.name AS customerName,
                   c.segment AS customerSegment
            ORDER BY o.order_date DESC, o.created_at DESC
            LIMIT $limit
            """)
    List<Map<String, Object>> findRecentOrdersWithCustomer(@Param("limit") int limit);

    /**
     * Get orders by month for time series chart
     */
    @Query("""
            MATCH (o:CRM_Order)
            WHERE o.order_date IS NOT NULL
            WITH o,
                 toString(o.order_date.year) + '-' +
                 CASE WHEN o.order_date.month < 10
                      THEN '0' + toString(o.order_date.month)
                      ELSE toString(o.order_date.month) END AS month
            RETURN month,
                   count(o) AS orderCount,
                   sum(o.total_amount) AS totalRevenue,
                   avg(o.total_amount) AS avgOrderValue
            ORDER BY month DESC
            LIMIT $months
            """)
    List<Map<String, Object>> getOrdersByMonth(@Param("months") int months);

    /**
     * Get revenue by month for time series
     */
    @Query("""
            MATCH (o:CRM_Order)
            WHERE o.order_date IS NOT NULL AND o.status <> 'cancelled'
            WITH o,
                 toString(o.order_date.year) + '-' +
                 CASE WHEN o.order_date.month < 10
                      THEN '0' + toString(o.order_date.month)
                      ELSE toString(o.order_date.month) END AS month
            RETURN month,
                   sum(o.total_amount) AS revenue,
                   count(o) AS orders
            ORDER BY month
            """)
    List<Map<String, Object>> getRevenueByMonth();

    /**
     * Get funnel metrics (visit -> view -> cart -> purchase)
     */
    @Query("""
            MATCH (c:CRM_Customer)
            OPTIONAL MATCH (c)-[:VIEWED]->(viewed:CRM_Product)
            OPTIONAL MATCH (c)-[:PLACED_ORDER]->(o:CRM_Order)
            WITH count(DISTINCT c) AS totalVisitors,
                 count(DISTINCT CASE WHEN viewed IS NOT NULL THEN c END) AS productViewers,
                 count(DISTINCT CASE WHEN o IS NOT NULL THEN c END) AS purchasers
            RETURN totalVisitors,
                   productViewers,
                   purchasers,
                   CASE WHEN totalVisitors > 0
                        THEN toFloat(productViewers) / totalVisitors * 100
                        ELSE 0 END AS viewRate,
                   CASE WHEN productViewers > 0
                        THEN toFloat(purchasers) / productViewers * 100
                        ELSE 0 END AS purchaseRate
            """)
    Map<String, Object> getFunnelMetrics();

    /**
     * Get detailed funnel data
     */
    @Query("""
            MATCH (c:CRM_Customer)
            WITH count(c) AS totalCustomers
            MATCH (c2:CRM_Customer)-[:VIEWED]->(p:CRM_Product)
            WITH totalCustomers, count(DISTINCT c2) AS viewers
            MATCH (c3:CRM_Customer)-[:PLACED_ORDER]->(o:CRM_Order)-[:CONTAINS]->(prod:CRM_Product)
            WITH totalCustomers, viewers, count(DISTINCT c3) AS buyers
            RETURN
                totalCustomers AS visitors,
                viewers AS productViewed,
                CASE WHEN totalCustomers > 0
                     THEN round(toFloat(viewers) / totalCustomers * 10000) / 100
                     ELSE 0 END AS addedToCart,
                buyers AS purchased,
                CASE WHEN totalCustomers > 0
                     THEN round(toFloat(buyers) / totalCustomers * 10000) / 100
                     ELSE 0 END AS conversionRate
            """)
    Map<String, Object> getDetailedFunnelMetrics();

    /**
     * Get cohort data for retention analysis
     */
    @Query("""
            MATCH (c:CRM_Customer)-[:PLACED_ORDER]->(first_order:CRM_Order)
            WITH c, min(first_order.order_date) AS cohortDate
            WITH c,
                 toString(cohortDate.year) + '-' +
                 CASE WHEN cohortDate.month < 10
                      THEN '0' + toString(cohortDate.month)
                      ELSE toString(cohortDate.month) END AS cohort
            MATCH (c)-[:PLACED_ORDER]->(o:CRM_Order)
            WITH cohort, c, o,
                 duration.inMonths(date(cohort + '-01'), o.order_date).months AS monthsAfter
            WHERE monthsAfter >= 0
            RETURN cohort,
                   monthsAfter,
                   count(DISTINCT c) AS customersActive
            ORDER BY cohort, monthsAfter
            """)
    List<Map<String, Object>> getCohortData();

    /**
     * Get cohort retention matrix
     */
    @Query("""
            MATCH (c:CRM_Customer)-[:PLACED_ORDER]->(first_order:CRM_Order)
            WITH c, min(first_order.order_date) AS firstPurchaseDate
            WITH c,
                 toString(firstPurchaseDate.year) + '-' +
                 CASE WHEN firstPurchaseDate.month < 10
                      THEN '0' + toString(firstPurchaseDate.month)
                      ELSE toString(firstPurchaseDate.month) END AS cohort,
                 firstPurchaseDate
            WITH cohort, count(DISTINCT c) AS cohortSize, collect(c) AS customers
            UNWIND customers AS customer
            MATCH (customer)-[:PLACED_ORDER]->(o:CRM_Order)
            WITH cohort, cohortSize, customer, o,
                 duration.inMonths(date(cohort + '-01'), o.order_date).months AS monthNumber
            WHERE monthNumber >= 0 AND monthNumber <= 12
            WITH cohort, cohortSize, monthNumber, count(DISTINCT customer) AS retained
            RETURN cohort, cohortSize, monthNumber,
                   retained,
                   round(toFloat(retained) / cohortSize * 100) AS retentionRate
            ORDER BY cohort, monthNumber
            """)
    List<Map<String, Object>> getCohortRetentionMatrix();

    /**
     * Get total order count
     */
    @Query("""
            MATCH (o:CRM_Order)
            RETURN count(o)
            """)
    Long getTotalOrderCount();

    /**
     * Get total revenue (excluding cancelled orders)
     */
    @Query("""
            MATCH (o:CRM_Order)
            WHERE o.status IS NULL OR o.status <> 'cancelled'
            RETURN sum(o.total_amount)
            """)
    Double getTotalRevenue();

    /**
     * Get average order value
     */
    @Query("""
            MATCH (o:CRM_Order)
            WHERE o.total_amount IS NOT NULL
              AND (o.status IS NULL OR o.status <> 'cancelled')
            RETURN avg(o.total_amount)
            """)
    Double getAverageOrderValue();

    /**
     * Get orders by status
     */
    @Query("""
            MATCH (o:CRM_Order)
            WHERE o.status IS NOT NULL
            RETURN o.status AS status, count(o) AS count
            ORDER BY count DESC
            """)
    List<Map<String, Object>> getOrdersByStatus();

    /**
     * Get orders by channel
     */
    @Query("""
            MATCH (o:CRM_Order)
            WHERE o.channel IS NOT NULL
            RETURN o.channel AS channel,
                   count(o) AS orderCount,
                   sum(o.total_amount) AS totalRevenue
            ORDER BY totalRevenue DESC
            """)
    List<Map<String, Object>> getOrdersByChannel();

    /**
     * Get orders by payment method
     */
    @Query("""
            MATCH (o:CRM_Order)
            WHERE o.payment_method IS NOT NULL
            RETURN o.payment_method AS paymentMethod,
                   count(o) AS orderCount,
                   sum(o.total_amount) AS totalRevenue
            ORDER BY orderCount DESC
            """)
    List<Map<String, Object>> getOrdersByPaymentMethod();

    /**
     * Get daily order stats for last N days
     */
    @Query("""
            MATCH (o:CRM_Order)
            WHERE o.order_date IS NOT NULL
              AND o.order_date >= date() - duration({days: $days})
            WITH o, toString(o.order_date) AS day
            RETURN day,
                   count(o) AS orderCount,
                   sum(o.total_amount) AS revenue
            ORDER BY day
            """)
    List<Map<String, Object>> getDailyOrderStats(@Param("days") int days);

    /**
     * Get hourly distribution of orders
     */
    @Query("""
            MATCH (o:CRM_Order)
            WHERE o.created_at IS NOT NULL
            WITH o.created_at.hour AS hour, count(o) AS orderCount
            RETURN hour, orderCount
            ORDER BY hour
            """)
    List<Map<String, Object>> getHourlyOrderDistribution();

    /**
     * Get repeat purchase rate
     */
    @Query("""
            MATCH (c:CRM_Customer)-[:PLACED_ORDER]->(o:CRM_Order)
            WITH c, count(o) AS orderCount
            WITH count(c) AS totalCustomers,
                 sum(CASE WHEN orderCount > 1 THEN 1 ELSE 0 END) AS repeatCustomers
            RETURN totalCustomers,
                   repeatCustomers,
                   CASE WHEN totalCustomers > 0
                        THEN round(toFloat(repeatCustomers) / totalCustomers * 100)
                        ELSE 0 END AS repeatRate
            """)
    Map<String, Object> getRepeatPurchaseRate();

    /**
     * Get orders with pagination
     */
    @Query(value = """
            MATCH (o:CRM_Order)
            RETURN o
            ORDER BY o.order_date DESC
            SKIP $skip LIMIT $limit
            """,
            countQuery = """
            MATCH (o:CRM_Order)
            RETURN count(o)
            """)
    Page<CrmOrderNode> findAllOrders(Pageable pageable);
}
