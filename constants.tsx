
import { Content, Language, Project, SocialLink } from './types';

export const TRANSLATIONS: Record<Language, Content> = {
  en: {
    brandName: "ASHRAFUL KHAN",
    title: "Hi, I'm a Developer",
    desc: "I build modern, high-performance web applications with a focus on user experience and clean code.",
    work: "View Projects",
    contact: "Contact Me",
    stat1: "Years Experience",
    stat2: "Projects Completed",
    stat3: "Happy Clients",
    projectsTitle: "Selected Projects",
    personalizeTitle: "AI Bio Personalizer",
    personalizeDesc: "Let Gemini rewrite your professional intro based on your specific role.",
    placeholder: "e.g., Fullstack Engineer, UI/UX Enthusiast...",
    generateBtn: "Magic Rewrite",
    loading: "Thinking...",
    lifeStoryTitle: "My Personal Journey",
    rootsTitle: "Farmgate, Dhaka: The Birthplace",
    rootsContent: "This is where my world began. Amidst the vibrant chaos and the endless energy of Farmgate, I found my first inspiration to create. It's more than a location; it's the rhythm of my ambition.",
    childhoodTitle: "Golden Childhood",
    childhoodContent: "Climbing trees and chasing rain - my childhood was an adventure that sparked my imagination.",
    educationTitle: "The Learning Era",
    educationContent: "Academic life was a bridge between my curiosity and my professional calling in technology.",
    hobbiesTitle: "Sports & Passion",
    hobbiesContent: "The football field is where I recharge. It taught me teamwork, strategy, and resilience.",
    friendsTitle: "The Tribe",
    friendsContent: "My friends are my second family. We've grown from dreamers to achievers together.",
    areaTitle: "Local Life",
    areaContent: "My current neighborhood is a blend of bustling markets and quiet libraries.",
    socialTitle: "Connect With Me"
  },
  bn: {
    brandName: "আশরাফুল ইসলাম",
    title: "হ্যালো, আমি একজন ডেভেলপার",
    desc: "আমি আধুনিক এবং উচ্চ-ক্ষমতাসম্পন্ন ওয়েব অ্যাপ্লিকেশন তৈরি করি, যেখানে ব্যবহারকারীর অভিজ্ঞতা এবং ক্লিন কোডকে প্রাধান্য দিই।",
    work: "প্রজেক্ট দেখুন",
    contact: "যোগাযোগ করুন",
    stat1: "বছরের অভিজ্ঞতা",
    stat2: "সম্পন্ন প্রজেক্ট",
    stat3: "সন্তুষ্ট ক্লায়েন্ট",
    projectsTitle: "নির্বাচিত প্রজেক্টসমূহ",
    personalizeTitle: "এআই বায়ো পার্সোনালাইজার",
    personalizeDesc: "জেমিনির মাধ্যমে আপনার ভূমিকার ভিত্তিতে একটি চমৎকার প্রফেশনাল ইন্ট্রো তৈরি করুন।",
    placeholder: "যেমন: ফুলস্ট্যাক ইঞ্জিনিয়ার, ইউআই/ইউএক্স উৎসাহী...",
    generateBtn: "ম্যাজিক রিরাইট",
    loading: "ভাবছি...",
    lifeStoryTitle: "আমার ব্যক্তিগত গল্প",
    rootsTitle: "ফার্মগেট, ঢাকা: আমার শেকড়",
    rootsContent: "এখান থেকেই আমার পৃথিবীর শুরু। ফার্মগেটের সেই প্রাণবন্ত কোলাহল আর অন্তহীন শক্তির মাঝেই আমি খুঁজে পেয়েছিলাম আমার সৃষ্টির প্রথম অনুপ্রেরণা। এটি কেবল একটি স্থান নয়, এটি আমার স্বপ্নের স্পন্দন।",
    childhoodTitle: "সোনালী শৈশব",
    childhoodContent: "গাছে ওঠা আর বৃষ্টির পেছনে ছোটা - আমার শৈশব ছিল এক অ্যাডভেঞ্চার যা আমার কল্পনাশক্তি বাড়িয়ে দিয়েছিল।",
    educationTitle: "শিক্ষা জীবন",
    educationContent: "শিক্ষা জীবন ছিল আমার কৌতূহল এবং প্রযুক্তির প্রতি ভালোবাসার মধ্যকার এক সেতুবন্ধন।",
    hobbiesTitle: "খেলাধুলা ও আবেগ",
    hobbiesContent: "ফুটবল মাঠ আমার শক্তি সঞ্চয়ের জায়গা। এটি আমাকে দলগত কাজ এবং ধৈর্য শিখিয়েছে।",
    friendsTitle: "বন্ধুত্বের বন্ধন",
    friendsContent: "আমার বন্ধুরা আমার দ্বিতীয় পরিবার। আমরা একসাথে স্বপ্ন দেখা থেকে স্বপ্ন ছোঁয়া শিখেছি।",
    areaTitle: "আমার এলাকা",
    areaContent: "আমার বর্তমান এলাকাটি ব্যক্ত বাজার আর শান্ত লাইব্রেরির এক অপূর্ব সংমিশ্রণ।",
    socialTitle: "যোগাযোগ করুন"
  }
};

export const PROJECTS: Project[] = [
  { id: 1, title: "Fintech Dashboard", tags: ["React", "D3.js"], image: "https://images.unsplash.com/photo-1551288049-bbda48642153?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "E-Commerce Suite", tags: ["Next.js", "Stripe"], image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "AI Image Generator", tags: ["Gemini", "Tailwind"], image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'LinkedIn', url: '#', icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z', color: '#0077b5' },
  { platform: 'GitHub', url: '#', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z', color: '#ffffff' },
  { platform: 'Twitter', url: '#', icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z', color: '#1da1f2' }
];

export const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600"
];
