package com.cafe24.crm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Recent Order Display
 *
 * Contains order information for dashboard recent orders list
 * including customer details.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Recent order for dashboard display")
public class RecentOrderDTO {

    @Schema(description = "Order ID", example = "ORD-2024-001234")
    private String orderId;

    @Schema(description = "Customer ID", example = "CUST-001234")
    private String customerId;

    @Schema(description = "Customer name", example = "김철수")
    private String customerName;

    @Schema(description = "Customer segment", example = "VIP")
    private String customerSegment;

    @Schema(description = "Order date")
    private LocalDate orderDate;

    @Schema(description = "Order creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Total order amount", example = "125000")
    private Double totalAmount;

    @Schema(description = "Formatted amount", example = "125,000원")
    private String formattedAmount;

    @Schema(description = "Order status", example = "delivered")
    private String status;

    @Schema(description = "Status display label", example = "배송완료")
    private String statusLabel;

    @Schema(description = "Number of items", example = "3")
    private Integer itemCount;

    @Schema(description = "Product summary", example = "프리미엄 니트 외 2건")
    private String productSummary;

    @Schema(description = "Payment method", example = "card")
    private String paymentMethod;

    @Schema(description = "Order channel", example = "mobile")
    private String channel;

    @Schema(description = "Time ago string", example = "2시간 전")
    private String timeAgo;

    @Schema(description = "Status color for UI", example = "#4CAF50")
    private String statusColor;

    /**
     * Format amount for display
     */
    public String getFormattedAmount() {
        if (totalAmount == null) return "0원";
        return String.format("%,.0f원", totalAmount);
    }

    /**
     * Get status label in Korean
     */
    public String getStatusLabel() {
        if (statusLabel != null) return statusLabel;
        if (status == null) return "Unknown";

        return switch (status.toLowerCase()) {
            case "pending" -> "주문접수";
            case "confirmed" -> "주문확인";
            case "processing" -> "처리중";
            case "shipped" -> "배송중";
            case "delivered", "completed" -> "배송완료";
            case "cancelled" -> "취소됨";
            case "returned" -> "반품";
            case "refunded" -> "환불완료";
            default -> status;
        };
    }

    /**
     * Get status color for UI
     */
    public String getStatusColor() {
        if (statusColor != null) return statusColor;
        if (status == null) return "#9E9E9E";

        return switch (status.toLowerCase()) {
            case "pending" -> "#FF9800";
            case "confirmed" -> "#2196F3";
            case "processing" -> "#03A9F4";
            case "shipped" -> "#00BCD4";
            case "delivered", "completed" -> "#4CAF50";
            case "cancelled" -> "#F44336";
            case "returned" -> "#FF5722";
            case "refunded" -> "#9C27B0";
            default -> "#9E9E9E";
        };
    }

    /**
     * Calculate time ago string
     */
    public String getTimeAgo() {
        if (timeAgo != null) return timeAgo;
        if (createdAt == null && orderDate == null) return "";

        LocalDateTime timestamp = createdAt != null ? createdAt : orderDate.atStartOfDay();
        LocalDateTime now = LocalDateTime.now();

        long minutes = java.time.Duration.between(timestamp, now).toMinutes();

        if (minutes < 1) return "방금 전";
        if (minutes < 60) return minutes + "분 전";

        long hours = minutes / 60;
        if (hours < 24) return hours + "시간 전";

        long days = hours / 24;
        if (days < 7) return days + "일 전";

        long weeks = days / 7;
        if (weeks < 4) return weeks + "주 전";

        long months = days / 30;
        if (months < 12) return months + "개월 전";

        return (days / 365) + "년 전";
    }

    /**
     * Get segment badge color
     */
    public String getSegmentColor() {
        if (customerSegment == null) return "#9E9E9E";

        return switch (customerSegment.toLowerCase()) {
            case "vip", "champions" -> "#4CAF50";
            case "premium", "loyal" -> "#2196F3";
            case "regular" -> "#FF9800";
            case "new" -> "#00BCD4";
            case "at-risk", "at_risk" -> "#FF5722";
            case "churned" -> "#F44336";
            default -> "#607D8B";
        };
    }
}
