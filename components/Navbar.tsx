import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Cpu, Download } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navLinks = [
    { name: 'About',        href: '#about'        },
    { name: 'Skills',       href: '#skills'       },
    { name: 'Experience',   href: '#experience'   },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Projects',     href: '#projects'     },
    { name: 'Contact',      href: '#contact'      },
  ];

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1));
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 150) {
          current = section;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed w-full z-50 bg-space-950/80 backdrop-blur-md border-b border-neon-900/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" className="flex-shrink-0 flex items-center gap-2">
              <Cpu className="h-8 w-8 text-neon-400" />
              <span className="font-tech font-bold text-xl text-white tracking-wider">
                PERSONAL<span className="text-neon-400">.PORTFOLIO</span>
              </span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 font-mono tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-400 ${
                    activeSection === link.href.substring(1)
                      ? 'text-neon-400 bg-space-800'
                      : 'text-gray-300 hover:text-neon-400 hover:bg-space-800'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop socials */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.a whileHover={{ scale: 1.2, rotate: 5 }} href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a whileHover={{ scale: 1.2, rotate: -5 }} href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </motion.a>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-space-800 focus:outline-none z-[110] relative"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen
                  ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="h-6 w-6 text-cyan-400" /></motion.span>
                  : <motion.span key="open"  initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu className="h-6 w-6" /></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Full-Screen Mobile Menu Overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex flex-col md:hidden"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-space-950/95 backdrop-blur-xl" onClick={closeMenu} />

            {/* Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative ml-auto w-4/5 max-w-sm h-full bg-space-900/90 border-l border-neon-900/30 flex flex-col px-8 pt-24 pb-10 shadow-2xl"
            >
              {/* Nav links — staggered */}
              <nav className="flex-1 space-y-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={closeMenu}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, type: 'spring', stiffness: 200, damping: 20 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-mono font-medium transition-colors group ${
                      activeSection === link.href.substring(1)
                        ? 'text-cyan-400 bg-cyan-900/20 border border-cyan-500/30'
                        : 'text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="text-cyan-500/40 group-hover:text-cyan-400 text-xs font-mono transition-colors">{String(i + 1).padStart(2, '0')}</span>
                    {link.name}
                  </motion.a>
                ))}
              </nav>

              {/* Bottom section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="border-t border-slate-800 pt-6 space-y-4"
              >
                {/* Download resume */}
                <a
                  href={PERSONAL_INFO.resumeLink}
                  download="Yash_Surve_Resume.pdf"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-sm hover:bg-cyan-500/20 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>

                {/* Social icons */}
                <div className="flex items-center gap-4 px-4">
                  <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <span className="ml-auto font-mono text-xs text-gray-600">PERSONAL.PORTFOLIO</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;