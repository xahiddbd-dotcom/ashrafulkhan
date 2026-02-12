
import React, { useState, useEffect, useRef } from 'react';
import { Content } from '../types';

interface HeroProps {
  content: Content;
  images: string[];
}

const Hero: React.FC<HeroProps> = ({ content, images }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isGlowFlashing, setIsGlowFlashing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const heroImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"];

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 30000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [heroImages.length]);

  const triggerGlow = () => {
    setIsGlowFlashing(true);
    setTimeout(() => setIsGlowFlashing(false), 800);
  };

  const nextSlide = () => {
    setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    triggerGlow();
    resetTimer();
  };

  const prevSlide = () => {
    setCurrentImgIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
    triggerGlow();
    resetTimer();
  };

  return (
    <main className="relative pt-32 pb-20 px-6 text-center overflow-visible">
      {/* Full Screen Flash Glow Effect */}
      <div 
        className={`fixed inset-0 z-[100] pointer-events-none transition-opacity duration-700 bg-blue-500/10 mix-blend-screen shadow-[inset_0_0_200px_rgba(59,130,246,0.5)] ${
          isGlowFlashing ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Background Blobs for Atmosphere */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-full max-w-lg h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-[100px] animate-blob transition-all duration-700 ${isGlowFlashing ? 'scale-150 opacity-60' : ''}`}></div>
      <div className={`absolute top-1/3 left-1/3 -translate-x-1/2 -z-10 w-full max-w-md h-80 bg-purple-400/10 dark:bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000 transition-all duration-700 ${isGlowFlashing ? 'scale-150 opacity-60' : ''}`}></div>

      {/* Image Slideshow Frame (6in x 3.5in ratio) */}
      <div className="mb-14 relative inline-block group">
        
        {/* Manual Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute -left-6 md:-left-16 top-1/2 -translate-y-1/2 z-30 glass w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border border-white/20 text-blue-500 dark:text-white hover:bg-blue-600/40 hover:scale-110 active:scale-95 transition-all group-hover:opacity-100 md:opacity-0"
          aria-label="Previous Slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <button 
          onClick={nextSlide}
          className="absolute -right-6 md:-right-16 top-1/2 -translate-y-1/2 z-30 glass w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border border-white/20 text-blue-500 dark:text-white hover:bg-blue-600/40 hover:scale-110 active:scale-95 transition-all group-hover:opacity-100 md:opacity-0"
          aria-label="Next Slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* The Animated Glow Container */}
        <div className={`glow-frame-container shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all duration-700 ${isGlowFlashing ? 'shadow-[0_0_120px_rgba(59,130,246,0.8)] scale-[1.01]' : 'group-hover:shadow-[0_0_70px_rgba(59,130,246,0.5)]'}`}>
          <div className="glow-frame-animator"></div>
          
          <div className="glow-frame-inner" style={{ width: 'min(90vw, 576px)', height: 'calc(min(90vw, 576px) * (3.5 / 6))' }}>
              {heroImages.map((img, index) => (
                  <img 
                      key={index}
                      src={img} 
                      alt={`Slideshow ${index}`} 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${
                          index === currentImgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                      }`}
                  />
              ))}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
        
        {/* Progress Indicator Dots */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {heroImages.map((_, index) => (
                <button 
                    key={index} 
                    onClick={() => { setCurrentImgIndex(index); triggerGlow(); resetTimer(); }}
                    className={`h-1 rounded-full transition-all duration-700 ${index === currentImgIndex ? 'w-8 bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'w-2 bg-blue-500/20 dark:bg-white/20 hover:bg-blue-500/40 dark:hover:bg-white/40'}`}
                    aria-label={`Go to slide ${index + 1}`}
                ></button>
            ))}
        </div>
      </div>
      
      {/* Dynamic font size applied here */}
      <h1 className={`${content.titleSize || 'text-5xl md:text-8xl'} font-black mb-6 leading-tight tracking-tight text-gradient transition-all duration-700`}>
        {content.title}
      </h1>
      
      <p className="text-lg md:text-2xl text-slate-500 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
        {content.desc}
      </p>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-xl hover:shadow-blue-500/20 active:scale-95">
          {content.work}
        </button>
        <button className="w-full sm:w-auto glass hover:bg-black/5 dark:hover:bg-white/10 px-10 py-4 rounded-full font-bold transition-all border border-blue-500/20 dark:border-white/20 active:scale-95">
          {content.contact}
        </button>
      </div>
    </main>
  );
};

export default Hero;
