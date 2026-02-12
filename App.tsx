
import React, { useState } from 'react';
import { Language, Content } from './types';
import { TRANSLATIONS } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Personalizer from './components/Personalizer';
import ProjectsSection from './components/ProjectsSection';
import LifeStory from './components/LifeStory';
import SocialLinks from './components/SocialLinks';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [customBio, setCustomBio] = useState<{ title: string; desc: string } | null>(null);

  const content = TRANSLATIONS[lang];

  const heroContent: Content = {
    ...content,
    title: customBio?.title || content.title,
    desc: customBio?.desc || content.desc,
  };

  return (
    <div className="relative">
      {/* Background Video directly in JSX to handle React lifecycle if needed, 
          but already in index.html for performance. Let's add noise overlay. */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>

      <div className="relative z-10">
        <Navbar lang={lang} setLang={setLang} content={content} />

        <Hero content={heroContent} />

        <Stats content={content} />

        <LifeStory content={content} />

        <Personalizer 
          content={content} 
          lang={lang} 
          onUpdate={(bio) => {
            setCustomBio(bio);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />

        <ProjectsSection content={content} />

        <SocialLinks content={content} />

        <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 text-center">
          <div className="text-blue-400 font-bold mb-4 tracking-tighter text-xl uppercase">
            {content.brandName}
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Modern Portfolio — Crafted with Passion & AI.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
