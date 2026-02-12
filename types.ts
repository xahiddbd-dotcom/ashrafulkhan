
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
  titleSize?: string;
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
  isOnline?: boolean;
  isBroadcasting?: boolean;
  broadcastSource?: 'browser' | 'external'; // 'browser' for webcam, 'external' for OBS/RTMP
  streamUrl?: string; // HLS (.m3u8) or direct video URL for external streaming
  streamTitle?: string; // Custom title for the live stream
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
  createdAt: number;
}
