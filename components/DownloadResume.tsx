import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, Loader2, ShieldCheck } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';

const DownloadResume: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'downloading' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);

  const handleDownload = () => {
    if (status !== 'idle') return;

    setStatus('scanning');
    
    // Simulate scanning phase
    setTimeout(() => {
      setStatus('downloading');
      
      // Simulate download progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 15;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setStatus('complete');
          
          // Trigger actual download
          const link = document.createElement('a');
          link.href = PERSONAL_INFO.resumeLink;
          link.download = 'Yash_Surve_Resume.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Reset after a delay
          setTimeout(() => {
            setStatus('idle');
            setProgress(0);
          }, 3000);
        }
        setProgress(currentProgress);
      }, 200);
    }, 1500);
  };

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={handleDownload}
        disabled={status !== 'idle'}
        className={`
          relative overflow-hidden group
          flex items-center justify-center gap-3
          px-8 py-3 rounded-sm
          font-mono font-medium text-base md:text-lg
          transition-all duration-300
          border
          ${status === 'idle' 
            ? 'border-neon-400/50 text-neon-400 hover:bg-neon-900/10 hover:shadow-[0_0_20px_rgba(0,242,255,0.2)]' 
            : status === 'complete'
            ? 'border-green-500/50 text-green-400 bg-green-900/10'
            : 'border-neon-400/30 text-neon-400/70 bg-black/20'
          }
          skew-x-[-10deg]
          min-w-[240px]
        `}
        whileHover={status === 'idle' ? { scale: 1.02 } : {}}
        whileTap={status === 'idle' ? { scale: 0.98 } : {}}
      >
        {/* Background Progress Bar */}
        {(status === 'downloading' || status === 'scanning') && (
          <motion.div 
            className="absolute inset-0 bg-neon-400/10 z-0"
            initial={{ width: "0%" }}
            animate={{ width: status === 'scanning' ? "100%" : `${progress}%` }}
            transition={status === 'scanning' ? { duration: 1.5, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
          />
        )}

        <div className="skew-x-[10deg] flex items-center gap-2 relative z-10">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <span>DOWNLOAD RESUME</span>
                <Download className="w-5 h-5" />
              </motion.div>
            )}

            {status === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 animate-pulse" />
                <span>SCANNING_FILES...</span>
              </motion.div>
            )}

            {status === 'downloading' && (
              <motion.div
                key="downloading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{Math.round(progress)}% TRANSFER</span>
              </motion.div>
            )}

            {status === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>ACCESS_GRANTED</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
      
      {/* Decorative Elements */}
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-neon-400/30" />
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-neon-400/30" />
    </div>
  );
};

export default DownloadResume;
