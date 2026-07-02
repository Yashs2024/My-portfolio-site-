import React from 'react';
import { Trophy, Code, GraduationCap, Award } from 'lucide-react';
import { ACHIEVEMENTS } from '../constants';
import { motion } from 'framer-motion';

const iconMap = {
  'Trophy': Trophy,
  'Code': Code,
  'GraduationCap': GraduationCap,
  'Award': Award
};

const Achievements: React.FC = () => {
  return (
    <section id="achievements" className="py-20 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
             initial={{ opacity: 0, y: -20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             viewport={{ once: true }}
             className="text-3xl md:text-4xl font-bold font-tech text-white mb-4"
          >
            Achievements <span className="text-cyan-400">& Recognition</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Highlights of my competitive and academic journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map((achievement, index) => {
            const Icon = iconMap[achievement.icon as keyof typeof iconMap] || Award;
            const isLarge = index === 0; // Highlight the first achievement
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all group shadow-lg hover:shadow-cyan-500/10 flex flex-col ${isLarge ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-900/20 transition-colors border border-slate-700 group-hover:border-cyan-500/30">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {achievement.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  {achievement.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Achievements;