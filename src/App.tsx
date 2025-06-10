import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
  return (
    <ErrorBoundary>
      <FavoritesProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </Layout>
        </Router>
      </FavoritesProvider>
    </ErrorBoundary>
  );
}

export default App;
