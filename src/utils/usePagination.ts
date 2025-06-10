import { useState, useMemo, useCallback } from "react";

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
}

export const usePagination = <T>({
  data,
  itemsPerPage,
}: UsePaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    return {
      currentData,
      totalItems,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems),
    };
  }, [data, itemsPerPage, currentPage]);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, paginationData.totalPages)));
    },
    [paginationData.totalPages]
  );

  const nextPage = useCallback(() => {
    if (paginationData.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [paginationData.hasNextPage]);

  const previousPage = useCallback(() => {
    if (paginationData.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [paginationData.hasPreviousPage]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    ...paginationData,
    goToPage,
    nextPage,
    previousPage,
    resetPage,
  };
};
