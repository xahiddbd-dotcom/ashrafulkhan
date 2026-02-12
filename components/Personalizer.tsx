
import React, { useState } from 'react';
import { Content, Language } from '../types';
import { generateBio } from '../services/geminiService';

interface PersonalizerProps {
  content: Content;
  lang: Language;
  onUpdate: (bio: { title: string; desc: string }) => void;
}

const Personalizer: React.FC<PersonalizerProps> = ({ content, lang, onUpdate }) => {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePersonalize = async () => {
    if (!role.trim()) return;
    setLoading(true);
    try {
      const result = await generateBio(role, lang);
      onUpdate(result);
    } catch (e) {
      alert("Failed to personalize bio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <h2 className="text-3xl font-bold mb-3 text-gradient inline-flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {content.personalizeTitle}
          </h2>
          <p className="text-gray-400 mb-8 max-w-md">{content.personalizeDesc}</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder={content.placeholder}
              className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            <button 
              onClick={handlePersonalize}
              disabled={loading}
              className="bg-white text-black hover:bg-blue-100 disabled:opacity-50 px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? content.loading : content.generateBtn}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Personalizer;
