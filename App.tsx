import React, { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechBackground from './components/TechBackground';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';
import NewsTicker from './components/NewsTicker';
import { PERSONAL_INFO } from './constants';
import { motion } from 'framer-motion';

const InverseKinematics = lazy(() => import('./components/InverseKinematics'));
const AssemblyLine = lazy(() => import('./components/AssemblyLine'));

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-space-950 text-gray-100 selection:bg-neon-400/30 cursor-none pb-12">
      <CustomCursor />
      <TechBackground />
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Achievements />
        <Projects />
        
        {/* Robotics Lab / Playground Section */}
        <section className="py-24 md:py-32 bg-slate-900/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold font-tech text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4"
              >
                Robotics <span className="text-cyan-400">Lab</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-gray-400 max-w-2xl mx-auto text-lg"
              >
                Interactive demonstrations of robotics algorithms and control systems. 
                Use these tools to visualize robot kinematics and assembly workflows in real-time.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Suspense fallback={<div className="h-64 flex items-center justify-center text-cyan-400 font-mono animate-pulse">Loading Simulation...</div>}>
                <InverseKinematics />
              </Suspense>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Suspense fallback={<div className="h-64 flex items-center justify-center text-emerald-400 font-mono animate-pulse">Loading Assembly Line...</div>}>
                <AssemblyLine />
              </Suspense>
            </motion.div>
          </div>
        </section>

        <Contact />
      </main>

      <footer className="relative z-10 bg-space-900 border-t border-space-800 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.</p>
          <p className="mt-2 font-mono text-xs text-gray-600">SYSTEM.STATUS: ONLINE // ROS2 NODE ACTIVE</p>
        </div>
      </footer>
      <NewsTicker />
    </div>
  );
};

export default App;