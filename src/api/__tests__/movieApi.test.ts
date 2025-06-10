import { vi } from "vitest";
import {
  searchMovies,
  getMovieDetails,
  withRetry,
  getAllMovies,
} from "../movieApi";
import { mockMovies } from "../mockData";

// Mock Math.random to control API error simulation
const mockMathRandom = vi.spyOn(Math, "random");

describe("movieApi", () => {
  beforeEach(() => {
    mockMathRandom.mockReturnValue(0.1); // > 0.05, so no errors
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("searchMovies", () => {
    it("returns empty results for empty query", async () => {
      const searchPromise = searchMovies("");
      vi.runAllTimers();

      const result = await searchPromise;

      expect(result.data).toEqual([]);
      expect(result.success).toBe(true);
      expect(result.message).toBe("Enter a search term to find movies");
    });

    it("returns empty results for whitespace-only query", async () => {
      const searchPromise = searchMovies("   ");
      vi.runAllTimers();

      const result = await searchPromise;

      expect(result.data).toEqual([]);
      expect(result.success).toBe(true);
    });

    it("searches by movie title", async () => {
      const searchPromise = searchMovies("Inception");
      vi.runAllTimers();

      const result = await searchPromise;

      expect(result.success).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0]).toHaveProperty("id");
      expect(result.data[0]).toHaveProperty("title");
      expect(result.data[0]).toHaveProperty("poster");
      expect(result.data[0]).toHaveProperty("releaseDate");
    });

    it("searches by director name", async () => {
      const searchPromise = searchMovies("Christopher Nolan");
      vi.runAllTimers();

      const result = await searchPromise;

      expect(result.success).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it("searches by genre", async () => {
      const searchPromise = searchMovies("Action");
      vi.runAllTimers();

      const result = await searchPromise;

      expect(result.success).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it("searches by cast member", async () => {
      const searchPromise = searchMovies("Leonardo DiCaprio");
      vi.runAllTimers();

      const result = await searchPromise;

      expect(result.success).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it("is case insensitive", async () => {
      const searchPromise = searchMovies("INCEPTION");
      vi.runAllTimers();

      const result = await searchPromise;

      expect(result.success).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it("returns appropriate message for no results", async () => {
      const searchPromise = searchMovies("NonexistentMovie123");
      vi.runAllTimers();

      const result = await searchPromise;

      expect(result.data).toEqual([]);
      expect(result.success).toBe(true);
      expect(result.message).toContain("No movies found matching");
    });

    it("simulates API errors", async () => {
      mockMathRandom.mockReturnValue(0.01); // < 0.05, so error should occur

      const searchPromise = searchMovies("test");
      vi.runAllTimers();

      await expect(searchPromise).rejects.toMatchObject({
        message: expect.stringContaining("Network connection failed"),
        status: expect.any(Number),
      });
    });

    it("includes search count in success message", async () => {
      const searchPromise = searchMovies("Action");
      vi.runAllTimers();

      const result = await searchPromise;

      expect(result.message).toMatch(/Found \d+ movie\(s\) matching/);
    });
  });

  describe("getMovieDetails", () => {
    it("returns movie details for valid ID", async () => {
      const validMovieId = mockMovies[0].id;
      const detailsPromise = getMovieDetails(validMovieId);
      vi.runAllTimers();

      const result = await detailsPromise;

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty("id", validMovieId);
      expect(result.data).toHaveProperty("title");
      expect(result.data).toHaveProperty("plot");
      expect(result.data).toHaveProperty("cast");
      expect(result.data).toHaveProperty("director");
      expect(result.data).toHaveProperty("genres");
    });

    it("returns 404 error for invalid movie ID", async () => {
      const detailsPromise = getMovieDetails("nonexistent-id");
      vi.runAllTimers();

      await expect(detailsPromise).rejects.toMatchObject({
        message: expect.stringContaining(
          'Movie with ID "nonexistent-id" was not found'
        ),
        status: 404,
      });
    });

    it("simulates API errors", async () => {
      mockMathRandom.mockReturnValue(0.01); // < 0.05, so error should occur

      const detailsPromise = getMovieDetails("valid-id");
      vi.runAllTimers();

      await expect(detailsPromise).rejects.toMatchObject({
        message: expect.stringContaining("Failed to load movie details"),
        status: expect.any(Number),
      });
    });
  });

  describe("getAllMovies", () => {
    it("returns all movies", async () => {
      const allMoviesPromise = getAllMovies();
      vi.runAllTimers();

      const result = await allMoviesPromise;

      expect(result.success).toBe(true);
      expect(result.data.length).toBe(mockMovies.length);
      expect(result.message).toContain(`Found ${mockMovies.length} movies`);
    });

    it("simulates API errors", async () => {
      mockMathRandom.mockReturnValue(0.01); // < 0.05, so error should occur

      const allMoviesPromise = getAllMovies();
      vi.runAllTimers();

      await expect(allMoviesPromise).rejects.toMatchObject({
        message: "Failed to load movies list.",
        status: 500,
      });
    });
  });

  describe("withRetry", () => {
    beforeEach(() => {
      vi.useRealTimers();
    });

    afterEach(() => {
      vi.useFakeTimers();
    });

    it("retries failed API calls", async () => {
      let callCount = 0;
      const mockApiCall = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount < 3) {
          throw { message: "Network error", status: 503 };
        }
        return "success";
      });

      const result = await withRetry(mockApiCall, 3, 10);

      expect(result).toBe("success");
      expect(mockApiCall).toHaveBeenCalledTimes(3);
    });

    it("does not retry 404 errors", async () => {
      const mockApiCall = vi.fn().mockRejectedValue({
        message: "Not found",
        status: 404,
      });

      await expect(withRetry(mockApiCall, 3, 10)).rejects.toMatchObject({
        status: 404,
      });

      expect(mockApiCall).toHaveBeenCalledTimes(1);
    });

    it("does not retry 429 errors", async () => {
      const mockApiCall = vi.fn().mockRejectedValue({
        message: "Too many requests",
        status: 429,
      });

      await expect(withRetry(mockApiCall, 3, 10)).rejects.toMatchObject({
        status: 429,
      });

      expect(mockApiCall).toHaveBeenCalledTimes(1);
    });

    it("throws last error after max retries", async () => {
      const mockApiCall = vi
        .fn()
        .mockRejectedValue(new Error("Persistent error"));

      await expect(withRetry(mockApiCall, 2, 10)).rejects.toThrow(
        "Persistent error"
      );

      expect(mockApiCall).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });

    it("succeeds on first try when no error", async () => {
      const mockApiCall = vi.fn().mockResolvedValue("immediate success");

      const result = await withRetry(mockApiCall, 3, 10);

      expect(result).toBe("immediate success");
      expect(mockApiCall).toHaveBeenCalledTimes(1);
    });
  });

  describe("Error types", () => {
    it("includes different error types in search", async () => {
      mockMathRandom.mockReturnValue(0.01); // Force error

      const searchPromise = searchMovies("test");
      vi.runAllTimers();

      await expect(searchPromise).rejects.toMatchObject({
        message: expect.any(String),
        status: expect.any(Number),
      });
    });

    it("includes different error types in getMovieDetails", async () => {
      mockMathRandom.mockReturnValue(0.01); // Force error

      const detailsPromise = getMovieDetails("test-id");
      vi.runAllTimers();

      await expect(detailsPromise).rejects.toMatchObject({
        message: expect.any(String),
        status: expect.any(Number),
      });
    });
  });
});
