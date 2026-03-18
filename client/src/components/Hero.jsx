import React from 'react';

const Hero = () => {
  return (
    <div className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background glowing effects - contained to prevent right-side overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[600px] h-[400px] bg-blue-500/15 blur-[100px] rounded-full"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Discover the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Latest Gadgets
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-lg text-gray-400 mb-8">
          Elevate your digital lifestyle with our curated collection of premium tech accessories and smart devices.
        </p>
        <div className="flex justify-center">
          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white rounded-full text-sm sm:text-base font-semibold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95">
            Explore Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
