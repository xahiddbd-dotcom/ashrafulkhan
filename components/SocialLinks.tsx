
import React from 'react';
import { SocialLink, Content } from '../types';

interface SocialLinksProps {
  content: Content;
  links: SocialLink[];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ content, links }) => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h2 className="text-2xl font-bold mb-8 text-gray-400">{content.socialTitle}</h2>
      <div className="flex justify-center flex-wrap gap-6">
        {links.map((link, idx) => (
          <a
            key={`${link.platform}-${idx}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <div 
              className="absolute -inset-2 rounded-full blur opacity-0 group-hover:opacity-40 transition duration-500"
              style={{ backgroundColor: link.color }}
            ></div>
            <div className="relative glass w-16 h-16 flex items-center justify-center rounded-full border border-white/10 hover:border-white/30 transition-all transform group-hover:-translate-y-2">
              <svg 
                className="w-7 h-7 fill-current transition-colors duration-300" 
                style={{ color: link.platform === 'GitHub' ? 'white' : link.color }}
                viewBox="0 0 24 24"
              >
                <path d={link.icon} />
              </svg>
            </div>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-400 whitespace-nowrap">
              {link.platform.toUpperCase()}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default SocialLinks;
