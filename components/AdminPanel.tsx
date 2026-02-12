
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

  const startBrowserBroadcast = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
      handleContentChange('broadcastSource', 'browser');
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

  const handleExport = () => {
    const data = { content, projects, stories, highlights, heroImages, socialLinks, exportedAt: new Date().toISOString() };
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

  // Google Drive Integration State
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [googleClientId, setGoogleClientId] = useState(localStorage.getItem('google_client_id') || '');

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

  const currentContent = content[editLang];

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950 flex flex-col text-white animate-in slide-in-from-bottom duration-500 overflow-hidden font-sans">
      <header className="border-b border-white/10 p-6 flex justify-between items-center glass shrink-0">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-2xl font-black text-blue-500 uppercase tracking-tighter">Portfolio Admin</h1>
          <nav className="flex gap-2 bg-white/5 p-1 rounded-full overflow-x-auto no-scrollbar max-w-[50vw]">
            {(['content', 'hero', 'projects', 'stories', 'highlights', 'social', 'sync', 'broadcast'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all uppercase whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}>
                {tab === 'broadcast' ? '🔴 Live/Stream' : tab}
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
            <div className="bg-slate-900 border border-white/10 p-8 rounded-[2rem]">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-black uppercase flex items-center gap-3">
                   {currentContent.isBroadcasting && <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>}
                   Live Stream Setup
                 </h2>
                 <div className="flex gap-2 bg-black/40 p-1 rounded-full border border-white/10">
                    <button 
                      onClick={() => handleContentChange('broadcastSource', 'browser')} 
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${currentContent.broadcastSource !== 'external' ? 'bg-blue-600' : 'text-gray-500'}`}
                    >Browser Cam</button>
                    <button 
                      onClick={() => handleContentChange('broadcastSource', 'external')} 
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${currentContent.broadcastSource === 'external' ? 'bg-red-600' : 'text-gray-500'}`}
                    >Social / External</button>
                 </div>
               </div>

               {currentContent.broadcastSource !== 'external' ? (
                 <div className="text-center">
                    <p className="text-gray-400 mb-6 text-sm">Quick broadcast using your device's built-in camera.</p>
                    <div className="relative aspect-video max-w-xl mx-auto rounded-3xl overflow-hidden bg-black border border-white/10 mb-8 group">
                       <video 
                         ref={videoPreviewRef} 
                         autoPlay 
                         muted 
                         playsInline 
                         controls // Full controls for Admin to test audio/video
                         className="w-full h-full object-cover" 
                       />
                       {!currentContent.isBroadcasting && (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
                           <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Preview Offline</p>
                         </div>
                       )}
                    </div>
                    <button onClick={currentContent.isBroadcasting ? stopBroadcast : startBrowserBroadcast} className={`px-8 py-3 rounded-2xl font-black flex items-center gap-2 mx-auto ${currentContent.isBroadcasting ? 'bg-white text-black' : 'bg-blue-600'}`}>
                       {currentContent.isBroadcasting ? 'STOP FEED' : 'START CAM'}
                    </button>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest">External Links (YT/FB/HLS)</h3>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            আপনি এখানে সরাসরি <strong>YouTube</strong>, <strong>Facebook</strong> ভিডিও লিংক অথবা <strong>OBS (HLS .m3u8)</strong> লিংক পেস্ট করতে পারেন। পোর্টফোলিও এটি অটোমেটিক প্লে করবে।
                          </p>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-500 uppercase">Stream or Video URL</label>
                             <input 
                                type="text" 
                                value={currentContent.streamUrl || ''} 
                                onChange={(e) => handleContentChange('streamUrl', e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono"
                                placeholder="Paste YouTube, Facebook or HLS link..."
                             />
                          </div>
                          <div className="p-4 rounded-2xl bg-blue-600/5 border border-blue-500/10">
                             <h4 className="text-[10px] font-bold uppercase mb-2 text-blue-400">Broadcaster Note:</h4>
                             <p className="text-[10px] text-gray-500 leading-relaxed">
                               Visitors will see the stream with <strong>only a Mute/Unmute button</strong>. Play, Pause, and Seeking controls are disabled for them to ensure they follow the live broadcast as intended.
                             </p>
                          </div>
                       </div>
                       
                       <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-3xl border border-white/5 text-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${currentContent.isBroadcasting ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]' : 'bg-gray-800'}`}>
                             <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                          </div>
                          <h3 className="text-lg font-black uppercase mb-1">Live Status</h3>
                          <button 
                            onClick={() => handleContentChange('isBroadcasting', !currentContent.isBroadcasting)}
                            className={`px-10 py-3 mt-4 rounded-2xl font-black transition-all ${currentContent.isBroadcasting ? 'bg-red-600 shadow-xl' : 'bg-white/10 text-gray-400'}`}
                          >
                            {currentContent.isBroadcasting ? 'STOP BROADCAST' : 'GO LIVE NOW'}
                          </button>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10">
              <div>
                <h2 className="text-xl font-bold mb-1">Availability Status</h2>
                <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Show if you are currently working</p>
              </div>
              <button 
                onClick={() => handleContentChange('isOnline', !currentContent.isOnline)}
                className={`px-8 py-3 rounded-2xl font-black transition-all border-2 ${currentContent.isOnline ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-red-600/20 border-red-500 text-red-400'}`}
              >
                {currentContent.isOnline ? 'ONLINE' : 'OFFLINE'}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Translations</h2>
              <div className="flex gap-2 bg-black/40 p-1 rounded-full border border-white/10">
                <button onClick={() => setEditLang('en')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${editLang === 'en' ? 'bg-blue-600' : ''}`}>EN</button>
                <button onClick={() => setEditLang('bn')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${editLang === 'bn' ? 'bg-blue-600' : ''}`}>বাংলা</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(currentContent).filter(k => !['isOnline', 'titleSize', 'isBroadcasting', 'broadcastSource', 'streamUrl'].includes(k)).map((key) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 font-bold">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <textarea 
                    value={(currentContent as any)[key]}
                    onChange={(e) => handleContentChange(key as keyof Content, e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm h-20"
                  />
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
