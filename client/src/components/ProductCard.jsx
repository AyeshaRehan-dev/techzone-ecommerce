import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
      setIsAdded(true);
      
      // Reset the button visual after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }
  };

  return (
    <div className="group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 transition-all hover:bg-gray-800/60 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1 flex flex-col h-full">
      <Link to={`/product/${product._id || product.id}`} className="relative h-64 w-full mb-4 overflow-hidden rounded-xl bg-gray-900 group-hover:bg-gray-800 transition-colors shrink-0">
        <img
          src={product.imageURL || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute top-2 right-2 px-3 py-1 bg-gray-900/80 backdrop-blur-md rounded-full text-xs font-medium text-emerald-400 border border-gray-700">
          {product.category}
        </div>
      </Link>
      
      <div className="flex flex-col flex-grow gap-2">
        <div className="flex justify-between items-start">
          <div className="pr-2">
            <Link to={`/product/${product._id || product.id}`}>
              <h3 className="text-lg font-semibold text-white line-clamp-1 hover:text-blue-400 transition-colors" title={product.name}>{product.name}</h3>
            </Link>
            <p className="text-sm text-gray-400">{product.brand}</p>
          </div>
          <p className="text-lg font-bold text-blue-400 whitespace-nowrap">${product.price}</p>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mt-2 flex-grow">
          {product.description}
        </p>
        
        <button 
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`mt-4 w-full py-2 px-4 rounded-xl font-medium transition-all duration-300 border ${
            isAdded 
              ? 'bg-emerald-500-20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
              : 'bg-gray-700/50 hover:bg-blue-500/20 text-white border-transparent hover:border-blue-500/30'
          }`}
        >
          {isAdded ? 'Added to Cart!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
