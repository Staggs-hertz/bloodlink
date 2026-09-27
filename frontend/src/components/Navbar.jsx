import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { assets } from "../assets/assets";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/90 py-1 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-30">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={assets.logo_light}
              className="w-20 max-md:w-20 max-lg:w-29"
              alt="BloodLink logo"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-red-600 font-medium transition-colors"
            >
              Home
            </Link>

            <Link
              to="/#how-it-works"
              className="text-gray-600 hover:text-red-600 font-medium transition-colors"
            >
              How it Works
            </Link>

            <Link
              to="/about"
              className="text-gray-600 hover:text-red-600 font-medium transition-colors"
            >
              About
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 font-medium hover:text-red-600 transition-colors"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  Login
                </Link>

                <Link to="/register">
                  <Button text="Get Started" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen((previous) => !previous)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Home
            </Link>

            <Link
              to="/#how-it-works"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              How it Works
            </Link>

            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            >
              About
            </Link>

            <div className="pt-3 border-t border-gray-100 mt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      await handleLogout();
                      closeMobileMenu();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="block px-3 py-2 mt-1 rounded-md text-white bg-red-600 text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
