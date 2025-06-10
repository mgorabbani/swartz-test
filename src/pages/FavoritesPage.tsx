import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import type { Movie } from "../types/movie";

const FavoritesPage: React.FC = () => {
  const { state, removeFromFavorites } = useFavorites();

  const handleRemoveFromFavorites = (
    movieId: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault(); // Prevent navigation when clicking remove button
    removeFromFavorites(movieId);
  };

  if (state.favorites.length === 0) {
    return (
      <div className="favorites-page">
        <h1 className="page-title">❤️ My Favorites</h1>
        <div className="empty-favorites-state">
          <p className="empty-message">🎬 No favorite movies yet</p>
          <p className="empty-hint">
            Search for movies and add them to your favorites to see them here
          </p>
          <Link to="/" className="search-link">
            🔍 Start Searching
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1 className="page-title">❤️ My Favorites</h1>
        <p className="favorites-count">
          {state.favorites.length} movie
          {state.favorites.length !== 1 ? "s" : ""} in your collection
        </p>
      </div>

      <div className="favorites-grid">
        {state.favorites.map((movie) => (
          <FavoriteMovieCard
            key={movie.id}
            movie={movie}
            onRemove={handleRemoveFromFavorites}
          />
        ))}
      </div>
    </div>
  );
};

interface FavoriteMovieCardProps {
  movie: Movie;
  onRemove: (movieId: string, event: React.MouseEvent) => void;
}

const FavoriteMovieCard: React.FC<FavoriteMovieCardProps> = ({
  movie,
  onRemove,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  return (
    <div className="favorite-movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-card-link">
        <div className="movie-poster">
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/300x450?text=No+Image";
            }}
          />
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-year">{formatDate(movie.releaseDate)}</p>
          <div className="movie-genres-small">
            {movie.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="genre-tag-small">
                {genre}
              </span>
            ))}
          </div>
          {movie.rating && (
            <div className="movie-rating-small">⭐ {movie.rating}/10</div>
          )}
        </div>
      </Link>
      <button
        onClick={(e) => onRemove(movie.id, e)}
        className="remove-favorite-btn"
        aria-label={`Remove ${movie.title} from favorites`}
      >
        ❌
      </button>
    </div>
  );
};

export default FavoritesPage;
