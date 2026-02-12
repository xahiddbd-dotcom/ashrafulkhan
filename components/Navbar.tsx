
import React from 'react';
import { Language, Content } from '../types';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  content: Content;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, content }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 max-w-7xl mx-auto backdrop-blur-md">
      <div className="text-xl md:text-2xl font-bold tracking-tighter text-blue-400 cursor-pointer uppercase">
        {content.brandName}
      </div>
      <div className="flex gap-2 glass p-1 rounded-full border border-white/10 shadow-lg">
        <button 
          onClick={() => setLang('en')} 
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${lang === 'en' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-gray-400 hover:text-white'}`}
        >
          EN
        </button>
        <button 
          onClick={() => setLang('bn')} 
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${lang === 'bn' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-gray-400 hover:text-white'}`}
        >
          বাংলা
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
