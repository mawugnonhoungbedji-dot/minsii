import React from 'react';
import { Target, Heart, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Mission = () => {
  const points = [
    { label: "Vérification Académique", icon: <ShieldCheck size={20} /> },
    { label: "Mentors Passionnés", icon: <Heart size={20} /> },
    { label: "Orientation Stratégique", icon: <Target size={20} /> }
  ];

  return (
    <section className="min-h-[90vh] flex items-center py-24 bg-[var(--bg-main)] overflow-hidden relative">
      {/* Background Decorative Wavy Path */}
      <div className="absolute top-0 left-0 right-0 h-40 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            id="missionCurve"
            d="M-100 100C300 50 600 150 1000 50C1400 -50 1600 150 1800 50" 
            stroke="var(--primary)" 
            strokeWidth="0.5"
            strokeDasharray="8 8"
            className="animate-path"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 xl:px-24 text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/10 mb-8">
                <Sparkles size={10} className="text-[var(--primary)]" />
                <span className="text-[8px] font-semibold text-[var(--primary)] opacity-40 tracking-widest">Notre Raison d'Être</span>
            </div>

            <h2 className="text-3xl md:text-5xl xl:text-[3.5rem] font-bold text-[var(--text-main)] leading-[1] tracking-tight mb-10">
                Nous construisons <br />
                <span className="text-[var(--primary)] italic font-serif opacity-90">l'élite béninoise.</span>
            </h2>

            <div className="max-w-xl mx-auto mb-14">
                <p className="text-base md:text-lg text-[var(--text-muted)] font-semibold tracking-wide leading-relaxed opacity-60">
                    Minsii est né d'un constat simple : l'éducation est le lever le plus puissant pour changer le futur. Nous donnons aux parents les outils pour trouver l'excellence académique à chaque étape.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-10 lg:gap-16">
                {points.map((point, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-3 group">
                        <div className="w-9 h-9 rounded-xl bg-white border border-[var(--border-main)] flex items-center justify-center text-[var(--primary)] shadow-sm group-hover:bg-[var(--primary)] group-hover:text-white transition-all transform group-hover:-translate-y-1">
                            {React.cloneElement(point.icon as React.ReactElement, { size: 12 })}
                        </div>
                        <span className="text-[7px] font-bold text-[var(--text-main)] opacity-30 group-hover:opacity-100 transition-opacity tracking-wider">
                            {point.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-16">
                <button className="h-14 px-8 rounded-full bg-[var(--primary)] text-white font-bold text-[9px] tracking-widest flex items-center gap-4 mx-auto hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20 group">
                    Rejoindre l'Aventure
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform">
                        <ArrowRight size={14} />
                    </div>
                </button>
            </div>
        </motion.div>
      </div>

      {/* Decorative Wavy Path Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 opacity-[0.03] pointer-events-none rotate-180">
        <svg className="w-full h-full" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M-100 100C300 50 600 150 1000 50C1400 -50 1600 150 1800 50" 
            stroke="var(--primary)" 
            strokeWidth="0.5"
            strokeDasharray="8 8"
            className="animate-path"
          />
        </svg>
      </div>
    </section>
  );
};
