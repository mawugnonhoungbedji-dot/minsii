import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, UserPlus, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const SignupCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="min-h-[90vh] flex items-center py-24 bg-[var(--bg-main)]">
      <div className="container mx-auto px-6 md:px-12 xl:px-24">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Parent Path - Blue/Ivory */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 group relative p-10 lg:p-12 rounded-[var(--radius-serenity)] bg-white border border-[var(--border-main)] overflow-hidden transition-all duration-700 hover:shadow-serenity hover:-translate-y-2"
          >
            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Search size={300} className="text-[var(--primary)]" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/10 mb-8">
                <Sparkles size={10} className="text-[var(--primary)]" />
                <span className="text-[10px] font-semibold text-[var(--primary)] opacity-60">Je suis un parent</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-black text-[var(--text-main)] mb-6 leading-[1.1] tracking-tighter">
                Trouvez le prof <br />
                <span className="text-[var(--primary)] italic font-serif opacity-90">idéal.</span>
              </h3>
              
              <p className="text-base text-[var(--text-muted)] mb-8 max-w-[280px] font-normal opacity-70 leading-relaxed">
                Accédez instantanément aux profils des meilleurs mentors certifiés de votre zone.
              </p>

              <button 
                onClick={() => navigate('/marketplace')}
                className="h-12 px-8 rounded-full bg-[var(--primary)] text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/5"
              >
                TROUVER UN MENTOR
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>

          {/* Teacher Path - Dark Premium */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 group relative p-10 lg:p-12 rounded-[var(--radius-serenity)] bg-[#0A0A0A] text-white overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-2"
          >
            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <UserPlus size={300} className="text-white" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
                <Sparkles size={10} className="text-[var(--secondary)]" />
                <span className="text-[10px] font-semibold text-white opacity-40">Je suis un mentor</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-black mb-6 leading-[1.1] tracking-tighter">
                Transmettez votre <br />
                <span className="text-[var(--secondary)] italic font-serif opacity-90">passion.</span>
              </h3>
              
              <p className="text-base text-white/40 mb-8 max-w-[280px] font-normal leading-relaxed">
                Rejoignez l'élite éducative du Bénin et gérez vos cours de manière professionnelle.
              </p>

              <button 
                onClick={() => navigate('/become-mentor')}
                className="h-12 px-8 rounded-full border-2 border-[var(--secondary)] text-[var(--secondary)] font-bold text-[10px] uppercase tracking-widest flex items-center gap-4 hover:bg-[var(--secondary)] hover:text-black transition-all"
              >
                DEVENIR MENTOR
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
