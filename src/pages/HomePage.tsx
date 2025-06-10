import React, { useState, useCallback } from "react";
import SearchBar from "../components/SearchBar";
import SearchSuggestions from "../components/SearchSuggestions";
import MovieList from "../components/MovieList";
import { useMovieSearch } from "../utils/useMovieSearch";
import { useMovieFilters } from "../utils/useMovieFilters";
import SearchFilters from "../components/SearchFilters";

const HomePage: React.FC = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    query,
    setQuery,
    results,
    loading,
    error,
    hasSearched,
    searchHistory,
    searchFromHistory,
    clearSearchHistory,
  } = useMovieSearch();

  const {
    filters,
    setFilters,
    filteredMovies,
    availableGenres,
    filtersOpen,
    toggleFilters,
  } = useMovieFilters(results);

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      setShowSuggestions(newQuery.length === 0 && searchHistory.length > 0);
    },
    [setQuery, searchHistory.length]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      searchFromHistory(suggestion);
      setShowSuggestions(false);
    },
    [searchFromHistory]
  );

  const handleSearchFocus = useCallback(() => {
    if (query.length === 0 && searchHistory.length > 0) {
      setShowSuggestions(true);
    }
  }, [query.length, searchHistory.length]);

  const handleSearchBlur = useCallback(() => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 150);
  }, []);

  const handleClearHistory = useCallback(() => {
    clearSearchHistory();
    setShowSuggestions(false);
  }, [clearSearchHistory]);

  return (
    <div className="home-page">
      <div className="search-section">
        <h1 className="page-title">🎬 Movie Search</h1>
        <p className="page-subtitle">
          Discover your favorite movies and save them to your collection
        </p>

        <div className="search-controls">
          <div className="search-container">
            <div onFocus={handleSearchFocus} onBlur={handleSearchBlur}>
              <SearchBar
                query={query}
                onQueryChange={handleQueryChange}
                loading={loading}
                placeholder="Search for movies by title, director, actor, or genre..."
              />
            </div>

            <SearchSuggestions
              suggestions={searchHistory}
              onSuggestionClick={handleSuggestionClick}
              onClearHistory={handleClearHistory}
              visible={showSuggestions}
            />
          </div>

          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableGenres={availableGenres}
            isOpen={filtersOpen}
            onToggle={toggleFilters}
          />
        </div>
      </div>

      <MovieList
        movies={filteredMovies}
        loading={loading}
        error={error}
        hasSearched={hasSearched}
      />
    </div>
  );
};

export default HomePage;
