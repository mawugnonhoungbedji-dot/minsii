import React, { useState } from 'react';
import { Star, MapPin, BadgeCheck, ArrowRight, Heart, Clock, Sparkles } from 'lucide-react';
import { Teacher } from '../types';
import { motion } from 'framer-motion';

interface TeacherCardProps {
  teacher: Teacher;
  isMatch?: boolean;
  matchReason?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onClick?: () => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, isMatch, matchReason, isFavorite, onToggleFavorite, onClick }) => {
  const [isFavoriteLocal, setIsFavoriteLocal] = useState(isFavorite);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavoriteLocal(!isFavoriteLocal);
    if (onToggleFavorite) onToggleFavorite(teacher.id);
  };

  const isVerified = teacher.badges?.some(b =>
    b.toLowerCase().includes('vérifié') || b.toLowerCase().includes('certifié')
  );

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="relative group bg-white rounded-[var(--radius-serenity)] p-4 pb-8 border border-[var(--border-main)]/50 shadow-serenity hover:shadow-premium transition-all duration-700 overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[var(--primary)]/5 to-transparent z-0" />

      {/* Favorite Button */}
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-6 right-6 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
            isFavoriteLocal 
            ? 'bg-rose-500 border-rose-500 text-white shadow-lg' 
            : 'bg-white border-black/5 text-gray-400 hover:text-rose-500 hover:shadow-md'
        }`}
      >
        <Heart size={16} className={`${isFavoriteLocal ? 'fill-current' : ''}`} />
      </button>

      {/* Header Profile Photo */}
      <div className="relative z-10 flex flex-col items-center pt-6">
        <div className="relative mb-4">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[2rem] overflow-hidden border-2 border-white shadow-xl transition-transform duration-700 group-hover:scale-105">
                <img
                    src={teacher.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name || 'M')}&background=F5F5F7&color=1D1D1F`}
                    alt={teacher.name}
                    className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                />
            </div>
            {isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg">
                    <BadgeCheck size={10} className="text-white" />
                </div>
            )}
        </div>

        {/* Rating Badge */}
        <div className="flex items-center gap-1 bg-[#F5F5F7] px-3 py-1 rounded-full mb-4">
            <Star size={12} fill="#FFC107" className="text-[#FFC107]" />
            <span className="text-[10px] font-bold text-[#1D1D1F]">{teacher.rating}</span>
        </div>

        <h3 className="text-lg lg:text-xl font-bold text-[var(--text-main)] tracking-tight mb-1 text-center line-clamp-1 font-serif italic opacity-90">
            {teacher.name}
        </h3>
        <p className="text-[10px] font-semibold text-[var(--primary)] mb-4 opacity-80">
            {teacher.subject}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-4 w-full px-4 mb-6 text-[10px] font-medium text-[var(--text-muted)] opacity-50">
            <div className="flex items-center gap-1.5">
                <MapPin size={9} />
                {teacher.location?.split(',')[0]}
            </div>
            <div className="w-0.5 h-0.5 rounded-full bg-[var(--text-muted)] opacity-30" />
            <div className="flex items-center gap-1.5">
                <Clock size={9} />
                {teacher.experience}
            </div>
        </div>

        {/* Pricing & CTA */}
        <div className="w-full px-2 flex items-center justify-between mt-auto">
            <div className="flex flex-col">
                <span className="text-[var(--text-main)] font-bold text-lg lg:text-xl leading-none font-serif opacity-80">
                    {teacher.hourlyRate?.toLocaleString('fr-FR')}
                </span>
                <span className="text-[9px] font-medium text-[var(--text-muted)] opacity-50 mt-1">
                    CFA / heure
                </span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onClick?.(); }}
              className="bg-[var(--text-main)] text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--primary)] transition-all shadow-xl active:scale-95 group/btn"
            >
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>

      {/* AI Match Reason Overlays */}
      {isMatch && (
        <div className="absolute inset-x-4 bottom-4 p-4 rounded-[2rem] bg-[var(--primary)] text-white text-[10px] font-bold leading-relaxed shadow-2xl animate-fade-up z-20">
            <div className="flex items-center gap-2 mb-1 text-white/90">
                <Sparkles size={12} />
                <span className="text-[9px] font-bold uppercase tracking-wider">Minsii Conseil</span>
            </div>
            <p className="opacity-80 font-medium whitespace-pre-wrap">"{matchReason}"</p>
        </div>
      )}
    </motion.div>
  );
};

export default TeacherCard;
