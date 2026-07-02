import React, { useState } from 'react';
import { PERSONAL_INFO } from '../constants';
import { motion } from 'framer-motion';
import { User, Target, Cpu, Send, Mail, Check, Loader2 } from 'lucide-react';
import GitHubStats from './GitHubStats';

const About: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Construct mailto link
    const subject = `Portfolio Contact from ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    const mailtoLink = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;

    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => {
        setFormStatus('idle');
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }, 1000);
  };

  return (
    <section id="about" className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Avatar / Image Area */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:col-span-4 flex justify-center md:justify-start"
          >
            <div className="relative w-64 md:w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] group">
              <img 
                src={PERSONAL_INFO.profileImage} 
                alt={PERSONAL_INFO.name} 
                className="w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:col-span-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6 font-tech">
              About <span className="text-cyan-400">Me</span>
            </h2>
            <div className="prose prose-lg prose-invert text-gray-300 mb-8">
              <p className="leading-relaxed">
                {PERSONAL_INFO.about}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-900/40 backdrop-blur-md p-4 rounded-lg border border-white/10 transition-colors hover:border-cyan-500/30"
                >
                    <div className="flex items-center gap-3 mb-2 text-cyan-400">
                        <Target className="w-5 h-5" />
                        <h3 className="font-semibold text-white">Career Goal</h3>
                    </div>
                    <p className="text-sm text-gray-400">
                        To contribute to the next generation of autonomous industrial robotics, focusing on safety, efficiency, and human-robot collaboration.
                    </p>
                </motion.div>
                
                <motion.div 
                   whileHover={{ scale: 1.02 }}
                   className="bg-slate-900/40 backdrop-blur-md p-4 rounded-lg border border-white/10 transition-colors hover:border-cyan-500/30"
                >
                    <div className="flex items-center gap-3 mb-2 text-cyan-400">
                        <Cpu className="w-5 h-5" />
                        <h3 className="font-semibold text-white">Core Focus</h3>
                    </div>
                    <p className="text-sm text-gray-400">
                        Bridging the gap between AI algorithms and real-time hardware control using ROS2 and embedded systems.
                    </p>
                </motion.div>
            </div>

            {/* Quick Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-slate-900/40 p-6 rounded-xl border border-white/10 backdrop-blur-md"
            >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    Quick Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name" 
                            required
                            className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email" 
                            required
                            className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                    <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message..." 
                        rows={3} 
                        required
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    ></textarea>
                    <button 
                        type="submit" 
                        disabled={formStatus !== 'idle'}
                        className="flex items-center gap-2 px-6 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/20 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {formStatus === 'submitting' ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                            </>
                        ) : formStatus === 'success' ? (
                            <>
                                <Check className="w-4 h-4" />
                                Sent!
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Send Message
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
          </motion.div>
        </div>

        {/* GitHub Live Stats Widget */}
        <GitHubStats />
      </div>
    </section>
  );
};

export default About;