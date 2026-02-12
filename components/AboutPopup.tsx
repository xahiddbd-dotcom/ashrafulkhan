
import React, { useRef, useEffect } from 'react';
import { Language } from '../types';

interface AboutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const AboutPopup: React.FC<AboutPopupProps> = ({ isOpen, onClose, lang }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const content = {
    en: {
      title: "About Me!",
      intro: "Know about me.",
      q1: "Who am I?",
      a1: "I am a passionate software developer based in Farmgate, Dhaka. I love turning complex problems into simple, beautiful, and intuitive designs.",
      q2: "What is my identity?",
      a2: "Beyond being a coder, I am a lifelong learner, an enthusiast of modern tech, and someone who believes in the power of clean code and meaningful user experiences.",
      hobbies: "When I'm not coding, you'll find me exploring the busy streets of Dhaka or experimenting with the latest AI tools."
    },
    bn: {
      title: "আমার সম্পর্কে",
      intro: "আমার সম্পর্কে জানুন।",
      q1: "আমি কে?",
      a1: "আমি একজন নিবেদিতপ্রাণ সফটওয়্যার ডেভেলপার, যার বর্তমান ঠিকানা ফার্মগেট, ঢাকা। আমি জটিল সমস্যাগুলোকে সহজ, সুন্দর এবং কার্যকর সমাধানে রূপান্তর করতে ভালোবাসি।",
      q2: "আমার পরিচয় কি?",
      a2: "কোড লেখার বাইরেও আমি একজন আজীবন শিক্ষার্থী এবং আধুনিক প্রযুক্তির একজন ভক্ত। আমি ক্লিন কোড এবং অর্থপূর্ণ ব্যবহারকারী অভিজ্ঞতার শক্তিতে বিশ্বাস করি।",
      hobbies: "যখন আমি কোডিং করি না, তখন আমাকে ঢাকার ব্যস্ত রাস্তায় ঘুরে বেড়াতে অথবা লেটেস্ট এআই টুলস নিয়ে এক্সপেরিমেন্ট করতে দেখা যায়।"
    }
  };

  const t = content[lang];

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div 
        ref={popupRef}
        className={`bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden transform transition-all duration-500 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex justify-between items-center">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t.title}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="p-8 md:p-10 space-y-6 text-gray-300 leading-relaxed">
          <div>
            <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-1">{t.intro}</p>
            <h3 className="text-xl font-bold text-white mb-2">{t.q1}</h3>
            <p className="text-sm md:text-base">{t.a1}</p>
          </div>
          
          <div className="pt-4 border-t border-white/5">
            <h3 className="text-xl font-bold text-white mb-2">{t.q2}</h3>
            <p className="text-sm md:text-base">{t.a2}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl italic text-sm text-gray-400">
            {t.hobbies}
          </div>
          
          <div className="pt-4 flex justify-center">
             <button 
               onClick={onClose}
               className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all active:scale-95 shadow-lg"
             >
               {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPopup;
