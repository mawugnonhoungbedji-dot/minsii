import React from 'react';
import { Search, Phone, Trophy, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    title: "Sélection Elite",
    desc: "Parcourez les profils certifiés par notre équipe académique.",
    icon: <Search size={22} />,
    step: "01"
  },
  {
    title: "Contact Direct",
    desc: "Discutez instantanément pour fixer le premier cours d'essai.",
    icon: <Zap size={22} />,
    step: "02"
  },
  {
    title: "Réussite Suivie",
    desc: "Mesurez les progrès via nos tableaux de bord exclusifs.",
    icon: <Trophy size={22} />,
    step: "03"
  }
];

export const HowItWorks = () => {
  return (
    <section className="min-h-[90vh] flex items-center py-24 bg-[var(--bg-main)] overflow-hidden relative">
      {/* Background Decorative SVG Path - 'The Flow' */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M-100 450C200 450 400 150 700 450C1000 750 1200 450 1600 450" 
            stroke="var(--primary)" 
            strokeWidth="0.5"
            strokeDasharray="8 8"
            className="animate-path"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-24">
          
          {/* Left Side: Massive Typography */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/10 mb-8">
                    <Sparkles size={10} className="text-[var(--primary)]" />
                    <span className="text-[10px] font-semibold text-[var(--primary)] opacity-60">Processus de Succès</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[var(--text-main)] mb-8 leading-[1] tracking-tighter">
                    L'Excellence <br />
                    <span className="text-[var(--primary)] italic font-serif opacity-90">simplifiée.</span>
                </h2>
                <p className="text-base text-[var(--text-muted)] max-w-sm mx-auto lg:mx-0 mb-10 font-normal opacity-70 leading-relaxed">
                    Une expérience fluide conçue pour transformer le potentiel de chaque étudiant au Bénin.
                </p>
                <button className="h-12 px-8 rounded-full border border-[var(--border-main)] hover:bg-[var(--primary)] hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest flex items-center gap-4 mx-auto lg:mx-0 shadow-sm">
                    Découvrir le processus
                    <ArrowRight size={14} />
                </button>
            </motion.div>
          </div>

          {/* Right Side: Step Flow Cards */}
          <div className="flex-1 flex flex-col gap-8 relative">
            {STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40, boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.03)"
                }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  delay: idx * 1, 
                  duration: 1.2, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="group relative bg-white border border-black/5 p-10 lg:p-12 rounded-[var(--radius-serenity)] transition-all duration-700 hover:-translate-y-2 hover:shadow-premium overflow-hidden"
              >
                <div className="flex items-center gap-8">
                    {/* Step Number */}
                    <span className="text-3xl font-black text-[var(--primary)]/5 group-hover:text-[var(--primary)]/20 transition-colors font-serif italic">
                        {step.step}
                    </span>
                    
                    <div className="flex-1">
                        <div className="w-8 h-8 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                            {React.cloneElement(step.icon as React.ReactElement, { size: 16 })}
                        </div>
                        <h3 className="text-lg font-black text-[var(--text-main)] mb-1.5 tracking-tight">
                            {step.title}
                        </h3>
                        <p className="text-[13px] text-[var(--text-muted)] font-normal leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                            {step.desc}
                        </p>
                    </div>
                </div>

                {/* Decorative background circle */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--primary)]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}

            {/* Connecting Vertical Line Background */}
            <div className="absolute left-20 top-20 bottom-20 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -z-10 hidden md:block" />
          </div>

        </div>
      </div>
    </section>
  );
};
