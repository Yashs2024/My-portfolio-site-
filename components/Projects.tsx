import React, { useState } from 'react';
import { Github, ExternalLink, Code, ChevronRight, Play, X } from 'lucide-react';
import { PROJECTS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';

/* ─── Video Modal ─────────────────────────────────────────── */
const VideoModal: React.FC<{ url: string; title: string; onClose: () => void }> = ({ url, title, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal box */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-slate-900 rounded-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(0,242,255,0.15)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400">
            <Play className="w-4 h-4 fill-cyan-400" />
            <span className="font-tech text-sm font-semibold tracking-wide">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Embed */}
        <div className="relative aspect-video bg-black">
          <iframe
            src={url}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

/* ─── Project Card ─────────────────────────────────────────── */
const ProjectCard: React.FC<{ project: Project; onWatchDemo: (url: string, title: string) => void }> = ({ project, onWatchDemo }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] flex flex-col h-full focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-slate-900"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
        <div className="absolute bottom-4 left-4">
          <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-900 bg-cyan-400 rounded-sm">
            {project.category}
          </span>
        </div>

        {/* Watch Demo overlay button */}
        {project.demoVideoUrl && (
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => onWatchDemo(project.demoVideoUrl!, project.title)}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm border border-cyan-400/50 text-cyan-400 px-4 py-2 rounded-full font-mono text-sm font-semibold shadow-[0_0_20px_rgba(0,242,255,0.3)]">
              <Play className="w-4 h-4 fill-cyan-400" />
              Watch Demo
            </div>
          </motion.button>
        )}
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="flex items-center text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-700">
              <Code className="w-3 h-3 mr-1 text-cyan-500" />
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto flex-wrap gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center text-sm text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:text-cyan-400"
            >
              <Github className="w-4 h-4 mr-2" />
              Code
            </a>
          )}

          <div className="flex items-center gap-3">
            {project.demoVideoUrl && (
              <button
                onClick={() => onWatchDemo(project.demoVideoUrl!, project.title)}
                className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                <Play className="w-4 h-4 mr-1 fill-cyan-400" />
                Demo
              </button>
            )}
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Live
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            ) : (
              !project.demoVideoUrl && (
                <span className="flex items-center text-sm text-gray-600 cursor-not-allowed">
                  Internal
                  <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Projects Section ─────────────────────────────────────── */
const Projects: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Robotics' | 'AI/ML' | 'Automation'>('All');
  const [modalVideo, setModalVideo] = useState<{ url: string; title: string } | null>(null);

  const filteredProjects = filter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filter || p.category === 'Other');

  const filters = ['All', 'Robotics', 'AI/ML', 'Automation'];

  return (
    <section id="projects" className="py-20 bg-slate-850/50">
      {/* Video Modal */}
      {modalVideo && (
        <VideoModal
          url={modalVideo.url}
          title={modalVideo.title}
          onClose={() => setModalVideo(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-tech text-white mb-4"
          >
            Featured <span className="text-cyan-400">Projects</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center gap-4 flex-wrap mt-8"
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  filter === f
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    : 'bg-slate-900 border-slate-700 text-gray-400 hover:border-cyan-500/50 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onWatchDemo={(url, title) => setModalVideo({ url, title })}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;