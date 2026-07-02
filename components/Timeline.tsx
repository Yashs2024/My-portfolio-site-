import React from 'react';
import { motion } from 'framer-motion';
import { TIMELINE } from '../constants';

const typeColors: Record<string, string> = {
  project:     'border-cyan-400   bg-cyan-400/10   text-cyan-400',
  education:   'border-blue-400   bg-blue-400/10   text-blue-400',
  work:        'border-emerald-400 bg-emerald-400/10 text-emerald-400',
  achievement: 'border-amber-400  bg-amber-400/10  text-amber-400',
};

const typeLabels: Record<string, string> = {
  project:     'Project',
  education:   'Education',
  work:        'Work',
  achievement: 'Achievement',
};

const Timeline: React.FC = () => {
  return (
    <section id="timeline" className="py-20 bg-space-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold font-tech text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4"
          >
            Engineering <span className="text-cyan-400">Journey</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-400 max-w-xl mx-auto"
          >
            From a first Arduino blink to multi-engine robotics simulation platforms — the path that shaped me as an engineer.
          </motion.p>
        </div>

        <div className="relative">
          {/* Central vertical line */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-slate-800" />

          <div className="space-y-12">
            {TIMELINE.map((item, index) => {
              const isLeft = index % 2 === 0;
              const colorClass = typeColors[item.type];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  viewport={{ once: true, margin: '-80px' }}
                  className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8`}
                >
                  {/* Card */}
                  <div className="md:w-[calc(50%-2rem)] w-full">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`bg-slate-900/60 backdrop-blur-md border rounded-xl p-5 shadow-lg ${colorClass.split(' ')[0]} hover:shadow-cyan-500/10 transition-all`}
                    >
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-2xl">{item.icon}</span>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colorClass}`}>
                          {typeLabels[item.type]}
                        </span>
                        <span className="ml-auto font-mono text-xs text-gray-500">{item.year}</span>
                      </div>
                      <h3 className="text-white font-bold text-base mb-2 leading-tight">{item.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                    </motion.div>
                  </div>

                  {/* Centre node */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-900 border-2 border-cyan-500/50 items-center justify-center shadow-[0_0_12px_rgba(0,242,255,0.3)] z-10">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="md:w-[calc(50%-2rem)] hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
