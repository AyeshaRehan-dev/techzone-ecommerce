import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = ({ onAddToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Product not found.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (onAddToCart && product) {
      onAddToCart(product);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <h2 className="text-2xl mb-4">{error || 'Product not found'}</h2>
      <Link to="/" className="text-blue-400 hover:underline">Back to Shop</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-3xl p-4 sm:p-8 shadow-2xl">
          {/* Image Column */}
          <div className="rounded-2xl overflow-hidden bg-gray-900 aspect-square">
            <img 
              src={product.imageURL} 
              alt={product.name} 
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          {/* Details Column */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="px-4 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20 mb-4 inline-block">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-400 text-lg">{product.brand}</p>
            </div>

            <div className="mb-8">
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                ${product.price}
              </p>
            </div>

            <div className="mb-8 border-t border-gray-700 pt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-300 uppercase tracking-wider text-sm">Description</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <div className="mt-auto space-y-4">
              <button 
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg transform active:scale-95 ${
                  isAdded 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                }`}
              >
                {isAdded ? 'Successfully Added!' : 'Add to Cart'}
              </button>
              
              <Link to="/cart" className="block w-full text-center py-4 rounded-xl font-bold text-lg border border-gray-700 hover:bg-gray-700 transition-colors">
                View Cart
              </Link>
            </div>
            
            <div className="mt-8 flex items-center text-gray-400 text-sm">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Checkout & Free Shipping Included
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
