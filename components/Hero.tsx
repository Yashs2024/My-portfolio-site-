import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ArrowRight, Download, MapPin, Terminal } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import { motion, useScroll, useTransform } from 'framer-motion';
import DownloadResume from './DownloadResume';

const RobotBackground = lazy(() => import('./RobotBackground'));

const TypingText: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(text.substring(0, index));
      index++;
      if (index > text.length) {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="inline-block">
      {displayText}
      <motion.span 
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="text-neon-400 ml-1"
      >
        |
      </motion.span>
    </span>
  );
};

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 500]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* 3D Robot Background */}
      <Suspense fallback={null}>
        <RobotBackground />
      </Suspense>

      {/* Parallax Background Layer */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
         {/* Subtle Gradient Overlay */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.1),transparent_60%)]" />
      </motion.div>

      {/* Content Layer */}
      <motion.div 
        style={{ opacity }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-900/20 border border-neon-400/30 text-neon-400 text-sm font-medium mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(0,242,255,0.1)] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-500"></span>
            </span>
            SYSTEM.READY | OPEN_TO_INTERNSHIPS
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold font-tech tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-gray-400 mb-6 drop-shadow-2xl h-20 md:h-24"
        >
          <TypingText text={PERSONAL_INFO.name} />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-2 text-xl md:text-3xl font-medium text-neon-400 mb-4"
        >
          <Terminal className="w-6 h-6" />
          <h2>{PERSONAL_INFO.title}</h2>
        </motion.div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-gray-400 mb-8 font-mono"
        >
            <MapPin className="w-4 h-4" />
            <span>{PERSONAL_INFO.location}</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl text-base md:text-lg text-gray-300 mb-10 leading-relaxed"
        >
          {PERSONAL_INFO.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <a
            href="#projects"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-sm text-space-950 bg-neon-400 hover:bg-neon-500 md:text-lg transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] skew-x-[-10deg] min-w-[240px]"
          >
            <span className="skew-x-[10deg] flex items-center">
              View Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          </a>
          
          <DownloadResume />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;