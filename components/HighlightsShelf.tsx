
import React, { useState, useEffect } from 'react';
import { SocialHighlight } from '../types';

interface HighlightsShelfProps {
  highlights: SocialHighlight[];
}

const HighlightsShelf: React.FC<HighlightsShelfProps> = ({ highlights }) => {
  const [activeStory, setActiveStory] = useState<SocialHighlight | null>(null);
  const [progress, setProgress] = useState(0);

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
      }, 50); // 5 seconds total duration roughly
    }
    return () => clearInterval(timer);
  }, [activeStory]);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-4">
      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar items-center">
        {highlights.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveStory(item)}
            className="flex-shrink-0 flex flex-col items-center gap-2 group"
          >
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 transition-transform group-hover:scale-110 active:scale-95">
              <div className="p-0.5 rounded-full bg-slate-950">
                <img 
                  src={item.thumbnail} 
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-slate-900" 
                  alt={item.caption}
                />
              </div>
              {item.type === 'video' && (
                <div className="absolute bottom-1 right-1 bg-blue-600 rounded-full p-1 border-2 border-slate-950">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4l12 6-12 6z" />
                  </svg>
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.timestamp}</span>
          </button>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <button 
            onClick={() => setActiveStory(null)}
            className="absolute top-8 right-8 text-white/50 hover:text-white z-[210]"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-full max-w-lg aspect-[9/16] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl mx-4">
            {/* Progress Bar */}
            <div className="absolute top-6 left-6 right-6 z-[220] flex gap-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="bg-white h-full transition-all duration-50"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Content */}
            {activeStory.type === 'image' ? (
              <img src={activeStory.url} className="w-full h-full object-cover" />
            ) : (
              <video 
                src={activeStory.url} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
            )}

            {/* Caption Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/50 to-transparent">
              <p className="text-white text-xl font-medium mb-2">{activeStory.caption}</p>
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">{activeStory.timestamp}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighlightsShelf;
