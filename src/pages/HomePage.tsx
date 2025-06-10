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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          🎬 Movie Search
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover your favorite movies and save them to your collection
        </p>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="flex flex-col sm:flex-row items-start gap-2">
          <div
            className="relative w-full sm:flex-grow"
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          >
            <SearchBar
              query={query}
              onQueryChange={handleQueryChange}
              loading={loading}
              placeholder="Search for movies by title, director, actor, or genre..."
            />
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

        <MovieList
          movies={filteredMovies}
          loading={loading}
          error={error}
          hasSearched={hasSearched}
        />
      </div>
    </div>
  );
};

export default HomePage;
