
import React, { useState, useRef } from 'react';
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
  const [activeTab, setActiveTab] = useState<'content' | 'hero' | 'projects' | 'stories' | 'highlights' | 'social' | 'sync' | 'broadcast'>('content');
  const [editLang, setEditLang] = useState<Language>('en');
  const [content, setContent] = useState(initialContent);
  const [projects, setProjects] = useState(initialProjects);
  const [stories, setStories] = useState(initialStories);
  const [highlights, setHighlights] = useState(initialHighlights);
  const [heroImages, setHeroImages] = useState(initialHeroImages);
  const [socialLinks, setSocialLinks] = useState(initialSocialLinks);

  // Google Drive Integration State
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [googleClientId, setGoogleClientId] = useState(localStorage.getItem('google_client_id') || '');

  // Broadcast State
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startBrowserBroadcast = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoPreviewRef.current) videoPreviewRef.current.srcObject = stream;
      handleContentChange('broadcastSource', 'browser');
      handleContentChange('isBroadcasting', true);
    } catch (err) {
      alert('Could not access camera/microphone.');
    }
  };

  const stopBroadcast = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (videoPreviewRef.current) videoPreviewRef.current.srcObject = null;
    handleContentChange('isBroadcasting', false);
  };

  const handleContentChange = (key: keyof Content, value: any) => {
    setContent(prev => ({
      ...prev,
      [editLang]: { ...prev[editLang], [key]: value }
    }));
  };

  const handleSave = () => {
    onSave(content, projects, stories, highlights, heroImages, socialLinks);
    localStorage.setItem('google_client_id', googleClientId);
    alert('Changes saved successfully!');
  };

  const initGoogleAuth = () => {
    if (!googleClientId) {
      alert('Please set your Google Client ID in the "Sync" tab first!');
      return;
    }
    const client = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: googleClientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (response: any) => {
        if (response.access_token) setAccessToken(response.access_token);
      },
    });
    client.requestAccessToken();
  };

  const uploadFile = async (file: File, fieldId: string, callback: (url: string) => void) => {
    if (!accessToken) { initGoogleAuth(); return; }
    setIsUploading(fieldId);
    try {
      const metadata = { name: `portfolio_${Date.now()}_${file.name}`, mimeType: file.type };
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', file);
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      const result = await response.json();
      await fetch(`https://www.googleapis.com/drive/v3/files/${result.id}/permissions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'reader', type: 'anyone' }),
      });
      // Direct Link logic might vary depending on file type, using basic webview for now
      callback(`https://lh3.googleusercontent.com/u/0/d/${result.id}`);
    } catch (err) {
      alert('Upload failed.');
    } finally {
      setIsUploading(null);
    }
  };

  const currentContent = content[editLang];

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950 flex flex-col text-white animate-in slide-in-from-bottom duration-500 overflow-hidden font-sans">
      <header className="border-b border-white/10 p-4 flex justify-between items-center glass shrink-0">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
          <h1 className="text-xl font-black text-blue-500 uppercase tracking-tighter whitespace-nowrap">Dashboard</h1>
          <nav className="flex gap-1 bg-white/5 p-1 rounded-full shrink-0">
            {(['content', 'hero', 'projects', 'stories', 'highlights', 'social', 'sync', 'broadcast'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all uppercase whitespace-nowrap ${activeTab === tab ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-xs font-bold transition-all">Save</button>
          <button onClick={onLogout} className="bg-white/5 hover:bg-red-600/20 text-gray-400 px-4 py-2 rounded-xl text-xs font-bold transition-all">Exit</button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-8">
        
        {/* TAB: CONTENT (Translations) */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase">Text Content</h2>
              <div className="flex gap-1 bg-black/40 p-1 rounded-full">
                <button onClick={() => setEditLang('en')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${editLang === 'en' ? 'bg-blue-600' : ''}`}>EN</button>
                <button onClick={() => setEditLang('bn')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${editLang === 'bn' ? 'bg-blue-600' : ''}`}>BN</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(currentContent).filter(k => typeof (currentContent as any)[k] === 'string').map(key => (
                <div key={key}>
                  <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">{key}</label>
                  <textarea 
                    value={(currentContent as any)[key]} 
                    onChange={(e) => handleContentChange(key as keyof Content, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm h-24 focus:ring-1 ring-blue-500 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: HERO (Slideshow Images) */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase">Hero Slideshow</h2>
              <button 
                onClick={() => setHeroImages([...heroImages, ''])}
                className="bg-blue-600 text-xs px-4 py-2 rounded-xl font-bold"
              >+ Add Image</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {heroImages.map((img, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/10 relative group">
                  <div className="aspect-video mb-4 rounded-xl overflow-hidden bg-black border border-white/5">
                    {img ? <img src={img} className="w-full h-full object-cover" alt="Hero" /> : <div className="w-full h-full flex items-center justify-center text-gray-700">No Image</div>}
                  </div>
                  <input 
                    type="text" value={img} onChange={(e) => {
                      const newImgs = [...heroImages]; newImgs[idx] = e.target.value; setHeroImages(newImgs);
                    }}
                    placeholder="Image URL" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs mb-2"
                  />
                  <input 
                    type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], `hero-${idx}`, (url) => {
                      const newImgs = [...heroImages]; newImgs[idx] = url; setHeroImages(newImgs);
                    })}
                    className="w-full text-[10px] text-gray-500"
                  />
                  <button onClick={() => setHeroImages(heroImages.filter((_, i) => i !== idx))} className="absolute top-2 right-2 p-2 bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={3} /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase">Projects</h2>
              <button 
                onClick={() => setProjects([...projects, { id: Date.now().toString(), title: 'New Project', tags: ['React'], image: '' }])}
                className="bg-blue-600 text-xs px-4 py-2 rounded-xl font-bold"
              >+ Add Project</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj, idx) => (
                <div key={proj.id} className="bg-white/5 p-6 rounded-[2rem] border border-white/10 relative group">
                  <div className="aspect-video mb-4 rounded-2xl overflow-hidden bg-black">
                    {proj.image && <img src={proj.image} className="w-full h-full object-cover" />}
                  </div>
                  <div className="space-y-3">
                    <input 
                      type="text" value={proj.title} onChange={(e) => {
                        const newP = [...projects]; newP[idx].title = e.target.value; setProjects(newP);
                      }}
                      placeholder="Title" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm"
                    />
                    <input 
                      type="text" value={proj.tags.join(', ')} onChange={(e) => {
                        const newP = [...projects]; newP[idx].tags = e.target.value.split(',').map(s => s.trim()); setProjects(newP);
                      }}
                      placeholder="Tags (comma separated)" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs"
                    />
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" value={proj.image} onChange={(e) => {
                          const newP = [...projects]; newP[idx].image = e.target.value; setProjects(newP);
                        }}
                        placeholder="Image URL" className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px]"
                      />
                      <label className="bg-white/10 p-2 rounded-xl cursor-pointer hover:bg-white/20 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth={2}/></svg>
                        <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], `proj-${idx}`, (url) => {
                          const newP = [...projects]; newP[idx].image = url; setProjects(newP);
                        })} />
                      </label>
                    </div>
                  </div>
                  <button onClick={() => setProjects(projects.filter((_, i) => i !== idx))} className="absolute top-4 right-4 p-2 bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: LIFE STORIES */}
        {activeTab === 'stories' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase">Life Journey Stories</h2>
              <button 
                onClick={() => setStories([...stories, { id: Date.now().toString(), title: 'New Story', desc: '', image: '', icon: '🌟', details: '' }])}
                className="bg-blue-600 text-xs px-4 py-2 rounded-xl font-bold"
              >+ Add Story</button>
            </div>
            <div className="space-y-4">
              {stories.map((story, idx) => (
                <div key={story.id} className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-6 relative group">
                  <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-black shrink-0 relative">
                    {story.image && <img src={story.image} className="w-full h-full object-cover" />}
                    <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                      <span className="text-[10px] font-bold">UPLOAD</span>
                      <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], `story-${idx}`, (url) => {
                        const newS = [...stories]; newS[idx].image = url; setStories(newS);
                      })} />
                    </label>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                       <input type="text" value={story.icon} onChange={(e) => { const n = [...stories]; n[idx].icon = e.target.value; setStories(n); }} className="w-12 bg-black/40 border border-white/10 rounded-xl p-2 text-center" />
                       <input type="text" value={story.title} onChange={(e) => { const n = [...stories]; n[idx].title = e.target.value; setStories(n); }} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 font-bold" />
                    </div>
                    <textarea value={story.desc} onChange={(e) => { const n = [...stories]; n[idx].desc = e.target.value; setStories(n); }} placeholder="Brief Description" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs h-20" />
                    <textarea value={story.details} onChange={(e) => { const n = [...stories]; n[idx].details = e.target.value; setStories(n); }} placeholder="Full Details" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs h-32" />
                  </div>
                  <button onClick={() => setStories(stories.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 font-bold">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: HIGHLIGHTS (Navbar Stories) */}
        {activeTab === 'highlights' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase">Navbar Highlights</h2>
              <button 
                onClick={() => setHighlights([...highlights, { id: Date.now().toString(), type: 'image', url: '', thumbnail: '', caption: '', timestamp: 'Just now', createdAt: Date.now() }])}
                className="bg-blue-600 text-xs px-4 py-2 rounded-xl font-bold"
              >+ Add Highlight</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {highlights.map((h, idx) => (
                <div key={h.id} className="bg-white/5 p-4 rounded-3xl border border-white/10 relative group">
                  <div className="aspect-[9/16] mb-4 bg-black rounded-2xl overflow-hidden relative">
                    {h.type === 'image' ? <img src={h.url} className="w-full h-full object-cover" /> : <video src={h.url} className="w-full h-full object-cover" muted />}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <select value={h.type} onChange={(e) => { const n = [...highlights]; n[idx].type = e.target.value as any; setHighlights(n); }} className="bg-black/80 text-[10px] p-1 rounded">
                        <option value="image">IMG</option>
                        <option value="video">VID</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input type="text" value={h.caption} onChange={(e) => { const n = [...highlights]; n[idx].caption = e.target.value; setHighlights(n); }} placeholder="Caption" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px]" />
                    <div className="flex items-center gap-1">
                       <input type="text" value={h.url} placeholder="Media URL" className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-[8px]" />
                       <label className="p-1.5 bg-blue-600 rounded-lg cursor-pointer">
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth={3}/></svg>
                         <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], `high-${idx}`, (url) => {
                           const n = [...highlights]; n[idx].url = url; n[idx].thumbnail = url; setHighlights(n);
                         })} />
                       </label>
                    </div>
                  </div>
                  <button onClick={() => setHighlights(highlights.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SOCIAL LINKS */}
        {activeTab === 'social' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase">Social Profiles</h2>
              <button 
                onClick={() => setSocialLinks([...socialLinks, { platform: 'Custom', url: '', icon: '', color: '#ffffff' }])}
                className="bg-blue-600 text-xs px-4 py-2 rounded-xl font-bold"
              >+ Add Profile</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialLinks.map((link, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex gap-4 items-center relative group">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10" style={{ color: link.color }}>
                     <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d={link.icon || 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'} /></svg>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                       <input type="text" value={link.platform} onChange={(e) => { const n = [...socialLinks]; n[idx].platform = e.target.value; setSocialLinks(n); }} placeholder="Platform" className="w-24 bg-black/40 border border-white/10 rounded-lg p-2 text-xs font-bold" />
                       <input type="text" value={link.url} onChange={(e) => { const n = [...socialLinks]; n[idx].url = e.target.value; setSocialLinks(n); }} placeholder="URL" className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-xs" />
                    </div>
                    <div className="flex gap-2">
                       <input type="color" value={link.color} onChange={(e) => { const n = [...socialLinks]; n[idx].color = e.target.value; setSocialLinks(n); }} className="w-10 h-8 rounded bg-transparent border-none cursor-pointer" />
                       <input type="text" value={link.icon} onChange={(e) => { const n = [...socialLinks]; n[idx].icon = e.target.value; setSocialLinks(n); }} placeholder="SVG Path Data" className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-[8px]" />
                    </div>
                  </div>
                  <button onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== idx))} className="text-red-500 opacity-0 group-hover:opacity-100">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SYNC/CLOUD */}
        {activeTab === 'sync' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem]">
               <h2 className="text-2xl font-black uppercase mb-2">Cloud Storage (Google Drive)</h2>
               <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                 Configure your Google Client ID to enable media uploads. This allows you to host photos and videos directly in your Drive.
               </p>
               <div className="space-y-4 max-w-xl">
                 <div>
                   <label className="text-[10px] font-bold text-gray-500 uppercase">Google Client ID</label>
                   <input 
                      type="text" 
                      value={googleClientId}
                      onChange={(e) => setGoogleClientId(e.target.value)}
                      placeholder="Enter Client ID..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs"
                   />
                 </div>
                 <button 
                   onClick={initGoogleAuth}
                   className={`px-8 py-3 rounded-xl font-bold transition-all ${accessToken ? 'bg-green-600' : 'bg-blue-600 hover:scale-105'}`}
                 >
                   {accessToken ? 'Connected to Drive' : 'Authorize Drive Access'}
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* TAB: BROADCAST (Already present but refined) */}
        {activeTab === 'broadcast' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="bg-slate-900 border border-white/10 p-8 rounded-[2rem]">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-black uppercase flex items-center gap-3">
                   {currentContent.isBroadcasting && <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>}
                   Live Stream Setup
                 </h2>
                 <div className="flex gap-2 bg-black/40 p-1 rounded-full border border-white/10">
                    <button onClick={() => handleContentChange('broadcastSource', 'browser')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase ${currentContent.broadcastSource !== 'external' ? 'bg-blue-600' : ''}`}>Cam</button>
                    <button onClick={() => handleContentChange('broadcastSource', 'external')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase ${currentContent.broadcastSource === 'external' ? 'bg-red-600' : ''}`}>External</button>
                 </div>
               </div>
               
               {currentContent.broadcastSource !== 'external' ? (
                 <div className="text-center space-y-4">
                    <video ref={videoPreviewRef} autoPlay muted playsInline className="aspect-video w-full max-w-xl mx-auto rounded-3xl bg-black border border-white/10" />
                    <button onClick={currentContent.isBroadcasting ? stopBroadcast : startBrowserBroadcast} className={`px-10 py-4 rounded-2xl font-black ${currentContent.isBroadcasting ? 'bg-white text-black' : 'bg-blue-600'}`}>
                       {currentContent.isBroadcasting ? 'STOP STREAM' : 'START CAMERA FEED'}
                    </button>
                 </div>
               ) : (
                 <div className="space-y-4 max-w-xl">
                    <input type="text" value={currentContent.streamTitle || ''} onChange={(e) => handleContentChange('streamTitle', e.target.value)} placeholder="Stream Title" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs" />
                    <input type="text" value={currentContent.streamUrl || ''} onChange={(e) => handleContentChange('streamUrl', e.target.value)} placeholder="HLS / YouTube URL" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs" />
                    <button onClick={() => handleContentChange('isBroadcasting', !currentContent.isBroadcasting)} className={`w-full py-4 rounded-2xl font-black ${currentContent.isBroadcasting ? 'bg-red-600' : 'bg-white/10 text-gray-400'}`}>
                       {currentContent.isBroadcasting ? 'LIVE NOW - CLICK TO STOP' : 'GO LIVE (EXTERNAL SOURCE)'}
                    </button>
                 </div>
               )}
            </div>
          </div>
        )}

      </main>

      {isUploading && (
        <div className="fixed bottom-10 right-10 bg-blue-600 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
           <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
           <span className="text-xs font-black uppercase tracking-widest">Uploading to Cloud...</span>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
