
import React, { useState, useEffect } from 'react';
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
  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (activeStory) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setActiveStory(null);
            return 100;
          }
          return prev + 1;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [activeStory]);

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
        .animate-brand-3d {
          display: inline-block;
          animation: colorCycle 2s infinite ease-in-out, tilt3D 4s infinite ease-in-out;
          transform-style: preserve-3d;
        }
      `}</style>
      
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-4 md:px-8 py-2 bg-slate-950/70 backdrop-blur-2xl border-b border-white/5">
        {/* Left: Enhanced 3D Brand Name & Status Indicator */}
        <div className="flex items-center gap-3 shrink-0 mr-6">
          <div className="flex flex-col">
            <div className="cursor-pointer uppercase shrink-0 overflow-visible py-1">
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

        {/* Divider */}
        <div className="h-8 w-px bg-white/10 shrink-0 hidden md:block"></div>

        {/* Center: Expansive Highlights Section */}
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
              {item.type === 'video' && (
                <div className="absolute top-0 right-0 bg-blue-600 rounded-full p-0.5 border border-slate-950 shadow-lg">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4l12 6-12 6z" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        
        {/* Right: Controls */}
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
            ) : (
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
          </button>

          <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setLang('en')} 
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >EN</button>
            <button 
              onClick={() => setLang('bn')} 
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${lang === 'bn' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >বাংলা</button>
          </div>
        </div>
      </nav>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <button 
            onClick={() => setActiveStory(null)}
            className="absolute top-8 right-8 text-white/50 hover:text-white z-[210] p-3 hover:bg-white/10 rounded-full transition-all"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-full max-w-[420px] aspect-[9/16] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 border border-white/10 ring-1 ring-white/5">
            <div className="absolute top-4 left-4 right-4 z-[220] flex gap-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="bg-white h-full transition-all duration-50 rounded-full shadow-[0_0_10px_white]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {activeStory.type === 'image' ? (
              <img src={activeStory.url} className="w-full h-full object-cover" alt="highlight" />
            ) : (
              <video src={activeStory.url} autoPlay muted playsInline loop className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="flex items-center gap-3 mb-3">
                <img src={activeStory.thumbnail} className="w-8 h-8 rounded-full border border-white/20" alt="thumb" />
                <span className="text-white font-bold text-sm tracking-tight">{content.brandName}</span>
                <span className="text-white/40 text-[10px]">•</span>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{activeStory.timestamp}</span>
              </div>
              <p className="text-white text-lg font-medium leading-tight mb-2 drop-shadow-lg">{activeStory.caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
