
import React, { useState, useEffect, useRef } from 'react';
import { Language, Content, SocialHighlight } from '../types';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  content: Content;
  highlights: SocialHighlight[];
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, content, highlights }) => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [activeStory, setActiveStory] = useState<SocialHighlight | null>(null);
  const [isLiveViewerOpen, setIsLiveViewerOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleNext = () => {
    const currentIndex = highlights.findIndex(h => h.id === activeStory?.id);
    if (currentIndex !== -1 && currentIndex < highlights.length - 1) {
      setActiveStory(highlights[currentIndex + 1]);
    } else {
      setActiveStory(null);
    }
  };

  const handlePrev = () => {
    const currentIndex = highlights.findIndex(h => h.id === activeStory?.id);
    if (currentIndex > 0) {
      setActiveStory(highlights[currentIndex - 1]);
    } else {
      setProgress(0);
    }
  };

  const togglePlayPause = () => {
    setIsPaused(!isPaused);
    if (videoRef.current) {
      if (isPaused) videoRef.current.play();
      else videoRef.current.pause();
    }
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
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&disablekb=1&modestbranding=1&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&disablekb=1&modestbranding=1&rel=0`;
    }
    if (url.includes('youtube.com/live/')) {
      const id = url.split('live/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&disablekb=1&modestbranding=1&rel=0`;
    }
    if (url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560&autoplay=1&mute=${isMuted ? 1 : 0}`;
    }
    return url;
  };

  useEffect(() => {
    const streamType = getStreamType(content.streamUrl || '');
    if (isLiveViewerOpen && content.broadcastSource === 'external' && streamType === 'hls' && liveVideoRef.current) {
      const video = liveVideoRef.current;
      const hlsUrl = content.streamUrl!;

      if ((window as any).Hls && (window as any).Hls.isSupported()) {
        const hls = new (window as any).Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on((window as any).Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => console.error("Autoplay prevented:", e));
        });
        return () => hls.destroy();
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(e => console.error("Autoplay prevented:", e));
        });
      }
    }
  }, [isLiveViewerOpen, content.broadcastSource, content.streamUrl]);

  // Sync volume with video element
  useEffect(() => {
    if (liveVideoRef.current) {
      liveVideoRef.current.volume = volume;
      liveVideoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const streamType = getStreamType(content.streamUrl || '');

  return (
    <>
      <style>{`
        @keyframes colorCycle {
          0%, 100% { color: #3b82f6; text-shadow: 2px 2px 0px #1e3a8a, 4px 4px 0px #1e40af; }
          25% { color: #8b5cf6; text-shadow: 2px 2px 0px #4c1d95, 4px 4px 0px #5b21b6; }
          50% { color: #ec4899; text-shadow: 2px 2px 0px #831843, 4px 4px 0px #9d174d; }
          75% { color: #06b6d4; text-shadow: 2px 2px 0px #164e63, 4px 4px 0px #155e75; }
        }
        @keyframes tilt3D {
          0%, 100% { transform: perspective(500px) rotateX(10deg) rotateY(-15deg) scale(1.05); }
          50% { transform: perspective(500px) rotateX(-5deg) rotateY(15deg) scale(1.1); }
        }
        @keyframes blink-red {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        .animate-brand-3d {
          display: inline-block;
          animation: colorCycle 2s infinite ease-in-out, tilt3D 4s infinite ease-in-out;
          transform-style: preserve-3d;
        }
        .animate-live-blink {
          animation: blink-red 0.8s infinite;
        }
        .volume-slider {
          -webkit-appearance: none;
          width: 80px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 5px;
          outline: none;
        }
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
        }
      `}</style>
      
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 md:px-8 py-2 bg-slate-950/70 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-4 shrink-0 mr-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 cursor-pointer uppercase shrink-0 overflow-visible py-1">
              {content.isBroadcasting && (
                <button 
                  onClick={() => setIsLiveViewerOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600 hover:bg-red-700 rounded-lg transition-all animate-live-blink shadow-[0_0_20px_rgba(220,38,38,0.5)] active:scale-95"
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span className="text-[9px] font-black text-white uppercase tracking-tighter">LIVE</span>
                </button>
              )}

              <span className="text-xl md:text-2xl font-black tracking-tighter animate-brand-3d">
                {content.brandName}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 mt-[-2px]">
              <div className={`w-2 h-2 rounded-full relative ${content.isOnline ? 'bg-green-500' : 'bg-red-500'}`}>
                {content.isOnline && (
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75"></div>
                )}
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                {content.isOnline ? (lang === 'en' ? 'Online' : 'অনলাইন') : (lang === 'en' ? 'Offline' : 'অফলাইন')}
              </span>
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-white/10 shrink-0 hidden md:block"></div>

        <div className="flex-1 flex items-center gap-4 overflow-x-auto no-scrollbar py-1 px-4">
          {highlights.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveStory(item)}
              className="flex-shrink-0 relative group flex flex-col items-center gap-1"
            >
              <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 active:scale-90 transition-transform">
                <div className="p-[1px] rounded-full bg-slate-950">
                  <img 
                    src={item.thumbnail} 
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all border border-slate-900" 
                    alt="story"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 01-1.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
            ) : (
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
          </button>

          <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setLang('en')} 
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
            >EN</button>
            <button 
              onClick={() => setLang('bn')} 
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${lang === 'bn' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
            >বাংলা</button>
          </div>
        </div>
      </nav>

      {/* LIVE VIEWER MODAL */}
      {isLiveViewerOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-10 animate-in fade-in zoom-in-95 duration-300">
           <div className="absolute top-6 right-6 z-[260]">
             <button onClick={() => setIsLiveViewerOpen(false)} className="text-white/50 hover:text-white p-3 hover:bg-white/10 rounded-full transition-all">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
           </div>
           
           <div className="w-full max-w-5xl glass rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative flex flex-col md:flex-row aspect-video">
              <div className="flex-1 bg-black relative group/player">
                 <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full z-10 animate-live-blink">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-tighter">LIVE BROADCAST</span>
                 </div>
                 
                 {/* VISITOR VOLUME CONTROLS OVERLAY */}
                 <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 flex items-center gap-3 bg-black/40 backdrop-blur-xl p-3 rounded-2xl border border-white/10">
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                      )}
                    </button>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={isMuted ? 0 : volume} 
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setVolume(val);
                        if (val > 0) setIsMuted(false);
                        else setIsMuted(true);
                      }}
                      className="volume-slider"
                    />
                 </div>

                 <div className="w-full h-full flex flex-col items-center justify-center text-center">
                    {content.isBroadcasting && content.broadcastSource === 'external' && content.streamUrl ? (
                      <>
                        {(streamType === 'youtube' || streamType === 'facebook') ? (
                          <div className="w-full h-full relative pointer-events-none">
                            <iframe 
                              src={getEmbedUrl(content.streamUrl)}
                              className="w-full h-full border-none"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            ></iframe>
                            <div className="absolute inset-0 z-10"></div>
                          </div>
                        ) : (
                          <video 
                            ref={liveVideoRef}
                            autoPlay 
                            muted={isMuted}
                            playsInline
                            className="w-full h-full object-contain pointer-events-none"
                            poster="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800"
                          />
                        )}
                      </>
                    ) : (
                      <div className="p-10">
                        <svg className="w-20 h-20 text-blue-500/50 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Signal Pending</h3>
                        <p className="text-gray-500 max-w-xs text-sm">Waiting for broadcaster to connect the signal...</p>
                      </div>
                    )}
                 </div>
              </div>
              
              <div className="w-full md:w-80 bg-slate-900/50 p-8 flex flex-col border-l border-white/5">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full border-2 border-blue-500 p-0.5">
                      <img src="https://via.placeholder.com/150" className="w-full h-full rounded-full object-cover" alt="Profile" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm tracking-tight">{content.brandName}</h4>
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">
                        {streamType === 'youtube' ? 'YOUTUBE LIVE' : streamType === 'facebook' ? 'FACEBOOK LIVE' : 'OBS STREAM'}
                      </p>
                    </div>
                 </div>
                 
                 <div className="flex-1 space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                       <p className="text-gray-400 text-xs font-medium italic">"Welcome to the workshop! Feel free to ask questions in the chat."</p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">
                       <span>Quality</span>
                       <span className="text-blue-500">Auto HD</span>
                    </div>
                 </div>
                 
                 <button className="mt-8 w-full bg-blue-600 py-3 rounded-xl text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                    Live Chat
                 </button>
              </div>
           </div>
        </div>
      )}

      {activeStory && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="absolute top-8 right-8 flex items-center gap-4 z-[230]">
            <button onClick={togglePlayPause} className="text-white/50 hover:text-white p-3 hover:bg-white/10 rounded-full">
              {isPaused ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1-1v4a1 1 0 102 0V8a1 1 0 00-1-1z" /></svg>
              )}
            </button>
            <button onClick={() => setActiveStory(null)} className="text-white/50 hover:text-white p-3 hover:bg-white/10 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <button onClick={handlePrev} className="absolute left-4 md:left-12 text-white/30 hover:text-white z-[230] p-4 hidden sm:block">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={2} /></svg>
          </button>
          <button onClick={handleNext} className="absolute right-4 md:right-12 text-white/30 hover:text-white z-[230] p-4 hidden sm:block">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth={2} /></svg>
          </button>

          <div className="relative w-full max-w-[420px] aspect-[9/16] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 border border-white/10">
            <div className="absolute top-4 left-4 right-4 z-[220] flex gap-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="bg-white h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            {activeStory.type === 'image' ? (
              <img src={activeStory.url} className="w-full h-full object-cover" alt="highlight" />
            ) : (
              <video ref={videoRef} src={activeStory.url} autoPlay muted playsInline loop className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
              <div className="flex items-center gap-3 mb-3">
                <img src={activeStory.thumbnail} className="w-8 h-8 rounded-full border border-white/20" alt="thumb" />
                <span className="text-white font-bold text-sm tracking-tight">{content.brandName}</span>
                <span className="text-white/40 text-[10px]">•</span>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{activeStory.timestamp}</span>
              </div>
              <p className="text-white text-lg font-medium leading-tight mb-2">{activeStory.caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
