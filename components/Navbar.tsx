
import React, { useState, useEffect } from 'react';
import { Language, Content } from '../types';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  content: Content;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, content }) => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 max-w-7xl mx-auto backdrop-blur-md">
      <div className="text-xl md:text-2xl font-bold tracking-tighter text-blue-500 cursor-pointer uppercase transition-colors">
        {content.brandName}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="glass p-2 rounded-full border border-white/10 hover:bg-blue-500/20 transition-all active:scale-90"
          title="Toggle Theme"
        >
          {isDark ? (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        <div className="flex gap-2 glass p-1 rounded-full border border-white/10 shadow-lg">
          <button 
            onClick={() => setLang('en')} 
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${lang === 'en' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:text-blue-500'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('bn')} 
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${lang === 'bn' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-gray-500 hover:text-blue-500'}`}
          >
            বাংলা
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
