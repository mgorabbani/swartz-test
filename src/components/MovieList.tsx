import React, { memo, useMemo, useEffect } from "react";
import MovieCard from "./MovieCard";
import SkeletonLoader from "./SkeletonLoader";
import Pagination from "./Pagination";
import { usePagination } from "../utils/usePagination";
import type { MovieSearchResult } from "../types/movie";

interface MovieListProps {
  movies: MovieSearchResult[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

const MOVIES_PER_PAGE = 8;

const MovieList: React.FC<MovieListProps> = memo(
  ({ movies, loading, error, hasSearched }) => {
    const pagination = usePagination({
      data: movies,
      itemsPerPage: MOVIES_PER_PAGE,
    });

    // Reset to first page when movies change (new search)
    useEffect(() => {
      pagination.resetPage();
    }, [movies.length]);

    const moviesGrid = useMemo(
      () => (
        <div className="movies-grid">
          {pagination.currentData.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ),
      [pagination.currentData]
    );

    if (loading) {
      return (
        <div className="movie-list-container">
          <div className="movies-grid">
            <SkeletonLoader variant="card" count={8} />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="movie-list-container">
          <div className="error-state">
            <p className="error-message">❌ {error}</p>
            <p className="error-hint">
              Please try again or search for different movies
            </p>
          </div>
        </div>
      );
    }

    if (movies.length === 0) {
      if (hasSearched) {
        return (
          <div className="movie-list-container">
            <div className="no-results-state">
              <p className="no-results-message">🎬 No movies found</p>
              <p className="no-results-hint">
                Try a different search term or check your spelling
              </p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="movie-list-container">
            <div className="empty-state">
              <p className="empty-message">🎬 No movies available</p>
              <p className="empty-hint">Please try again later</p>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="movie-list-container">
        <div className="movie-list-header">
          {hasSearched ? (
            <p className="movie-list-title">
              Search Results ({movies.length} movies found)
            </p>
          ) : (
            <p className="movie-list-title">
              Popular Movies ({movies.length} movies)
            </p>
          )}
        </div>
        {moviesGrid}

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

MovieList.displayName = "MovieList";

export default MovieList;
