import { useState, useMemo, useCallback } from "react";
import type { MovieSearchResult } from "../types/movie";
import type { FilterState } from "../components/SearchFilters";

export const useMovieFilters = (movies: MovieSearchResult[]) => {
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    yearRange: { min: 1970, max: 2024 },
    minRating: 0,
  });

  const [filtersOpen, setFiltersOpen] = useState(false);

  // Extract available genres from movies
  const availableGenres = useMemo(() => {
    const genreSet = new Set<string>();
    movies.forEach((movie) => {
      // Since MovieSearchResult doesn't have genres, we'll use a predefined list
      // In a real app, this would come from the full movie data
    });

    // Predefined genres based on our mock data
    return [
      "Action",
      "Adventure",
      "Biography",
      "Comedy",
      "Crime",
      "Drama",
      "Romance",
      "Sci-Fi",
      "Thriller",
    ];
  }, [movies]);

  // Apply filters to movies
  const filteredMovies = useMemo(() => {
    if (!movies.length) return movies;

    return movies.filter((movie) => {
      // For this implementation, we'll need to mock the genre/rating data
      // since MovieSearchResult doesn't have all movie details
      const movieYear = new Date(movie.releaseDate).getFullYear();

      // Year range filter
      if (
        movieYear < filters.yearRange.min ||
        movieYear > filters.yearRange.max
      ) {
        return false;
      }

      // For demo purposes, we'll simulate genre filtering based on movie title
      // In a real app, you'd have this data from the API
      if (filters.genres.length > 0) {
        // Simple heuristic for demo - match genres to movie titles
        const movieTitle = movie.title.toLowerCase();
        const hasMatchingGenre = filters.genres.some((genre) => {
          switch (genre.toLowerCase()) {
            case "action":
              return (
                movieTitle.includes("dark") || movieTitle.includes("matrix")
              );
            case "crime":
              return (
                movieTitle.includes("godfather") ||
                movieTitle.includes("goodfellas") ||
                movieTitle.includes("pulp")
              );
            case "drama":
              return (
                movieTitle.includes("shawshank") ||
                movieTitle.includes("forrest") ||
                movieTitle.includes("parasite")
              );
            case "sci-fi":
              return (
                movieTitle.includes("matrix") ||
                movieTitle.includes("inception") ||
                movieTitle.includes("interstellar")
              );
            case "thriller":
              return (
                movieTitle.includes("dark") ||
                movieTitle.includes("inception") ||
                movieTitle.includes("parasite")
              );
            default:
              return true; // Allow other genres for demo
          }
        });

        if (!hasMatchingGenre) {
          return false;
        }
      }

      // For demo purposes, simulate rating filter based on movie popularity
      // In a real app, you'd have actual ratings from the API
      if (filters.minRating > 0) {
        // Simulate ratings based on movie position (first movies are "higher rated")
        const simulatedRating = 10 - movies.indexOf(movie) * 0.5;
        if (simulatedRating < filters.minRating) {
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
