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
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-lg text-gray-800 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow shadow-sm hover:shadow-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          disabled={loading}
          autoComplete="off"
          spellCheck={false}
        />
        {query && !loading && (
          <button
            onClick={handleClear}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
            aria-label="Clear search"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        {loading && (
          <div
            className="absolute top-1/2 right-4 transform -translate-y-1/2"
            aria-label="Searching..."
          >
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          </div>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
