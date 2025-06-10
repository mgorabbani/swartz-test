import React, { memo, useEffect } from "react";
import DetailedMovieCard from "./DetailedMovieCard";
import SkeletonLoader from "./SkeletonLoader";
import Pagination from "./Pagination";
import { usePagination } from "../utils/usePagination";
import type { Movie } from "../types/movie";

interface DetailedMovieListProps {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

const MOVIES_PER_PAGE = 5; // Fewer items per page since cards are larger

const DetailedMovieList: React.FC<DetailedMovieListProps> = memo(
  ({ movies, loading, error, hasSearched }) => {
    const pagination = usePagination({
      data: movies,
      itemsPerPage: MOVIES_PER_PAGE,
    });

    // Reset to first page when movies change (new filter applied)
    useEffect(() => {
      pagination.resetPage();
    }, [movies.length]);

    if (loading) {
      return (
        <div className="mt-8">
          <div className="space-y-6">
            <SkeletonLoader variant="card" count={MOVIES_PER_PAGE} />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="mt-8 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-lg mx-auto">
            <strong className="font-bold">❌ Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <p className="text-sm mt-2">
              Please try again or search for different movies.
            </p>
          </div>
        </div>
      );
    }

    const renderEmptyState = (message: string, hint: string) => (
      <div className="mt-8 text-center py-16 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            {message}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">{hint}</p>
        </div>
      </div>
    );

    if (movies.length === 0) {
      return hasSearched
        ? renderEmptyState(
            "No movies found",
            "Try adjusting your filters or add more movies to your favorites."
          )
        : renderEmptyState(
            "No favorite movies yet",
            "Start adding movies to your favorites to see them here."
          );
    }

    return (
      <div className="mt-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            My Favorite Movies
            <span className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
              ({movies.length} total)
            </span>
          </h2>
        </div>

        {/* Movie Cards List */}
        <div className="space-y-6">
          {pagination.currentData.map((movie) => (
            <DetailedMovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onPageChange={pagination.goToPage}
          onNextPage={pagination.nextPage}
          onPreviousPage={pagination.previousPage}
        />
      </div>
    );
  }
);

DetailedMovieList.displayName = "DetailedMovieList";

export default DetailedMovieList;
