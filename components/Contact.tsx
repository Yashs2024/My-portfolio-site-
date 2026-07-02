import React, { useState } from 'react';
import { Mail, Github, Linkedin, Send, Phone } from 'lucide-react';
import { PERSONAL_INFO } from '../constants';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
    <section id="contact" className="py-20 relative">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="text-center mb-10 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl font-bold font-tech text-white mb-4"
            >
              Let's <span className="text-cyan-400">Connect</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-gray-400"
            >
              Interested in discussing robotics, automation, or potential collaborations?
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Contact Information</h3>
                <div className="space-y-4">
                   <div className="flex items-center text-gray-300">
                    <Mail className="w-5 h-5 text-cyan-400 mr-3" />
                    <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:text-cyan-400 transition-colors">
                        {PERSONAL_INFO.email}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Phone className="w-5 h-5 text-cyan-400 mr-3" />
                    <a href={`tel:${PERSONAL_INFO.phone}`} className="hover:text-cyan-400 transition-colors">
                        {PERSONAL_INFO.phone}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Github className="w-5 h-5 text-cyan-400 mr-3" />
                    <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
                        Github Profile
                    </a>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Linkedin className="w-5 h-5 text-cyan-400 mr-3" />
                    <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
                        LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <p className="text-sm text-gray-500 italic">
                  "The best way to predict the future is to invent it."
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit} 
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={formStatus !== 'idle'}
                className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${
                  formStatus === 'success' 
                    ? 'bg-green-500 text-white'
                    : 'bg-cyan-500 text-slate-900 hover:bg-cyan-400'
                }`}
              >
                {formStatus === 'submitting' ? (
                   <span className="animate-pulse">Sending...</span>
                ) : formStatus === 'success' ? (
                   <span>Message Sent!</span>
                ) : (
                   <>
                     Send Message
                     <Send className="ml-2 w-4 h-4" />
                   </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;