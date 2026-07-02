import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Cpu } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1));
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= (element.offsetTop - 150)) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed w-full z-50 bg-space-950/80 backdrop-blur-md border-b border-neon-900/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Cpu className="h-8 w-8 text-neon-400" />
            <span className="font-tech font-bold text-xl text-white tracking-wider">
              YASH<span className="text-neon-400">.SURVE</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`${activeSection === link.href.substring(1) ? 'text-neon-400 bg-space-800' : 'text-gray-300 hover:text-neon-400 hover:bg-space-800'} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 font-mono tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-400`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Social Icons Desktop */}
          <div className="hidden md:flex items-center space-x-4">
             <motion.a 
               whileHover={{ scale: 1.2, rotate: 5 }}
               href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"
             >
                <Github className="h-5 w-5" />
             </motion.a>
             <motion.a 
                whileHover={{ scale: 1.2, rotate: -5 }}
                href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"
             >
                <Linkedin className="h-5 w-5" />
             </motion.a>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-space-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-space-900 border-b border-neon-900/30 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`${activeSection === link.href.substring(1) ? 'text-neon-400 bg-space-800' : 'text-gray-300 hover:text-neon-400'} block px-3 py-2 rounded-md text-base font-medium font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-400`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;