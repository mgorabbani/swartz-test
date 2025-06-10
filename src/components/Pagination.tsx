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
      <div className="flex flex-col md:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 gap-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p>
            Showing <span className="font-medium">{startIndex}</span> to{" "}
            <span className="font-medium">{endIndex}</span> of{" "}
            <span className="font-medium">{totalItems}</span> movies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousPage}
            disabled={!hasPreviousPage}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Previous page"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {typeof page === "number" ? (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      page === currentPage
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                ) : (
                  <span
                    className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                  >
                    {page}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={onNextPage}
            disabled={!hasNextPage}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
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
