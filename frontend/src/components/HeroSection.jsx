import React, { useState } from 'react';
import { FiArrowRight } from "react-icons/fi"; // example icon

import { useRef } from 'react';



const HeroSection = () => {

  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(50);

  const containerRef = useRef(null);

  // Handle drag
  const handleDrag = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = e.clientX || (e.touches && e.touches[0].clientX);
    let percent = ((x - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent)); // clamp between 0–100
    setPosition(percent);
  };

  return (
    <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden p-4 md:p-8">
      {/* Background gradients/animations */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-yellow-900 animate-gradient-shift"></div>
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto backdrop-blur-sm bg-black/40 p-8 rounded-xl shadow-lg border border-yellow-600/40">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 text-transparent bg-clip-text">
          Unleash Your Media's Full Potential
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Transform images and videos with AI-powered editing, background removal, upscaling, and more.
        </p>

        {/* Before/After Image Comparison */}
        <div
          ref={containerRef}
          className="relative w-full max-w-3xl mx-auto mb-8 h-[400px] rounded-lg overflow-hidden shadow-2xl border border-yellow-600 select-none"
          onMouseMove={(e) => e.buttons === 1 && handleDrag(e)} // dragging with left mouse
          onTouchMove={handleDrag}
        >
          {/* Before Image */}
          <img
            src="https://images.pexels.com/photos/33728147/pexels-photo-33728147.jpeg"
            alt="Original"
            className="w-full h-full object-cover"
          />

          {/* After Image (Clipped Dynamically) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <img
              src="https://images.pexels.com/photos/33728109/pexels-photo-33728109.jpeg"
              alt="After"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-yellow-500 cursor-col-resize"
            style={{ left: `${position}%`, transform: "translateX(-50%)" }}
            onMouseDown={(e) => handleDrag(e)}
            onTouchStart={handleDrag}
          >
            {/* Circle handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-yellow-400 w-5 h-5 rounded-full shadow-lg border-2 border-yellow-600 cursor-grab"></div>
          </div>

          {/* Labels */}
          <span className="absolute bottom-4 left-4 text-white text-sm px-2 py-1 rounded-md bg-black/60">
            Original
          </span>
          <span className="absolute bottom-4 right-4 text-white text-sm px-2 py-1 rounded-md bg-black/60">
            After
          </span>
        </div>

        {/* Gradient Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <button
            className="group relative btn btn-lg bg-gradient-to-r from-yellow-600 to-yellow-400 border-none text-black font-bold shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-yellow-500/50"
          >
            <span className="flex items-center gap-2">
              Start Editing Now <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          <a
            href="#features"
            className="btn btn-lg btn-ghost text-yellow-400 hover:text-yellow-300 transition-all duration-300 hover:scale-105"
          >
            See Features in Action
          </a>
        </div>
      </div>

      {/* Tailwind Keyframes for background animation */}
      <style>{`
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes blob {
        0% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
        100% { transform: translate(0, 0) scale(1); }
      }
      .animate-gradient-shift {
        background-size: 200% 200%;
        animation: gradient-shift 15s ease infinite;
      }
      .animate-blob {
        animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
      }
    `}</style>
    </section>
  );

};

export default HeroSection;
