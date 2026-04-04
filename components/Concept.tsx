import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Play, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SERVICES = [
  {
    title: "Soutien Scolaire d'Élite",
    desc: "Un accompagnement personnalisé par les meilleurs mentors du Bénin.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000",
    size: "col-span-12 md:col-span-8",
    tag: "Académie",
    hasVideo: true
  },
  {
    title: "Orientation Stratégique",
    desc: "Découvrez votre voie avec nos experts.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000",
    size: "col-span-12 md:col-span-4",
    tag: "Futur"
  },
  {
    title: "Inscrivez-vous à une Classe d'Élite",
    desc: "Rejoignez la prochaine session.",
    size: "col-span-12 md:col-span-4 bg-primary text-white",
    isCTA: true
  },
  {
    title: "Préparation Concours",
    desc: "Maximisez vos chances.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
    size: "col-span-12 md:col-span-8",
    tag: "Succès"
  }
];

export const Concept = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[90vh] flex items-center py-24 bg-[var(--bg-section)] relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/10 mb-8">
              <Sparkles size={10} className="text-[var(--primary)]" />
              <span className="text-[10px] font-semibold text-[var(--primary)] opacity-60">Notre Approche</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[var(--text-main)] mb-6 leading-[1.1] tracking-tighter">
              Améliorez votre potentiel <br />
              <span className="text-[var(--primary)] italic font-serif opacity-90">aujourd'hui.</span>
            </h2>
            <p className="text-base text-[var(--text-muted)] font-normal opacity-70 leading-relaxed max-w-md">
              Une plateforme conçue pour l'excellence, alliant technologie de pointe et accompagnement humain.
            </p>
          </motion.div>
          
          <motion.button 
            onClick={() => navigate('/marketplace')}
            whileHover={{ x: 5 }}
            className="group flex items-center gap-4 text-[var(--text-main)] font-black"
          >
            <span className="text-[10px] tracking-widest uppercase">Tous nos services</span>
            <div className="w-10 h-10 rounded-full border border-[var(--border-main)] flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
              <ArrowRight size={14} />
            </div>
          </motion.button>
        </div>

        {/* Custom Bento Grid */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8 max-w-7xl mx-auto h-full">
          {SERVICES.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative group rounded-[var(--radius-serenity)] overflow-hidden ${service.size} min-h-[240px] lg:min-h-[280px] flex flex-col p-8 lg:p-10 justify-between transition-all duration-700 ${!service.isCTA ? 'bg-white border border-[var(--border-main)]/50' : 'shadow-blue border-none'} shadow-sm hover:shadow-serenity`}
            >
              {service.image && (
                <div className="absolute inset-0 z-0">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                </div>
              )}

              {service.isCTA ? (
                <div className="flex flex-col h-full justify-between items-start relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 leading-tight tracking-tight">
                      {service.title}
                    </h3>
                    <div className="flex flex-col gap-1.5 mb-6 opacity-70">
                        {["Mentors d'élite", "Suivi 24/7", "Certifié"].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-white" />
                                <span className="text-[10px] font-semibold opacity-80 tracking-wider">{item}</span>
                            </div>
                        ))}
                    </div>
                    <button className="bg-white text-[var(--primary)] h-10 px-8 rounded-full font-bold text-[10px] tracking-wider hover:scale-105 transition-transform shadow-lg active:scale-95">
                      S'inscrire Maintenant
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-[var(--primary)] tracking-wider shadow-sm">
                      {service.tag}
                    </span>
                    {service.hasVideo && (
                      <button className="flex items-center gap-2 px-3 py-1 bg-black rounded-full text-[10px] font-bold text-white tracking-wider transition-colors">
                        <Play size={10} fill="white" />
                        Voir Vidéo
                      </button>
                    )}
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-[1.1] tracking-tight drop-shadow-md">
                      {service.title}
                    </h3>
                    <p className="text-white/80 text-[10px] font-bold tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                      {service.desc}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
