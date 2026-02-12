
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
  const hlsRef = useRef<HTMLVideoElement>(null);

  const heroImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"];

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 30000);
  };

  useEffect(() => {
    if (!content.isBroadcasting) {
      resetTimer();
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [heroImages.length, content.isBroadcasting]);

  useEffect(() => {
    if (content.isBroadcasting && content.broadcastSource === 'external' && content.streamUrl?.includes('.m3u8') && hlsRef.current) {
      const video = hlsRef.current;
      const hlsUrl = content.streamUrl;
      if ((window as any).Hls && (window as any).Hls.isSupported()) {
        const hls = new (window as any).Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on((window as any).Hls.Events.MANIFEST_PARSED, () => video.play());
        return () => hls.destroy();
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl;
        video.addEventListener('loadedmetadata', () => video.play());
      }
    }
  }, [content.isBroadcasting, content.streamUrl]);

  const triggerGlow = () => {
    setIsGlowFlashing(true);
    setTimeout(() => setIsGlowFlashing(false), 800);
  };

  const nextSlide = () => {
    if (content.isBroadcasting) return;
    setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    triggerGlow();
    resetTimer();
  };

  const prevSlide = () => {
    if (content.isBroadcasting) return;
    setCurrentImgIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
    triggerGlow();
    resetTimer();
  };

  const getStreamType = (url: string) => {
    if (!url) return 'none';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
    if (url.includes('.m3u8')) return 'hls';
    return 'direct';
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&rel=0`;
    }
    if (url.includes('youtube.com/live/')) {
      const id = url.split('live/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&rel=0`;
    }
    if (url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560&autoplay=1&mute=1`;
    }
    return url;
  };

  const streamType = getStreamType(content.streamUrl || '');

  return (
    <main className="relative pt-32 pb-20 px-6 text-center overflow-visible">
      {/* Full Screen Flash Glow Effect */}
      <div 
        className={`fixed inset-0 z-[100] pointer-events-none transition-opacity duration-700 bg-blue-500/10 mix-blend-screen shadow-[inset_0_0_200px_rgba(59,130,246,0.5)] ${
          isGlowFlashing ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Background Blobs */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-full max-w-lg h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-[100px] animate-blob transition-all duration-700 ${isGlowFlashing ? 'scale-150 opacity-60' : ''}`}></div>

      {/* Image Slideshow or Live Stream Frame */}
      <div className="mb-14 relative inline-block group">
        
        {!content.isBroadcasting && (
          <>
            <button onClick={prevSlide} className="absolute -left-6 md:-left-16 top-1/2 -translate-y-1/2 z-30 glass w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border border-white/20 text-blue-500 dark:text-white hover:bg-blue-600/40 hover:scale-110 active:scale-95 transition-all group-hover:opacity-100 md:opacity-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextSlide} className="absolute -right-6 md:-right-16 top-1/2 -translate-y-1/2 z-30 glass w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border border-white/20 text-blue-500 dark:text-white hover:bg-blue-600/40 hover:scale-110 active:scale-95 transition-all group-hover:opacity-100 md:opacity-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}

        <div className={`glow-frame-container shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all duration-700 ${isGlowFlashing ? 'shadow-[0_0_120px_rgba(59,130,246,0.8)] scale-[1.01]' : 'group-hover:shadow-[0_0_70px_rgba(59,130,246,0.5)]'}`}>
          <div className="glow-frame-animator"></div>
          
          <div className="glow-frame-inner bg-black" style={{ width: 'min(90vw, 576px)', height: 'calc(min(90vw, 576px) * (3.5 / 6))' }}>
              {content.isBroadcasting ? (
                <div className="w-full h-full relative overflow-hidden">
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-2 py-1 bg-red-600 rounded-lg animate-live-blink shadow-lg">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span className="text-[8px] font-black text-white uppercase tracking-tighter">LIVE FEED</span>
                  </div>
                  {content.streamUrl ? (
                    (streamType === 'youtube' || streamType === 'facebook') ? (
                      <div className="w-full h-full pointer-events-none">
                        <iframe src={getEmbedUrl(content.streamUrl)} className="w-full h-full" allow="autoplay; encrypted-media"></iframe>
                      </div>
                    ) : (
                      <video ref={hlsRef} autoPlay muted playsInline className="w-full h-full object-cover pointer-events-none" />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest animate-pulse">Waiting for Stream...</p>
                    </div>
                  )}
                </div>
              ) : (
                heroImages.map((img, index) => (
                  <img 
                      key={index}
                      src={img} 
                      alt={`Slideshow ${index}`} 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${
                          index === currentImgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                      }`}
                  />
                ))
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </div>
        
        {!content.isBroadcasting && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {heroImages.map((_, index) => (
                  <button key={index} onClick={() => { setCurrentImgIndex(index); triggerGlow(); resetTimer(); }} className={`h-1 rounded-full transition-all duration-700 ${index === currentImgIndex ? 'w-8 bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'w-2 bg-blue-500/20 dark:bg-white/20 hover:bg-blue-500/40 dark:hover:bg-white/40'}`}></button>
              ))}
          </div>
        )}
      </div>
      
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
