import React, { useState, useEffect, useRef } from 'react';
import { 
    Layout, BookOpen, Users, Calendar, MessageSquare, 
    Settings, LogOut, Search, Bell, Plus, ChevronRight,
    Star, Clock, CheckCircle, AlertCircle, TrendingUp,
    MoreVertical, FileText, Download, User, Save, Loader2, Sparkles,
    Briefcase, GraduationCap, MapPin, DollarSign, Award, ArrowUpRight, Building2,
    Upload, Phone, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService, AuthUser } from '../services/authService';
import { jobOfferService, JobOffer, JobApplication } from '../services/jobOfferService';
import { messageService, Message, Conversation } from '../services/messageService';
import { bookingService, Booking } from '../services/bookingService';
import { reviewService, Review } from '../services/reviewService';
import { supabase } from '../services/supabaseClient';
import { reportService, MonthlyReport } from '../services/reportService';
import BrandedLoader from './BrandedLoader';
import SearchableSelect from './SearchableSelect';

// Extracted Sub-components
import TeacherOverview from './dashboard/TeacherOverview';
import TeacherProfile from './dashboard/TeacherProfile';
import TeacherApplications from './dashboard/TeacherApplications';

interface DashboardTeacherProps {
    onBack: () => void;
    user: AuthUser;
    teacherId: string;
}

