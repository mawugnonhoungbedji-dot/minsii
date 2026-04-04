import React, { useState } from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const REVIEWS = [
  {
    id: 1,
    name: "Fatima S.",
    role: "Mère de famille (Cotonou)",
    text: "Minsii a changé le parcours scolaire de mon fils. Il a repris confiance en lui en seulement 2 mois de mentorat.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    angle: 0
  },
  {
    id: 2,
    name: "Christian K.",
    role: "Père de Sonia (Calavi)",
    text: "L'approche sérieuse et le suivi Minsii m'ont rassuré dès le début. Ma fille comprend enfin la chimie et les maths.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    angle: 72
  },
  {
    id: 3,
    name: "Solange A.",
    role: "Maman de Déo (Fidjrossè)",
    text: "Déo a réussi son CEP avec brio grâce à l'accompagnement patient de son mentor Minsii. Une réussite totale.",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    angle: 144
  },
  {
    id: 4,
    name: "Marc O.",
    role: "Lycéen (Porto-Novo)",
    text: "Le mentorat Minsii m'a permis d'intégrer l'école de mes rêves. Les conseils sont vraiment précieux.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    angle: 216
  },
  {
    id: 5,
    name: "Awa T.",
    role: "Étudiante (Parakou)",
    text: "Grâce à ma mentor, j'ai pu surmonter mes difficultés en anglais. Je me sens prête pour l'international.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    rating: 5,
    angle: 288
  }
];

export const Testimonials = () => {
  const [activeReview, setActiveReview] = useState(REVIEWS[0]);
  const radius = 180; // Tighter radius for a finer look

  return (
    <section className="min-h-[90vh] flex items-center py-24 bg-[var(--bg-main)] overflow-hidden">
      <div className="container mx-auto px-6 flex flex-col items-center">
        
        <div className="text-center mb-14 max-w-2xl">
          <span className="text-[10px] font-semibold text-[var(--primary)] mb-6 block opacity-60">Communauté Minsii</span>
          <h2 className="text-2xl md:text-3xl font-black text-[var(--text-main)] mb-8 leading-[1] tracking-tighter">
            La Voix de nos <br />
            <span className="text-[var(--primary)] italic font-serif opacity-90">familles épanouies.</span>
          </h2>
        </div>

        {/* Circular Layout Container */}
        <div className="relative w-full max-w-[800px] aspect-square flex items-center justify-center">
          
          {/* Decorative Background Circles */}
          <div className="absolute inset-0 border border-[var(--primary)]/5 rounded-full scale-[0.8]" />
          <div className="absolute inset-0 border border-[var(--primary)]/5 rounded-full scale-[0.6]" />
          <div className="absolute inset-0 border border-[var(--primary)]/5 rounded-full scale-[0.4]" />

          {/* Profiles rotating on path */}
          {REVIEWS.map((review) => {
            const x = Math.cos((review.angle - 90) * (Math.PI / 180)) * radius;
            const y = Math.sin((review.angle - 90) * (Math.PI / 180)) * radius;
            
            const isActive = activeReview.id === review.id;

            return (
              <motion.button
                key={review.id}
                onClick={() => setActiveReview(review)}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: review.id * 0.1 }}
                className="absolute z-20 group"
                style={{ 
                  left: `calc(50% + ${x}px)`, 
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className={`relative p-0.5 rounded-full transition-all duration-500Refined ${isActive ? 'scale-110 border-2 border-[var(--primary)] bg-white shadow-xl' : 'scale-100 hover:scale-105 border border-transparent'}`}>
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={review.image} 
                      alt={review.name} 
                      className={`w-full h-full object-cover transition-all duration-500 ${isActive ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                    />
                  </div>
                </div>
                {!isActive && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-[9px] font-semibold px-2.5 py-1 rounded-full text-white"
                    >
                        {review.name.split(' ')[0]}
                    </motion.div>
                )}
              </motion.button>
            );
          })}

          {/* Central Active Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-30 w-full max-w-[320px] p-8 md:p-10 bg-white rounded-[var(--radius-serenity)] shadow-serenity border border-black/5"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-9 h-9 bg-[var(--primary)] text-white rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquareQuote size={18} />
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(activeReview.rating)].map((_, i) => (
                  <Star key={i} size={12} fill="var(--secondary)" className="text-[var(--secondary)]" />
                ))}
              </div>

              <p className="text-lg md:text-xl font-bold text-[var(--text-main)] mb-8 leading-[1.2] tracking-tight italic font-serif opacity-80">
                "{activeReview.text}"
              </p>

              <div className="flex items-center gap-3 border-t border-[var(--border-main)]/10 pt-6 mt-2">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img src={activeReview.image} alt={activeReview.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[var(--text-main)] leading-none mb-1 truncate">
                    {activeReview.name}
                  </h4>
                  <p className="text-[10px] font-semibold text-[var(--primary)] opacity-60 truncate">
                    {activeReview.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Trust Proof Below */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] opacity-30">Approuvé par des centaines de parents au Bénin</p>
        </motion.div>
      </div>
    </section>
  );
};
