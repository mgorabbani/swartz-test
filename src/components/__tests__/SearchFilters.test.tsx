import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SearchFilters from "../SearchFilters";
import type { FilterState } from "../SearchFilters";

describe("SearchFilters", () => {
  const mockOnFiltersChange = vi.fn();
  const mockOnToggle = vi.fn();

  const defaultFilters: FilterState = {
    genres: [],
    yearRange: { min: 1970, max: 2024 },
    minRating: 0,
  };

  const availableGenres = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror"];

  beforeEach(() => {
    mockOnFiltersChange.mockClear();
    mockOnToggle.mockClear();
  });

  it("renders toggle button with correct text", () => {
    render(
      <SearchFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={false}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByText("🔧 Filters")).toBeInTheDocument();
  });

  it("shows active filters badge when filters are applied", () => {
    const filtersWithGenre: FilterState = {
      ...defaultFilters,
      genres: ["Action"],
    };

    render(
      <SearchFilters
        filters={filtersWithGenre}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={false}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByText("•")).toBeInTheDocument();
  });

  it("does not show badge when no filters are applied", () => {
    render(
      <SearchFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={false}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.queryByText("•")).not.toBeInTheDocument();
  });

  it("calls onToggle when toggle button is clicked", () => {
    render(
      <SearchFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={false}
        onToggle={mockOnToggle}
      />
    );

    const toggleButton = screen.getByRole("button", { name: /filters/i });
    fireEvent.click(toggleButton);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it("shows filters panel when isOpen is true", () => {
    render(
      <SearchFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={true}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByText("Filter Movies")).toBeInTheDocument();
  });

  it("does not show filters panel when isOpen is false", () => {
    render(
      <SearchFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={false}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.queryByText("Filter Movies")).not.toBeInTheDocument();
  });

  it("renders genre checkboxes", () => {
    render(
      <SearchFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={true}
        onToggle={mockOnToggle}
      />
    );

    availableGenres.forEach((genre) => {
      expect(screen.getByText(genre)).toBeInTheDocument();
    });
  });

  it("handles genre selection", () => {
    render(
      <SearchFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={true}
        onToggle={mockOnToggle}
      />
    );

    const actionCheckbox = screen.getByRole("checkbox", { name: /action/i });
    fireEvent.click(actionCheckbox);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      genres: ["Action"],
    });
  });

  it("handles genre deselection", () => {
    const filtersWithGenre: FilterState = {
      ...defaultFilters,
      genres: ["Action"],
    };

    render(
      <SearchFilters
        filters={filtersWithGenre}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={true}
        onToggle={mockOnToggle}
      />
    );

    const actionCheckbox = screen.getByRole("checkbox", { name: /action/i });
    fireEvent.click(actionCheckbox);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      genres: [],
    });
  });

  it("handles year range changes", () => {
    render(
      <SearchFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={true}
        onToggle={mockOnToggle}
      />
    );

    const minYearInput = screen.getByLabelText("From:");
    fireEvent.change(minYearInput, { target: { value: "2000" } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      yearRange: { min: 2000, max: 2024 },
    });
  });

  it("handles rating changes", () => {
    render(
      <SearchFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={true}
        onToggle={mockOnToggle}
      />
    );

    const ratingSlider = screen.getByRole("slider");
    fireEvent.change(ratingSlider, { target: { value: "7.5" } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...defaultFilters,
      minRating: 7.5,
    });
  });

  it("shows clear filters button when filters are active", () => {
    const filtersWithGenre: FilterState = {
      ...defaultFilters,
      genres: ["Action"],
    };

    render(
      <SearchFilters
        filters={filtersWithGenre}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={true}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByText("Clear All")).toBeInTheDocument();
  });

  it("clears all filters when clear button is clicked", () => {
    const filtersWithMultiple: FilterState = {
      genres: ["Action", "Comedy"],
      yearRange: { min: 2000, max: 2020 },
      minRating: 7.0,
    };

    render(
      <SearchFilters
        filters={filtersWithMultiple}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={true}
        onToggle={mockOnToggle}
      />
    );

    const clearButton = screen.getByText("Clear All");
    fireEvent.click(clearButton);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      genres: [],
      yearRange: { min: 1970, max: 2024 },
      minRating: 0,
    });
  });

  it("displays correct rating text when rating is set", () => {
    const filtersWithRating: FilterState = {
      ...defaultFilters,
      minRating: 8.0,
    };

    render(
      <SearchFilters
        filters={filtersWithRating}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={true}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByText("8+ ⭐")).toBeInTheDocument();
  });

  it('displays "Any Rating" when rating is 0', () => {
    render(
      <SearchFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={true}
        onToggle={mockOnToggle}
      />
    );

    expect(screen.getByText("Any Rating")).toBeInTheDocument();
  });

  it("has correct aria-expanded attribute", () => {
    const { rerender } = render(
      <SearchFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={false}
        onToggle={mockOnToggle}
      />
    );

    const toggleButton = screen.getByRole("button", { name: /filters/i });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    rerender(
      <SearchFilters
        filters={defaultFilters}
        onFiltersChange={mockOnFiltersChange}
        availableGenres={availableGenres}
        isOpen={true}
        onToggle={mockOnToggle}
      />
    );

    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  });
});
