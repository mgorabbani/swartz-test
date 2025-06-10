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
      <div className="search-suggestions">
        <div className="search-suggestions-header">
          <span className="search-suggestions-title">Recent Searches</span>
          <button
            onClick={handleClearHistory}
            className="clear-history-btn"
            aria-label="Clear search history"
            type="button"
          >
            Clear
          </button>
        </div>
        <ul className="search-suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion}-${index}`}
              className="search-suggestion-item"
            >
              <button
                onClick={() => handleSuggestionClick(suggestion)}
                className="search-suggestion-btn"
                type="button"
              >
                <span className="suggestion-icon">🔍</span>
                <span className="suggestion-text">{suggestion}</span>
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
