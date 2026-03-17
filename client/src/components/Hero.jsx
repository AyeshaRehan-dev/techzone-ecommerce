import React from 'react';

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Discover the{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Latest Gadgets
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 mb-10">
          Elevate your digital lifestyle with our curated collection of premium tech accessories and smart devices.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            Explore Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
