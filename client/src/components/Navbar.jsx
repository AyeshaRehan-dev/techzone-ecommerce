import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ cartItemCount = 0, user, onLogout, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
    setIsMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="fixed w-full z-50 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-3">
              {user && (
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all active:scale-90"
                  aria-label="Toggle menu"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                    )}
                  </svg>
                </button>
              )}
              <Link to="/" className="text-lg sm:text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight shrink-0">
                TechZone
              </Link>
            </div>
            
            {/* Center: Desktop Search */}
            {user && (
              <div className="hidden md:block flex-1 max-w-md mx-6">
                <form onSubmit={handleSearchSubmit} className="relative group">
                  <input
                    type="text"
                    placeholder="Search gadgets..."
                    className="w-full bg-gray-900/80 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 group-focus-within:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </form>
              </div>
            )}

            {/* Right: Desktop Nav + Actions */}
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="hidden lg:flex items-center gap-6">
                <Link to="/" className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Home</Link>
                <Link to="/" className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Catalog</Link>
                {user && (
                  <Link to="/my-orders" className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">My Orders</Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-[11px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">Dashboard</Link>
                )}
              </div>

              <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-gray-800/60">
                {user && (
                  <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-all active:scale-90">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[9px] font-black text-white bg-blue-600 rounded-full shadow-lg shadow-blue-500/40">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
                {user ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="hidden sm:block text-xs font-bold text-gray-300 max-w-[80px] truncate">{user.username}</span>
                    <button 
                      onClick={onLogout}
                      className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-90"
                      title="Sign Out"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/auth"
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                  >
                    SIGN IN
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]" onClick={closeMenu}>
          {/* Dark backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-[280px] z-[70] bg-gray-950 border-r border-gray-800/50 shadow-2xl shadow-black/50 transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-gray-800/50">
            <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">
              TechZone
            </span>
            <button onClick={closeMenu} className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Search */}
          <div className="px-4 pt-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search gadgets..."
                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 pt-6 space-y-1 overflow-y-auto">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-white hover:bg-gray-800/80 transition-all group">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-bold text-sm">Home</span>
            </Link>

            <Link to="/" onClick={closeMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-white hover:bg-gray-800/80 transition-all group">
              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="font-bold text-sm">Catalog</span>
            </Link>

            {user && (
              <Link to="/my-orders" onClick={closeMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-white hover:bg-gray-800/80 transition-all group">
                <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="font-bold text-sm">My Orders</span>
              </Link>
            )}

            <Link to="/cart" onClick={closeMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-white hover:bg-gray-800/80 transition-all group">
              <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-bold text-sm">Cart</span>
              {cartItemCount > 0 && (
                <span className="ml-auto bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{cartItemCount}</span>
              )}
            </Link>

            {user?.role === 'admin' && (
              <>
                <div className="border-t border-gray-800/50 my-3" />
                <p className="px-3 text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">Admin</p>
                <Link to="/admin" onClick={closeMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl text-blue-400 hover:bg-blue-500/10 transition-all group">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-bold text-sm">Admin Panel</span>
                </Link>
              </>
            )}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-4 py-4 border-t border-gray-800/50">
            {user && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.username}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user.role || 'User'}</p>
                </div>
                <button 
                  onClick={() => { onLogout(); closeMenu(); }}
                  className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Sign Out"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
