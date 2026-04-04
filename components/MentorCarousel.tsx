import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronRight, ChevronLeft, ArrowRight, Sparkles } from 'lucide-react';
import TeacherCard from './TeacherCard';
import { Teacher } from '../types';
import { motion } from 'framer-motion';

const MENTORS: Teacher[] = [
  {
    id: "1",
    name: "Prof. Armand T.",
    subject: "Mathématiques & Physique",
    location: "Cotonou (Cadjehoun)",
    rating: 4.9,
    reviewsCount: 42,
    hourlyRate: 5000,
    avatar: "https://images.unsplash.com/photo-1544717297-fa95b3ee51f3?auto=format&fit=crop&q=80&w=400",
    badges: ["Série C", "Vérifié"],
    education: "Master en Mathématiques",
    availability: ["Lundi", "Mercredi", "Samedi"],
    experience: "12 ans",
    bio: "Spécialiste des classes d'examen. J'accompagne mes élèves vers l'excellence.",
    phoneNumber: "+229 00 00 00 01",
    levels: ["3ème", "Terminale"]
  },
  {
    id: "2",
    name: "Mlle. Edwige O.",
    subject: "Anglais & Français",
    location: "Abomey-Calavi",
    rating: 5.0,
    reviewsCount: 28,
    hourlyRate: 3500,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    badges: ["Bilingue", "Certifié"],
    education: "Licence en Anglais",
    availability: ["Mardi", "Jeudi", "Vendredi"],
    experience: "5 ans",
    bio: "J'aide les jeunes élèves à prendre confiance à l'oral et à l'écrit.",
    phoneNumber: "+229 00 00 00 02",
    levels: ["CM2", "3ème"]
  },
  {
    id: "3",
    name: "M. Seraphin K.",
    subject: "Chimie & Biologie",
    location: "Porto-Novo",
    rating: 4.8,
    reviewsCount: 56,
    hourlyRate: 4500,
    avatar: "https://images.unsplash.com/photo-1544717305-27a734ef1904?auto=format&fit=crop&q=80&w=400",
    badges: ["Série D", "Vérifié"],
    education: "Master en SVT",
    availability: ["Samedi", "Dimanche"],
    experience: "8 ans",
    bio: "Approche pédagogique basée sur l'expérimentation. Série scientifique.",
    phoneNumber: "+229 00 00 00 03",
    levels: ["Seconde", "Terminale"]
  }
];

export const MentorCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      align: 'start',
      containScroll: 'trimSnaps',
      loop: true
    }, 
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section id="mentors" className="min-h-[90vh] flex items-center py-24 bg-[var(--bg-main)] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 xl:px-24">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between items-start mb-16 gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
                <Sparkles size={12} className="text-[var(--primary)]" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--primary)] opacity-40">SÉLECTION PREMIUM</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[var(--text-main)] leading-[1] tracking-tighter">
              Le mentor idéal pour <br />
              <span className="text-[var(--primary)] italic font-serif opacity-90">chaque</span> élève.
            </h2>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex gap-2 p-1 bg-[var(--border-main)]/5 rounded-full">
              <button 
                onClick={scrollPrev} 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[var(--border-main)]/30 hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm active:scale-90 group"
              >
                <ChevronLeft size={16} className="group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={scrollNext} 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[var(--border-main)]/30 hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm active:scale-90 group"
              >
                <ChevronRight size={16} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <button className="hidden sm:flex items-center gap-3 h-12 px-6 rounded-full border-2 border-[var(--primary)] text-[var(--primary)] font-black text-[10px] uppercase tracking-widest hover:bg-[var(--primary)] hover:text-white transition-all">
                VOIR TOUT
                <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Carousel Area */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing -mx-4 px-4" ref={emblaRef}>
          <div className="flex gap-8 pb-12">
            {MENTORS.map((teacher, idx) => (
              <div key={teacher.id} className="flex-[0_0_100%] sm:flex-[0_0_48%] lg:flex-[0_0_32%] min-w-0">
                <motion.div
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1, duration: 0.6 }}
                >
                    <TeacherCard 
                       teacher={teacher} 
                       isMatch={teacher.id === "1"} 
                       matchReason="Spécialiste BAC C, 12 ans d'expérience."
                    />
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
