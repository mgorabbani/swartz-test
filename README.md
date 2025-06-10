# React Movie Search Application

This is a movie search and details application built with React, TypeScript, and Vite. It allows users to search for movies, view detailed information, and save their favorite movies.

## ✨ Features

- **🎬 Movie Search**: Search for movies by title with a debounced search input.
- **🍿 Popular Movies**: A list of popular movies is displayed on the initial load.
- **📄 Movie Details**: View a comprehensive details page for each movie, including plot, cast, director, genres, and more.
- **❤️ Favorites**: Add or remove movies from a personal favorites list, which persists across sessions using `localStorage`.
- **🔀 Advanced Filtering**: Filter search results by genre, release year range, and minimum rating.
- **🔢 Pagination**: Navigate through search results with a complete pagination system.
- ** LOADING & ERROR STATES**: Smooth user experience with skeleton loaders and clear error messages.
- **CACHE & CANCELLATION**: Search requests are cached and previous requests are cancelled to prevent race conditions.
- **📱 Responsive Design**: The application is designed to be usable on various screen sizes.
- **🐛 Error Boundary**: A global error boundary prevents the entire app from crashing due to rendering errors.

## 🛠️ Technologies Used

- **Framework**: [React](https://reactjs.org/) (v18)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/) (v6)
- **State Management**: React Hooks (`useState`, `useEffect`, `useReducer`, `useContext`, `useCallback`, `useMemo`)
- **Styling**: Plain CSS with a modern, dark theme.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (version 16 or later) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/react-movie-app.git
    cd react-movie-app
    ```

2.  **Install the dependencies:**

    ```bash
    npm install
    ```

### Running the Application

Once the dependencies are installed, you can run the development server:

```bash
npm run dev
```

This will start the Vite development server, and you can view the application by navigating to `http://localhost:5173` in your web browser.

## 📂 Project Structure

The project follows a standard feature-based folder structure:

```
src
├── api/             # Mock API and data
├── assets/          # Static assets like images
├── components/      # Reusable UI components
├── context/         # React context for global state
├── hooks/           # Custom React hooks (Not used, utils instead)
├── pages/           # Page components for each route
├── types/           # TypeScript type definitions
├── utils/           # Utility functions and custom hooks
├── App.css          # Global styles
├── App.tsx          # Main application component with routing
└── main.tsx         # Application entry point
```
