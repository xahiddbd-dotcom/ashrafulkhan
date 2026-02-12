
export type Language = 'en' | 'bn';

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  color: string;
}

export interface Content {
  brandName: string;
  title: string;
  desc: string;
  work: string;
  contact: string;
  stat1: string;
  stat2: string;
  stat3: string;
  projectsTitle: string;
  personalizeTitle: string;
  personalizeDesc: string;
  placeholder: string;
  generateBtn: string;
  loading: string;
  lifeStoryTitle: string;
  socialTitle: string;
  isOnline?: boolean; // New field for status indicator
}

export interface Project {
  id: string;
  title: string;
  tags: string[];
  image: string;
}

export interface Story {
  id: string;
  title: string;
  desc: string;
  image: string;
  icon: string;
  details: string;
}

export interface SocialHighlight {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  caption: string;
  timestamp: string;
}
