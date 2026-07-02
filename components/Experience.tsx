import React from 'react';
import { Briefcase, GraduationCap, Calendar, Award } from 'lucide-react';
import { EXPERIENCE, EDUCATION, CERTIFICATIONS } from '../constants';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-tech text-white mb-4"
          >
            Journey <span className="text-cyan-400">& Milestones</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Work Experience */}
          <div>
            <div className="flex items-center mb-8">
              <Briefcase className="text-cyan-400 mr-3 h-6 w-6" />
              <h3 className="text-2xl font-bold text-white">Experience & Leadership</h3>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8 relative border-l-2 border-slate-800 ml-3 pl-8 py-2"
            >
              {EXPERIENCE.map((exp) => (
                <motion.div
                    key={exp.id}
                    variants={itemVariants}
                    className="relative group"
                >
                  <span className="absolute -left-[41px] top-0 h-5 w-5 rounded-full border-4 border-slate-900 bg-cyan-500 group-hover:bg-neon-400 group-hover:shadow-[0_0_15px_rgba(0,242,255,0.8)] transition-all duration-300"></span>
                  
                  <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1">
                    <h4 className="text-xl font-semibold text-white">{exp.role}</h4>
                    <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-400 mt-1 mb-4">
                        <span className="text-cyan-200 font-medium">{exp.company}</span>
                        <div className="flex items-center gap-1 mt-1 sm:mt-0">
                            <Calendar className="w-3 h-3" />
                            <span>{exp.period}</span>
                        </div>
                    </div>
                    <ul className="list-disc list-inside text-gray-300 text-sm space-y-2 mb-4 marker:text-cyan-500">
                        {exp.description.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                        {exp.technologies.map(tech => (
                            <span key={tech} className="px-2 py-1 text-xs rounded bg-slate-800 text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-colors">
                                {tech}
                            </span>
                        ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Education & Certifications */}
          <div className="flex flex-col gap-12">
            <div>
              <div className="flex items-center mb-8">
                <GraduationCap className="text-cyan-400 mr-3 h-6 w-6" />
                <h3 className="text-2xl font-bold text-white">Education</h3>
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-8 relative border-l-2 border-slate-800 ml-3 pl-8 py-2"
              >
                {EDUCATION.map((edu) => (
                  <motion.div
                      key={edu.id}
                      variants={itemVariants}
                      className="relative group"
                  >
                    <span className="absolute -left-[41px] top-0 h-5 w-5 rounded-full border-4 border-slate-900 bg-gray-500 group-hover:bg-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,242,255,0.8)] transition-all duration-300"></span>
                    
                    <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1">
                      <h4 className="text-xl font-semibold text-white">{edu.degree}</h4>
                      <div className="text-cyan-200 font-medium text-sm mt-1">{edu.institution}</div>
                      <div className="text-gray-400 text-sm mt-1 italic mb-2">{edu.year}</div>
                      <p className="text-gray-300 text-sm">
                        {edu.details}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Certifications */}
            <div>
              <div className="flex items-center mb-6">
                <Award className="text-cyan-400 mr-3 h-6 w-6" />
                <h3 className="text-2xl font-bold text-white">Certifications</h3>
              </div>
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5 }}
                 viewport={{ once: true }}
                 className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/10"
              >
                  <div className="flex flex-wrap gap-3">
                    {CERTIFICATIONS.map((cert, i) => (
                        <motion.span 
                            key={i} 
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 41, 59, 1)" }}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-slate-800 text-cyan-400 border border-slate-700 cursor-default"
                        >
                            {cert}
                        </motion.span>
                    ))}
                  </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;