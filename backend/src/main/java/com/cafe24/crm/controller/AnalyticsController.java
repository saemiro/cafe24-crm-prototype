package com.cafe24.crm.controller;

import com.cafe24.crm.dto.*;
import com.cafe24.crm.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
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
 * Analytics Controller
 *
 * REST API endpoints for advanced CRM analytics including
 * RFM analysis, conversion funnels, cohort analysis, and CLV predictions.
 */
@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Analytics", description = "CRM Analytics APIs")
@CrossOrigin(origins = {"https://crm.saemiro.com", "http://localhost:3000", "http://localhost:5173"})
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * Get RFM analysis data
     */
    @GetMapping("/rfm")
    @Operation(
            summary = "Get RFM analysis",
            description = "Returns Recency-Frequency-Monetary analysis data including distribution, segments, and matrix for heatmap visualization"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "RFM analysis retrieved successfully",
                    content = @Content(schema = @Schema(implementation = RfmAnalysisDTO.class))
            )
    })
    public ResponseEntity<ApiResponse<RfmAnalysisDTO>> getRfmAnalysis() {
        log.info("GET /analytics/rfm - Fetching RFM analysis");

        try {
            RfmAnalysisDTO rfmData = analyticsService.getRfmAnalysis();
            return ResponseEntity.ok(ApiResponse.success(rfmData));
        } catch (Exception e) {
            log.error("Error fetching RFM analysis: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("RFM_ERROR", "Failed to fetch RFM analysis"));
        }
    }

    /**
     * Get conversion funnel data
     */
    @GetMapping("/funnel")
    @Operation(
            summary = "Get conversion funnel",
            description = "Returns conversion funnel data from visitors to purchases with drop-off rates at each stage"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Funnel data retrieved successfully",
                    content = @Content(schema = @Schema(implementation = FunnelDataDTO.class))
            )
    })
    public ResponseEntity<ApiResponse<FunnelDataDTO>> getFunnelAnalysis() {
        log.info("GET /analytics/funnel - Fetching funnel analysis");

        try {
            FunnelDataDTO funnelData = analyticsService.getFunnelAnalysis();
            return ResponseEntity.ok(ApiResponse.success(funnelData));
        } catch (Exception e) {
            log.error("Error fetching funnel analysis: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("FUNNEL_ERROR", "Failed to fetch funnel analysis"));
        }
    }

    /**
     * Get cohort retention analysis
     */
    @GetMapping("/cohort")
    @Operation(
            summary = "Get cohort analysis",
            description = "Returns cohort retention data showing customer retention rates over time by acquisition cohort"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Cohort data retrieved successfully",
                    content = @Content(schema = @Schema(implementation = CohortDataDTO.class))
            )
    })
    public ResponseEntity<ApiResponse<CohortDataDTO>> getCohortAnalysis() {
        log.info("GET /analytics/cohort - Fetching cohort analysis");

        try {
            CohortDataDTO cohortData = analyticsService.getCohortAnalysis();
            return ResponseEntity.ok(ApiResponse.success(cohortData));
        } catch (Exception e) {
            log.error("Error fetching cohort analysis: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("COHORT_ERROR", "Failed to fetch cohort analysis"));
        }
    }

    /**
     * Get CLV predictions
     */
    @GetMapping("/clv")
    @Operation(
            summary = "Get CLV predictions",
            description = "Returns Customer Lifetime Value predictions including distribution, segment breakdown, and top customers"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "CLV predictions retrieved successfully",
                    content = @Content(schema = @Schema(implementation = ClvPredictionDTO.class))
            )
    })
    public ResponseEntity<ApiResponse<ClvPredictionDTO>> getClvPredictions() {
        log.info("GET /analytics/clv - Fetching CLV predictions");

        try {
            ClvPredictionDTO clvData = analyticsService.getClvPrediction();
            return ResponseEntity.ok(ApiResponse.success(clvData));
        } catch (Exception e) {
            log.error("Error fetching CLV predictions: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("CLV_ERROR", "Failed to fetch CLV predictions"));
        }
    }

    /**
     * Get new customers trend by month
     */
    @GetMapping("/new-customers")
    @Operation(
            summary = "Get new customers by month",
            description = "Returns count of new customers acquired each month"
    )
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getNewCustomersByMonth() {
        log.info("GET /analytics/new-customers");

        try {
            List<Map<String, Object>> data = analyticsService.getNewCustomersByMonth();
            return ResponseEntity.ok(ApiResponse.success(data));
        } catch (Exception e) {
            log.error("Error fetching new customers by month: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("ANALYTICS_ERROR", "Failed to fetch new customer data"));
        }
    }

    /**
     * Get purchase patterns by day of week
     */
    @GetMapping("/purchase-patterns")
    @Operation(
            summary = "Get purchase patterns",
            description = "Returns purchase distribution by day of week"
    )
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPurchasePatterns() {
        log.info("GET /analytics/purchase-patterns");

        try {
            List<Map<String, Object>> patterns = analyticsService.getPurchasePatterns();
            return ResponseEntity.ok(ApiResponse.success(patterns));
        } catch (Exception e) {
            log.error("Error fetching purchase patterns: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("PATTERNS_ERROR", "Failed to fetch purchase patterns"));
        }
    }

    /**
     * Get complete analytics data in one call
     */
    @GetMapping
    @Operation(
            summary = "Get complete analytics",
            description = "Returns all analytics data in a single response for initial load optimization"
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCompleteAnalytics() {
        log.info("GET /analytics - Fetching complete analytics");

        try {
            Map<String, Object> analytics = Map.of(
                    "rfm", analyticsService.getRfmAnalysis(),
                    "funnel", analyticsService.getFunnelAnalysis(),
                    "cohort", analyticsService.getCohortAnalysis(),
                    "clv", analyticsService.getClvPrediction()
            );
            return ResponseEntity.ok(ApiResponse.success(analytics));
        } catch (Exception e) {
            log.error("Error fetching complete analytics: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("ANALYTICS_ERROR", "Failed to fetch analytics data"));
        }
    }

    /**
     * Get RFM segment details
     */
    @GetMapping("/rfm/segments")
    @Operation(
            summary = "Get RFM segments",
            description = "Returns detailed breakdown of RFM segments with recommended actions"
    )
    public ResponseEntity<ApiResponse<List<RfmAnalysisDTO.RfmSegment>>> getRfmSegments() {
        log.info("GET /analytics/rfm/segments");

        try {
            RfmAnalysisDTO rfmData = analyticsService.getRfmAnalysis();
            return ResponseEntity.ok(ApiResponse.success(rfmData.getSegments()));
        } catch (Exception e) {
            log.error("Error fetching RFM segments: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("RFM_ERROR", "Failed to fetch RFM segments"));
        }
    }

    /**
     * Get RFM matrix only (for heatmap)
     */
    @GetMapping("/rfm/matrix")
    @Operation(
            summary = "Get RFM matrix",
            description = "Returns RFM matrix data optimized for heatmap visualization"
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRfmMatrix() {
        log.info("GET /analytics/rfm/matrix");

        try {
            RfmAnalysisDTO rfmData = analyticsService.getRfmAnalysis();
            Map<String, Object> matrixData = Map.of(
                    "matrix", rfmData.getMatrix(),
                    "recencyLabels", rfmData.getRecencyLabels(),
                    "frequencyLabels", rfmData.getFrequencyLabels(),
                    "totalCustomers", rfmData.getTotalCustomers()
            );
            return ResponseEntity.ok(ApiResponse.success(matrixData));
        } catch (Exception e) {
            log.error("Error fetching RFM matrix: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("MATRIX_ERROR", "Failed to fetch RFM matrix"));
        }
    }

    /**
     * Get cohort retention averages
     */
    @GetMapping("/cohort/averages")
    @Operation(
            summary = "Get cohort averages",
            description = "Returns average retention rates across all cohorts"
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCohortAverages() {
        log.info("GET /analytics/cohort/averages");

        try {
            CohortDataDTO cohortData = analyticsService.getCohortAnalysis();
            Map<String, Object> averages = Map.of(
                    "avgRetentionMonth1", cohortData.getAvgRetentionMonth1(),
                    "avgRetentionMonth3", cohortData.getAvgRetentionMonth3(),
                    "avgRetentionMonth6", cohortData.getAvgRetentionMonth6(),
                    "avgRetentionMonth12", cohortData.getAvgRetentionMonth12(),
                    "bestCohort", cohortData.getBestCohort() != null ? cohortData.getBestCohort() : "",
                    "bestCohortRetention", cohortData.getBestCohortRetention() != null ? cohortData.getBestCohortRetention() : 0.0
            );
            return ResponseEntity.ok(ApiResponse.success(averages));
        } catch (Exception e) {
            log.error("Error fetching cohort averages: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("COHORT_ERROR", "Failed to fetch cohort averages"));
        }
    }

    /**
     * Get CLV by segment
     */
    @GetMapping("/clv/segments")
    @Operation(
            summary = "Get CLV by segment",
            description = "Returns CLV breakdown by customer segment"
    )
    public ResponseEntity<ApiResponse<List<ClvPredictionDTO.SegmentClv>>> getClvBySegment() {
        log.info("GET /analytics/clv/segments");

        try {
            ClvPredictionDTO clvData = analyticsService.getClvPrediction();
            return ResponseEntity.ok(ApiResponse.success(clvData.getSegmentClv()));
        } catch (Exception e) {
            log.error("Error fetching CLV by segment: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("CLV_ERROR", "Failed to fetch CLV by segment"));
        }
    }

    /**
     * Get top CLV customers
     */
    @GetMapping("/clv/top-customers")
    @Operation(
            summary = "Get top CLV customers",
            description = "Returns customers with highest predicted lifetime value"
    )
    public ResponseEntity<ApiResponse<List<ClvPredictionDTO.TopCustomerClv>>> getTopClvCustomers() {
        log.info("GET /analytics/clv/top-customers");

        try {
            ClvPredictionDTO clvData = analyticsService.getClvPrediction();
            return ResponseEntity.ok(ApiResponse.success(clvData.getTopCustomers()));
        } catch (Exception e) {
            log.error("Error fetching top CLV customers: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("CLV_ERROR", "Failed to fetch top CLV customers"));
        }
    }
}
