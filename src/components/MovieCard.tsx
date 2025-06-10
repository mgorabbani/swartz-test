import React, { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import type { MovieSearchResult } from "../types/movie";

interface MovieCardProps {
  movie: MovieSearchResult;
}

const MovieCard: React.FC<MovieCardProps> = memo(({ movie }) => {
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

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl focus:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="relative">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          onError={handleImageError}
          loading="lazy"
          className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {formatDate(movie.releaseDate)}
        </p>
      </div>
    </Link>
  );
});

MovieCard.displayName = "MovieCard";

export default MovieCard;
