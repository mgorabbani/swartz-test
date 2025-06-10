export interface Movie {
  id: string;
  title: string;
  poster: string;
  releaseDate: string;
  plot: string;
  cast: string[];
  director: string;
  genres: string[];
  rating?: number;
  duration?: string;
}

export interface MovieSearchResult {
  id: string;
  title: string;
  poster: string;
  releaseDate: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export type SearchMoviesResponse = ApiResponse<MovieSearchResult[]>;
export type GetMovieDetailsResponse = ApiResponse<Movie>;

export interface FavoritesState {
  favorites: Movie[];
}

export type FavoritesAction =
  | { type: "ADD_FAVORITE"; payload: Movie }
  | { type: "REMOVE_FAVORITE"; payload: string }
  | { type: "LOAD_FAVORITES"; payload: Movie[] };

export interface SearchState {
  query: string;
  results: MovieSearchResult[];
  loading: boolean;
  error: string | null;
}
