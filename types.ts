
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
  // Personal Story Fields
  lifeStoryTitle: string;
  rootsTitle: string;
  rootsContent: string;
  childhoodTitle: string;
  childhoodContent: string;
  educationTitle: string;
  educationContent: string;
  hobbiesTitle: string;
  hobbiesContent: string;
  friendsTitle: string;
  friendsContent: string;
  areaTitle: string;
  areaContent: string;
  // Social & Footer
  socialTitle: string;
}

export interface Project {
  id: number;
  title: string;
  tags: string[];
  image: string;
}
