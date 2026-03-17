import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ cartItemCount = 0, user, onLogout, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              TechZone
            </Link>
          </div>
          
          {/* Professional Search Bar */}
          {user && (
            <div className="hidden sm:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearchSubmit} className="relative group">
                <input
                  type="text"
                  placeholder="What's next in tech?"
                  className="w-full bg-gray-800/40 border border-gray-700/50 rounded-2xl py-2.5 pl-12 pr-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-gray-800/60 transition-all placeholder:text-gray-500 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>
            </div>
          )}

          <div className="flex items-center space-x-8">
            <div className="hidden lg:flex items-center space-x-6">
              <Link to="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Catalog</Link>
              {user && (
                <Link to="/my-orders" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">My Orders</Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">Admin Dashboard</Link>
              )}
            </div>

            <div className="flex items-center space-x-6 pl-6 border-l border-gray-700/50">
              {user && (
                <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-all transform hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-[10px] font-black leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}

              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:flex flex-col items-end leading-none">
                    <span className="text-[9px] text-gray-500 uppercase tracking-tighter mb-0.5">Verified User</span>
                    <span className="text-sm font-bold text-gray-200">{user.username}</span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="bg-gray-800/60 p-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-90"
                    title="Sign Out"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <Link 
                  to="/auth"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                >
                  ENTER STORE
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
