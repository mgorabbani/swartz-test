import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDebounce } from "./useDebounce";
import { searchMovies, getAllMovies } from "../api/movieApi";
import type { MovieSearchResult, ApiError } from "../types/movie";

interface SearchCache {
  [query: string]: {
    results: MovieSearchResult[];
    timestamp: number;
  };
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_SEARCH_HISTORY = 10;

export const useMovieSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query, 500);
  const cacheRef = useRef<SearchCache>({});
  const abortControllerRef = useRef<AbortController | null>(null);
  const initialLoadRef = useRef(false);

  // Memoized cache cleanup function
  const cleanupCache = useCallback(() => {
    const now = Date.now();
    const cache = cacheRef.current;

    Object.keys(cache).forEach((key) => {
      if (now - cache[key].timestamp > CACHE_DURATION) {
        delete cache[key];
      }
    });
  }, []);

  // Memoized function to check cache
  const getCachedResults = useCallback(
    (searchQuery: string): MovieSearchResult[] | null => {
      const cached = cacheRef.current[searchQuery.toLowerCase()];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.results;
      }
      return null;
    },
    []
  );

  // Memoized function to cache results
  const setCachedResults = useCallback(
    (searchQuery: string, searchResults: MovieSearchResult[]) => {
      cacheRef.current[searchQuery.toLowerCase()] = {
        results: searchResults,
        timestamp: Date.now(),
      };
    },
    []
  );

  // Memoized function to update search history
  const updateSearchHistory = useCallback((searchQuery: string) => {
    if (searchQuery.trim() && searchQuery.length > 2) {
      setSearchHistory((prev) => {
        const newHistory = [
          searchQuery,
          ...prev.filter((item) => item !== searchQuery),
        ];
        return newHistory.slice(0, MAX_SEARCH_HISTORY);
      });
    }
  }, []);

  // Load initial movies on mount
  useEffect(() => {
    const loadInitialMovies = async () => {
      if (initialLoadRef.current) return;
      initialLoadRef.current = true;

      try {
        setLoading(true);
        const response = await getAllMovies();
        setResults(response.data);
        setError(null);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialMovies();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (!debouncedQuery.trim()) {
        // If query is empty and we haven't loaded initial movies, load them
        if (!initialLoadRef.current) {
          return;
        }
        // If query is empty but we have initial movies, show them
        try {
          const response = await getAllMovies();
          setResults(response.data);
          setError(null);
          setHasSearched(false);
        } catch (err) {
          const apiError = err as ApiError;
          setError(apiError.message);
        }
        return;
      }

      // Check cache first
      const cachedResults = getCachedResults(debouncedQuery);
      if (cachedResults) {
        setResults(cachedResults);
        setError(null);
        setHasSearched(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setHasSearched(true);

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        const response = await searchMovies(debouncedQuery);

        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        setResults(response.data);
        setCachedResults(debouncedQuery, response.data);
        updateSearchHistory(debouncedQuery);

        // Cleanup old cache entries
        cleanupCache();
      } catch (err) {
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const apiError = err as ApiError;
        setError(apiError.message);
        setResults([]);
      } finally {
        // Check if request was aborted
        if (!abortControllerRef.current?.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // Only perform search if initial load is complete
    if (initialLoadRef.current) {
      performSearch();
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [
    debouncedQuery,
    getCachedResults,
    setCachedResults,
    updateSearchHistory,
    cleanupCache,
  ]);

  const clearSearch = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setQuery("");
    setHasSearched(false);
    setError(null);
    setLoading(true);

    // Load all movies again
    getAllMovies()
      .then((response) => {
        setResults(response.data);
        setLoading(false);
      })
      .catch((err) => {
        const apiError = err as ApiError;
        setError(apiError.message);
        setLoading(false);
      });
  }, []);

  const searchFromHistory = useCallback((historyQuery: string) => {
    setQuery(historyQuery);
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  // Memoized return value
  const returnValue = useMemo(
    () => ({
      query,
      setQuery,
      results,
      loading,
      error,
      hasSearched,
      searchHistory,
      clearSearch,
      searchFromHistory,
      clearSearchHistory,
    }),
    [
      query,
      results,
      loading,
      error,
      hasSearched,
      searchHistory,
      clearSearch,
      searchFromHistory,
      clearSearchHistory,
    ]
  );

  return returnValue;
};
