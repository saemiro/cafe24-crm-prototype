package com.cafe24.crm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Paginated Response Wrapper
 *
 * Provides consistent pagination structure for list endpoints
 * with page metadata and navigation info.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Paginated response wrapper")
public class PageResponse<T> {

    @Schema(description = "List of items in current page")
    private List<T> content;

    @Schema(description = "Current page number (0-based)", example = "0")
    private Integer page;

    @Schema(description = "Items per page", example = "20")
    private Integer size;

    @Schema(description = "Total number of items", example = "1542")
    private Long totalElements;

    @Schema(description = "Total number of pages", example = "78")
    private Integer totalPages;

    @Schema(description = "Is first page", example = "true")
    private Boolean first;

    @Schema(description = "Is last page", example = "false")
    private Boolean last;

    @Schema(description = "Has next page", example = "true")
    private Boolean hasNext;

    @Schema(description = "Has previous page", example = "false")
    private Boolean hasPrevious;

    @Schema(description = "Number of items in current page", example = "20")
    private Integer numberOfElements;

    @Schema(description = "Is current page empty", example = "false")
    private Boolean empty;

    /**
     * Create from Spring Data Page
     */
    public static <T> PageResponse<T> from(Page<T> page) {
        return PageResponse.<T>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .numberOfElements(page.getNumberOfElements())
                .empty(page.isEmpty())
                .build();
    }

    /**
     * Create from list with manual pagination info
     */
    public static <T> PageResponse<T> of(List<T> content, int page, int size, long totalElements) {
        int totalPages = (int) Math.ceil((double) totalElements / size);
        return PageResponse.<T>builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .first(page == 0)
                .last(page >= totalPages - 1)
                .hasNext(page < totalPages - 1)
                .hasPrevious(page > 0)
                .numberOfElements(content.size())
                .empty(content.isEmpty())
                .build();
    }

    /**
     * Create empty page response
     */
    public static <T> PageResponse<T> empty(int page, int size) {
        return PageResponse.<T>builder()
                .content(List.of())
                .page(page)
                .size(size)
                .totalElements(0L)
                .totalPages(0)
                .first(true)
                .last(true)
                .hasNext(false)
                .hasPrevious(false)
                .numberOfElements(0)
                .empty(true)
                .build();
    }
}
