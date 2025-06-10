import { useState, useEffect } from "react";
import { getMovieDetails } from "../api/movieApi";
import type { Movie, ApiError } from "../types/movie";

export const useMovieDetails = (movieId: string | undefined) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setLoading(false);
      setError("Invalid movie ID");
      setMovie(null);
      return;
    }

    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      setMovie(null);

      try {
        const response = await getMovieDetails(movieId);
        setMovie(response.data);
        setError(null);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const retry = () => {
    if (movieId) {
      setError(null);
      setLoading(true);
      setMovie(null);

      setTimeout(async () => {
        try {
          const response = await getMovieDetails(movieId);
          setMovie(response.data);
          setError(null);
        } catch (err) {
          const apiError = err as ApiError;
          setError(apiError.message);
          setMovie(null);
        } finally {
          setLoading(false);
        }
      }, 100);
    }
  };

  return {
    movie,
    loading,
    error,
    retry,
  };
};
