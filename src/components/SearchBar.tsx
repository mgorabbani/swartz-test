import React, { memo, useCallback } from "react";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  loading: boolean;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = memo(
  ({ query, onQueryChange, loading, placeholder = "Search for movies..." }) => {
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onQueryChange(e.target.value);
      },
      [onQueryChange]
    );

    const handleClear = useCallback(() => {
      onQueryChange("");
    }, [onQueryChange]);

    return (
      <div className="search-bar">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="search-input"
            disabled={loading}
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={handleClear}
              className="search-clear-btn"
              aria-label="Clear search"
              type="button"
            >
              ✕
            </button>
          )}
          {loading && (
            <div className="search-spinner" aria-label="Searching...">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
