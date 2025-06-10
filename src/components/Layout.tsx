import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { getFavoriteCount } = useFavorites();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const favoriteCount = getFavoriteCount();

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">🎬 Movie Search App</Link>
        </div>
        <div className="nav-links">
          <Link
            to="/"
            className={isActive("/") ? "nav-link active" : "nav-link"}
          >
            Home
          </Link>
          <Link
            to="/favorites"
            className={isActive("/favorites") ? "nav-link active" : "nav-link"}
          >
            Favorites
            {favoriteCount > 0 && (
              <span className="favorites-count">{favoriteCount}</span>
            )}
          </Link>
        </div>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
