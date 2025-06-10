import React from "react";
import { useParams, Link } from "react-router-dom";
import { useMovieDetails } from "../utils/useMovieDetails";
import { useFavorites } from "../context/FavoritesContext";
import SkeletonLoader from "../components/SkeletonLoader";

const MovieDetailsPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { movie, loading, error, retry } = useMovieDetails(movieId);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleFavoriteClick = () => {
    if (!movie) return;

    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  if (loading) {
    return (
      <div className="movie-details-page">
        <Link to="/" className="back-link">
          ← Back to Search
        </Link>
        <SkeletonLoader variant="details" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-details-page">
        <div className="error-state">
          <p className="error-message">❌ {error}</p>
          <p className="error-hint">
            Unable to load movie details. This could be due to a network issue.
          </p>
          <button onClick={retry} className="retry-btn">
            Try Again
          </button>
          <Link to="/" className="back-link">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-page">
        <div className="error-state">
          <p className="error-message">Movie not found</p>
          <p className="error-hint">
            The movie you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="back-link">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isMovieFavorite = isFavorite(movie.id);

  return (
    <div className="movie-details-page">
      <Link to="/" className="back-link">
        ← Back to Search
      </Link>

      <div className="movie-details-container">
        <div className="movie-poster-section">
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            className="movie-details-poster"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/400x600?text=No+Image";
            }}
          />
        </div>

        <div className="movie-info-section">
          <div className="movie-header">
            <h1 className="movie-details-title">{movie.title}</h1>
            <div className="movie-meta">
              <span className="movie-year">
                {new Date(movie.releaseDate).getFullYear()}
              </span>
              {movie.duration && (
                <span className="movie-duration">• {movie.duration}</span>
              )}
              {movie.rating && (
                <span className="movie-rating">• ⭐ {movie.rating}/10</span>
              )}
            </div>
          </div>

          <div className="movie-genres">
            {movie.genres.map((genre) => (
              <span key={genre} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>

          <div className="movie-section">
            <h3>Plot</h3>
            <p className="movie-plot">{movie.plot}</p>
          </div>

          <div className="movie-section">
            <h3>Director</h3>
            <p className="movie-director">{movie.director}</p>
          </div>

          <div className="movie-section">
            <h3>Cast</h3>
            <div className="movie-cast">
              {movie.cast.map((actor, index) => (
                <span key={actor} className="cast-member">
                  {actor}
                  {index < movie.cast.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>

          <div className="movie-section">
            <h3>Release Date</h3>
            <p className="movie-release-date">
              {formatDate(movie.releaseDate)}
            </p>
          </div>

          <div className="movie-actions">
            <button
              onClick={handleFavoriteClick}
              className={`favorite-btn ${isMovieFavorite ? "favorited" : ""}`}
              aria-label={
                isMovieFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isMovieFavorite
                ? "❤️ Remove from Favorites"
                : "🤍 Add to Favorites"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
