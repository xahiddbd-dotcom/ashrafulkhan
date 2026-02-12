
import React, { useState, useEffect } from 'react';
import { Language, Content, Project, Story, SocialHighlight } from './types';
import { TRANSLATIONS, PROJECTS, INITIAL_STORIES, INITIAL_HIGHLIGHTS } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Personalizer from './components/Personalizer';
import ProjectsSection from './components/ProjectsSection';
import LifeStory from './components/LifeStory';
import SocialLinks from './components/SocialLinks';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import HighlightsShelf from './components/HighlightsShelf';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [customBio, setCustomBio] = useState<{ title: string; desc: string } | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  // Persistence state
  const [activeContent, setActiveContent] = useState<Record<Language, Content>>(TRANSLATIONS);
  const [activeProjects, setActiveProjects] = useState<Project[]>(PROJECTS);
  const [activeStories, setActiveStories] = useState<Story[]>(INITIAL_STORIES);
  const [activeHighlights, setActiveHighlights] = useState<SocialHighlight[]>(INITIAL_HIGHLIGHTS);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('portfolio_content');
    const savedProjects = localStorage.getItem('portfolio_projects');
    const savedStories = localStorage.getItem('portfolio_stories');
    const savedHighlights = localStorage.getItem('portfolio_highlights');
    if (savedContent) setActiveContent(JSON.parse(savedContent));
    if (savedProjects) setActiveProjects(JSON.parse(savedProjects));
    if (savedStories) setActiveStories(JSON.parse(savedStories));
    if (savedHighlights) setActiveHighlights(JSON.parse(savedHighlights));
  }, []);

  const content = activeContent[lang];

  const heroContent: Content = {
    ...content,
    title: customBio?.title || content.title,
    desc: customBio?.desc || content.desc,
  };

  const handleAdminSave = (
    newContent: Record<Language, Content>, 
    newProjects: Project[], 
    newStories: Story[], 
    newHighlights: SocialHighlight[]
  ) => {
    setActiveContent(newContent);
    setActiveProjects(newProjects);
    setActiveStories(newStories);
    setActiveHighlights(newHighlights);
    localStorage.setItem('portfolio_content', JSON.stringify(newContent));
    localStorage.setItem('portfolio_projects', JSON.stringify(newProjects));
    localStorage.setItem('portfolio_stories', JSON.stringify(newStories));
    localStorage.setItem('portfolio_highlights', JSON.stringify(newHighlights));
    setIsAdminMode(false);
  };

  if (isAdminMode) {
    return (
      <AdminPanel 
        initialContent={activeContent}
        initialProjects={activeProjects}
        initialStories={activeStories}
        initialHighlights={activeHighlights}
        onSave={handleAdminSave}
        onLogout={() => setIsAdminMode(false)}
      />
    );
  }

  return (
    <div className="relative">
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>

      <div className="relative z-10">
        <Navbar lang={lang} setLang={setLang} content={content} />

        <HighlightsShelf highlights={activeHighlights} />

        <Hero content={heroContent} />

        <Stats content={content} />

        <LifeStory content={content} stories={activeStories} />

        <Personalizer 
          content={content} 
          lang={lang} 
          onUpdate={(bio) => {
            setCustomBio(bio);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />

        <ProjectsSection content={content} projects={activeProjects} />

        <SocialLinks content={content} />

        <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 text-center">
          <div className="text-blue-400 font-bold mb-4 tracking-tighter text-xl uppercase">
            {content.brandName}
          </div>
          <p className="text-gray-500 text-sm mb-6">
            &copy; {new Date().getFullYear()} Modern Portfolio — Crafted with Passion & AI.
          </p>
          <button 
            onClick={() => setIsLoginOpen(true)}
            className="text-xs text-gray-700 hover:text-blue-500 font-bold uppercase tracking-widest transition-colors"
          >
            Admin Access
          </button>
        </footer>
      </div>

      {isLoginOpen && (
        <Login 
          onLogin={() => {
            setIsLoginOpen(false);
            setIsAdminMode(true);
          }}
          onClose={() => setIsLoginOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
