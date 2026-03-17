import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import CartPage from './components/CartPage';
import AdminDashboard from './components/AdminDashboard';
import AuthPage from './components/AuthPage';
import MyOrders from './components/MyOrders';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'price-low', 'price-high'
  
  const navigate = useNavigate();

  // New User State
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleAuthSuccess = (userData, token) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
    navigate('/auth');
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    // Legacy cleanup - clear old localStorage data to ensure a fresh start with sessionStorage
    const legacyKeys = ['user', 'token', 'adminToken'];
    legacyKeys.forEach(key => localStorage.removeItem(key));

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = searchTerm 
          ? `/api/products?search=${searchTerm}`
          : '/api/products';
        const response = await axios.get(url);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load products. Is the server running?');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  // Improved Filtering & Sorting
  const productsArray = Array.isArray(products) ? products : [];
  let filteredProducts = productsArray.filter((product) =>
    selectedCategory === 'All' ? true : product.category === selectedCategory
  );

  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500/30">
      <Navbar 
        cartItemCount={cart.length} 
        user={user} 
        onLogout={handleLogout} 
        onSearch={handleSearch}
      />
      <Routes>
        <Route path="/" element={
          user ? (
            <>
              <Hero />
              <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                  <div className="flex items-center gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                    {['All', 'Laptops', 'Accessories', 'Audio', 'Monitors'].map(cat => (
                      <span 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all cursor-pointer whitespace-nowrap ${
                          selectedCategory === cat 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300'
                        }`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Sort By</span>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl backdrop-blur-sm text-center font-bold">
                    {error}
                  </div>
                ) : searchTerm && products.length === 0 ? (
                  <div className="text-center py-24 bg-gray-900/30 rounded-3xl border border-gray-800 border-dashed">
                    <p className="text-gray-500 mb-2">No gadgets matching "{searchTerm}"</p>
                    <button onClick={() => setSearchTerm('')} className="text-blue-400 font-bold hover:underline">Clear Search</button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center text-gray-500 py-12 bg-gray-800/20 rounded-2xl border border-gray-800 border-dashed">
                    No products found. Start by adding some to your database!
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    No products found in this category.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product._id || product.id} product={product} onAddToCart={addToCart} />
                    ))}
                  </div>
                )}
              </main>
            </>
          ) : (
            <Navigate to="/auth" />
          )
        } />
        
        <Route path="/cart" element={
          user ? <CartPage cartItems={cart} clearCart={clearCart} user={user} /> : <Navigate to="/auth" />
        } />
        
        <Route path="/product/:id" element={user ? <ProductDetails onAddToCart={addToCart} /> : <Navigate to="/auth" />} />
        
        <Route path="/my-orders" element={user ? <MyOrders userId={user.id || user._id} /> : <Navigate to="/auth" />} />
        
        <Route path="/auth" element={<AuthPage onAuthSuccess={handleAuthSuccess} />} />
        
        <Route path="/admin" element={
          user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/auth" />
        } />
      </Routes>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-500">
            <p>&copy; 2026 TechZone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
