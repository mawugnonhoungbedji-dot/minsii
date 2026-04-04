import React from 'react';
import { 
    Layout, Star, Clock, MessageSquare, Search, Zap, 
    ArrowUpRight, User, TrendingUp, X, SearchX 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthUser } from '../../services/authService';
import { Booking } from '../../services/bookingService';
import { Conversation } from '../../services/messageService';
import { Teacher } from '../../types';
import TeacherCard from '../TeacherCard';

interface ClientOverviewProps {
    user: AuthUser;
    stats: {
        favoritesCount: number;
        bookingsCount: number;
        unreadMessages: number;
    };
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    showSuggestions: boolean;
    setShowSuggestions: (val: boolean) => void;
    suggestions: Teacher[];
    handleSearch: () => void;
    setSearchResults: (teachers: Teacher[]) => void;
    /** BUG #11 — Résultats de la recherche, affichés dans la section dédiée */
    searchResults: Teacher[];
    onClearSearch: () => void;
    setActiveTab: (tab: any) => void;
    onTeacherClick: (t: any) => void;
}

const ClientOverview: React.FC<ClientOverviewProps> = ({ 
    user, stats, searchTerm, setSearchTerm, 
    showSuggestions, setShowSuggestions, suggestions,
    handleSearch, setSearchResults, searchResults, onClearSearch, setActiveTab, onTeacherClick
}) => {
    return (
        <div className="space-y-16 lg:space-y-24 animate-soft-in">
            {/* Hero Section - Serenity Style */}
            <section className="relative rounded-[40px] lg:rounded-[48px] bg-white p-8 lg:p-16 border border-[var(--border-main)]/50 shadow-premium z-30">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary)]/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="w-32 lg:w-40 h-32 lg:h-40 rounded-[32px] bg-white p-3 shadow-xl border border-[var(--border-main)]/50 relative group overflow-hidden">
                        {user?.profile?.avatar_url ? (
                            <img src={user.profile.avatar_url} className="w-full h-full rounded-[24px] object-cover group-hover:scale-110 transition-transform duration-700" alt="Profile" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[var(--bg-section)] rounded-[24px]">
                                <User className="w-12 lg:w-16 text-[var(--text-muted)] opacity-20" />
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 lg:w-10 lg:h-10 bg-[var(--primary)] rounded-xl border-4 border-white flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform">
                            <TrendingUp className="w-4 lg:w-5 h-4 lg:h-5" />
                        </div>
                    </div>

                    <div className="flex-1 text-center lg:text-left space-y-4">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--primary)]/5 border border-[var(--primary)]/10 gap-2">
                            <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-[var(--primary)] uppercase tracking-[0.3em]">Session Active</span>
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-black text-[var(--text-main)] tracking-tighter leading-[0.85] uppercase italic font-serif">
                            Bonjour, <br className="hidden lg:block"/><span className="text-[var(--primary)] not-italic">{user?.profile?.name?.split(' ')[0] || 'Étudiant'}</span>.
                        </h2>
                        <p className="text-[var(--text-muted)] font-bold text-base lg:text-lg lg:max-w-xl leading-relaxed opacity-80">
                            "L'apprentissage est le voyage le plus gratifiant. Quel mentor vous accompagnera aujourd'hui ?"
                        </p>
                    </div>
                </div>

                {/* Search Bar - Integrated into Hero */}
                <div className="mt-12 lg:mt-16 max-w-2xl relative group h-[72px] lg:h-[84px] mx-auto lg:mx-0">
                    <div className="absolute inset-0 bg-[var(--primary)]/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <Search className="absolute left-7 lg:left-8 top-1/2 -translate-y-1/2 w-5 h-5 lg:w-6 lg:h-6 text-[var(--text-muted)] opacity-30 group-focus-within:text-[var(--primary)] transition-colors z-20" />
                    <input 
                        type="text" 
                        placeholder="MATH, PHYSIQUE, ANGLAIS..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full h-full pl-16 lg:pl-20 pr-32 lg:pr-48 bg-white border border-[var(--border-main)]/50 rounded-[28px] lg:rounded-[32px] text-base font-black tracking-tight outline-none shadow-premium focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all uppercase placeholder:text-[var(--text-muted)]/20 text-[var(--text-main)] relative z-10"
                    />
                    <button 
                        onClick={handleSearch}
                        className="absolute right-3 top-3 bottom-3 px-6 lg:px-10 bg-[var(--primary)] text-white rounded-[20px] lg:rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/10 z-20"
                    >
                        Trouver
                    </button>

                    {/* Quick Suggestions Dropdown - Serenity Evolution */}
                    <div className={`absolute top-full left-0 right-0 mt-8 bg-white/95 backdrop-blur-xl rounded-[40px] shadow-[0_32px_120px_rgba(30,30,220,0.12)] border border-[var(--border-main)]/30 overflow-hidden z-[100] transition-all duration-700 ease-[0.16,1,0.3,1] ${showSuggestions && suggestions.length > 0 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-[0.98] pointer-events-none'}`}>
                        <div className="p-8 bg-[var(--primary)]/5 border-b border-[var(--border-main)]/30 flex items-center justify-between">
                            <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.4em] flex items-center gap-3">
                                {searchTerm.length === 0 ? (
                                    <>
                                        <TrendingUp className="w-4 h-4" /> Mentors Recommandés
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-4 h-4 fill-[var(--primary)]" /> Suggestions Rapides
                                    </>
                                )}
                            </p>
                            <span className="text-[9px] font-black text-[var(--text-muted)] opacity-30 uppercase tracking-[0.2em]">{suggestions.length} Résultat{suggestions.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
                            {suggestions.map((teacher) => (
                                <button
                                    key={teacher.id}
                                    onClick={() => {
                                        onTeacherClick(teacher);
                                        setShowSuggestions(false);
                                    }}
                                    className="w-full py-10 px-10 flex items-center justify-between hover:bg-[var(--primary)]/5 transition-all group relative border-b border-[var(--border-main)]/10 last:border-0"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--primary)] scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
                                    <div className="flex items-center gap-8 translate-x-0 group-hover:translate-x-2 transition-transform duration-500">
                                        <div className="w-20 h-20 bg-white rounded-[28px] border border-[var(--border-main)]/50 flex items-center justify-center font-black text-[var(--primary)] text-2xl shadow-sm group-hover:shadow-xl group-hover:scale-110 transition-all duration-500 overflow-hidden">
                                            {teacher.avatar ? (
                                                <img src={teacher.avatar} className="w-full h-full object-cover" alt={teacher.name} />
                                            ) : (
                                                teacher.name.charAt(0)
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-[var(--text-main)] group-hover:text-[var(--primary)] transition-colors text-xl tracking-tight leading-none mb-2 font-serif italic">{teacher.name}</p>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">{teacher.subject}</span>
                                                <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <span className="text-[11px] font-black text-[var(--primary)] uppercase tracking-[0.1em] opacity-0 group-hover:opacity-60 transition-all -translate-x-2 group-hover:translate-x-0">{teacher.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-[var(--primary)]/5 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                        <ArrowUpRight className="w-5 h-5 text-[var(--primary)]" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                {[
                    { label: 'Mentors Favoris', value: stats.favoritesCount, icon: Star, color: 'text-amber-500', tab: 'favorites', bg: 'bg-amber-50' },
                    { label: 'Sessions Archivées', value: stats.bookingsCount, icon: Clock, color: 'text-[var(--primary)]', tab: 'history', bg: 'bg-[var(--primary)]/5' },
                    { label: 'Messages Liaison', value: stats.unreadMessages, icon: MessageSquare, color: 'text-emerald-500', tab: 'messages', bg: 'bg-emerald-50', showBadge: stats.unreadMessages > 0 },
                ].map((stat, i) => (
                    <motion.button 
                        key={i} 
                        whileHover={{ y: -6, shadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(stat.tab)}
                        className="bg-white rounded-[32px] p-10 text-left relative group overflow-hidden border border-[var(--border-main)]/50 shadow-premium"
                    >
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                            <stat.icon className={`w-5 h-5 ${stat.color} transition-colors`} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-2 opacity-50">{stat.label}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-5xl font-black tracking-tighter text-[var(--text-main)] leading-none font-serif">{stat.value}</h3>
                                {stat.showBadge && (
                                    <span className="animate-ping bg-rose-500 w-3 h-3 rounded-full" />
                                )}
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="w-4 h-4 text-[var(--primary)]" />
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* BUS #11 — Section Résultats de Recherche */}
            <AnimatePresence>
                {searchResults.length > 0 && (
                    <motion.section
                        key="search-results"
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -32 }}
                        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                        className="space-y-12"
                    >
                        {/* En-tête résultats */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#1A1008]/5 pb-10">
                            <div>
                                <h2 className="text-4xl lg:text-5xl font-black text-[#1A1008] tracking-tighter uppercase italic mb-2">
                                    {searchResults.length} Mentor{searchResults.length > 1 ? 's' : ''} Trouvé{searchResults.length > 1 ? 's' : ''}
                                </h2>
                                <p className="text-[11px] font-black text-[#1e1edc] uppercase tracking-[0.4em]">
                                    POUR &laquo; {searchTerm} &raquo;
                                </p>
                            </div>
                            <button
                                onClick={onClearSearch}
                                className="h-14 px-10 rounded-[20px] bg-[#1A1008] text-white hover:bg-[#1e1edc] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl"
                            >
                                <X className="w-4 h-4" />
                                Nouvelle Reclame
                            </button>
                        </div>

                        {/* Grille de résultats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                            {searchResults.map((teacher, i) => (
                                <motion.div
                                    key={teacher.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                >
                                    <TeacherCard 
                                        key={teacher.id}
                                        teacher={teacher} 
                                        onClick={() => onTeacherClick(teacher)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {searchResults.length === 0 && searchTerm.length >= 2 && (
                    <motion.div
                        key="no-results"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[48px] border border-dashed border-[#1A1008]/10"
                    >
                        <div className="w-24 h-24 bg-[#FDFAF7] rounded-[32px] flex items-center justify-center mb-10 shadow-inner border border-[#1A1008]/5">
                            <SearchX className="w-10 h-10 text-[#1A1008]/20" />
                        </div>
                        <h3 className="text-3xl font-black text-[#1A1008] tracking-tighter uppercase italic mb-4">Signal Perdu</h3>
                        <p className="text-[#5C5248] font-bold text-lg max-w-md mx-auto leading-relaxed">
                            Aucun mentor trouvé pour &laquo; {searchTerm} &raquo;. <br/>
                            Vérifiez l'orthographe ou tentez une approche plus large.
                        </p>
                        <button
                            onClick={onClearSearch}
                            className="mt-12 h-16 px-12 bg-[#1e1edc] text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#0a0a1a] transition-all shadow-2xl"
                        >
                            Tenter Autre Chose
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientOverview;
