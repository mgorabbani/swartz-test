import { render, screen, act } from "@testing-library/react";
import { vi } from "vitest";
import { FavoritesProvider, useFavorites } from "../FavoritesContext";
import type { Movie } from "../../types/movie";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Test component that uses the context
const TestComponent = () => {
  const {
    state,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoriteCount,
  } = useFavorites();

  const mockMovie: Movie = {
    id: "test-movie-1",
    title: "Test Movie",
    poster: "test-poster.jpg",
    releaseDate: "2023",
    plot: "A test movie",
    cast: ["Actor 1", "Actor 2"],
    director: "Test Director",
    genres: ["Drama"],
    rating: 8.0,
  };

  return (
    <div>
      <div data-testid="favorites-count">{getFavoriteCount()}</div>
      <div data-testid="is-favorite">
        {isFavorite("test-movie-1").toString()}
      </div>
      <button
        data-testid="add-favorite"
        onClick={() => addToFavorites(mockMovie)}
      >
        Add to Favorites
      </button>
      <button
        data-testid="remove-favorite"
        onClick={() => removeFromFavorites("test-movie-1")}
      >
        Remove from Favorites
      </button>
      <div data-testid="favorites-list">
        {state.favorites.map((movie) => (
          <div key={movie.id} data-testid={`favorite-${movie.id}`}>
            {movie.title}
          </div>
        ))}
      </div>
    </div>
  );
};

const TestComponentWithError = () => {
  // This should throw an error when used outside provider
  const favorites = useFavorites();
  return <div>{favorites.getFavoriteCount()}</div>;
};

describe("FavoritesContext", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("provides initial empty state", () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    expect(screen.getByTestId("favorites-count")).toHaveTextContent("0");
    expect(screen.getByTestId("is-favorite")).toHaveTextContent("false");
  });

  it("throws error when used outside provider", () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponentWithError />);
    }).toThrow("useFavorites must be used within a FavoritesProvider");

    consoleSpy.mockRestore();
  });

  it("adds a movie to favorites", () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    const addButton = screen.getByTestId("add-favorite");
    act(() => {
      addButton.click();
    });

    expect(screen.getByTestId("favorites-count")).toHaveTextContent("1");
    expect(screen.getByTestId("is-favorite")).toHaveTextContent("true");
    expect(screen.getByTestId("favorite-test-movie-1")).toHaveTextContent(
      "Test Movie"
    );
  });

  it("does not add duplicate movies to favorites", () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    const addButton = screen.getByTestId("add-favorite");

    // Add the same movie twice
    act(() => {
      addButton.click();
      addButton.click();
    });

    expect(screen.getByTestId("favorites-count")).toHaveTextContent("1");
  });

  it("removes a movie from favorites", () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    const addButton = screen.getByTestId("add-favorite");
    const removeButton = screen.getByTestId("remove-favorite");

    // First add, then remove
    act(() => {
      addButton.click();
    });

    expect(screen.getByTestId("favorites-count")).toHaveTextContent("1");

    act(() => {
      removeButton.click();
    });

    expect(screen.getByTestId("favorites-count")).toHaveTextContent("0");
    expect(screen.getByTestId("is-favorite")).toHaveTextContent("false");
    expect(
      screen.queryByTestId("favorite-test-movie-1")
    ).not.toBeInTheDocument();
  });

  it("persists favorites to localStorage", () => {
    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    const addButton = screen.getByTestId("add-favorite");

    act(() => {
      addButton.click();
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "movieFavorites",
      expect.stringContaining("test-movie-1")
    );
  });

  it("loads favorites from localStorage on mount", () => {
    const savedFavorites = [
      {
        id: "saved-movie",
        title: "Saved Movie",
        poster: "saved-poster.jpg",
        releaseDate: "2022",
        plot: "A saved movie",
        cast: ["Saved Actor"],
        director: "Saved Director",
        genres: ["Action"],
      },
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedFavorites));

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    expect(screen.getByTestId("favorites-count")).toHaveTextContent("1");
    expect(screen.getByTestId("favorite-saved-movie")).toHaveTextContent(
      "Saved Movie"
    );
  });

  it("handles corrupted localStorage data gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    localStorageMock.getItem.mockReturnValue("invalid json");

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    expect(screen.getByTestId("favorites-count")).toHaveTextContent("0");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error loading favorites from localStorage:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("handles null localStorage data", () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    expect(screen.getByTestId("favorites-count")).toHaveTextContent("0");
    expect(localStorageMock.getItem).toHaveBeenCalledWith("movieFavorites");
  });
});
