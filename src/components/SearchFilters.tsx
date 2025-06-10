import React, { memo, useCallback, useRef, useEffect } from "react";

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
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          filterRef.current &&
          !filterRef.current.contains(event.target as Node)
        ) {
          if (isOpen) {
            onToggle();
          }
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, onToggle]);

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
      <div className="relative" ref={filterRef}>
        <button
          onClick={onToggle}
          className={`flex w-full sm:w-auto items-center justify-center px-5 py-3 text-base font-medium text-gray-700 bg-white border-2 rounded-2xl transition-colors duration-200 shadow-sm
            ${isOpen ? "border-indigo-500" : "border-gray-300"}
            hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
            dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:border-indigo-500`}
          aria-expanded={isOpen}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 4H3M17 10H7M13 16H11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>

          <span className="ml-2 hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="ml-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-96 p-6 bg-white dark:bg-gray-800 border dark:border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Filter Movies
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  Genres
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {availableGenres.map((genre) => (
                    <label
                      key={genre}
                      className="flex items-center text-gray-600 dark:text-gray-300 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.genres.includes(genre)}
                        onChange={() => handleGenreChange(genre)}
                        className="h-5 w-5 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500 mr-2"
                      />
                      {genre}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  Release Year
                </h4>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="year-min"
                      className="block text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      From
                    </label>
                    <input
                      id="year-min"
                      type="number"
                      value={filters.yearRange.min}
                      onChange={(e) =>
                        handleYearRangeChange(
                          "min",
                          parseInt(e.target.value) || 1970
                        )
                      }
                      className="w-full mt-1 bg-transparent text-lg font-semibold p-0 border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="year-max"
                      className="block text-sm font-medium text-gray-500 dark:text-gray-400"
                    >
                      To
                    </label>
                    <input
                      id="year-max"
                      type="number"
                      value={filters.yearRange.max}
                      onChange={(e) =>
                        handleYearRangeChange(
                          "max",
                          parseInt(e.target.value) || 2024
                        )
                      }
                      className="w-full mt-1 bg-transparent text-lg font-semibold p-0 border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  Minimum Rating
                </h4>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    value={filters.minRating}
                    onChange={(e) =>
                      handleRatingChange(parseFloat(e.target.value))
                    }
                    min="0"
                    max="10"
                    step="0.5"
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                  />
                  <div className="text-base font-semibold text-gray-600 dark:text-gray-300 w-28 text-right">
                    {filters.minRating > 0
                      ? `${filters.minRating.toFixed(1)}`
                      : "Any Rating"}
                  </div>
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
