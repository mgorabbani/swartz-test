import React, { useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useMovieDetails } from "../utils/useMovieDetails";
import { useFavorites } from "../context/FavoritesContext";
import SkeletonLoader from "../components/SkeletonLoader";
import type { Movie } from "../types/movie";

const MovieDetailsPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { movie, loading, error, retry } = useMovieDetails(movieId);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleFavoriteClick = useCallback(() => {
    if (!movie) return;
    const movieData = movie as Movie;
    isFavorite(movieData.id)
      ? removeFromFavorites(movieData.id)
      : addToFavorites(movieData);
  }, [movie, isFavorite, removeFromFavorites, addToFavorites]);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement;
      target.src = "https://placehold.co/400x600?text=No+Image";
    },
    []
  );

  const renderLoading = () => (
    <div className="container mx-auto px-4 py-8">
      <SkeletonLoader variant="details" />
    </div>
  );

  const renderError = (message: string, showRetry: boolean = false) => (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-6 rounded-lg max-w-lg mx-auto">
        <h3 className="text-xl font-bold mb-2">❌ An Error Occurred</h3>
        <p className="mb-4">{message}</p>
        {showRetry && (
          <button
            onClick={retry}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        )}
        <Link
          to="/"
          className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Back to Search
        </Link>
      </div>
    </div>
  );

  if (loading) return renderLoading();
  if (error)
    return renderError(
      "Could not load movie details. Please check your connection and try again.",
      true
    );
  if (!movie) return renderError("Sorry, we couldn't find this movie.");

  const isMovieFavorite = isFavorite(movie.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-6"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        Back to Search
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              onError={handleImageError}
              className="h-full w-full object-cover md:w-80"
            />
          </div>
          <div className="p-8 md:p-12 flex-grow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                  {movie.title}
                </h1>
                <div className="text-lg text-gray-500 dark:text-gray-400 mt-2 flex items-center space-x-3">
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                  {movie.duration && (
                    <>
                      <span>•</span>
                      <span>{movie.duration}</span>
                    </>
                  )}
                  {movie.rating && (
                    <>
                      <span>•</span>
                      <span className="flex items-center">
                        ⭐ {movie.rating.toFixed(1)}/10
                      </span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={handleFavoriteClick}
                className={`flex-shrink-0 ml-4 p-3 rounded-full transition-colors duration-300 ${
                  isMovieFavorite
                    ? "bg-red-100 text-red-500 hover:bg-red-200"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
                aria-label={
                  isMovieFavorite ? "Remove from favorites" : "Add to favorites"
                }
              >
                <svg
                  className="w-6 h-6"
                  fill={isMovieFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-full dark:bg-indigo-900 dark:text-indigo-200"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Plot
                </h2>
                <p className="leading-relaxed">{movie.plot}</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Director
                </h2>
                <p>{movie.director}</p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Cast
                </h2>
                <p>{movie.cast.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
