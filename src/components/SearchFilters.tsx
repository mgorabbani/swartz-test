import React, { memo, useCallback } from "react";

export interface FilterState {
  genres: string[];
  yearRange: {
    min: number;
    max: number;
  };
  minRating: number;
}

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableGenres: string[];
  isOpen: boolean;
  onToggle: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = memo(
  ({ filters, onFiltersChange, availableGenres, isOpen, onToggle }) => {
    const handleGenreChange = useCallback(
      (genre: string) => {
        const newGenres = filters.genres.includes(genre)
          ? filters.genres.filter((g) => g !== genre)
          : [...filters.genres, genre];

        onFiltersChange({
          ...filters,
          genres: newGenres,
        });
      },
      [filters, onFiltersChange]
    );

    const handleYearRangeChange = useCallback(
      (type: "min" | "max", value: number) => {
        onFiltersChange({
          ...filters,
          yearRange: {
            ...filters.yearRange,
            [type]: value,
          },
        });
      },
      [filters, onFiltersChange]
    );

    const handleRatingChange = useCallback(
      (rating: number) => {
        onFiltersChange({
          ...filters,
          minRating: rating,
        });
      },
      [filters, onFiltersChange]
    );

    const clearFilters = useCallback(() => {
      onFiltersChange({
        genres: [],
        yearRange: { min: 1970, max: 2024 },
        minRating: 0,
      });
    }, [onFiltersChange]);

    const hasActiveFilters =
      filters.genres.length > 0 ||
      filters.yearRange.min > 1970 ||
      filters.yearRange.max < 2024 ||
      filters.minRating > 0;

    return (
      <div className="search-filters">
        <button
          onClick={onToggle}
          className="filters-toggle-btn"
          aria-expanded={isOpen}
        >
          🔧 Filters
          {hasActiveFilters && <span className="filters-badge">•</span>}
        </button>

        {isOpen && (
          <div className="filters-panel">
            <div className="filters-header">
              <h3>Filter Movies</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear All
                </button>
              )}
            </div>

            <div className="filter-section">
              <h4>Genres</h4>
              <div className="genre-filters">
                {availableGenres.map((genre) => (
                  <label key={genre} className="genre-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.genres.includes(genre)}
                      onChange={() => handleGenreChange(genre)}
                    />
                    <span className="checkbox-custom"></span>
                    {genre}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Release Year</h4>
              <div className="year-filters">
                <div className="year-input-group">
                  <label htmlFor="year-min">From:</label>
                  <input
                    id="year-min"
                    type="number"
                    min="1970"
                    max="2024"
                    value={filters.yearRange.min}
                    onChange={(e) =>
                      handleYearRangeChange(
                        "min",
                        parseInt(e.target.value) || 1970
                      )
                    }
                    className="year-input"
                  />
                </div>
                <div className="year-input-group">
                  <label htmlFor="year-max">To:</label>
                  <input
                    id="year-max"
                    type="number"
                    min="1970"
                    max="2024"
                    value={filters.yearRange.max}
                    onChange={(e) =>
                      handleYearRangeChange(
                        "max",
                        parseInt(e.target.value) || 2024
                      )
                    }
                    className="year-input"
                  />
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h4>Minimum Rating</h4>
              <div className="rating-filters">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) =>
                    handleRatingChange(parseFloat(e.target.value))
                  }
                  className="rating-slider"
                />
                <div className="rating-display">
                  {filters.minRating > 0
                    ? `${filters.minRating}+ ⭐`
                    : "Any Rating"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

SearchFilters.displayName = "SearchFilters";

export default SearchFilters;
