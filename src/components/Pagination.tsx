import React, { memo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const Pagination: React.FC<PaginationProps> = memo(
  ({
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
    onPageChange,
    onNextPage,
    onPreviousPage,
  }) => {
    if (totalPages <= 1) {
      return null;
    }

    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const showPages = 5; // Number of page buttons to show
      const half = Math.floor(showPages / 2);

      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, start + showPages - 1);

      // Adjust start if we're near the end
      if (end - start + 1 < showPages) {
        start = Math.max(1, end - showPages + 1);
      }

      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("...");
        }
      }

      // Add page numbers
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add last page and ellipsis if needed
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }

      return pages;
    };

    return (
      <div className="pagination-container">
        <div className="pagination-info">
          <p className="pagination-text">
            Showing {startIndex}-{endIndex} of {totalItems} movies
          </p>
        </div>

        <div className="pagination-controls">
          <button
            onClick={onPreviousPage}
            disabled={!hasPreviousPage}
            className="pagination-btn pagination-btn-nav"
            aria-label="Previous page"
          >
            ← Previous
          </button>

          <div className="pagination-pages">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {typeof page === "number" ? (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`pagination-btn pagination-btn-page ${
                      page === currentPage ? "active" : ""
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                ) : (
                  <span className="pagination-ellipsis" aria-hidden="true">
                    {page}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={onNextPage}
            disabled={!hasNextPage}
            className="pagination-btn pagination-btn-nav"
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export default Pagination;
