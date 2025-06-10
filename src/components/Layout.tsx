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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
              >
                🎬 Movie Search
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`${
                    isActive("/")
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  Home
                </Link>
                <Link
                  to="/favorites"
                  className={`${
                    isActive("/favorites")
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  } px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center`}
                >
                  Favorites
                  {favoriteCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {favoriteCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default Layout;
