
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
  const [activeTab, setActiveTab] = useState<'content' | 'projects' | 'stories' | 'highlights' | 'sync'>('content');
  const [editLang, setEditLang] = useState<Language>('en');
  const [content, setContent] = useState(initialContent);
  const [projects, setProjects] = useState(initialProjects);
  const [stories, setStories] = useState(initialStories);
  const [highlights, setHighlights] = useState(initialHighlights);

  const handleContentChange = (key: keyof Content, value: any) => {
    setContent({
      ...content,
      [editLang]: { ...content[editLang], [key]: value }
    });
  };

  const handleSave = () => {
    onSave(content, projects, stories, highlights);
    alert('Changes saved successfully!');
  };

  // Sync Logic
  const handleExport = () => {
    const data = { content, projects, stories, highlights };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string);
        setContent(imported.content);
        setProjects(imported.projects);
        setStories(imported.stories);
        setHighlights(imported.highlights);
        alert('Data imported successfully. Remember to Save All Changes!');
      } catch (err) {
        alert('Invalid data format.');
      }
    };
    reader.readAsText(file);
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

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950 flex flex-col text-white animate-in slide-in-from-bottom duration-500 overflow-hidden">
      <header className="border-b border-white/10 p-6 flex justify-between items-center glass">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-2xl font-black text-blue-500 uppercase tracking-tighter">Admin Dashboard</h1>
          <nav className="flex gap-2 bg-white/5 p-1 rounded-full">
            {(['content', 'projects', 'stories', 'highlights', 'sync'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all uppercase ${activeTab === tab ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'hover:bg-white/5 text-gray-400'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex gap-4">
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-500/20">Save All Changes</button>
          <button onClick={onLogout} className="bg-white/5 hover:bg-red-600/20 text-gray-400 hover:text-red-400 px-6 py-2 rounded-xl text-sm font-bold transition-all border border-white/10">Exit</button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full">
        {activeTab === 'content' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10">
              <div>
                <h2 className="text-xl font-bold mb-1">Global Status Control</h2>
                <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Toggle your online availability indicator</p>
              </div>
              <button 
                onClick={() => handleContentChange('isOnline', !content[editLang].isOnline)}
                className={`px-8 py-3 rounded-2xl font-black transition-all border-2 ${content[editLang].isOnline ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-red-600/20 border-red-500 text-red-400'}`}
              >
                {content[editLang].isOnline ? 'ONLINE (ACTIVE)' : 'OFFLINE (INACTIVE)'}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Text Management</h2>
              <div className="flex gap-2 bg-black/40 p-1 rounded-full border border-white/10">
                <button onClick={() => setEditLang('en')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${editLang === 'en' ? 'bg-blue-600' : ''}`}>EN</button>
                <button onClick={() => setEditLang('bn')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${editLang === 'bn' ? 'bg-blue-600' : ''}`}>বাংলা</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(content[editLang]).filter(k => k !== 'isOnline').map((key) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold">{key.replace(/([A-Z])/g, ' $1')}</label>
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

        {activeTab === 'sync' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="bg-blue-600/10 border border-blue-500/20 p-10 rounded-[3rem] text-center">
                <h2 className="text-4xl font-black mb-4">Global Data Mobility</h2>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                   Since this portfolio is built to be serverless, your changes are stored locally in your browser. 
                   To access your admin dashboard from another device or location, you can <b>Export</b> your data as a file 
                   and <b>Import</b> it on the new device.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                   <button 
                     onClick={handleExport}
                     className="bg-blue-600 hover:bg-blue-700 px-10 py-5 rounded-3xl font-bold text-lg transition-all shadow-xl shadow-blue-500/20"
                   >
                     Export Site Data (.json)
                   </button>
                   <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-5 rounded-3xl font-bold text-lg transition-all">
                     Import Site Data
                     <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                   </label>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'highlights' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Social Stories</h2>
              <button onClick={addHighlight} className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-bold">+ New Post</button>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {highlights.map((h, idx) => (
                <div key={h.id} className="glass p-6 rounded-[2rem] border border-white/10 flex gap-6 relative">
                  <button onClick={() => deleteHighlight(h.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div className="w-32 space-y-2">
                    <img src={h.thumbnail} className="w-32 h-32 rounded-full object-cover border-2 border-blue-500" />
                    <select value={h.type} onChange={(e) => { const n = [...highlights]; n[idx].type = e.target.value as any; setHighlights(n); }} className="w-full bg-black/40 border border-white/10 rounded-lg text-[10px] py-1">
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                     <div><label className="text-[10px] font-bold text-gray-500">MEDIA URL</label><input value={h.url} onChange={(e) => { const n = [...highlights]; n[idx].url = e.target.value; setHighlights(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" /></div>
                     <div><label className="text-[10px] font-bold text-gray-500">THUMBNAIL</label><input value={h.thumbnail} onChange={(e) => { const n = [...highlights]; n[idx].thumbnail = e.target.value; setHighlights(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" /></div>
                     <div className="col-span-2"><label className="text-[10px] font-bold text-gray-500">CAPTION</label><input value={h.caption} onChange={(e) => { const n = [...highlights]; n[idx].caption = e.target.value; setHighlights(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing logic for projects and stories */}
        {activeTab === 'projects' && (
           <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex justify-between items-center"><h2 className="text-3xl font-bold">Projects</h2><button onClick={addProject} className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-bold">+ New Project</button></div>
             <div className="grid grid-cols-1 gap-4">
               {projects.map((p, i) => (
                 <div key={p.id} className="glass p-6 rounded-[2rem] border border-white/10 flex gap-6 relative">
                   <button onClick={() => deleteProject(p.id)} className="absolute top-4 right-4 text-red-500 p-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                   <img src={p.image} className="w-32 h-20 rounded-xl object-cover" />
                   <div className="flex-1 space-y-2">
                     <input value={p.title} onChange={(e) => { const n = [...projects]; n[i].title = e.target.value; setProjects(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm" />
                     <input value={p.image} onChange={(e) => { const n = [...projects]; n[i].image = e.target.value; setProjects(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-1 text-[10px]" />
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}

        {activeTab === 'stories' && (
           <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex justify-between items-center"><h2 className="text-3xl font-bold">Personal Stories</h2><button onClick={addStory} className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-bold">+ New Entry</button></div>
             <div className="grid grid-cols-1 gap-6">
               {stories.map((s, i) => (
                 <div key={s.id} className="glass p-6 rounded-[2rem] border border-white/10 flex gap-6 relative">
                   <button onClick={() => deleteStory(s.id)} className="absolute top-4 right-4 text-red-500 p-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                   <div className="flex-1 space-y-3">
                     <input value={s.title} onChange={(e) => { const n = [...stories]; n[i].title = e.target.value; setStories(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold" />
                     <textarea value={s.desc} onChange={(e) => { const n = [...stories]; n[i].desc = e.target.value; setStories(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm h-16" />
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