const DashboardTeacher: React.FC<DashboardTeacherProps> = ({ onBack, user, teacherId }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'marketplace' | 'applications' | 'profile' | 'messages' | 'reports'>('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSessions: 0,
        activeStudents: 0,
        pendingReviews: 0
    });
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const results = await Promise.allSettled([
                jobOfferService.getMyApplications(),
                messageService.getConversations(user.profile.id),
                bookingService.getMyBookings(),
                reviewService.getReviewsForTeacher(user.profile.id)
            ]);

            const apps = results[0].status === 'fulfilled' ? (results[0].value.data || []) : [];
            const convs = results[1].status === 'fulfilled' ? (results[1].value.data || []) : [];
            const freshBookings = results[2].status === 'fulfilled' ? (results[2].value.data || []) : [];
            const freshReviews = results[3].status === 'fulfilled' ? (results[3].value || []) : [];

            if (results.some(r => r.status === 'rejected')) {
                console.warn('[DashboardTeacher] Partial data load failure:', results.filter(r => r.status === 'rejected'));
            }

            setBookings(freshBookings);
            setReviews(freshReviews);
            
            setStats({
                totalSessions: freshBookings.filter(b => b.status === 'confirmed').length,
                activeStudents: Array.from(new Set([
                    ...freshBookings.map(b => b.student_id),
                    ...convs.map(c => c.other_user_id)
                ])).length,
                pendingReviews: apps.filter(a => a.status === 'pending').length
            });
        } catch (error) {
            console.error('[DashboardTeacher] Critical stats loading error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user?.profile?.id]);

    if (isLoading) return <BrandedLoader message="Initialisation de votre espace Mentor..." />;

    const navigationItems = [
        { id: 'accueil', label: 'Accueil', icon: ArrowLeft, action: onBack },
        { id: 'overview', label: 'Aperçu', icon: Layout },
        { id: 'sessions', label: 'Sessions', icon: Calendar },
        { id: 'marketplace', label: 'Missions', icon: BookOpen },
        { id: 'reports', label: 'Rapports', icon: FileText },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'profile', label: 'Profil', icon: GraduationCap },
    ];

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--bg-main)] selection:bg-[var(--primary)]/10 text-[var(--text-main)]">
            {/* Desktop Sidebar - Serenity Style */}
            <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[var(--bg-main)] border-r border-[var(--border-main)]/50 z-50 hidden lg:flex flex-col p-8 transition-all">
                <div className="mb-10 px-2 flex items-center gap-4 cursor-pointer group" onClick={onBack}>
                    <div className="w-10 h-10 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:rotate-6 transition-transform">
                        <Sparkles className="text-white w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-[var(--text-main)] tracking-tight font-serif italic leading-none">Minsii <span className="text-[var(--primary)] not-italic">Elite</span></span>
                        <span className="text-[10px] font-semibold text-[var(--text-muted)] opacity-60 mt-1">Espace Mentor</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => item.action ? item.action() : setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-4 px-6 h-12 rounded-2xl transition-all group ${
                                activeTab === item.id 
                                ? 'bg-[var(--primary)] text-white shadow-xl shadow-blue-500/10' 
                                : 'text-[var(--text-muted)] hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-[var(--primary)] opacity-50 group-hover:opacity-100'}`} />
                            <span className="text-[11px] font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-8 border-t border-[var(--border-main)]/50">
                    <div className="bg-[var(--bg-section)] border border-[var(--border-main)]/50 rounded-3xl p-5 mb-8">
                        <p className="text-[10px] font-semibold text-[var(--text-muted)] mb-2 opacity-60">Statut</p>
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-semibold text-[var(--text-main)]">Mentor Certifié</span>
                        </div>
                    </div>

                    <button 
                        onClick={async () => { await authService.logout(); onBack(); }}
                        className="w-full flex items-center gap-4 px-6 h-12 rounded-2xl text-[var(--text-muted)] opacity-50 hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-500 transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Bottom Nav (Mobile) - Serenity Style */}
            <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[var(--bg-main)] border-t border-[var(--border-main)]/50 z-50 lg:hidden flex items-center justify-around px-4 rounded-t-[32px] shadow-[0_-10px_30px_rgba(30,30,220,0.05)]">
                {navigationItems.slice(0, 5).map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`flex flex-col items-center gap-1.5 transition-all ${
                            activeTab === item.id ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] opacity-50'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[9px] font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 min-h-screen pb-24 lg:pb-12 relative">
                {/* Header - Serenity Style */}
                <header className="sticky top-0 bg-white border-b border-[var(--border-main)]/50 z-40 px-6 lg:px-12 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 lg:hidden">
                         <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-lg">
                            <Sparkles className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold text-[var(--text-main)] tracking-tight font-serif italic uppercase">Minsii <span className="text-[var(--primary)] not-italic underline decoration-rose-500/20 underline-offset-4">Elite</span></span>
                    </div>

                    <div className="flex-1 max-w-xl mx-8 hidden lg:block">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1008]/30 group-focus-within:text-[#1e1edc] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Rechercher une session, un élève..." 
                                className="w-full bg-white border border-[#1A1008]/5 focus:border-[#1e1edc]/20 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold text-[#1A1008] outline-none transition-all placeholder:text-[#1A1008]/20 shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative w-12 h-12 flex items-center justify-center bg-white rounded-2xl border border-[#1A1008]/5 hover:border-[#1e1edc]/20 transition-all shadow-sm group">
                            <Bell className="w-5 h-5 text-[#1A1008]/60 group-hover:text-[#1e1edc]" />
                            <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-4 border-white" />
                        </button>
                        
                        <div className="h-8 w-[1px] bg-[#1A1008]/10 hidden sm:block" />
                        
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-[#1A1008] leading-none mb-1.5">{user?.profile?.name || 'Mentor'}</p>
                                <p className="text-[10px] font-semibold text-[#1e1edc] uppercase tracking-wider opacity-60">Expert Certifié</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-white border border-[#1A1008]/5 overflow-hidden shadow-sm p-1">
                                {user?.profile?.avatar_url ? (
                                    <img src={user.profile.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#FDFAF7] rounded-xl">
                                        <User className="w-6 h-6 text-[#1A1008]/30" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                        >
                            {activeTab === 'overview' && <TeacherOverview stats={stats} user={user} bookings={bookings} reviews={reviews} />}
                            {activeTab === 'sessions' && <TeacherSessions bookings={bookings} />}
                            {activeTab === 'marketplace' && <TeacherMarketplace />}
                            {activeTab === 'messages' && <TeacherMessages user={user} />}
                            {activeTab === 'profile' && <TeacherProfile user={user} />}
                            {activeTab === 'applications' && <TeacherApplications user={user} />}
                            {activeTab === 'reports' && <TeacherReports user={user} bookings={bookings} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

function TeacherSessions({ bookings }: { bookings: Booking[] }) {
    return (
        <div className="space-y-10 animate-soft-in">
            <header>
                <h2 className="text-3xl lg:text-4xl font-black text-[var(--text-main)] tracking-tighter mb-2 italic font-serif">Gestion des Sessions</h2>
                <p className="text-[var(--text-muted)] font-medium text-sm lg:text-base opacity-70">Planifiez et suivez vos interventions pédagogiques.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-premium border border-[var(--border-main)]/50">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                            <div className="flex gap-2 bg-[var(--bg-section)] p-1.5 rounded-[18px]">
                                <button className="px-6 py-2 bg-white shadow-sm text-[10px] font-bold rounded-xl uppercase tracking-wider">Calendrier</button>
                                <button className="px-6 py-2 text-[var(--text-muted)] text-[10px] font-semibold rounded-xl hover:bg-white/50 transition-all uppercase tracking-wider opacity-50">Liste</button>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="w-10 h-10 flex items-center justify-center hover:bg-[var(--bg-section)] rounded-xl transition-colors border border-[var(--border-main)]/30"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                                <span className="text-[11px] font-bold text-[var(--text-main)] uppercase tracking-widest">Mars 2026</span>
                                <button className="w-10 h-10 flex items-center justify-center hover:bg-[var(--bg-section)] rounded-xl transition-colors border border-[var(--border-main)]/30"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-2">
                            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
                                <div key={day} className="text-center py-3 text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest font-sans opacity-30">{day}</div>
                            ))}
                            {[...Array(31)].map((_, i) => {
                                const isToday = i + 1 === 24;
                                return (
                                    <div key={i} className={`aspect-square p-1 rounded-[16px] lg:rounded-[20px] flex flex-col items-center justify-center transition-all cursor-pointer ${isToday ? 'bg-[var(--primary)] text-white shadow-lg shadow-blue-500/20' : 'hover:bg-[var(--bg-section)] border border-transparent hover:border-[var(--border-main)]/30'}`}>
                                        <span className={`text-[11px] font-bold ${isToday ? 'text-white' : 'text-[var(--text-main)] opacity-70'}`}>{i + 1}</span>
                                        {i + 1 === 26 && !isToday && <div className="w-1 h-1 bg-[var(--primary)] rounded-full mt-1.5 opacity-50" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="bg-[var(--bg-section)] rounded-[40px] p-8 border border-[var(--border-main)]/50">
                        <h4 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-8 opacity-60">À venir aujourd'hui</h4>
                        <div className="space-y-4">
                            {bookings.filter(b => b.status === 'confirmed').slice(0, 5).map((booking) => (
                                <div key={booking.id} className="flex gap-4 p-5 bg-white rounded-[24px] shadow-sm border border-[var(--border-main)]/30 group hover:shadow-xl transition-all">
                                    <div className="w-1 bg-[var(--primary)] rounded-full h-auto opacity-20 group-hover:opacity-100 transition-opacity" />
                                    <div>
                                        <p className="text-[10px] font-semibold text-[var(--primary)] uppercase tracking-wider mb-1.5">
                                            {booking.requested_date ? new Date(booking.requested_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Heure à fixer'}
                                        </p>
                                        <p className="text-sm font-bold text-[var(--text-main)] leading-tight mb-1">{booking.subject}</p>
                                        <p className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider opacity-60">{booking.student?.name}</p>
                                    </div>
                                </div>
                            ))}
                            {bookings.filter(b => b.status === 'confirmed').length === 0 && (
                                <div className="text-center py-12 opacity-30">
                                    <Calendar className="w-10 h-10 mx-auto mb-4 text-[#1A1008]" />
                                    <p className="text-xs font-bold text-[#1A1008] uppercase tracking-widest italic">Aucune session.</p>
                                </div>
                            )}
                        </div>
                        <button className="w-full bg-[var(--text-main)] text-white py-4 mt-10 rounded-[20px] font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-[#1A1008]/5 hover:scale-[1.02] active:scale-95 transition-all">Modifier disponibilité</button>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function TeacherMarketplace() {
    const [offers, setOffers] = useState<JobOffer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [applyMsg, setApplyMsg] = useState<{ type: 'success' | 'error'; text: string; offerId: string } | null>(null);

    const loadOffers = async () => {
        setIsLoading(true);
        const res = await jobOfferService.getAllActiveOffers();
        if (res.success && res.data) {
            setOffers(res.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadOffers();
    }, []);

    const filteredOffers = offers.filter(o => 
        o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.establishment_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-soft-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-black text-[var(--text-main)] tracking-tighter mb-2 italic font-serif">Opportunités Missions</h2>
                    <p className="text-[var(--text-muted)] font-medium text-sm lg:text-base opacity-70">Découvrez des missions qui vous correspondent au Bénin.</p>
                </div>
                <div className="w-full md:w-auto">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] opacity-20 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher une mission..." 
                            className="w-full md:min-w-[350px] bg-white border border-[var(--border-main)]/50 rounded-[20px] py-4 pl-12 pr-6 text-sm font-medium text-[var(--text-main)] outline-none transition-all shadow-sm focus:border-[var(--primary)]/10 tracking-tight placeholder:text-[var(--text-muted)]/40"
                        />
                    </div>
                </div>
            </header>

            {applyMsg && (
                <div className={`flex items-center gap-4 px-8 py-5 rounded-[24px] text-white animate-soft-in shadow-xl ${
                    applyMsg.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'
                }`}>
                    {applyMsg.type === 'success' ? <CheckCircle className="w-6 h-6 flex-shrink-0" /> : <AlertCircle className="w-6 h-6 flex-shrink-0" />}
                    <p className="text-sm font-black uppercase tracking-[0.1em]">{applyMsg.text}</p>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-24">
                    <Loader2 className="w-12 h-12 text-[#1e1edc] animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {filteredOffers.map((offer) => (
                        <div key={offer.id} className="bg-white rounded-[40px] p-8 lg:p-10 shadow-premium border border-[var(--border-main)]/50 group hover:shadow-xl transition-all flex flex-col sm:flex-row gap-8">
                            <div className="w-20 h-20 bg-[var(--bg-section)] rounded-[24px] flex items-center justify-center text-[var(--primary)] font-black text-3xl border border-[var(--border-main)] shadow-sm group-hover:scale-110 transition-transform">
                                {offer.establishment_name?.charAt(0) || 'M'}
                            </div>
                            <div className="flex-1 space-y-5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 bg-[var(--primary)]/5 text-[var(--primary)] text-[8px] font-black uppercase tracking-[0.15em] rounded-full border border-[var(--primary)]/10">{offer.subject}</span>
                                    <span className="px-3 py-1 bg-[var(--bg-section)] text-[var(--text-muted)] text-[8px] font-black uppercase tracking-[0.15em] rounded-full border border-[var(--border-main)]/50 opacity-60">{offer.contract_type}</span>
                                </div>
                                <h3 className="text-xl lg:text-2xl font-bold text-[var(--text-main)] tracking-tight leading-tight group-hover:text-[var(--primary)] transition-colors font-serif italic">{offer.title}</h3>
                                <div className="flex flex-wrap gap-5">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">
                                        <MapPin className="w-3 h-3 text-[var(--primary)]" /> {offer.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">
                                        <DollarSign className="w-3 h-3 text-emerald-500" /> {offer.salary_range || 'N/A'}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-[var(--border-main)]/30 flex justify-between items-center mt-4">
                                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 pr-6 leading-relaxed font-bold opacity-60 uppercase tracking-tight">{offer.description}</p>
                                    <button 
                                        onClick={async () => {
                                            const res = await jobOfferService.applyToOffer(offer.id);
                                            const msg = res.success
                                                ? { type: 'success' as const, text: 'Candidature envoyée !', offerId: offer.id }
                                                : { type: 'error' as const, text: res.error || 'Erreur.', offerId: offer.id };
                                            setApplyMsg(msg);
                                            setTimeout(() => setApplyMsg(null), 5000);
                                        }}
                                        className="w-12 h-12 bg-[var(--primary)] text-white rounded-xl flex items-center justify-center p-0 flex-shrink-0 shadow-lg shadow-blue-500/20 hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <ArrowUpRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredOffers.length === 0 && (
                        <div className="col-span-full py-24 text-center opacity-30">
                            <p className="text-sm font-black text-[#1A1008] uppercase tracking-[0.2em] italic">Aucune opportunité disponible.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function TeacherMessages({ user }: { user: AuthUser }) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [onlineUsers, setOnlineUsers] = useState<Record<string, any>>({});
    const activeConversationRef = useRef<Conversation | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadConversations = async () => {
        const { data, error } = await messageService.getConversations(user.profile.id);
        if (!error && data) setConversations(data);
    };

    const loadMessages = async (convUserId: string) => {
        setChatLoading(true);
        const { data, error } = await messageService.getMessages(convUserId, user.profile.id);
        if (!error && data) {
            setChatMessages(data);
            await messageService.markAsRead(convUserId, user.profile.id);
            loadConversations();
        }
        setChatLoading(false);
    };

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        activeConversationRef.current = activeConversation;
        if (activeConversation) {
            loadMessages(activeConversation.other_user_id);
        }
    }, [activeConversation]);

    useEffect(() => {
        if (!user?.profile?.id) return;

        const msgSubscription = messageService.subscribeToMessages(user.profile.id, async (payload) => {
            const msg = payload.new as Message;
            if (!msg) return;
            loadConversations();
            const currentConv = activeConversationRef.current;
            if (currentConv && (msg.sender_id === currentConv.other_user_id || msg.receiver_id === currentConv.other_user_id)) {
                setChatMessages(prev => {
                    if (prev.find(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
                if (msg.receiver_id === user.profile.id) {
                    await messageService.markAsRead(msg.sender_id, user.profile.id);
                }
            }
        });

        const presenceChannel = messageService.subscribeToPresence('global', user.profile.id, (state) => {
            setOnlineUsers(state);
        });

        return () => {
            msgSubscription?.unsubscribe();
            presenceChannel?.unsubscribe();
        };
    }, [user?.profile?.id]);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation || isSending) return;
        const content = newMessage.trim();
        setIsSending(true);
        setNewMessage('');
        try {
            const { data, error } = await messageService.sendMessage(activeConversation.other_user_id, content, user.profile.id);
            if (!error && data) {
                setChatMessages(prev => [...prev, data]);
                loadConversations();
            }
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="h-[calc(100vh-180px)] bg-white rounded-[40px] flex flex-col md:flex-row overflow-hidden border border-[var(--border-main)]/50 shadow-premium animate-soft-in">
            {/* Conversations List */}
            <div className={`w-full md:w-96 border-r border-[var(--border-main)]/50 flex flex-col bg-white ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-8 border-b border-[var(--border-main)]/50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-[var(--text-main)] tracking-tighter uppercase font-serif italic">Messagerie</h3>
                    <div className="w-8 h-8 rounded-xl bg-[var(--bg-section)] flex items-center justify-center border border-[var(--border-main)]/50">
                        <Search size={14} className="text-[var(--text-muted)] opacity-30" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {conversations.map((conv) => (
                        <button 
                            key={conv.other_user_id} 
                            onClick={() => setActiveConversation(conv)}
                            className={`w-full flex items-center gap-4 p-4 rounded-[24px] transition-all ${activeConversation?.other_user_id === conv.other_user_id ? 'bg-[var(--bg-section)] border border-[var(--border-main)]/50' : 'hover:bg-[var(--bg-section)]/50 border border-transparent'}`}
                        >
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-white border border-[var(--border-main)]/50 flex items-center justify-center font-black text-[var(--primary)] overflow-hidden shadow-sm">
                                    {conv.other_user_avatar ? <img src={conv.other_user_avatar} className="w-full h-full object-cover" /> : conv.other_user_name.charAt(0)}
                                </div>
                                {onlineUsers[conv.other_user_id] && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />}
                            </div>
                            <div className="text-left overflow-hidden flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="font-black text-[var(--text-main)] truncate text-[13px] tracking-tight">{conv.other_user_name}</p>
                                    {conv.unread_count > 0 && <span className="px-1.5 py-0.5 bg-[var(--primary)] text-white text-[8px] font-black rounded-full uppercase tracking-widest">{conv.unread_count}</span>}
                                </div>
                                <p className="text-[10px] text-[var(--text-muted)] truncate font-bold opacity-50 uppercase tracking-tight">{conv.last_message}</p>
                            </div>
                        </button>
                    ))}
                    {conversations.length === 0 && (
                        <div className="p-12 text-center opacity-30">
                            <p className="text-xs font-black text-[#1A1008] uppercase tracking-widest italic">Aucune discussion.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-[var(--bg-section)]/30 relative overflow-hidden ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
                {activeConversation ? (
                    <>
                        <div className="p-6 bg-white border-b border-[var(--border-main)]/50 relative z-10 flex items-center gap-5">
                            <button onClick={() => setActiveConversation(null)} className="md:hidden p-2 text-[var(--text-muted)] hover:bg-[var(--bg-section)] rounded-xl"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                            <div className="w-11 h-11 rounded-xl bg-white border border-[var(--border-main)]/50 flex items-center justify-center font-black text-[var(--primary)] text-lg shadow-sm">
                                {activeConversation.other_user_avatar ? <img src={activeConversation.other_user_avatar} className="w-full h-full object-cover rounded-xl" /> : activeConversation.other_user_name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-black text-[var(--text-main)] text-[14px] tracking-tight leading-tight mb-1">{activeConversation.other_user_name}</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${onlineUsers[activeConversation.other_user_id] ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] opacity-40">{onlineUsers[activeConversation.other_user_id] ? 'En ligne' : 'Hors ligne'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-6 lg:p-10 overflow-y-auto space-y-6 relative z-10">
                            {chatMessages.map((msg, i) => (
                                <div key={msg.id || i} className={`flex ${msg.sender_id === user.profile.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] lg:max-w-[70%] p-5 rounded-[24px] text-[13px] leading-relaxed shadow-sm ${
                                        msg.sender_id === user.profile.id 
                                        ? 'bg-[var(--primary)] text-white rounded-tr-none shadow-blue-500/10' 
                                        : 'bg-white text-[var(--text-main)] rounded-tl-none border border-[var(--border-main)]/30 font-bold'
                                    }`}>
                                        {msg.content}
                                        <div className={`flex items-center gap-2 mt-3 ${msg.sender_id === user.profile.id ? 'justify-end text-white/50' : 'text-[var(--text-muted)] opacity-30 text-right justify-end'}`}>
                                            <p className="text-[8px] font-black uppercase tracking-widest">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            {msg.sender_id === user.profile.id && <CheckCircle size={10} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-6 lg:p-10 bg-white border-t border-[#1A1008]/5 relative z-10">
                            <form onSubmit={handleSendMessage} className="flex gap-4">
                                <input 
                                    type="text" 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Écrivez votre message..." 
                                    className="flex-1 bg-[#FDFAF7] border border-transparent rounded-[24px] py-4 px-8 text-sm font-bold text-[#1A1008] outline-none focus:bg-white focus:border-[#1e1edc]/10 transition-all placeholder:text-[#1A1008]/20 shadow-inner"
                                />
                                <button type="submit" disabled={!newMessage.trim() || isSending} className="w-14 h-14 bg-[#1e1edc] text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-[#1e1edc]/20 hover:scale-110 disabled:opacity-50 transition-all">
                                    {isSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowUpRight className="w-7 h-7" />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-30">
                         <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center shadow-xl border border-[var(--border-main)]/50">
                            <MessageSquare className="w-8 h-8 text-[var(--primary)]" />
                        </div>
                        <p className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-[0.2em] italic max-w-xs">Sélectionnez une discussion pour commencer.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

function TeacherReports({ user, bookings }: { user: AuthUser, bookings: Booking[] }) {
    const [reports, setReports] = useState<MonthlyReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    
    // Form state
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [attendance, setAttendance] = useState(100);
    const [nextSteps, setNextSteps] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const loadReports = async () => {
        setIsLoading(true);
        const res = await reportService.getTeacherReports(user.profile.id);
        if (res.success && res.data) setReports(res.data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent || !content.trim()) return;
        
        setIsSubmitting(true);
        const res = await reportService.submitReport({
            teacher_id: user.profile.id,
            student_id: selectedStudent,
            content,
            performance_rating: rating,
            attendance_percent: attendance,
            next_steps: nextSteps
        });

        if (res.success) {
            setMessage({ type: 'success', text: 'Rapport envoyé avec succès !' });
            setShowForm(false);
            loadReports();
            // Reset form
            setContent('');
            setNextSteps('');
            setSelectedStudent('');
        } else {
            setMessage({ type: 'error', text: res.error || "Échec de l'envoi." });
        }
        setIsSubmitting(false);
        setTimeout(() => setMessage(null), 5000);
    };

    // Filter students for the dropdown (only those with confirmed bookings)
    const uniqueStudents = Array.from(new Map(
        bookings
            .filter(b => b.status === 'confirmed' && b.student)
            .map(b => [b.student_id, b.student!])
    ).values());

    return (
        <div className="space-y-10 animate-soft-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h2 className="text-3xl lg:text-4xl font-black text-[var(--text-main)] tracking-tighter mb-2 italic font-serif">Suivi Pédagogique</h2>
                    <p className="text-[var(--text-muted)] font-medium text-sm lg:text-base opacity-70">Générez des rapports mensuels pour rassurer les parents.</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[var(--primary)] text-white px-8 py-3.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-2.5 shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4 text-white" />
                    {showForm ? 'Annuler' : 'Nouveau Rapport'}
                </button>
            </header>

            {message && (
                <div className={`p-8 rounded-[32px] text-white flex items-center gap-5 animate-soft-in shadow-xl ${message.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
                    <p className="font-black text-sm uppercase tracking-[0.1em]">{message.text}</p>
                </div>
            )}

            <AnimatePresence>
                {showForm && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-white rounded-[40px] p-8 lg:p-12 shadow-premium border border-[var(--border-main)]/50 mb-12"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-2 opacity-50">Élève Destinataire</label>
                                    <select 
                                        required
                                        value={selectedStudent}
                                        onChange={(e) => setSelectedStudent(e.target.value)}
                                        className="w-full bg-[var(--bg-section)] border border-transparent rounded-[16px] py-4 px-6 text-[11px] font-black text-[var(--text-main)] outline-none focus:bg-white focus:border-[var(--primary)]/10 shadow-inner uppercase tracking-wide appearance-none"
                                    >
                                        <option value="">SÉLECTIONNEZ UN ÉLÈVE...</option>
                                        {uniqueStudents.map(s => (
                                            <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-2 opacity-50">Performance (1-5)</label>
                                        <input 
                                            type="number" min="1" max="5" required
                                            value={rating}
                                            onChange={(e) => setRating(parseInt(e.target.value))}
                                            className="w-full bg-[var(--bg-section)] border border-transparent rounded-[16px] py-4 px-6 text-[11px] font-black text-[var(--text-main)] outline-none focus:bg-white focus:border-[var(--primary)]/10 shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-2 opacity-50">Présence (%)</label>
                                        <input 
                                            type="number" min="0" max="100" required
                                            value={attendance}
                                            onChange={(e) => setAttendance(parseInt(e.target.value))}
                                            className="w-full bg-[var(--bg-section)] border border-transparent rounded-[16px] py-4 px-6 text-[11px] font-black text-[var(--text-main)] outline-none focus:bg-white focus:border-[var(--primary)]/10 shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-2 opacity-50">Résumé des activités et progrès</label>
                                <textarea 
                                    required
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Décrivez les chapitres abordés, les points forts..."
                                    rows={5}
                                    className="w-full bg-[var(--bg-section)] border border-transparent rounded-[24px] py-6 px-8 text-[11px] font-bold text-[var(--text-main)] outline-none focus:bg-white focus:border-[var(--primary)]/10 shadow-inner resize-none leading-relaxed font-serif italic uppercase opacity-80"
                                />
                            </div>
 
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] ml-2 opacity-50">Objectifs du mois prochain</label>
                                <input 
                                    type="text"
                                    value={nextSteps}
                                    onChange={(e) => setNextSteps(e.target.value)}
                                    placeholder="EX: MAÎTRISE DES ÉQUATIONS DU SECOND DEGRÉ..."
                                    className="w-full bg-[var(--bg-section)] border border-transparent rounded-[16px] py-4 px-6 text-[11px] font-black text-[var(--text-main)] outline-none focus:bg-white focus:border-[var(--primary)]/10 shadow-inner uppercase tracking-wide"
                                />
                            </div>
 
                            <div className="pt-4 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="bg-[var(--text-main)] text-white px-10 py-4 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-3 disabled:opacity-50 shadow-xl shadow-[#1A1008]/10 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Expédier le Rapport
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-8">
                {isLoading ? (
                    <div className="flex justify-center py-16"><Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" /></div>
                ) : reports.map((report) => (
                    <div key={report.id} className="bg-white rounded-[40px] p-8 lg:p-10 flex flex-col md:flex-row gap-8 group hover:shadow-premium transition-all border border-[var(--border-main)]/50">
                        <div className="w-20 h-20 bg-[var(--bg-section)] rounded-[24px] flex items-center justify-center flex-shrink-0 border border-[var(--border-main)] shadow-sm group-hover:scale-110 transition-transform">
                            <FileText className="w-8 h-8 text-[var(--primary)] opacity-40" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <h4 className="text-xl lg:text-2xl font-black text-[var(--text-main)] tracking-tighter font-serif italic uppercase">{(report as any).student?.name}</h4>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-100">Envoyé</span>
                                </div>
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-20">{new Date(report.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                            </div>
                            <p className="text-[13px] text-[var(--text-main)] leading-relaxed line-clamp-2 italic font-bold opacity-60 uppercase tracking-tight">"{report.content}"</p>
                            <div className="flex flex-wrap gap-8 pt-6 border-t border-[var(--border-main)]/30 mt-4 opacity-50">
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                    <span className="text-xs font-black text-[#1A1008] uppercase tracking-widest">Score: {report.performance_rating}/5</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-[#1e1edc]" />
                                    <span className="text-xs font-black text-[#1A1008] uppercase tracking-widest">Présence: {report.attendance_percent}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {!isLoading && reports.length === 0 && (
                    <div className="py-24 text-center opacity-30">
                        <p className="text-sm font-black text-[#1A1008] uppercase tracking-[0.2em] italic">Aucun rapport envoyé.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Sub-component definitions that haven't been exported yet

export default DashboardTeacher;
