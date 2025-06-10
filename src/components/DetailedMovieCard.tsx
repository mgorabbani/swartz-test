import React, { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import type { Movie } from "../types/movie";

interface DetailedMovieCardProps {
  movie: Movie;
}

const DetailedMovieCard: React.FC<DetailedMovieCardProps> = memo(
  ({ movie }) => {
    const { removeFromFavorites } = useFavorites();

    const formatDate = useCallback((dateString: string) => {
      const date = new Date(dateString);
      return date.getFullYear();
    }, []);

    const handleImageError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.src = "https://placehold.co/300x450?text=No+Image";
      },
      []
    );

    const handleRemoveFromFavorites = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        removeFromFavorites(movie.id);
      },
      [movie.id, removeFromFavorites]
    );

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Movie Poster */}
          <div className="flex-shrink-0 sm:w-48">
            <Link to={`/movie/${movie.id}`}>
              <img
                src={movie.poster}
                alt={`${movie.title} poster`}
                onError={handleImageError}
                loading="lazy"
                className="w-full h-64 sm:h-72 object-cover hover:opacity-95 transition-opacity"
              />
            </Link>
          </div>

          {/* Movie Details */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              {/* Title and Year */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <Link to={`/movie/${movie.id}`} className="block group">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {movie.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formatDate(movie.releaseDate)}
                    {movie.duration && (
                      <span className="ml-2">• {movie.duration}</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={handleRemoveFromFavorites}
                  className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  aria-label={`Remove ${movie.title} from favorites`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Rating */}
              {movie.rating && (
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {movie.rating}/10
                    </span>
                  </div>
                </div>
              )}

              {/* Genres */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {movie.genres.slice(0, 4).map((genre) => (
                    <span
                      key={genre}
                      className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full dark:bg-indigo-900/30 dark:text-indigo-300"
                    >
                      {genre}
                    </span>
                  ))}
                  {movie.genres.length > 4 && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full dark:bg-gray-700 dark:text-gray-400">
                      +{movie.genres.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Plot */}
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                {movie.plot}
              </p>

              {/* Director and Cast */}
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Director:
                  </span>
                  <span className="ml-2 text-sm text-gray-900 dark:text-white">
                    {movie.director}
                  </span>
                </div>

                {movie.cast.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Cast:
                    </span>
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                      {movie.cast.slice(0, 3).join(", ")}
                      {movie.cast.length > 3 &&
                        ` +${movie.cast.length - 3} more`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                to={`/movie/${movie.id}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
              >
                View Details
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DetailedMovieCard.displayName = "DetailedMovieCard";

export default DetailedMovieCard;
