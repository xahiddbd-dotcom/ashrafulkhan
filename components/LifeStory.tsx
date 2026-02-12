
import React, { useState } from 'react';
import { Content, Story } from '../types';

interface LifeStoryProps {
  content: Content;
  stories: Story[];
}

const LifeStory: React.FC<LifeStoryProps> = ({ content, stories }) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleBoxClick = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById('lifestory-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentStory = stories.find(s => s.id === activeTab);

  return (
    <section id="lifestory-container" className="max-w-7xl mx-auto px-6 py-24 min-h-[600px] transition-all duration-500">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-gradient">{content.lifeStoryTitle}</h2>
        <p className="text-gray-500 max-w-xl mx-auto uppercase tracking-widest text-sm font-bold">Interactive Experience Inside</p>
      </div>

      {activeTab === null ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
          {stories.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleBoxClick(item.id)}
              className="group relative h-[400px] rounded-[2.5rem] overflow-hidden border border-white/5 cursor-pointer shadow-2xl hover:scale-[1.02] transition-all duration-500"
            >
              <img 
                src={item.image} 
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="flex items-center gap-4">
                  <span className="text-3xl bg-blue-600/30 backdrop-blur-xl w-14 h-14 flex items-center justify-center rounded-2xl border border-white/10">{item.icon}</span>
                  <h3 className="text-2xl font-bold text-white leading-tight">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed Tabbed View */
        <div className="glass rounded-[3rem] overflow-hidden flex flex-col lg:flex-row h-auto lg:min-h-[600px] border border-white/10 animate-in zoom-in duration-500">
          {/* Internal Sidebar/Tabs */}
          <div className="w-full lg:w-72 bg-black/40 border-b lg:border-b-0 lg:border-r border-white/10 p-6 flex lg:flex-col gap-2 overflow-x-auto">
            <button 
              onClick={() => setActiveTab(null)}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-blue-400 font-bold mb-4"
            >
              <span>←</span> Back to Grid
            </button>
            {stories.map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all whitespace-nowrap lg:whitespace-normal ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold text-sm">{item.title}</span>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 relative bg-black/20 p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center overflow-y-auto">
            {currentStory && (
              <>
                <div className="w-full md:w-1/2 h-64 md:h-full rounded-3xl overflow-hidden relative group">
                    <img 
                        src={currentStory.image} 
                        className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700"
                    />
                    <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
                </div>
                <div className="flex-1 space-y-6 animate-in slide-in-from-right duration-500">
                    <div className="flex items-center gap-4">
                        <span className="text-5xl">{currentStory.icon}</span>
                        <h2 className="text-4xl font-black text-blue-400">{currentStory.title}</h2>
                    </div>
                    <p className="text-2xl text-gray-200 font-light leading-relaxed">
                        {currentStory.desc}
                    </p>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-gray-400 font-light italic">
                        {currentStory.details}
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                        <div className="w-4 h-1 bg-blue-600/30 rounded-full"></div>
                    </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default LifeStory;
