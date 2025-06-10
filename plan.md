# Instructions

- You are required to implement the functionality outlined in the task description using ReactJS
  (version 18 or above).
- The solution should be implemented using React functional components and React hooks
  (e.g., useState, useEffect, useReducer, useContext, etc.).
- You should focus on clean, modular, and well-documented code.
- Use React Router for navigation if needed.
- Optimize for performance where appropriate, using techniques like memoization, lazy loading,
  and efficient state management.
- Proper error handling and loading states should be implemented.
- Optional: You may use libraries such as Axios for API requests or styled-components for
  styling.

# Task

Build a Movie Search and Details Application

## Application Overview:

You will be building a Movie Search and Details Application. The app allows users to search for
movies, view detailed information about each movie, and save favorite movies for later viewing. The app
interacts with a mock API (which you will simulate) to fetch movie data.

## Key Features:

1. Movie Search:

- A search bar to search for movies by title.
- The search results should be displayed as a list of movie titles and their poster images.
- Each search result should show basic movie details like the title, poster, and release
  date.

2. Movie Details:

- When a user clicks on a movie title, they should be navigated to a details page that
  shows detailed information about the movie, such as:

Full description (plot).

- Cast (names of actors).
- Director.
- Release year.
- Genres.

- Display a "Loading..." state while waiting for the movie details.

3. Favorites:

- Users should be able to add movies to a "Favorites" list.
- The favorite movies should be saved in the application's state (persisted across sessions
  using localStorage or React context).
- The "Favorites" list should be accessible via a side menu or a separate page.
- On the "Favorites" page, display the list of favorite movies along with their basic details.
- Users should be able to remove movies from the "Favorites" list.

4. Routing

- Use React Router to enable navigation between pages:

Home page with a search bar and movie results.
●
Movie Details page that displays detailed information.
●
Favorites page that shows a list of saved favorite movies.

5. Mock API

- Simulate fetching movie data from an API. You can use setTimeout to mimic network

requests.
The API should provide the following information:

- A list of movies with titles, release dates, and posters for the search results.

Detailed information for each movie, including plot, director, cast, genres, etc.

- Handle errors gracefully (e.g., if an API call fails, display an error message).

## Advanced Concepts

1. Context API and useReducer for State Management:

Use the Context API to manage the global state for the user's favorites list.

- Use useReducer to handle the addition and removal of movies from the favorites list.

- Provide context values for:

- List of favorite movies.

Actions to add/remove movies from the favorites list.

2. Optimizing Search Results Rendering:

- Use React.memo or useMemo to prevent unnecessary re-renders when the movie list is
  updated.

- Debounce the search input (i.e., wait for the user to stop typing before sending a search
  request).

3. Error Handling:

Implement proper error handling for API requests (e.g., if the movie data is not available,
show a user-friendly error message).

- Show loading indicators while fetching data.

4. Routing and Navigation:

Use React Router to handle navigation between pages (Home, Movie Details, and
Favorites).

- Implement route protection or redirects if necessary (e.g., users must be logged in or
  there are no favorites to display).

5. Persistence with localStorage (Optional):

- Use localStorage to persist the favorite movies list across page reloads.

Retrieve and update the favorite list stored in localStorage when the app is reloaded.
Bonus Features (Optional):

1. Pagination for Search Results:

- Implement pagination for movie search results if the number of results is too large.

The user can click "Next" or "Previous" to navigate through the pages of search results. 2. Advanced Search Filters:

- Allow users to filter the search results by genre, release date, or rating.

Include a filter UI with checkboxes or dropdowns. 3. Unit Testing:

- Write unit tests for key components (e.g., Movie Search, Movie Details, Favorites, etc.)
  using Jest or React Testing Library.

## Deliverables

1. A GitHub repository or a zip file containing the complete source code.
2. A README.md file with instructions on how to run the app and any dependencies required.

This task will test your proficiency in ReactJS, focusing on advanced concepts like routing, state
management with Context API, performance optimizations, and handling dynamic, asynchronous data.

Good luck!
