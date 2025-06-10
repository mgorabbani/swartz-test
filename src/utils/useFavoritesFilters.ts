import { useState, useMemo, useCallback } from "react";
import type { Movie } from "../types/movie";
import type { FilterState } from "../components/SearchFilters";

export const useFavoritesFilters = (movies: Movie[]) => {
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    yearRange: { min: 1970, max: 2024 },
    minRating: 0,
  });

  const [filtersOpen, setFiltersOpen] = useState(false);

  // Extract available genres from favorite movies
  const availableGenres = useMemo(() => {
    const genreSet = new Set<string>();
    movies.forEach((movie) => {
      movie.genres.forEach((genre) => genreSet.add(genre));
    });
    return Array.from(genreSet).sort();
  }, [movies]);

  // Apply filters to movies
  const filteredMovies = useMemo(() => {
    if (!movies.length) return movies;

    return movies.filter((movie) => {
      const movieYear = new Date(movie.releaseDate).getFullYear();

      // Year range filter
      if (
        movieYear < filters.yearRange.min ||
        movieYear > filters.yearRange.max
      ) {
        return false;
      }

      // Genre filter
      if (filters.genres.length > 0) {
        const hasMatchingGenre = movie.genres.some((genre) =>
          filters.genres.includes(genre)
        );
        if (!hasMatchingGenre) {
          return false;
        }
      }

      // Rating filter
      if (filters.minRating > 0) {
        if (!movie.rating || movie.rating < filters.minRating) {
          return false;
        }
      }

      return true;
    });
  }, [movies, filters]);

  const toggleFilters = useCallback(() => {
    setFiltersOpen((prev) => !prev);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      genres: [],
      yearRange: { min: 1970, max: 2024 },
      minRating: 0,
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.genres.length > 0 ||
      filters.yearRange.min > 1970 ||
      filters.yearRange.max < 2024 ||
      filters.minRating > 0
    );
  }, [filters]);

  return {
    filters,
    setFilters,
    filteredMovies,
    availableGenres,
    filtersOpen,
    toggleFilters,
    clearFilters,
    hasActiveFilters,
  };
};
