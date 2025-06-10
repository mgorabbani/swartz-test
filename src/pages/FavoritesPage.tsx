import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import MovieList from "../components/MovieList";
import SearchFilters from "../components/SearchFilters";
import { useFavoritesFilters } from "../utils/useFavoritesFilters";

const FavoritesPage: React.FC = () => {
  const { state } = useFavorites();

  const {
    filters,
    setFilters,
    filteredMovies,
    availableGenres,
    filtersOpen,
    toggleFilters,
  } = useFavoritesFilters(state.favorites);

  if (state.favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            ❤️ My Favorites
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your collection of favorite movies
          </p>
        </div>

        <div className="mt-8 text-center py-16 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              🎬 No favorite movies yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Search for movies and add them to your favorites to see them here
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              🔍 Start Searching
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          ❤️ My Favorites
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {state.favorites.length} movie
          {state.favorites.length !== 1 ? "s" : ""} in your collection
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {state.favorites.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start justify-end gap-2 mb-6">
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableGenres={availableGenres}
              isOpen={filtersOpen}
              onToggle={toggleFilters}
            />
          </div>
        )}

        <MovieList
          movies={filteredMovies}
          loading={false}
          error={null}
          hasSearched={true}
        />
      </div>
    </div>
  );
};

export default FavoritesPage;
