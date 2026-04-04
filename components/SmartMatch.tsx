import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, Send, BrainCircuit, Target, Zap, ChevronDown, MapPin, Ruler, FileText, Building2, Activity } from 'lucide-react';
import { matchTeacherWithKeywords, matchTeacherWithPreferences } from '../services/matchingService';
import { preferencesService } from '../services/preferencesService';
import { Teacher, MatchingResult } from '../types';
import { UserPreferences } from '../types/preferences';

interface SmartMatchProps {
  teachers: Teacher[];
  onMatchesFound: (matches: MatchingResult[]) => void;
}

const PLACEHOLDER_PHRASES = [
  "Ex: Je cherche un prof de Maths pour mon fils en Terminale C à Fidjrossè...",
  "Ex: Cours de SVT pour une fille en Série D, quartier Akpakpa...",
  "Ex: Répétiteur Anglais pour un élève de 3ème à Cotonou, 4000 FCFA/h...",
  "Ex: Préparation BAC Série A à Abomey-Calavi, semaines chargées...",
  "Ex: Prof de Physique pour Série C en difficulté, budget 5000 FCFA...",
];

const SmartMatch: React.FC<SmartMatchProps> = ({ teachers, onMatchesFound }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [placeholder, setPlaceholder] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const prefs = preferencesService.getPreferences();
    setUserPreferences(prefs);
  }, []);

  // Typewriter effect on placeholder
  useEffect(() => {
    if (query) return; // stop when user is typing
    const currentPhrase = PLACEHOLDER_PHRASES[phraseIdx];

    if (isTyping) {
      if (charIdx < currentPhrase.length) {
        const t = setTimeout(() => {
          setPlaceholder(prev => prev + currentPhrase[charIdx]);
          setCharIdx(c => c + 1);
        }, 38);
        return () => clearTimeout(t);
      } else {
        // Pause then erase
        const t = setTimeout(() => setIsTyping(false), 2400);
        return () => clearTimeout(t);
      }
    } else {
      if (charIdx > 0) {
        const t = setTimeout(() => {
          setPlaceholder(prev => prev.slice(0, -1));
          setCharIdx(c => c - 1);
        }, 18);
        return () => clearTimeout(t);
      } else {
        setPhraseIdx(i => (i + 1) % PLACEHOLDER_PHRASES.length);
        setIsTyping(true);
      }
    }
  }, [charIdx, isTyping, phraseIdx, query]);

  const handleMatch = async () => {
    if (!query.trim() && !userPreferences) return;
    setIsLoading(true);
    try {
      let results: MatchingResult[];
      if (userPreferences) {
        results = matchTeacherWithPreferences(teachers, userPreferences, query);
      } else {
        results = await matchTeacherWithKeywords(query, teachers);
      }
      onMatchesFound(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const quickTags = [
    { label: 'Prépa BAC', value: 'Préparation BAC Série C', icon: <Target className="w-3 h-3" /> },
    { label: 'Akpakpa', value: 'Cotonou Akpakpa', icon: <MapPin className="w-3 h-3" /> },
    { label: 'Maths Tle D', value: 'Maths Terminale D', icon: <Ruler className="w-3 h-3" /> },
    { label: 'Français BEPC', value: 'Français BEPC 3ème', icon: <FileText className="w-3 h-3" /> },
    { label: 'Calavi', value: 'Abomey-Calavi', icon: <Building2 className="w-3 h-3" /> },
  ];

  return (
    <div className="relative rounded-[3rem] overflow-hidden mb-20 shadow-2xl border border-white/10 bg-[#06091F] p-1">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full -mr-60 -mt-60 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full -ml-40 -mb-40 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 p-10 md:p-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden">

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-10 items-start mb-12">
                <div className="w-20 h-20 bg-orange-400 rounded-3xl flex items-center justify-center shadow-[0_20px_40px_rgba(245,158,11,0.3)] shrink-0 animate-float border border-white/20">
                  <Sparkles className="text-white w-10 h-10 fill-white" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                    SmartMatch <span className="text-orange-400">AI</span>
                  </h2>
                  <p className="text-white opacity-40 text-lg md:text-xl font-normal leading-relaxed max-w-xl">
                    Décrivez votre besoin en quelques mots. Notre IA s'occupe de trouver le mentor idéal.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap mb-10">
                <div className="bg-white/5 border border-white/10 px-5 py-2 rounded-2xl flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Neural Engine v2.0</span>
                </div>
                {userPreferences && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 px-5 py-2 rounded-2xl flex items-center gap-3">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-semibold text-emerald-100/60 uppercase tracking-widest">Ciblage Précis</span>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="relative group">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleMatch(); }}
                placeholder={placeholder || ' '}
                className={`w-full bg-white/5 border rounded-[2rem] p-8 pr-28 text-white placeholder-indigo-100/20
              focus:outline-none focus:border-orange-400/30 min-h-[160px]
              transition-all text-lg leading-relaxed resize-none
              ${!query ? 'typing-cursor' : ''}
              ${isLoading ? 'border-orange-400/40' : 'border-white/10'}`}
              />

              {/* Send button */}
              <button
                onClick={handleMatch}
                disabled={isLoading || (!query.trim() && !userPreferences)}
                className="absolute bottom-8 right-8 bg-orange-400 text-white p-5 rounded-2xl
              hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed
              shadow-2xl shadow-orange-400/20 active:scale-95 group/btn
              transition-all duration-300"
                title="Chercher (Ctrl+Entrée)"
              >
                {isLoading
                  ? <Loader2 className="w-6 h-6 animate-spin" />
                  : <Send className="w-6 h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                }
              </button>
            </div>

            {/* Keyboard hint */}
            <p className="text-white/20 text-[10px] text-right mt-4 font-semibold uppercase tracking-widest">
              Ctrl+Entrée pour propulser
            </p>

            {/* Quick Tags */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Activity className="w-4 h-4 text-orange-400/40 shrink-0" />
              <span className="text-[10px] text-white/20 font-semibold uppercase tracking-widest shrink-0">Tendances</span>
              {quickTags.map(tag => (
                <button
                  key={tag.label}
                  onClick={() => { setQuery(tag.value); textareaRef.current?.focus(); }}
                  className="text-[11px] font-semibold bg-white/5 hover:bg-orange-400/10 px-6 py-2.5
                rounded-full border border-white/5 hover:border-orange-400/20
                text-white/40 hover:text-orange-400
                transition-all duration-300 active:scale-95
                flex items-center gap-2 uppercase tracking-wider"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartMatch;
