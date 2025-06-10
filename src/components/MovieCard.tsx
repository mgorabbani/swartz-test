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
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-poster">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{formatDate(movie.releaseDate)}</p>
      </div>
    </Link>
  );
});

MovieCard.displayName = "MovieCard";

export default MovieCard;
