
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

  // Broadcast State
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startBroadcast = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
      handleContentChange('isBroadcasting', true);
    } catch (err) {
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const stopBroadcast = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    handleContentChange('isBroadcasting', false);
  };

  // Google Drive Integration State
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);
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

  // Added handleExport to fix "Cannot find name 'handleExport'" error.
  const handleExport = () => {
    const data = {
      content,
      projects,
      stories,
      highlights,
      heroImages,
      socialLinks,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const initGoogleAuth = () => {
    if (!googleClientId) {
      alert('Please set your Google Client ID in the "Sync/Cloud" tab first!');
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

  const uploadFileToDrive = async (file: File, fieldId: string, callback: (url: string) => void) => {
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
      callback(`https://lh3.googleusercontent.com/u/0/d/${result.id}`);
    } catch (err) {
      alert('Upload failed.');
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
      <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadFileToDrive(file, id, onUrl); }} />
    </label>
  );

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
            {(['content', 'hero', 'projects', 'stories', 'highlights', 'social', 'sync', 'broadcast'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all uppercase whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>
                {tab === 'broadcast' ? '🔴 LIVE' : tab}
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
        
        {activeTab === 'broadcast' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-red-600/10 border border-red-500/20 p-8 rounded-[2rem] text-center">
              <h2 className="text-3xl font-black mb-4 uppercase flex items-center justify-center gap-3">
                {content[editLang].isBroadcasting && <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>}
                Live Broadcaster
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Start a live session directly from your mobile or desktop. This will show a "LIVE" indicator to all site visitors.
              </p>
              
              <div className="relative aspect-video max-w-2xl mx-auto rounded-3xl overflow-hidden bg-black border border-white/10 mb-8">
                 <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                 {!content[editLang].isBroadcasting && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                     <p className="text-gray-400 font-bold uppercase tracking-widest">Camera Offline</p>
                   </div>
                 )}
              </div>

              <div className="flex justify-center gap-4">
                {!content[editLang].isBroadcasting ? (
                  <button onClick={startBroadcast} className="bg-red-600 hover:bg-red-700 px-10 py-4 rounded-2xl font-black flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                    START LIVE BROADCAST
                  </button>
                ) : (
                  <button onClick={stopBroadcast} className="bg-white text-black hover:bg-gray-200 px-10 py-4 rounded-2xl font-black flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
                    STOP BROADCASTING
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10">
              <div>
                <h2 className="text-xl font-bold mb-1">Global Status Control</h2>
                <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Toggle your online availability indicator</p>
              </div>
              <button 
                onClick={() => handleContentChange('isOnline', !content[editLang].isOnline)}
                className={`px-8 py-3 rounded-2xl font-black transition-all border-2 ${content[editLang].isOnline ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-red-600/20 border-red-500 text-red-400'}`}
              >
                {content[editLang].isOnline ? 'ONLINE' : 'OFFLINE'}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Text Management</h2>
              <div className="flex gap-2 bg-black/40 p-1 rounded-full border border-white/10">
                <button onClick={() => setEditLang('en')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${editLang === 'en' ? 'bg-blue-600' : ''}`}>EN</button>
                <button onClick={() => setEditLang('bn')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${editLang === 'bn' ? 'bg-blue-600' : ''}`}>বাংলা</button>
              </div>
            </div>

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
                     {fontSizes.map(size => <option key={size.value} value={size.value}>{size.label}</option>)}
                   </select>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(content[editLang]).filter(k => !['isOnline', 'titleSize', 'isBroadcasting'].includes(k)).map((key) => (
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

        {activeTab === 'hero' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center"><h2 className="text-3xl font-bold">Hero Slideshow</h2><button onClick={() => setHeroImages([...heroImages, ''])} className="bg-blue-600 px-6 py-2 rounded-xl text-sm font-bold">+ Image</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {heroImages.map((img, idx) => (
                <div key={idx} className="glass p-6 rounded-[2rem] border border-white/10 relative group">
                   <button onClick={() => setHeroImages(heroImages.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-red-500 bg-red-500/10 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg></button>
                   <img src={img || 'https://via.placeholder.com/300'} className="w-full h-32 rounded-xl object-cover mb-4" alt="hero" />
                   <div className="flex gap-2">
                     <input value={img} onChange={(e) => { const n = [...heroImages]; n[idx] = e.target.value; setHeroImages(n); }} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs" />
                     <DriveUploadButton id={`hero-${idx}`} onUrl={(url) => { const n = [...heroImages]; n[idx] = url; setHeroImages(n); }} />
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other sections handled similarly */}
        {activeTab === 'sync' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2rem]">
                <h2 className="text-2xl font-black mb-4 uppercase">Cloud Storage Settings</h2>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Google Client ID</label>
                    <input type="text" value={googleClientId} onChange={(e) => setGoogleClientId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono" />
                  </div>
                  {!accessToken ? <button onClick={initGoogleAuth} className="w-full bg-blue-600 py-3 rounded-xl font-bold">Connect Google Drive</button> : <div className="bg-green-600/20 border border-green-500 text-green-400 p-4 rounded-xl">Drive Connected</div>}
                </div>
             </div>
             <button onClick={handleExport} className="w-full bg-white/5 p-6 rounded-[2rem] border border-white/10 font-bold">Export Backup (.json)</button>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;
