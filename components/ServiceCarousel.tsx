
import React, { useState, useEffect, useRef } from 'react';
import { Search, Zap, Activity, Award, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const PHASES = [
  {
    id: 1,
    title: "Exploration Élite",
    description: "Trouvez le mentor idéal parmi une sélection rigoureuse des meilleurs professeurs du Bénin, certifiés pour leur excellence pédagogique.",
    icon: <Search className="w-8 h-8" />,
    color: "from-indigo-500/20 to-indigo-600/5",
    accent: "text-indigo-400",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Harmonie AI",
    description: "Notre algorithme de matching intelligent analyse les besoins de votre enfant pour créer une synergie parfaite avec son mentor.",
    icon: <Zap className="w-8 h-8" />,
    color: "from-orange-400/20 to-orange-500/5",
    accent: "text-orange-400",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Suivi Évolutif",
    description: "Accédez à des rapports de progression en temps réel. Visualisez chaque étape franchie par votre enfant vers son indépendance académique.",
    icon: <Activity className="w-8 h-8" />,
    color: "from-blue-400/20 to-blue-500/5",
    accent: "text-blue-400",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Excellence Béninoise",
    description: "99% de réussite académique. Nous transformons le potentiel en résultats concrets, bâtissant ainsi les leaders de demain au Bénin.",
    icon: <Award className="w-8 h-8" />,
    color: "from-emerald-400/20 to-emerald-500/5",
    accent: "text-emerald-400",
    image: "https://images.unsplash.com/photo-1523240715181-310f9d74a162?auto=format&fit=crop&q=80&w=800"
  }
];

const ServiceCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % PHASES.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + PHASES.length) % PHASES.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 8000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header - Breathable Spacing */}
        <div className="text-center mb-20 animate-soft-in">
          <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.4em] mb-4 block">✦ Votre Parcours Minsii</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
            L'Apprentissage <span className="premium-text-gradient">Réinventé.</span>
          </h2>
          <p className="text-indigo-100/40 max-w-xl mx-auto text-lg leading-relaxed">
            Une expérience fluide et personnalisée, de la découverte à la réussite suprême.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative flex flex-col items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[500px]">
            
            {/* Legend/Steps (Desktop Interface) */}
            <div className="lg:col-span-4 flex flex-col gap-4 animate-soft-in">
              {PHASES.map((phase, idx) => (
                <button
                  key={phase.id}
                  onClick={() => { setActiveIndex(idx); if(timerRef.current) clearInterval(timerRef.current); }}
                  className={`group relative flex items-center gap-6 p-6 rounded-[2rem] transition-all duration-700 text-left border ${
                    activeIndex === idx 
                      ? 'bg-white/[0.04] border-white/10 shadow-2xl scale-105' 
                      : 'bg-transparent border-transparent opacity-40 hover:opacity-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 ${
                    activeIndex === idx ? 'bg-white text-[#06091F]' : 'bg-white/5 text-white'
                  }`}>
                    {React.cloneElement(phase.icon as React.ReactElement, { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm tracking-wide ${activeIndex === idx ? 'text-white' : 'text-white/60'}`}>
                      {phase.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>

            {/* Display Area */}
            <div className="lg:col-span-8 relative group">
              <div className="relative overflow-hidden rounded-[3.5rem] glass-morphism-premium p-10 md:p-14 border border-white/10 h-full min-h-[440px] flex flex-col justify-center">
                
                {/* Visual Background Decoration */}
                <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${PHASES[activeIndex].color} rounded-full blur-[100px] transition-all duration-1000 opacity-60`} />

                <div className={`transition-all duration-700 ${isAnimating ? 'opacity-0 translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
                  <div className={`inline-flex items-center gap-2 mb-8 ${PHASES[activeIndex].accent}`}>
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Phase {PHASES[activeIndex].id}</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight tracking-tight">
                    {PHASES[activeIndex].title}
                  </h2>
                  <p className="text-xl text-indigo-100/60 leading-relaxed mb-10 max-w-2xl">
                    {PHASES[activeIndex].description}
                  </p>
                  
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-white font-bold group/btn">
                      En savoir plus <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Navigation Buttons for Mobile/Generic */}
                <div className="absolute bottom-10 right-10 flex gap-4">
                  <button onClick={prevSlide} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={nextSlide} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCarousel;
