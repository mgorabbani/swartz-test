import type {
  MovieSearchResult,
  Movie,
  SearchMoviesResponse,
  GetMovieDetailsResponse,
  ApiError,
} from "../types/movie";
import { mockMovies } from "./mockData";

// Simulate network delay
const NETWORK_DELAY = 800;

// Simulate random failures (5% chance - reduced from 10%)
const shouldSimulateError = () => Math.random() < 0.05;

// Enhanced error handling with retry logic
const createApiError = (message: string, status: number): ApiError => ({
  message,
  status,
});

// Convert full movie data to search result format
const toSearchResult = (movie: Movie): MovieSearchResult => ({
  id: movie.id,
  title: movie.title,
  poster: movie.poster,
  releaseDate: movie.releaseDate,
});

export const searchMovies = async (
  query: string,
  retryCount = 0
): Promise<SearchMoviesResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate random API errors with different types
      if (shouldSimulateError()) {
        const errorTypes = [
          createApiError(
            "Network connection failed. Please check your internet connection.",
            503
          ),
          createApiError(
            "Server is temporarily unavailable. Please try again later.",
            503
          ),
          createApiError(
            "Request timeout. The server took too long to respond.",
            408
          ),
          createApiError(
            "Too many requests. Please wait a moment before searching again.",
            429
          ),
        ];

        const randomError =
          errorTypes[Math.floor(Math.random() * errorTypes.length)];
        reject(randomError);
        return;
      }

      // If no query, return empty results
      if (!query.trim()) {
        resolve({
          data: [],
          success: true,
          message: "Enter a search term to find movies",
        });
        return;
      }

      try {
        // Filter movies by title, director, and genres (case insensitive)
        const filteredMovies = mockMovies.filter(
          (movie) =>
            movie.title.toLowerCase().includes(query.toLowerCase()) ||
            movie.director.toLowerCase().includes(query.toLowerCase()) ||
            movie.genres.some((genre) =>
              genre.toLowerCase().includes(query.toLowerCase())
            ) ||
            movie.cast.some((actor) =>
              actor.toLowerCase().includes(query.toLowerCase())
            )
        );

        const searchResults = filteredMovies.map(toSearchResult);

        resolve({
          data: searchResults,
          success: true,
          message:
            searchResults.length > 0
              ? `Found ${searchResults.length} movie(s) matching "${query}"`
              : `No movies found matching "${query}". Try different keywords.`,
        });
      } catch (error) {
        reject(
          createApiError("An unexpected error occurred while searching.", 500)
        );
      }
    }, NETWORK_DELAY);
  });
};

export const getMovieDetails = async (
  movieId: string,
  retryCount = 0
): Promise<GetMovieDetailsResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate random API errors
      if (shouldSimulateError()) {
        const errorTypes = [
          createApiError(
            "Failed to load movie details. Please check your connection.",
            503
          ),
          createApiError("Movie details are temporarily unavailable.", 503),
          createApiError("Request timeout while loading movie details.", 408),
        ];

        const randomError =
          errorTypes[Math.floor(Math.random() * errorTypes.length)];
        reject(randomError);
        return;
      }

      try {
        const movie = mockMovies.find((m) => m.id === movieId);

        if (!movie) {
          reject(
            createApiError(`Movie with ID "${movieId}" was not found.`, 404)
          );
          return;
        }

        resolve({
          data: movie,
          success: true,
          message: "Movie details loaded successfully",
        });
      } catch (error) {
        reject(
          createApiError(
            "An unexpected error occurred while loading movie details.",
            500
          )
        );
      }
    }, NETWORK_DELAY);
  });
};

// Retry wrapper for API calls
export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on certain error types
      const apiError = error as ApiError;
      if (apiError.status === 404 || apiError.status === 429) {
        throw error;
      }

      if (i < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError!;
};

// Get all movies (for development/testing purposes)
export const getAllMovies = async (): Promise<SearchMoviesResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSimulateError()) {
        reject(createApiError("Failed to load movies list.", 500));
        return;
      }

      try {
        const searchResults = mockMovies.map(toSearchResult);

        resolve({
          data: searchResults,
          success: true,
          message: `Found ${searchResults.length} movies`,
        });
      } catch (error) {
        reject(createApiError("An unexpected error occurred.", 500));
      }
    }, NETWORK_DELAY);
  });
};
