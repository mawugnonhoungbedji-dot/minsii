import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-[var(--bg-main)]">
      {/* Background Decorative SVG Path - 'The Trajectory' */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            id="curvePath"
            d="M-100 600C200 500 400 700 700 400C1000 100 1300 300 1600 100" 
            stroke="var(--primary)" 
            strokeWidth="0.2"
            strokeDasharray="4 4"
            className="animate-path opacity-30"
          />
          <text className="curved-text-path" style={{ fontSize: '7px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.1 }}>
            <textPath href="#curvePath" startOffset="0">
              Trajectoire de Succès • Excellence Éducative • Futur Brillant • Minsii Elite • Orientation • 
            </textPath>
          </text>
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/10 mb-8">
                <Sparkles size={10} className="text-[var(--primary)]" />
                <span className="text-[10px] font-semibold text-[var(--primary)] opacity-60">Elite Marketplace Bénin</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl xl:text-5xl font-black text-[var(--text-main)] leading-[1.05] tracking-tighter mb-8 max-w-xl mx-auto lg:mx-0">
                L'Élite <br />
                <span className="text-[var(--primary)] italic font-serif opacity-90">à la fois.</span>
              </h1>
              
              <p className="text-lg text-[var(--text-muted)] max-w-lg mx-auto lg:mx-0 mb-10 font-normal leading-relaxed opacity-70">
                Connectez-vous aux meilleurs mentors du Bénin pour une réussite scolaire et professionnelle d'excellence. 
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <button 
                  onClick={() => navigate('/marketplace')}
                  className="group relative bg-[var(--primary)] text-white h-11 px-8 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/5"
                >
                  Trouver un Mentor
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform">
                    <ArrowRight size={12} />
                  </div>
                </button>
                
                <button 
                  onClick={() => navigate('/how-it-works')}
                  className="flex items-center gap-4 text-[var(--text-main)] font-semibold group"
                >
                  <div className="w-8 h-8 rounded-full border-2 border-[var(--primary)]/10 flex items-center justify-center group-hover:bg-[var(--primary)]/5 transition-all">
                    <Play size={10} className="fill-[var(--primary)] text-[var(--primary)] ml-0.5" />
                  </div>
                  <span className="text-[10px] tracking-widest uppercase border-b border-transparent group-hover:border-[var(--primary)]">Voir le Concept</span>
                </button>
              </div>
            </motion.div>

            {/* Bottom Proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-14 flex items-center justify-center lg:justify-start gap-10"
            >
              <div>
                <p className="text-xl font-bold text-[var(--text-main)] font-serif italic tracking-tighter opacity-80">10K+</p>
                <p className="text-[9px] font-semibold text-[var(--text-muted)] opacity-50">Élèves Heureux</p>
              </div>
              <div className="w-px h-6 bg-[var(--border-main)] opacity-30" />
              <div>
                <p className="text-xl font-bold text-[var(--text-main)] font-serif italic tracking-tighter opacity-80">98%</p>
                <p className="text-[9px] font-semibold text-[var(--text-muted)] opacity-50">Satisfaction</p>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex-1 relative flex justify-center"
          >
            <div className="relative rounded-[3.5rem] overflow-hidden shadow-serenity w-full max-w-[440px] aspect-[4/5] bg-[var(--bg-section)]">
              <img 
                src="C:\Users\erica\.gemini\antigravity\brain\851bb6ad-50b7-4cf4-8b78-3bbccde1623d\hero_elite_education_1775043930099.png" 
                alt="Elite Education Benin" 
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/10 to-transparent pointer-events-none" />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2.5rem] shadow-2xl animate-float max-w-[200px]">
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-4 rounded-full bg-[var(--secondary)]" />)}
              </div>
              <p className="text-sm font-bold text-[var(--text-main)] leading-tight">
                "Le meilleur investissement pour mes enfants."
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
