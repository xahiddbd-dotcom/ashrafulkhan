
import React from 'react';
import { Content, Project } from '../types';

interface ProjectsSectionProps {
  content: Content;
  projects: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ content, projects }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black mb-4 tracking-tighter">{content.projectsTitle}</h2>
          <div className="w-20 h-1 bg-blue-600 rounded-full"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="group relative glass rounded-[2rem] overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-500">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-8">
              <div className="flex gap-2 mb-4">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <div className="mt-6 flex items-center text-gray-500 group-hover:text-white transition-colors cursor-pointer">
                <span className="text-sm font-semibold mr-2">Case Study</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
