
import React, { useState } from 'react';
import { Language, Content, Project, Story, SocialHighlight } from '../types';

interface AdminPanelProps {
  initialContent: Record<Language, Content>;
  initialProjects: Project[];
  initialStories: Story[];
  initialHighlights: SocialHighlight[];
  onSave: (content: Record<Language, Content>, projects: Project[], stories: Story[], highlights: SocialHighlight[]) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  initialContent, initialProjects, initialStories, initialHighlights, onSave, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'projects' | 'stories' | 'highlights'>('content');
  const [editLang, setEditLang] = useState<Language>('en');
  const [content, setContent] = useState(initialContent);
  const [projects, setProjects] = useState(initialProjects);
  const [stories, setStories] = useState(initialStories);
  const [highlights, setHighlights] = useState(initialHighlights);

  const handleContentChange = (key: keyof Content, value: string) => {
    setContent({
      ...content,
      [editLang]: { ...content[editLang], [key]: value }
    });
  };

  const addProject = () => setProjects([...projects, { id: Date.now().toString(), title: 'New Project', tags: ['React'], image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' }]);
  const deleteProject = (id: string) => setProjects(projects.filter(p => p.id !== id));

  const addStory = () => setStories([...stories, { id: Date.now().toString(), title: 'New Story', desc: 'Summary', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000', icon: '📖', details: 'Details' }]);
  const deleteStory = (id: string) => setStories(stories.filter(s => s.id !== id));

  const addHighlight = () => setHighlights([{ 
    id: Date.now().toString(), 
    type: 'image', 
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800', 
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=200', 
    caption: 'New Highlight', 
    timestamp: 'Just now' 
  }, ...highlights]);
  const deleteHighlight = (id: string) => setHighlights(highlights.filter(h => h.id !== id));

  const handleSave = () => {
    onSave(content, projects, stories, highlights);
    alert('Changes saved successfully!');
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950 flex flex-col text-white animate-in slide-in-from-bottom duration-500 overflow-hidden">
      <header className="border-b border-white/10 p-6 flex justify-between items-center glass">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-2xl font-black text-blue-500 uppercase tracking-tighter">Admin Panel</h1>
          <nav className="flex gap-2">
            {(['content', 'projects', 'stories', 'highlights'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all uppercase ${activeTab === tab ? 'bg-blue-600' : 'hover:bg-white/5'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex gap-4">
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl text-sm font-bold transition-all">Save All</button>
          <button onClick={onLogout} className="bg-white/5 hover:bg-red-600/20 text-gray-400 hover:text-red-400 px-6 py-2 rounded-xl text-sm font-bold transition-all border border-white/10">Exit</button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full">
        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Text Content</h2>
              <div className="flex gap-2 bg-black/40 p-1 rounded-full border border-white/10">
                <button onClick={() => setEditLang('en')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${editLang === 'en' ? 'bg-blue-600' : ''}`}>EN</button>
                <button onClick={() => setEditLang('bn')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${editLang === 'bn' ? 'bg-blue-600' : ''}`}>বাংলা</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(content[editLang]).map((key) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold">{key}</label>
                  <textarea 
                    value={(content[editLang] as any)[key]}
                    onChange={(e) => handleContentChange(key as keyof Content, e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm h-20"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'highlights' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Social Highlights</h2>
              <button onClick={addHighlight} className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-bold">+ New Highlight</button>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {highlights.map((h, idx) => (
                <div key={h.id} className="glass p-6 rounded-[2rem] border border-white/10 flex gap-6 relative">
                  <button onClick={() => deleteHighlight(h.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div className="w-32 space-y-2">
                    <img src={h.thumbnail} className="w-32 h-32 rounded-full object-cover border-2 border-blue-500" />
                    <select 
                      value={h.type}
                      onChange={(e) => {
                        const newH = [...highlights];
                        newH[idx].type = e.target.value as any;
                        setHighlights(newH);
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-lg text-[10px] py-1"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">MEDIA URL</label>
                        <input value={h.url} onChange={(e) => { const n = [...highlights]; n[idx].url = e.target.value; setHighlights(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">THUMBNAIL URL</label>
                        <input value={h.thumbnail} onChange={(e) => { const n = [...highlights]; n[idx].thumbnail = e.target.value; setHighlights(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">CAPTION</label>
                        <input value={h.caption} onChange={(e) => { const n = [...highlights]; n[idx].caption = e.target.value; setHighlights(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500">TIMESTAMP</label>
                        <input value={h.timestamp} onChange={(e) => { const n = [...highlights]; n[idx].timestamp = e.target.value; setHighlights(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Tabs Logic simplified for brevity here */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center"><h2 className="text-3xl font-bold">Projects</h2><button onClick={addProject} className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-bold">+ New Project</button></div>
            {projects.map((p, i) => (
              <div key={p.id} className="glass p-6 rounded-[2rem] border border-white/10 flex gap-6 relative">
                 <button onClick={() => deleteProject(p.id)} className="absolute top-4 right-4 text-red-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                 <img src={p.image} className="w-32 h-20 rounded-xl object-cover" />
                 <div className="flex-1 space-y-4">
                    <input value={p.title} onChange={(e) => { const n = [...projects]; n[i].title = e.target.value; setProjects(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm" />
                    <input value={p.image} onChange={(e) => { const n = [...projects]; n[i].image = e.target.value; setProjects(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-1 text-[10px]" />
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="space-y-8">
             <div className="flex justify-between items-center"><h2 className="text-3xl font-bold">Personal Stories</h2><button onClick={addStory} className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-bold">+ New Story</button></div>
             {stories.map((s, i) => (
               <div key={s.id} className="glass p-6 rounded-[2rem] border border-white/10 flex gap-6 relative">
                  <button onClick={() => deleteStory(s.id)} className="absolute top-4 right-4 text-red-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                  <img src={s.image} className="w-20 h-20 rounded-full object-cover" />
                  <div className="flex-1 space-y-4">
                     <input value={s.title} onChange={(e) => { const n = [...stories]; n[i].title = e.target.value; setStories(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm" />
                     <textarea value={s.desc} onChange={(e) => { const n = [...stories]; n[i].desc = e.target.value; setStories(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm h-20" />
                  </div>
               </div>
             ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
