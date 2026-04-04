import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[var(--bg-main)] pt-32 pb-16 overflow-hidden relative">
      {/* Decorative Wavy Path Bottom footer */}
      <div className="absolute top-0 left-0 right-0 h-40 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M-100 100C300 50 600 150 1000 50C1440 -50 1600 150 1800 50" 
            stroke="var(--primary)" 
            strokeWidth="0.5"
            className="animate-path"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 xl:px-24">
        
        {/* Refined Centered Header - Serenity V2 */}
        <div className="text-center mb-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/10 mb-8"
            >
                <Sparkles size={10} className="text-[var(--primary)]" />
                <span className="text-[10px] font-semibold text-[var(--primary)] opacity-60">Elite Education</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-[var(--text-main)] leading-[1] tracking-tighter max-w-4xl mx-auto">
                Améliorez votre <br />
                <span className="text-[var(--primary)] italic font-serif">futur</span> aujourd'hui.
            </h2>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8 mb-32">
            {/* Brand Column */}
            <div className="col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-black text-sm">m.</div>
                    <span className="text-xl font-black text-[var(--text-main)] tracking-tighter uppercase">MINSII</span>
                </div>
                <p className="text-[var(--text-muted)] text-[13px] font-medium leading-relaxed max-w-xs mb-8">
                    La plateforme d'excellence pour le mentorat et l'orientation académique au Bénin.
                </p>
                <div className="flex gap-4">
                    {[Twitter, Facebook, Instagram, Linkedin].map((Icon, idx) => (
                        <a key={idx} href="#" className="w-9 h-9 rounded-full border border-[var(--border-main)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm">
                            <Icon size={16} />
                        </a>
                    ))}
                </div>
            </div>

            {/* Links Columns - Functional */}
            <div>
                <h4 className="text-[10px] font-semibold text-[var(--text-muted)] mb-8 opacity-60">L'Entreprise</h4>
                <ul className="flex flex-col gap-4">
                    {[
                      { l: 'À Propos', p: '/how-it-works' },
                      { l: 'Services', p: '/services' },
                      { l: 'Carrières', p: '/career' },
                      { l: 'Blog', p: '/blog' }
                    ].map((link, idx) => (
                        <li key={idx}>
                            <button onClick={() => navigate(link.p)} className="text-[11px] font-medium text-[var(--text-main)] hover:text-[var(--primary)] transition-all text-left">{link.l}</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="text-[10px] font-semibold text-[var(--text-muted)] mb-8 opacity-60">Ressources</h4>
                <ul className="flex flex-col gap-4">
                    {[
                      { l: 'Guide Parent', p: '/parent-guide' },
                      { l: 'Guide Mentor', p: '/mentor-guide' },
                      { l: 'Matériel', p: '/material' },
                      { l: 'Séries', p: '/series' }
                    ].map((link, idx) => (
                        <li key={idx}>
                            <button onClick={() => navigate(link.p)} className="text-[11px] font-medium text-[var(--text-main)] hover:text-[var(--primary)] transition-all text-left">{link.l}</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="text-[10px] font-semibold text-[var(--text-muted)] mb-8 opacity-60">Produit</h4>
                <ul className="flex flex-col gap-4">
                    {[
                      { l: 'Marketplace', p: '/marketplace' },
                      { l: 'Dashboard', p: '/dashboard' },
                      { l: 'Expertise IA', p: '/expertise-ia' },
                      { l: 'Paiements', p: '/payments' }
                    ].map((link, idx) => (
                        <li key={idx}>
                            <button onClick={() => navigate(link.p)} className="text-[11px] font-medium text-[var(--text-main)] hover:text-[var(--primary)] transition-all text-left">{link.l}</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="text-[10px] font-semibold text-[var(--text-muted)] mb-8 opacity-60">Légal</h4>
                <ul className="flex flex-col gap-4">
                    {[
                      { l: 'Confidentialité', p: '/privacy' },
                      { l: 'Conditions', p: '/cgu' },
                      { l: 'Cookies', p: '/cookies' },
                      { l: 'Sécurité', p: '/security' }
                    ].map((link, idx) => (
                        <li key={idx}>
                            <button onClick={() => navigate(link.p)} className="text-[11px] font-medium text-[var(--text-main)] hover:text-[var(--primary)] transition-all text-left">{link.l}</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-[var(--border-main)] flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex gap-8">
                {['+229 00 00 00 00', 'support@minsii.bj', 'Cotonou, Bénin'].map((item, idx) => (
                    <span key={idx} className="text-[10px] font-medium text-[var(--text-muted)] opacity-50">{item}</span>
                ))}
            </div>
            <p className="text-[10px] font-medium text-[var(--text-muted)] opacity-50">
                © {new Date().getFullYear()} Minsii Elite Education. Tout droit réservé.
            </p>
        </div>

      </div>
    </footer>
  );
};
