import React from 'react';
import { Users, GraduationCap, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const STATS = [
  {
    id: 1,
    label: "Accompagnés",
    value: "10K+",
    icon: <Users size={20} />,
    color: "var(--primary)"
  },
  {
    id: 2,
    label: "Mentors d'Élite",
    value: "500+",
    icon: <GraduationCap size={20} />,
    color: "var(--primary)"
  },
  {
    id: 3,
    label: "Succès Garanti",
    value: "98%",
    icon: <Star size={20} />,
    color: "var(--secondary)"
  },
  {
    id: 4,
    label: "Sécurité Totale",
    value: "100%",
    icon: <ShieldCheck size={20} />,
    color: "var(--primary)"
  }
];

export const TrustBar = () => {
  return (
    <div className="relative z-40 -mt-8 md:-mt-10 container mx-auto px-6 md:px-12 xl:px-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
        className="glass-pill border-white/40 shadow-serenity py-5 px-8 md:px-12"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {STATS.map((stat, idx) => (
            <motion.div 
              key={stat.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3.5 group"
            >
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 shadow-sm bg-white/40 border border-white/60"
                style={{ color: stat.color }}
              >
                {React.cloneElement(stat.icon as React.ReactElement, { size: 14 })}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-[var(--text-main)] leading-none mb-1 font-serif italic tracking-tighter">
                  {stat.value}
                </h3>
                <p className="text-[10px] font-semibold text-[var(--text-muted)] opacity-50 truncate">
                  {stat.label}
                </p>
              </div>
              {idx < STATS.length - 1 && (
                <div className="hidden lg:block h-8 w-px bg-[var(--border-main)] opacity-10 ml-auto" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
