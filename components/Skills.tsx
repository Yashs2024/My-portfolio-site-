import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { SKILL_CATEGORIES, SKILL_CHART_DATA } from '../constants';
import { motion } from 'framer-motion';

const getScoreDescription = (score: number) => {
    if (score >= 95) return "Expert level. Extensive production experience and deep theoretical understanding.";
    if (score >= 90) return "Advanced proficiency. Capable of architecting complex systems efficiently.";
    if (score >= 80) return "High proficiency. Strong working knowledge with ability to solve complex problems.";
    if (score >= 70) return "Intermediate. Solid foundation with practical project experience.";
    return "Developing. Actively learning and applying concepts.";
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    return (
      <div className="bg-space-800/95 backdrop-blur-md border border-neon-400/30 p-4 rounded-xl shadow-[0_0_15px_rgba(0,242,255,0.15)] outline-none">
        <p className="text-neon-400 font-bold text-lg mb-1 font-tech">{label}</p>
        <div className="flex items-end gap-2 mb-2 border-b border-space-800 pb-2">
            <span className="text-3xl font-bold text-white leading-none">{score}</span>
            <span className="text-sm text-gray-400 mb-1">/ 100</span>
        </div>
        <p className="text-sm text-gray-300 max-w-[220px] leading-relaxed">
            {getScoreDescription(score)}
        </p>
      </div>
    );
  }
  return null;
};

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 bg-space-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-tech text-white mb-4"
          >
            Technical <span className="text-neon-400">Arsenal</span>
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             viewport={{ once: true }}
             className="text-gray-400 max-w-2xl mx-auto"
          >
            A comprehensive overview of the tools, languages, and frameworks I utilize to build autonomous systems. Hover over the chart for details.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Categories List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 order-2 lg:order-1">
                {SKILL_CATEGORIES.map((category, idx) => {
                    const isWide = idx % 3 === 0;
                    return (
                    <motion.div
                        key={category.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02 }}
                        className={`bg-space-800/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-neon-400/50 transition-all hover:shadow-[0_0_15px_rgba(0,242,255,0.1)] group flex flex-col ${isWide ? 'sm:col-span-2' : ''}`}
                    >
                        <h3 className="text-lg font-semibold text-neon-400 mb-4 border-b border-neon-900/30 pb-2 font-mono tracking-wide">
                            {category.title.toUpperCase()}
                        </h3>
                        <ul className={`grid gap-2 ${isWide ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {category.skills.map((skill) => (
                                <li key={skill} className="flex items-center text-gray-300 text-sm">
                                    <span className="w-1.5 h-1.5 bg-neon-500 rounded-full mr-2 group-hover:bg-neon-400 group-hover:shadow-[0_0_5px_#00f2ff] transition-all"></span>
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )})}
            </div>

            {/* Radar Chart */}
            <motion.div
                 initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                 whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                 transition={{ duration: 0.8, type: "spring" }}
                 viewport={{ once: true }}
                 className="h-[450px] w-full bg-space-800/30 rounded-xl border border-space-800 flex items-center justify-center relative order-1 lg:order-2 overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 z-10">
                   <div className="flex items-center gap-2 text-xs text-gray-400 bg-space-900/80 px-2 py-1 rounded border border-space-800 font-mono">
                     <span className="w-2 h-2 rounded-full bg-neon-400 animate-pulse"></span>
                     LIVE_METRICS
                   </div>
                </div>
                
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SKILL_CHART_DATA}>
                        <PolarGrid gridType="polygon" stroke="#1e293b" strokeWidth={1} />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 500, fontFamily: 'Rajdhani' }} 
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Proficiency"
                            dataKey="A"
                            stroke="#00f2ff"
                            strokeWidth={3}
                            fill="#00f2ff"
                            fillOpacity={0.2}
                            isAnimationActive={true}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1 }} />
                    </RadarChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;