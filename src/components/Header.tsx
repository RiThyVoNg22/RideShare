import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Shield, DollarSign } from 'lucide-react';
import { verificationAPI, adminAPI } from '../services/api';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingVerifications, setPendingVerifications] = useState(0);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const loadPendingCount = async () => {
      if (currentUser && (currentUser.isAdmin || currentUser.role === 'admin')) {
        try {
          const response = await verificationAPI.getPendingVerifications();
          if (response.success) {
            setPendingVerifications(response.verifications?.length || 0);
          }
        } catch (error) {
          // Silently fail - not critical
        }
      }
    };
    loadPendingCount();
    // Refresh count every 30 seconds
    const interval = setInterval(loadPendingCount, 30000);
    return () => clearInterval(interval);
  }, [currentUser]);

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
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {(currentUser.isAdmin || currentUser.role === 'admin') && (
                  <div className="flex items-center gap-2 bg-white/10 rounded-lg px-2 py-1 border border-white/20">
                    <Link
                      to="/admin/verifications"
                      className={`relative flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                        isActive('/admin/verifications') 
                          ? 'bg-white/20 text-white' 
                          : 'text-white/90 hover:bg-white/15 hover:text-white'
                      }`}
                      title="ID Verifications"
                    >
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">Verifications</span>
                      {pendingVerifications > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-primary-blue">
                          {pendingVerifications > 9 ? '9+' : pendingVerifications}
                        </span>
                      )}
                    </Link>
                    <div className="w-px h-6 bg-white/20"></div>
                    <Link
                      to="/admin/commissions"
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                        isActive('/admin/commissions') 
                          ? 'bg-white/20 text-white' 
                          : 'text-white/90 hover:bg-white/15 hover:text-white'
                      }`}
                      title="Commissions Dashboard"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">Commissions</span>
                    </Link>
                  </div>
                )}
                <Link
                  to="/profile"
                  className="btn btn-secondary flex items-center gap-2 px-4 py-2"
                >
                  {currentUser.firstName || currentUser.email?.split('@')[0]}
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline px-4 py-2 border-white/30 hover:bg-white/10"
                >
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
                <>
                  <li className="pt-2 pb-2 border-t border-white/20">
                    <p className="px-4 py-2 text-xs font-semibold text-white/60 uppercase tracking-wider">Admin</p>
                  </li>
                  <li>
                    <Link 
                      to="/admin/verifications" 
                      className={`relative flex items-center justify-between px-4 py-2 rounded-lg ${
                        isActive('/admin/verifications') ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Verifications
                      </span>
                      {pendingVerifications > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                          {pendingVerifications > 9 ? '9+' : pendingVerifications}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admin/commissions" 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        isActive('/admin/commissions') ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <DollarSign className="w-4 h-4" />
                      Commissions
                    </Link>
                  </li>
                </>
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
