import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  const mockOnQueryChange = vi.fn();

  beforeEach(() => {
    mockOnQueryChange.mockClear();
  });

  it("renders with correct placeholder", () => {
    render(
      <SearchBar query="" onQueryChange={mockOnQueryChange} loading={false} />
    );

    expect(
      screen.getByPlaceholderText("Search for movies...")
    ).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(
      <SearchBar
        query=""
        onQueryChange={mockOnQueryChange}
        loading={false}
        placeholder="Custom placeholder"
      />
    );

    expect(
      screen.getByPlaceholderText("Custom placeholder")
    ).toBeInTheDocument();
  });

  it("displays the current query value", () => {
    render(
      <SearchBar
        query="test query"
        onQueryChange={mockOnQueryChange}
        loading={false}
      />
    );

    expect(screen.getByDisplayValue("test query")).toBeInTheDocument();
  });

  it("calls onQueryChange when input value changes", () => {
    render(
      <SearchBar query="" onQueryChange={mockOnQueryChange} loading={false} />
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new search" } });

    expect(mockOnQueryChange).toHaveBeenCalledWith("new search");
  });

  it("shows clear button when query is not empty", () => {
    render(
      <SearchBar
        query="test"
        onQueryChange={mockOnQueryChange}
        loading={false}
      />
    );

    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("does not show clear button when query is empty", () => {
    render(
      <SearchBar query="" onQueryChange={mockOnQueryChange} loading={false} />
    );

    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
  });

  it("clears query when clear button is clicked", () => {
    render(
      <SearchBar
        query="test query"
        onQueryChange={mockOnQueryChange}
        loading={false}
      />
    );

    const clearButton = screen.getByLabelText("Clear search");
    fireEvent.click(clearButton);

    expect(mockOnQueryChange).toHaveBeenCalledWith("");
  });

  it("shows loading spinner when loading is true", () => {
    render(
      <SearchBar
        query="test"
        onQueryChange={mockOnQueryChange}
        loading={true}
      />
    );

    expect(screen.getByLabelText("Searching...")).toBeInTheDocument();
  });

  it("does not show loading spinner when loading is false", () => {
    render(
      <SearchBar
        query="test"
        onQueryChange={mockOnQueryChange}
        loading={false}
      />
    );

    expect(screen.queryByLabelText("Searching...")).not.toBeInTheDocument();
  });

  it("disables input when loading is true", () => {
    render(
      <SearchBar
        query="test"
        onQueryChange={mockOnQueryChange}
        loading={true}
      />
    );

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("enables input when loading is false", () => {
    render(
      <SearchBar
        query="test"
        onQueryChange={mockOnQueryChange}
        loading={false}
      />
    );

    expect(screen.getByRole("textbox")).not.toBeDisabled();
  });

  it("has correct accessibility attributes", () => {
    render(
      <SearchBar query="" onQueryChange={mockOnQueryChange} loading={false} />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("autoComplete", "off");
    expect(input).toHaveAttribute("spellCheck", "false");
  });
});
