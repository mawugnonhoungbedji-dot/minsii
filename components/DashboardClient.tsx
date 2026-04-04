import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
    Layout, Star, Clock, Settings, Search, MessageSquare, 
    User, LogOut, ChevronRight, Zap, TrendingUp, Shield,
    Bell, Menu, X, ArrowUpRight, Home, FileText, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import { authService, AuthUser } from '../services/authService';
import { bookingService, Booking } from '../services/bookingService';
import { messageService, Message, Conversation } from '../services/messageService';
import { reportService, MonthlyReport } from '../services/reportService';
import { Teacher } from '../types';
import { teacherService } from '../services/teacherService';
import BrandedLoader from './BrandedLoader';

// Sub-components
import ClientOverview from './dashboard/ClientOverview';
import ClientHistory from './dashboard/ClientHistory';
import ClientFavorites from './dashboard/ClientFavorites';
import ClientProfile from './dashboard/ClientProfile';
import ClientMessages from './dashboard/ClientMessages';
import ReviewModal from './ReviewModal';

interface DashboardClientProps {
    onBack: () => void;
    user: AuthUser;
}

const DashboardClient: React.FC<DashboardClientProps> = ({ onBack, user }) => {
    // UI States
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'favorites' | 'messages' | 'settings' | 'progress'>('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showRatingModal, setShowRatingModal] = useState<{ id: string; name: string } | null>(null);

    // Data States
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [favorites, setFavorites] = useState<Teacher[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<Teacher[]>([]);
    const [initialSuggestions, setInitialSuggestions] = useState<Teacher[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchResults, setSearchResults] = useState<Teacher[]>([]);

    // Chat States
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<Record<string, any>>({});
    const activeConversationRef = useRef<Conversation | null>(null);

    // Profile Edit State
    const [editProfile, setEditProfile] = useState({
        name: user.profile.name || '',
        location: user.profile.location || '',
        city_village: user.profile.city_village || '',
        level: user.studentProfile?.level || '',
        goals: user.studentProfile?.goals || '',
        avatar_url: user.profile.avatar_url || ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const showToast = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    // Data Loading
    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            const [bookingsRes, favRes] = await Promise.all([
                bookingService.getClientBookings(),
                bookingService.getFavorites()
            ]);
            
            if (bookingsRes.success) setBookings(bookingsRes.data || []);
            if (favRes.success) setFavorites(favRes.data || []);
            
            await loadInitialSuggestions();
            await loadConversations();
        } catch (error) {
            console.error('Error loading dashboard:', error);
            showToast('error', 'Erreur de synchronisation.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadInitialSuggestions = async () => {
        try {
            const res = await teacherService.getAllTeachers();
            if (res.success && res.data) {
                // Pre-filter with "verified" status if needed, but getAllTeachers already does it.
                const teachers = res.data.slice(0, 5);
                setInitialSuggestions(teachers);
                setSuggestions(teachers);
            }
        } catch (error) {
            console.error('[DashboardClient] loadInitialSuggestions error:', error);
        }
    };

    const loadConversations = async () => {
        const { data, error } = await messageService.getConversations(user.profile.id);
        if (!error && data) setConversations(data);
    };

    const loadMessages = async (otherUserId: string) => {
        const { data, error } = await messageService.getMessages(otherUserId, user.profile.id);
        if (!error && data) {
            setChatMessages(data);
            await messageService.markAsRead(otherUserId, user.profile.id);
            loadConversations();
        }
    };

    // Effects
    useEffect(() => { loadDashboardData(); }, []);

    // Handle incoming navigation intent (e.g. from TeacherProfilePublic)
    useEffect(() => {
        if (location.state) {
            const { tab, contactTeacherId } = location.state as any;
            if (tab) setActiveTab(tab);
            
            if (contactTeacherId && tab === 'messages') {
                const existing = conversations.find(c => c.other_user_id === contactTeacherId);
                if (existing) {
                    setActiveConversation(existing);
                } else if (!activeConversation || activeConversation.other_user_id !== contactTeacherId) {
                    // Placeholder for a new discussion
                    const placeholder: Conversation = {
                        other_user_id: contactTeacherId,
                        other_user_name: 'Mentor...',
                        other_user_avatar: '',
                        last_message: 'Nouveau message...',
                        last_message_at: new Date().toISOString(),
                        unread_count: 0
                    };
                    setActiveConversation(placeholder);
                    // Fetch real info
                    supabase.from('profiles').select('name, avatar_url').eq('id', contactTeacherId).single()
                        .then(({ data }) => {
                            if (data) {
                                setActiveConversation(prev => prev?.other_user_id === contactTeacherId ? {
                                    ...prev,
                                    other_user_name: data.name,
                                    other_user_avatar: data.avatar_url
                                } : prev);
                            }
                        });
                }
            }
        }
    }, [location.state, conversations.length]);

    useEffect(() => {
        if (!user?.profile?.id) return;activeConversationRef.current = activeConversation;
        if (activeConversation) {
            loadMessages(activeConversation.other_user_id);
        }
    }, [activeConversation]);

    useEffect(() => {
        if (!user?.profile?.id) return;

        // Message Subscription
        const msgSub = messageService.subscribeToMessages(user.profile.id, async (payload) => {
            const msg = payload.new as Message;
            if (!msg) return;
            loadConversations();
            
            const currentConv = activeConversationRef.current;
            if (currentConv && (msg.sender_id === currentConv.other_user_id || msg.receiver_id === currentConv.other_user_id)) {
                setChatMessages(prev => [...prev, msg]);
                if (msg.receiver_id === user.profile.id) {
                    await messageService.markAsRead(msg.sender_id, user.profile.id);
                }
            } else if (msg.receiver_id === user.profile.id) {
                showToast('success', 'Nouveau message reçu !');
            }
        });

        // Presence Subscription
        const presenceChannel = messageService.subscribeToPresence('global', user.profile.id, (state) => {
            setOnlineUsers(state);
        });

        return () => {
            msgSub?.unsubscribe();
            presenceChannel?.unsubscribe();
        };
    }, [user?.profile?.id]);

    // Update suggestions based on search term
    useEffect(() => {
        if (searchTerm.length >= 1) {
            const term = searchTerm.toLowerCase();
            const filtered = initialSuggestions.filter(t => 
                t.name.toLowerCase().includes(term) || 
                t.subject.toLowerCase().includes(term)
            );
            
            if (filtered.length > 0) {
                setSuggestions(filtered);
            } else {
                // Should potentially fetch from DB if local filter yields nothing
                // For now, keep suggestions empty or minimal
                setSuggestions([]);
            }
        } else {
            setSuggestions(initialSuggestions);
        }
    }, [searchTerm, initialSuggestions]);

    // Handlers
    const handleSearch = async () => {
        if (searchTerm.length < 2) return;
        setIsLoading(true);
        // NOTE: 'subjects' est un tableau (text[]) — ilike ne fonctionne pas sur les arrays.
        // On effectue la recherche sur les colonnes texte 'bio' et 'education'.
        const { data, error } = await supabase
            .from('teacher_profiles')
            .select('*, profiles(name, avatar_url, location, city_village)')
            .or(`bio.ilike.%${searchTerm}%,education.ilike.%${searchTerm}%,subjects.ov.{${searchTerm.toLowerCase()}}`) // .ov. is overlap in PostgREST for arrays
            .limit(10);
        
        if (!error && data) {
            const teachers: Teacher[] = data.map((t: any) => ({
                id: t.id,
                name: t.profiles?.name || 'Mentor',
                avatar: t.profiles?.avatar_url || '',
                subject: (t.subjects as string[])?.[0] || 'Soutien Scolaire',
                rating: t.rating || 5.0,
                location: t.profiles?.city_village || t.profiles?.location || 'Bénin',
                experience: `${t.experience_years || 0} ans`,
                hourlyRate: t.hourly_rate || 0,
                bio: t.bio || '',
                badges: t.is_verified ? ['Vérifié'] : [],
                levels: t.levels || [],
                education: t.education || '',
                availability: t.availability || [],
                phoneNumber: t.phone_number || '',
                reviewsCount: t.reviews_count || 0,
                isMatch: true
            }));
            setSearchResults(teachers);
            setActiveTab('dashboard');
        }
        setIsLoading(false);
    };

    const handleClearSearch = () => {
        setSearchResults([]);
        setSearchTerm('');
        setShowSuggestions(false);
    };

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
            showToast('error', 'Échec de transmission.');
        } finally {
            setIsSending(false);
        }
    };

    const handleToggleFavorite = async (teacherId: string) => {
        const isFav = favorites.some(f => f.id === teacherId);
        
        // Optimistic Update
        if (isFav) {
            setFavorites(prev => prev.filter(f => f.id !== teacherId));
            const res = await bookingService.removeFavorite(teacherId);
            if (!res.success) {
                showToast('error', 'Erreur lors du retrait des favoris');
                loadDashboardData(); // Rollback
            } else {
                showToast('success', 'Retiré des favoris');
            }
        } else {
            // Find teacher in search results or current favorites to add
            const teacherToAdd = searchResults.find(t => t.id === teacherId);
            if (teacherToAdd) {
                setFavorites(prev => [...prev, teacherToAdd]);
            }
            
            const res = await bookingService.addFavorite(teacherId);
            if (!res.success) {
                showToast('error', 'Erreur lors de l\'ajout aux favoris');
                loadDashboardData(); // Rollback
            } else {
                showToast('success', 'Ajouté aux favoris !');
                if (!teacherToAdd) loadDashboardData(); // Fetch full data if not in local results
            }
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const [pRes, cRes] = await Promise.all([
                authService.updateProfile({
                    name: editProfile.name,
                    location: editProfile.location,
                    city_village: editProfile.city_village,
                }),
                authService.updateClientProfile({
                    level: editProfile.level,
                    goals: editProfile.goals,
                })
            ]);
            
            if (pRes.success && cRes.success) {
                showToast('success', 'Profil synchronisé !');
            } else {
                throw new Error('Erreur de mise à jour');
            }
        } catch (err) {
            showToast('error', 'Échec de la sauvegarde.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const res = await authService.uploadAvatar(file);
            if (res.success && res.data) {
                setEditProfile({ ...editProfile, avatar_url: res.data });
                showToast('success', 'Photo mise à jour !');
            }
        } catch (err) {
            showToast('error', 'Échec de l\'upload.');
        } finally {
            setIsUploading(false);
        }
    };

    // Navigation Items
    const navItems = [
        { id: 'accueil', label: 'Accueil', icon: ArrowLeft, action: onBack },
        { id: 'dashboard', label: 'Espace', icon: Home },
        { id: 'favorites', label: 'Favoris', icon: Star },
        { id: 'history', label: 'Activités', icon: Clock },
        { id: 'messages', label: 'Messages', icon: MessageSquare, badge: conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0) },
        { id: 'progress', label: 'Progrès', icon: FileText },
        { id: 'settings', label: 'Compte', icon: Settings }
    ];

    if (isLoading && !bookings.length) return <BrandedLoader message="Liaison au Terminal Client..." />;

    return (
        <div className="min-h-screen bg-[var(--bg-main)] font-body selection:bg-[var(--primary)]/10 flex flex-col lg:flex-row overflow-hidden text-[var(--text-main)]">
            {/* Desktop Sidebar - Serenity Floating Style */}
            <aside className="hidden lg:flex w-72 bg-[var(--bg-main)] border-r border-[var(--border-main)]/50 flex-col p-8 relative z-50">
                <div className="flex items-center gap-4 mb-12 cursor-pointer group" onClick={onBack}>
                    <div className="w-10 h-10 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:rotate-6 transition-transform">
                        <TrendingUp className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-[var(--text-main)] tracking-tight font-serif italic leading-none">Minsii <span className="text-[var(--primary)] not-italic">Elite</span></h1>
                        <p className="text-[10px] font-semibold text-[var(--text-muted)] opacity-60 mt-1">Espace Étudiant</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => item.action ? item.action() : setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-4 px-6 h-12 rounded-2xl transition-all relative group ${
                                activeTab === item.id 
                                ? 'bg-[var(--primary)] text-white shadow-xl shadow-blue-500/10' 
                                : 'text-[var(--text-muted)] hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-[var(--primary)] opacity-50 group-hover:opacity-100'}`} />
                            <span className="text-[11px] font-medium">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                                <span className={`ml-auto w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black ${
                                    activeTab === item.id ? 'bg-white text-[var(--primary)]' : 'bg-[var(--primary)] text-white'
                                }`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="pt-8 border-t border-[var(--border-main)]/50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white overflow-hidden border border-[var(--border-main)] p-1">
                        {user.profile.avatar_url ? (
                            <img src={user.profile.avatar_url} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[var(--bg-section)]"><User className="text-[var(--text-muted)] w-5 h-5" /></div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--text-main)] truncate tracking-tight">{user.profile.name || 'Étudiant'}</p>
                        <p className="text-[10px] font-semibold text-[var(--primary)] opacity-70 mt-0.5">Membre Premium</p>
                    </div>
                    <button onClick={onBack} title="Quitter" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-500/10 hover:text-rose-500 text-[var(--text-muted)] opacity-50 transition-all">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </aside>

            {/* Mobile Navigation Header - Refined */}
            <header className="lg:hidden h-20 bg-[var(--bg-main)] flex items-center justify-between px-6 sticky top-0 z-[60] border-b border-[var(--border-main)]/50">
                <div className="flex items-center gap-3" onClick={onBack}>
                    <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-md">
                        <TrendingUp className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-[var(--text-main)] tracking-tight font-serif italic leading-none">Minsii <span className="text-[var(--primary)] not-italic">Elite</span></h1>
                        <p className="text-[10px] font-semibold text-[var(--text-muted)] mt-1 opacity-60">Espace Étudiant</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white overflow-hidden border border-[var(--border-main)] p-1">
                        {user.profile.avatar_url ? (
                            <img src={user.profile.avatar_url} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[var(--bg-section)]"><User className="text-[var(--text-muted)] w-5 h-5" /></div>
                        )}
                    </div>
                </div>
            </header>


            {/* Main Content View */}
            <main className="flex-1 overflow-y-auto relative scrollbar-hide">
                <div className="p-8 lg:p-14 lg:pb-32 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            {activeTab === 'dashboard' && (
                                <ClientOverview 
                                    user={user}
                                    stats={{
                                        favoritesCount: favorites.length,
                                        bookingsCount: bookings.length,
                                        unreadMessages: conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0)
                                    }}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    showSuggestions={showSuggestions}
                                    setShowSuggestions={setShowSuggestions}
                                    suggestions={suggestions}
                                    loadInitialSuggestions={async () => {
                                        try {
                                            const res = await teacherService.getAllTeachers();
                                            if (res.success && res.data) {
                                                setInitialSuggestions(res.data.slice(0, 5));
                                            }
                                        } catch (err) {
                                            console.error('Error loading initial suggestions:', err);
                                        }
                                    }}
                                    handleSearch={handleSearch}
                                    setSearchResults={setSearchResults}
                                    searchResults={searchResults}
                                    onClearSearch={handleClearSearch}
                                    setActiveTab={setActiveTab}
                                    onTeacherClick={(t) => {
                                        window.open(`/public-profile?prof=${t.id}`, '_blank');
                                    }}
                                />
                            )}

                            {activeTab === 'history' && (
                                <ClientHistory 
                                    bookings={bookings}
                                    isLoading={isLoading}
                                    setShowRatingModal={(id) => {
                                        const teacher = bookings.find(b => b.teacher_id === id)?.teacher_profiles;
                                        if (teacher) {
                                            setShowRatingModal({ 
                                                id, 
                                                name: teacher.profiles?.name || 'Mentor' 
                                            });
                                        }
                                    }}
                                />
                            )}

                            {activeTab === 'favorites' && (
                                <ClientFavorites 
                                    favorites={favorites}
                                    handleToggleFavorite={handleToggleFavorite}
                                    setActiveTab={setActiveTab}
                                    onTeacherClick={(t) => {
                                        window.open(`/public-profile?prof=${t.id}`, '_blank');
                                    }}
                                />
                            )}

                            {activeTab === 'messages' && (
                                <ClientMessages 
                                    conversations={conversations}
                                    activeConversation={activeConversation}
                                    setActiveConversation={setActiveConversation}
                                    chatMessages={chatMessages}
                                    newMessage={newMessage}
                                    setNewMessage={setNewMessage}
                                    handleSendMessage={handleSendMessage}
                                    isSending={isSending}
                                    onlineUsers={onlineUsers}
                                    userProfileId={user.profile.id}
                                />
                            )}
                            {activeTab === 'progress' && (
                                <ClientProgress 
                                    user={user}
                                />
                            )}

                            {activeTab === 'settings' && (
                                <ClientProfile 
                                    editProfile={editProfile}
                                    setEditProfile={setEditProfile}
                                    isSaving={isSaving}
                                    isUploading={isUploading}
                                    handleSaveProfile={handleSaveProfile}
                                    handleAvatarUpload={handleAvatarUpload}
                                    onBack={onBack}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Mobile Bottom Navigation - Serenity Style */}
            <nav className="lg:hidden h-20 bg-[var(--bg-main)] border-t border-[var(--border-main)]/50 px-6 flex items-center justify-between fixed bottom-0 left-0 right-0 z-[60] shadow-[0_-10px_30px_rgba(30,30,220,0.05)]">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`flex flex-col items-center gap-1.5 transition-all ${
                            activeTab === item.id ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] opacity-50'
                        }`}
                    >
                        <div className="relative">
                            <item.icon className="w-5 h-5" />
                            {item.badge && item.badge > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--primary)] text-white text-[8px] font-black rounded-lg border-2 border-[var(--bg-main)] flex items-center justify-center">
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        <span className="text-[9px] font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Review Modal Integration */}
            {showRatingModal && (
                <ReviewModal 
                    teacherId={showRatingModal.id}
                    teacherName={showRatingModal.name}
                    onClose={() => setShowRatingModal(null)}
                    onSubmit={() => {
                        showToast('success', 'Avis publié !');
                        loadDashboardData();
                    }}
                />
            )}

            {/* Toast Notifications */}
            <AnimatePresence>
                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-24 lg:bottom-10 right-6 lg:right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
                            message.type === 'success' 
                            ? 'bg-emerald-500 text-white border-white/20' 
                            : 'bg-rose-500 text-white border-white/20'
                        }`}
                    >
                        {message.type === 'success' ? <Bell className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                        <p className="text-[10px] font-bold uppercase tracking-widest">{message.text}</p>
                        <button onClick={() => setMessage(null)} className="ml-4 opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

function ClientProgress({ user }: { user: AuthUser }) {
    const [reports, setReports] = useState<MonthlyReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadReports = async () => {
        setIsLoading(true);
        const res = await reportService.getStudentReports(user.profile.id);
        if (res.success && res.data) setReports(res.data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadReports();
    }, []);

    return (
        <div className="space-y-12 animate-soft-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-[#1A1008] tracking-tighter mb-4 italic font-serif">Tableau de Progrès</h2>
                    <p className="text-[#5C5248] font-medium text-base lg:text-lg opacity-70">Suivez l'évolution académique au fil des mois avec vos mentors.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-10">
                {isLoading ? (
                    <div className="flex justify-center py-32"><BrandedLoader message="Récupération du carnet de notes..." /></div>
                ) : reports.map((report) => (
                    <div key={report.id} className="bg-white rounded-[48px] p-10 lg:p-14 border border-[#1A1008]/5 shadow-premium group hover:shadow-2xl transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1e1edc]/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000" />
                        
                        <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                            <div className="w-24 h-24 bg-[#FDFAF7] rounded-[32px] flex items-center justify-center flex-shrink-0 border border-[#1A1008]/5 shadow-inner">
                                <FileText className="w-10 h-10 text-[#1e1edc]" />
                            </div>
                            
                            <div className="flex-1 space-y-8">
                                <div className="flex flex-wrap items-center justify-between gap-10">
                                    <div>
                                        <h3 className="text-3xl font-black text-[#1A1008] tracking-tighter mb-2 italic font-serif">Rapport de {(report as any).teacher?.name}</h3>
                                        <p className="text-[10px] font-semibold text-[#1e1edc] uppercase tracking-wider opacity-60">{new Date(report.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center bg-[#FDFAF7] px-8 py-4 rounded-[24px] border border-[#1A1008]/5 shadow-sm">
                                            <p className="text-[9px] font-black text-[#1A1008]/30 uppercase tracking-widest mb-2">Score</p>
                                            <div className="flex items-center justify-center gap-2 text-amber-500">
                                                <Star size={16} className="fill-amber-500" />
                                                <span className="text-lg font-bold">{report.performance_rating}/5</span>
                                            </div>
                                        </div>
                                        <div className="text-center bg-[#FDFAF7] px-8 py-4 rounded-[24px] border border-[#1A1008]/5 shadow-sm">
                                            <p className="text-[9px] font-black text-[#1A1008]/30 uppercase tracking-widest mb-2">Présence</p>
                                            <div className="text-[#1e1edc] text-lg font-bold">
                                                {report.attendance_percent}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 bg-[#FDFAF7] rounded-[40px] border border-[#1A1008]/5 relative group/content">
                                    <div className="mb-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-1.5 h-1.5 bg-[#1e1edc] rounded-full" />
                                            <h4 className="text-[10px] font-black text-[#1A1008]/40 uppercase tracking-[0.3em]">Analyse du Mentor</h4>
                                        </div>
                                        <p className="text-base text-[#5C5248] leading-relaxed font-bold italic">"{report.content}"</p>
                                    </div>
                                    
                                    {report.next_steps && (
                                        <div className="pt-8 border-t border-[#1A1008]/5">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                <h4 className="text-[10px] font-black text-[#1A1008]/40 uppercase tracking-[0.3em]">Prochains Objectifs</h4>
                                            </div>
                                            <p className="text-xs font-black text-[#1A1008] uppercase tracking-[0.15em] leading-relaxed">{report.next_steps}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {!isLoading && reports.length === 0 && (
                    <div className="bg-white rounded-[48px] py-32 text-center opacity-30 border border-dashed border-[#1A1008]/20">
                        <FileText className="w-16 h-16 mx-auto mb-6 text-[#1A1008]" />
                        <p className="font-black text-sm uppercase tracking-[0.3em] mb-4">Carnet de bord vide</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">Votre mentor publiera votre premier rapport d'ici la fin du mois.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardClient;
