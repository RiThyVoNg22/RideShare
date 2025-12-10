import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-primary-blue text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img 
              src="/RideShare/imge/logo.png" 
              alt="RideShare Local" 
              className="h-14 w-auto object-contain"
            />
            <span className="text-xl font-bold">RideShare Local</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/') ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/how-it-works" 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/how-it-works') ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link 
                to="/rent" 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/rent') ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                Rent
              </Link>
            </li>
            <li>
              <Link 
                to="/list-vehicle" 
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/list-vehicle') ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                List Your Vehicle
              </Link>
            </li>
          </ul>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                {(currentUser.isAdmin || currentUser.role === 'admin') && (
                  <Link
                    to="/admin/verifications"
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isActive('/admin/verifications') ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
                    }`}
                    title="Admin Panel"
                  >
                    <i className="fas fa-shield-alt"></i> Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <i className="fas fa-user-circle"></i>
                  {currentUser.firstName || currentUser.email?.split('@')[0]}
                </Link>
                <button onClick={handleLogout} className="btn btn-outline">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-secondary">
                Sign Up / Log In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <ul className="flex flex-col gap-2">
              <li>
                <Link 
                  to="/" 
                  className={`block px-4 py-2 rounded-lg ${
                    isActive('/') ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/how-it-works" 
                  className={`block px-4 py-2 rounded-lg ${
                    isActive('/how-it-works') ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  to="/rent" 
                  className={`block px-4 py-2 rounded-lg ${
                    isActive('/rent') ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rent
                </Link>
              </li>
              <li>
                <Link 
                  to="/list-vehicle" 
                  className={`block px-4 py-2 rounded-lg ${
                    isActive('/list-vehicle') ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  List Your Vehicle
                </Link>
              </li>
              {(currentUser?.isAdmin || currentUser?.role === 'admin') && (
                <li>
                  <Link 
                    to="/admin/verifications" 
                    className={`block px-4 py-2 rounded-lg ${
                      isActive('/admin/verifications') ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fas fa-shield-alt"></i> Admin Panel
                  </Link>
                </li>
              )}
              <li className="pt-4 border-t border-white/20">
                {currentUser ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/profile"
                      className="btn btn-secondary w-full text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fas fa-user-circle"></i>
                      {currentUser.firstName || 'Profile'}
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }} 
                      className="btn btn-outline w-full"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/auth" 
                    className="btn btn-secondary w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up / Log In
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
