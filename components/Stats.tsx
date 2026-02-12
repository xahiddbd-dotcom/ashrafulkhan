
import React from 'react';
import { Content } from '../types';

interface StatsProps {
  content: Content;
}

const Stats: React.FC<StatsProps> = ({ content }) => {
  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-12">
      <div className="glass p-10 rounded-3xl text-center group hover:border-blue-500/50 transition-colors">
        <h3 className="text-5xl font-black text-blue-500 mb-2 group-hover:scale-110 transition-transform">5+</h3>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">{content.stat1}</p>
      </div>
      <div className="glass p-10 rounded-3xl text-center border-t-2 border-blue-500/30 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <h3 className="text-5xl font-black text-blue-500 mb-2 group-hover:scale-110 transition-transform">50+</h3>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">{content.stat2}</p>
      </div>
      <div className="glass p-10 rounded-3xl text-center group hover:border-blue-500/50 transition-colors">
        <h3 className="text-5xl font-black text-blue-500 mb-2 group-hover:scale-110 transition-transform">100%</h3>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">{content.stat3}</p>
      </div>
    </section>
  );
};

export default Stats;
