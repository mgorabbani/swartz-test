import React, { memo, useCallback } from "react";

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  onClearHistory: () => void;
  visible: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = memo(
  ({ suggestions, onSuggestionClick, onClearHistory, visible }) => {
    const handleSuggestionClick = useCallback(
      (suggestion: string) => {
        onSuggestionClick(suggestion);
      },
      [onSuggestionClick]
    );

    const handleClearHistory = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onClearHistory();
      },
      [onClearHistory]
    );

    if (!visible || suggestions.length === 0) {
      return null;
    }

    return (
      <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Recent Searches
          </span>
          <button
            onClick={handleClearHistory}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            aria-label="Clear search history"
            type="button"
          >
            Clear
          </button>
        </div>
        <ul className="py-1">
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion}-${index}`}>
              <button
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                type="button"
              >
                <span className="mr-3">🔍</span>
                <span>{suggestion}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
);

SearchSuggestions.displayName = "SearchSuggestions";

export default SearchSuggestions;
