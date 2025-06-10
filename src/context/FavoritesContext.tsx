import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import type { Movie, FavoritesState, FavoritesAction } from "../types/movie";

interface FavoritesContextType {
  state: FavoritesState;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: string) => void;
  isFavorite: (movieId: string) => boolean;
  getFavoriteCount: () => number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

// Reducer function for favorites state management
const favoritesReducer = (
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState => {
  console.log("🔄 Reducer called with action:", action.type);
  console.log("🔄 Current state:", state);

  switch (action.type) {
    case "ADD_FAVORITE":
      console.log("🎬 Adding favorite:", action.payload.title);
      // Check if movie already exists in favorites
      const exists = state.favorites.some(
        (movie) => movie.id === action.payload.id
      );
      if (exists) {
        console.log("⚠️ Movie already exists in favorites");
        return state;
      }
      const newState = {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
      console.log("✅ New state after ADD_FAVORITE:", newState);
      return newState;

    case "REMOVE_FAVORITE":
      console.log("🗑️ Removing favorite with ID:", action.payload);
      const filteredState = {
        ...state,
        favorites: state.favorites.filter(
          (movie) => movie.id !== action.payload
        ),
      };
      console.log("✅ New state after REMOVE_FAVORITE:", filteredState);
      return filteredState;

    case "LOAD_FAVORITES":
      console.log("📂 Loading favorites:", action.payload);
      const loadedState = {
        ...state,
        favorites: action.payload,
      };
      console.log("✅ New state after LOAD_FAVORITES:", loadedState);
      return loadedState;

    default:
      console.log("❓ Unknown action type:", action);
      return state;
  }
};

// Function to load initial favorites from localStorage
const loadInitialFavorites = (): Movie[] => {
  try {
    console.log("🔍 Loading initial favorites from localStorage...");
    const savedFavorites = localStorage.getItem("movieFavorites");
    console.log("📦 Raw localStorage data:", savedFavorites);

    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites);
      console.log("✅ Parsed favorites:", parsedFavorites);

      if (Array.isArray(parsedFavorites)) {
        console.log(
          "🎬 Loaded",
          parsedFavorites.length,
          "favorites from localStorage"
        );
        return parsedFavorites;
      }
    }

    console.log("📭 No valid favorites found in localStorage");
    return [];
  } catch (error) {
    console.error("❌ Error loading initial favorites:", error);
    // Clear corrupted data
    localStorage.removeItem("movieFavorites");
    return [];
  }
};

// Initial state
const initialState: FavoritesState = {
  favorites: loadInitialFavorites(),
};

// Provider component
interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);
  const isInitialized = useRef(false);

  // Mark as initialized after first render
  useEffect(() => {
    isInitialized.current = true;
    console.log(
      "✅ Favorites context initialized with",
      state.favorites.length,
      "favorites"
    );
  }, []);

  // Save favorites to localStorage whenever favorites change (but not on first render)
  useEffect(() => {
    console.log("💾 Favorites changed. Current state:", state.favorites);
    console.log("🏁 Is initialized:", isInitialized.current);

    // Only save if we're initialized (prevents saving during initial render)
    if (isInitialized.current) {
      try {
        const dataToSave = JSON.stringify(state.favorites);
        console.log("💾 Saving to localStorage:", dataToSave);
        localStorage.setItem("movieFavorites", dataToSave);
        console.log("✅ Successfully saved to localStorage");
      } catch (error) {
        console.error("❌ Error saving favorites to localStorage:", error);
      }
    } else {
      console.log("⏸️ Skipping save - not yet initialized");
    }
  }, [state.favorites]);

  // Action creators
  const addToFavorites = (movie: Movie) => {
    console.log("➕ Adding movie to favorites:", movie.title, "ID:", movie.id);
    dispatch({ type: "ADD_FAVORITE", payload: movie });
  };

  const removeFromFavorites = (movieId: string) => {
    console.log("➖ Removing movie from favorites. ID:", movieId);
    dispatch({ type: "REMOVE_FAVORITE", payload: movieId });
  };

  const isFavorite = (movieId: string): boolean => {
    const result = state.favorites.some((movie) => movie.id === movieId);
    console.log(
      "❓ Checking if movie is favorite. ID:",
      movieId,
      "Result:",
      result
    );
    return result;
  };

  const getFavoriteCount = (): number => {
    return state.favorites.length;
  };

  const value: FavoritesContextType = {
    state,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoriteCount,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use favorites context
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
