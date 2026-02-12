
import React, { useState, useEffect } from 'react';
import { Language, Content, Project, Story, SocialHighlight, SocialLink } from '../types';

interface AdminPanelProps {
  initialContent: Record<Language, Content>;
  initialProjects: Project[];
  initialStories: Story[];
  initialHighlights: SocialHighlight[];
  initialHeroImages: string[];
  initialSocialLinks: SocialLink[];
  onSave: (content: Record<Language, Content>, projects: Project[], stories: Story[], highlights: SocialHighlight[], heroImages: string[], socialLinks: SocialLink[]) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  initialContent, initialProjects, initialStories, initialHighlights, initialHeroImages, initialSocialLinks, onSave, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'hero' | 'projects' | 'stories' | 'highlights' | 'social' | 'sync'>('content');
  const [editLang, setEditLang] = useState<Language>('en');
  const [content, setContent] = useState(initialContent);
  const [projects, setProjects] = useState(initialProjects);
  const [stories, setStories] = useState(initialStories);
  const [highlights, setHighlights] = useState(initialHighlights);
  const [heroImages, setHeroImages] = useState(initialHeroImages);
  const [socialLinks, setSocialLinks] = useState(initialSocialLinks);

  // Google Drive Integration State
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null); // Key or ID of the uploading field
  const [googleClientId, setGoogleClientId] = useState(localStorage.getItem('google_client_id') || '');

  const handleContentChange = (key: keyof Content, value: any) => {
    setContent({
      ...content,
      [editLang]: { ...content[editLang], [key]: value }
    });
  };

  const handleSave = () => {
    onSave(content, projects, stories, highlights, heroImages, socialLinks);
    localStorage.setItem('google_client_id', googleClientId);
    alert('Changes saved successfully!');
  };

  // Google Drive Logic
  const initGoogleAuth = () => {
    if (!googleClientId) {
      alert('Please set your Google Client ID in the "Sync/Cloud" tab first!');
      return;
    }
    
    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: googleClientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (response: any) => {
        if (response.access_token) {
          setAccessToken(response.access_token);
        }
      },
    });
    client.requestAccessToken();
  };

  const uploadFileToDrive = async (file: File, fieldId: string, callback: (url: string) => void) => {
    if (!accessToken) {
      initGoogleAuth();
      return;
    }

    setIsUploading(fieldId);

    try {
      // 1. Metadata setup
      const metadata = {
        name: `portfolio_${Date.now()}_${file.name}`,
        mimeType: file.type,
      };

      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', file);

      // 2. Upload request
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const result = await response.json();
      const fileId = result.id;

      // 3. Make file public (Anyone with link can view)
      await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: 'reader', type: 'anyone' }),
      });

      // 4. Construct Direct Link (Works with img tags)
      const directUrl = `https://lh3.googleusercontent.com/u/0/d/${fileId}`;
      callback(directUrl);
      
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please check your credentials.');
    } finally {
      setIsUploading(null);
    }
  };

  const DriveUploadButton = ({ id, onUrl }: { id: string, onUrl: (url: string) => void }) => (
    <label className="shrink-0 cursor-pointer">
      <div className={`p-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2 ${isUploading === id ? 'animate-pulse text-blue-400' : 'text-gray-400'}`}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 11h2.29l-4.29 4.29L6.71 13H9V7h4v6z"/></svg>
        <span className="text-[10px] font-bold uppercase">{isUploading === id ? 'Uploading...' : 'Drive'}</span>
      </div>
      <input 
        type="file" 
        className="hidden" 
        accept="image/*,video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFileToDrive(file, id, onUrl);
        }} 
      />
    </label>
  );

  // Standard Management Methods
  const addHeroImage = () => setHeroImages([...heroImages, '']);
  const removeHeroImage = (index: number) => setHeroImages(heroImages.filter((_, i) => i !== index));

  const addProject = () => setProjects([...projects, { id: Date.now().toString(), title: 'New Project', tags: ['React'], image: '' }]);
  const deleteProject = (id: string) => setProjects(projects.filter(p => p.id !== id));

  const addStory = () => setStories([...stories, { id: Date.now().toString(), title: 'New Story', desc: 'Summary', image: '', icon: '📖', details: '' }]);
  const deleteStory = (id: string) => setStories(stories.filter(s => s.id !== id));

  const addHighlight = () => setHighlights([{ 
    id: Date.now().toString(), 
    type: 'image', 
    url: '', 
    thumbnail: '', 
    caption: 'New Highlight', 
    timestamp: 'Just now',
    createdAt: Date.now()
  }, ...highlights]);
  const deleteHighlight = (id: string) => setHighlights(highlights.filter(h => h.id !== id));

  const addSocialLink = () => setSocialLinks([...socialLinks, { platform: 'New Platform', url: '#', icon: 'M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z', color: '#3b82f6' }]);
  const deleteSocialLink = (idx: number) => setSocialLinks(socialLinks.filter((_, i) => i !== idx));

  const handleExport = () => {
    const data = { content, projects, stories, highlights, heroImages, socialLinks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string);
        if (imported.content) setContent(imported.content);
        if (imported.projects) setProjects(imported.projects);
        if (imported.stories) setStories(imported.stories);
        if (imported.highlights) setHighlights(imported.highlights);
        if (imported.heroImages) setHeroImages(imported.heroImages);
        if (imported.socialLinks) setSocialLinks(imported.socialLinks);
        alert('Data imported. Save to apply!');
      } catch (err) { alert('Invalid format.'); }
    };
    reader.readAsText(file);
  };

  const fontSizes = [
    { label: 'Small', value: 'text-4xl md:text-5xl' },
    { label: 'Normal', value: 'text-5xl md:text-6xl' },
    { label: 'Large', value: 'text-5xl md:text-7xl' },
    { label: 'Extra Large', value: 'text-5xl md:text-8xl' },
    { label: 'Gigantic', value: 'text-6xl md:text-9xl' },
  ];

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950 flex flex-col text-white animate-in slide-in-from-bottom duration-500 overflow-hidden">
      <header className="border-b border-white/10 p-6 flex justify-between items-center glass shrink-0">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-2xl font-black text-blue-500 uppercase tracking-tighter">Admin Dashboard</h1>
          <nav className="flex gap-2 bg-white/5 p-1 rounded-full overflow-x-auto no-scrollbar max-w-[50vw]">
            {(['content', 'hero', 'projects', 'stories', 'highlights', 'social', 'sync'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all uppercase whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex gap-4">
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl text-sm font-bold transition-all">Save Changes</button>
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

            {/* Title Font Size Control */}
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Hero Title Appearance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[10px] uppercase text-gray-500 font-bold">Title Font Size</label>
                   <select 
                     value={content[editLang].titleSize || 'text-5xl md:text-8xl'}
                     onChange={(e) => handleContentChange('titleSize', e.target.value)}
                     className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm"
                   >
                     {fontSizes.map(size => (
                       <option key={size.value} value={size.value}>{size.label}</option>
                     ))}
                   </select>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(content[editLang]).filter(k => k !== 'isOnline' && k !== 'titleSize').map((key) => (
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

        {/* ... (rest of the AdminPanel sections remain unchanged) ... */}
        
        {activeTab === 'sync' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2rem]">
                <h2 className="text-2xl font-black mb-4 uppercase">Cloud Storage Settings</h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Google Client ID</label>
                    <input 
                      type="text"
                      value={googleClientId}
                      onChange={(e) => setGoogleClientId(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono"
                      placeholder="Enter your Google OAuth Client ID..."
                    />
                    <p className="text-[10px] text-gray-500 mt-2">
                      Get this from <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-500 underline">Google Cloud Console</a>. 
                      Enable 'Drive API' and add 'http://localhost:3000' (or your domain) to Authorized JavaScript origins.
                    </p>
                  </div>
                  {!accessToken ? (
                    <button onClick={initGoogleAuth} className="w-full bg-blue-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                       <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032 c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10 c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                       Connect Google Drive
                    </button>
                  ) : (
                    <div className="bg-green-600/20 border border-green-500 text-green-400 p-4 rounded-xl flex items-center gap-3">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                       Drive Connected (Ready for Uploads)
                    </div>
                  )}
                </div>
             </div>
             <div className="flex gap-4">
                <button onClick={handleExport} className="flex-1 bg-white/5 p-6 rounded-[2rem] border border-white/10 text-center font-bold">Export Backup (.json)</button>
                <label className="flex-1 bg-white/5 p-6 rounded-[2rem] border border-white/10 text-center font-bold cursor-pointer">
                  Import Backup
                  <input type="file" className="hidden" accept=".json" onChange={handleImport} />
                </label>
             </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center"><h2 className="text-3xl font-bold">Hero Slideshow</h2><button onClick={addHeroImage} className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-bold">+ Image</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {heroImages.map((img, idx) => (
                <div key={idx} className="glass p-6 rounded-[2rem] border border-white/10 relative group">
                   <button onClick={() => removeHeroImage(idx)} className="absolute top-4 right-4 text-red-500 bg-red-500/10 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg>
                   </button>
                   <img src={img || 'https://via.placeholder.com/300?text=No+Image'} className="w-full h-32 rounded-xl object-cover mb-4 border border-white/5" alt="hero" />
                   <div className="flex gap-2">
                     <input value={img} onChange={(e) => { const n = [...heroImages]; n[idx] = e.target.value; setHeroImages(n); }} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" placeholder="Image URL..." />
                     <DriveUploadButton id={`hero-${idx}`} onUrl={(url) => { const n = [...heroImages]; n[idx] = url; setHeroImages(n); }} />
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'highlights' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center"><h2 className="text-3xl font-bold">Stories/Highlights</h2><button onClick={addHighlight} className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-bold">+ New</button></div>
            <div className="grid grid-cols-1 gap-6">
              {highlights.map((h, idx) => (
                <div key={h.id} className="glass p-6 rounded-[2rem] border border-white/10 flex gap-6 relative group">
                  <button onClick={() => deleteHighlight(h.id)} className="absolute top-4 right-4 text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg></button>
                  <div className="w-32 flex flex-col items-center gap-2">
                    <img src={h.thumbnail || 'https://via.placeholder.com/100'} className="w-24 h-24 rounded-full object-cover border-2 border-blue-500" />
                    <div className="flex gap-1 w-full justify-center">
                       <DriveUploadButton id={`highlight-thumb-${h.id}`} onUrl={(url) => { const n = [...highlights]; n[idx].thumbnail = url; setHighlights(n); }} />
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="col-span-2 flex gap-2">
                      <input value={h.url} onChange={(e) => { const n = [...highlights]; n[idx].url = e.target.value; setHighlights(n); }} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" placeholder="Media (Image/Video) URL..." />
                      <DriveUploadButton id={`highlight-media-${h.id}`} onUrl={(url) => { const n = [...highlights]; n[idx].url = url; setHighlights(n); }} />
                    </div>
                    <input value={h.caption} onChange={(e) => { const n = [...highlights]; n[idx].caption = e.target.value; setHighlights(n); }} className="col-span-2 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" placeholder="Caption..." />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
           <div className="space-y-8 animate-in fade-in">
             <div className="flex justify-between items-center"><h2 className="text-3xl font-bold">Projects</h2><button onClick={addProject} className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-bold">+ New</button></div>
             <div className="grid grid-cols-1 gap-6">
               {projects.map((p, i) => (
                 <div key={p.id} className="glass p-6 rounded-[2rem] border border-white/10 flex gap-6 relative">
                   <button onClick={() => deleteProject(p.id)} className="absolute top-4 right-4 text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg></button>
                   <img src={p.image || 'https://via.placeholder.com/150'} className="w-40 h-24 rounded-xl object-cover" />
                   <div className="flex-1 space-y-2">
                     <input value={p.title} onChange={(e) => { const n = [...projects]; n[i].title = e.target.value; setProjects(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold" />
                     <div className="flex gap-2">
                        <input value={p.image} onChange={(e) => { const n = [...projects]; n[i].image = e.target.value; setProjects(n); }} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-1 text-xs" placeholder="Image URL..." />
                        <DriveUploadButton id={`project-${p.id}`} onUrl={(url) => { const n = [...projects]; n[i].image = url; setProjects(n); }} />
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}

        {activeTab === 'stories' && (
           <div className="space-y-8 animate-in fade-in">
             <div className="flex justify-between items-center"><h2 className="text-3xl font-bold">Life Journey Entries</h2><button onClick={addStory} className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-bold">+ New Entry</button></div>
             <div className="grid grid-cols-1 gap-6">
               {stories.map((s, i) => (
                 <div key={s.id} className="glass p-6 rounded-[2rem] border border-white/10 flex gap-6 relative">
                   <button onClick={() => deleteStory(s.id)} className="absolute top-4 right-4 text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg></button>
                   <div className="flex-1 space-y-3">
                     <div className="flex gap-4">
                        <input value={s.title} onChange={(e) => { const n = [...stories]; n[i].title = e.target.value; setStories(n); }} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold" placeholder="Entry Title" />
                        <input value={s.icon} onChange={(e) => { const n = [...stories]; n[i].icon = e.target.value; setStories(n); }} className="w-16 bg-black/40 border border-white/10 rounded-xl text-center" />
                     </div>
                     <div className="flex gap-2">
                        <input value={s.image} onChange={(e) => { const n = [...stories]; n[i].image = e.target.value; setStories(n); }} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" placeholder="Image URL..." />
                        <DriveUploadButton id={`story-${s.id}`} onUrl={(url) => { const n = [...stories]; n[i].image = url; setStories(n); }} />
                     </div>
                     <textarea value={s.desc} onChange={(e) => { const n = [...stories]; n[i].desc = e.target.value; setStories(n); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs h-20" placeholder="Summary..." />
                   </div>
                 </div>
               ))}
             </div>
           </div>
        )}

        {activeTab === 'social' && (
           <div className="space-y-8 animate-in fade-in">
             <div className="flex justify-between items-center"><h2 className="text-3xl font-bold">Social Presence</h2><button onClick={addSocialLink} className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-bold">+ Link</button></div>
             <div className="grid grid-cols-1 gap-4">
                {socialLinks.map((link, idx) => (
                  <div key={idx} className="glass p-6 rounded-[2rem] border border-white/10 flex gap-6 relative group">
                    <button onClick={() => deleteSocialLink(idx)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg></button>
                    <div className="w-12 h-12 rounded-full shrink-0 border border-white/10 flex items-center justify-center" style={{ backgroundColor: link.color + '33' }}>
                      <svg className="w-6 h-6" fill={link.color} viewBox="0 0 24 24"><path d={link.icon} /></svg>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                       <input value={link.platform} onChange={(e) => { const n = [...socialLinks]; n[idx].platform = e.target.value; setSocialLinks(n); }} className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" />
                       <input value={link.color} onChange={(e) => { const n = [...socialLinks]; n[idx].color = e.target.value; setSocialLinks(n); }} className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" />
                       <input value={link.url} onChange={(e) => { const n = [...socialLinks]; n[idx].url = e.target.value; setSocialLinks(n); }} className="col-span-2 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" />
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
