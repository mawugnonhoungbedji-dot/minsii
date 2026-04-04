import React, { useState, useEffect, useRef } from 'react';
import { 
    Layout, Building2, Users, Settings, Plus, X,
    Briefcase, CheckCircle, XCircle, Save, Edit2, Trash2,
    ChevronRight, MapPin, Phone, Mail, GraduationCap,
    Rocket, Sparkles, Zap, Award, BookOpen, Clock, BarChart3,
    Upload, ImageIcon, Shield, Loader2, AlertCircle, LogOut, User,
    MessageSquare, Send, MoreVertical, Search, ArrowUpRight, DollarSign,
    Home, Bell, Menu, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import { authService, AuthUser } from '../services/authService';
import { jobOfferService, JobOffer, JobApplication } from '../services/jobOfferService';
import { messageService, Message, Conversation } from '../services/messageService';
import BrandedLoader from './BrandedLoader';

// Sub-components
import DirectorOverview from './dashboard/DirectorOverview';
import DirectorOffers from './dashboard/DirectorOffers';
import DirectorCandidates from './dashboard/DirectorCandidates';
import DirectorProfile from './dashboard/DirectorProfile';
import DirectorMessages from './dashboard/DirectorMessages';

interface DashboardDirectorProps {
    onBack: () => void;
    user: AuthUser;
}

const EMPTY_OFFER: Omit<JobOffer, 'id' | 'created_at' | 'updated_at' | 'director_id'> = {
    title: '',
    subject: '',
    description: '',
    contract_type: 'CDI',
    salary_range: '',
    location: '',
    levels: [],
    status: 'draft',
};

const DashboardDirector: React.FC<DashboardDirectorProps> = ({ onBack, user }) => {
    // UI States
    const [activeTab, setActiveTab] = useState<'dashboard' | 'offers' | 'candidates' | 'settings' | 'messages'>('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showOfferModal, setShowOfferModal] = useState(false);

    // Data States
    const [director, setDirector] = useState<any>(user ? { ...user.profile, ...user.directorProfile } : null);
    const [offers, setOffers] = useState<JobOffer[]>([]);
    const [applications, setApplications] = useState<JobApplication[]>([]);
    
    // Chat States
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<Record<string, any>>({});
    const activeConversationRef = useRef<Conversation | null>(null);

    // Action States
    const [editingOffer, setEditingOffer] = useState<Partial<JobOffer>>(EMPTY_OFFER);
    const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const showToast = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [offersRes, applicationsRes] = await Promise.all([
                jobOfferService.getMyOffers(),
                jobOfferService.getAllMyApplications(),
            ]);
            if (offersRes.success && offersRes.data) setOffers(offersRes.data);
            if (applicationsRes.success && applicationsRes.data) setApplications(applicationsRes.data);
            await loadConversations();
        } catch (error) {
            console.error('Error loading director data:', error);
            showToast('error', 'Échec de la synchronisation.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadConversations = async () => {
        const { data, error } = await messageService.getConversations(user.profile.id);
        if (!error && data) setConversations(data);
    };

    const loadMessages = async (convUserId: string) => {
        const { data, error } = await messageService.getMessages(convUserId, user.profile.id);
        if (!error && data) {
            setChatMessages(data);
            await messageService.markAsRead(convUserId, user.profile.id);
            loadConversations();
        }
    };

    useEffect(() => { loadData(); }, []);

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
                setChatMessages(prev => [...prev, msg]);
                if (msg.receiver_id === user.profile.id) {
                    await messageService.markAsRead(msg.sender_id, user.profile.id);
                }
            } else if (msg.receiver_id === user.profile.id) {
                showToast('success', 'Nouveau message reçu !');
            }
        });

        const presenceChannel = messageService.subscribeToPresence('global', user.profile.id, (state) => {
            setOnlineUsers(state);
        });

        const applicationSub = jobOfferService.subscribeToApplications(user.profile.id, async (payload) => {
            const { data: updatedApps } = await jobOfferService.getAllMyApplications();
            if (updatedApps) setApplications(updatedApps);
            const { data: updatedOffers } = await jobOfferService.getMyOffers();
            if (updatedOffers) setOffers(updatedOffers);
            if (payload.event === 'INSERT') showToast('success', 'Nouvelle candidature !');
        });

        return () => {
            msgSubscription?.unsubscribe();
            presenceChannel?.unsubscribe();
            if (applicationSub) applicationSub.unsubscribe();
        };
    }, [user?.profile?.id]);

    const handleSaveOffer = async () => {
        if (!editingOffer.title || !editingOffer.subject) {
            showToast('error', 'Le titre et la matière sont obligatoires.');
            return;
        }
        setIsSubmittingOffer(true);
        try {
            if ((editingOffer as JobOffer).id) {
                const res = await jobOfferService.updateOffer((editingOffer as JobOffer).id, editingOffer);
                if (!res.success) throw new Error(res.error || 'Erreur mise à jour');
                showToast('success', 'Offre mise à jour !');
            } else {
                const res = await jobOfferService.createOffer(editingOffer as any);
                if (!res.success) throw new Error(res.error || 'Erreur création');
                showToast('success', 'Offre publiée !');
            }
            setShowOfferModal(false);
            loadData();
        } catch (err: any) {
            showToast('error', err.message || 'Erreur.');
        } finally {
            setIsSubmittingOffer(false);
        }
    };

    const handleDeleteOffer = async (id: string) => {
        if (!window.confirm('Supprimer cette offre ?')) return;
        const res = await jobOfferService.deleteOffer(id);
        if (!res.success) showToast('error', res.error || 'Erreur.');
        else { showToast('success', 'Supprimée.'); loadData(); }
    };

    const handleUpdateApplication = async (appId: string, status: 'accepted' | 'rejected') => {
        const res = await jobOfferService.updateApplicationStatus(appId, status);
        if (!res.success) showToast('error', res.error || 'Erreur.');
        else { showToast('success', 'Candidature mise à jour.'); loadData(); }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const res = await authService.uploadAvatar(file);
            if (!res.success || !res.data) throw new Error(res.error || 'Échec upload');
            setDirector({ ...director, avatar_url: res.data });
            showToast('success', 'Logo mis à jour !');
        } catch (error: any) {
            showToast('error', error.message || 'Échec de l\'upload.');
        } finally {
            setIsUploading(false);
        }
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

    const handleContactCandidate = (candidateId: string, candidateName: string) => {
        const existing = conversations.find(c => c.other_user_id === candidateId);
        if (existing) {
            setActiveConversation(existing);
        } else {
            setActiveConversation({
                other_user_id: candidateId,
                other_user_name: candidateName,
                other_user_avatar: '',
                last_message: 'Nouveau Contact',
                last_message_at: new Date().toISOString(),
                unread_count: 0
            });
        }
        setActiveTab('messages');
    };

    const handleUpdateDirectorProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const [profileRes, directorRes] = await Promise.all([
                authService.updateProfile({
                    name: director.name,
                    location: director.location,
                    city_village: director.city_village,
                }),
                authService.updateDirectorProfile({
                    establishment_name: director.establishment_name,
                    establishment_type: director.establishment_type,
                    phone_number: director.phone_number,
                }),
            ]);
            if (!profileRes.success) throw new Error(profileRes.error || 'Erreur profil');
            if (!directorRes.success) throw new Error(directorRes.error || 'Erreur institution');
            showToast('success', 'Profil Institutionnel Mis à Jour');
        } catch (err: any) {
            showToast('error', err.message || 'Échec de la mise à jour');
        } finally {
            setIsSaving(false);
        }
    };

    // Navigation Items
    const navItems = [
        { id: 'accueil', label: 'Accueil', icon: ArrowLeft, action: onBack },
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'offers', label: 'Recrutement', icon: Briefcase },
        { id: 'candidates', label: 'Talents', icon: Users },
        { id: 'messages', label: 'Liaison', icon: MessageSquare, badge: conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0) },
        { id: 'settings', label: 'Institut', icon: Settings }
    ];

    if (isLoading && !director) return <BrandedLoader message="Terminal de Direction..." />;

    // For compatibility with sub-components
    (window as any).setDirectorTab = setActiveTab;

    return (
        <div className="min-h-screen bg-[#FDFAF7] font-sans selection:bg-apple-blue/10 flex flex-col lg:flex-row overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-80 bg-white border-r border-black/5 flex-col p-10 relative z-50">
                <div className="flex items-center gap-4 mb-16 cursor-pointer group" onClick={onBack}>
                    <div className="w-12 h-12 bg-[#1e1edc] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                        <Building2 className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-[#111111] tracking-tight font-serif italic">Minsii <span className="text-[#1e1edc] not-italic">Royal</span></h1>
                        <p className="text-[10px] font-semibold text-gray-400 opacity-60 mt-1">Plateforme RH</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => item.action ? item.action() : setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-4 px-6 h-14 rounded-2xl transition-all relative group ${
                                activeTab === item.id 
                                ? 'bg-apple-blue text-white shadow-xl shadow-apple-blue/10' 
                                : 'text-gray-400 hover:bg-apple-gray hover:text-apple-text'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-apple-blue'}`} />
                            <span className="text-[11px] font-medium">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                                <span className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 ${
                                    activeTab === item.id ? 'bg-white text-apple-blue border-apple-blue' : 'bg-red-50 text-white border-white'
                                }`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="pt-10 border-t border-black/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-apple-gray overflow-hidden border border-black/5">
                        {director?.avatar_url ? (
                            <img src={director.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"><User className="text-gray-300 w-6 h-6" /></div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-apple-text tracking-tight truncate">{director?.name || 'Proviseur'}</p>
                        <p className="text-[9px] font-semibold text-gray-400 opacity-60">Compte Institutionnel</p>
                    </div>
                    <button onClick={onBack}>
                        <LogOut className="w-4 h-4 text-gray-300 hover:text-rose-500 transition-colors" />
                    </button>
                </div>
            </aside>

            <header className="lg:hidden h-20 bg-white border-b border-black/5 flex items-center justify-between px-6 sticky top-0 z-[60]">
                <div className="flex items-center gap-3" onClick={onBack}>
                    <div className="w-10 h-10 bg-apple-blue rounded-xl flex items-center justify-center shadow-lg">
                        <Building2 className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-sm font-bold text-apple-text tracking-tight font-serif italic">Minsii <span className="text-apple-blue not-italic">Director</span></h1>
                </div>
            </header>

            {/* Main View */}
            <main className="flex-1 overflow-y-auto relative scrollbar-hide">
                <div className="p-6 lg:p-10 lg:pb-24 max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'dashboard' && (
                                <DirectorOverview 
                                    director={director}
                                    stats={{
                                        activeOffers: offers.filter(o => o.status === 'active').length,
                                        pendingApplications: applications.filter(a => a.status === 'pending').length,
                                        validationRate: '92%'
                                    }}
                                    setActiveTab={setActiveTab}
                                />
                            )}

                            {activeTab === 'offers' && (
                                <DirectorOffers 
                                    offers={offers}
                                    setShowOfferModal={setShowOfferModal}
                                    setEditingOffer={setEditingOffer}
                                    handleDeleteOffer={handleDeleteOffer}
                                    EMPTY_OFFER={EMPTY_OFFER}
                                />
                            )}

                            {activeTab === 'candidates' && (
                                <DirectorCandidates 
                                    applications={applications}
                                    handleUpdateApplication={handleUpdateApplication}
                                    handleContactCandidate={handleContactCandidate}
                                />
                            )}

                            {activeTab === 'messages' && (
                                <DirectorMessages 
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

                            {activeTab === 'settings' && (
                                <DirectorProfile 
                                    director={director}
                                    setDirector={setDirector}
                                    isSaving={isSaving}
                                    isUploading={isUploading}
                                    handleUpdateDirectorProfile={handleUpdateDirectorProfile}
                                    handleAvatarUpload={handleAvatarUpload}
                                    onBack={onBack}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="lg:hidden h-20 bg-white border-t border-black/5 px-6 flex items-center justify-between fixed bottom-0 left-0 right-0 z-[60]">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`flex flex-col items-center gap-1.5 transition-all ${
                            activeTab === item.id ? 'text-apple-blue' : 'text-gray-400'
                        }`}
                    >
                        <div className="relative">
                            <item.icon className="w-6 h-6" />
                            {item.badge && item.badge > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        <span className="text-[9px] font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Offer Modal */}
             {showOfferModal && (
                <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-6 lg:p-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="bg-white rounded-[2.5rem] lg:rounded-[4rem] shadow-4xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-black/5 relative p-8 lg:p-14 scrollbar-hide"
                    >
                        <button onClick={() => setShowOfferModal(false)} className="absolute top-8 lg:top-12 right-8 lg:right-12 p-3 bg-apple-gray rounded-full hover:rotate-90 hover:bg-rose-50 hover:text-rose-500 transition-all">
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="mb-10 lg:mb-14">
                            <h2 className="text-3xl lg:text-4xl font-black text-apple-text tracking-tight mb-2 italic font-serif">Architecture d'Offre</h2>
                            <p className="text-gray-500 font-medium italic opacity-60">Définissez les paramètres de votre futur recrutement.</p>
                        </div>

                        <div className="space-y-8 lg:space-y-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 opacity-60">Titre du Poste Strategic *</label>
                                <input
                                    type="text"
                                    value={editingOffer.title || ''}
                                    onChange={e => setEditingOffer(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full bg-apple-gray px-6 py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-apple-text outline-none focus:bg-white border-2 border-transparent focus:border-apple-blue/10 transition-all"
                                    placeholder="Ex: Professeur de Mathématiques - Série Expert"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 opacity-60">Corps de Métier *</label>
                                    <input
                                        type="text"
                                        value={editingOffer.subject || ''}
                                        onChange={e => setEditingOffer(prev => ({ ...prev, subject: e.target.value }))}
                                        className="w-full bg-apple-gray px-6 py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-apple-text outline-none focus:bg-white border-2 border-transparent focus:border-apple-blue/10 transition-all"
                                        placeholder="Ex: Physique"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 opacity-60">Protocole de Contrat</label>
                                    <select
                                        value={editingOffer.contract_type || 'CDI'}
                                        onChange={e => setEditingOffer(prev => ({ ...prev, contract_type: e.target.value }))}
                                        className="w-full bg-apple-gray px-6 py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-apple-text outline-none focus:bg-white border-2 border-transparent focus:border-apple-blue/10 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="CDI">CDI - Long Terme</option>
                                        <option value="CDD">CDD - Mission</option>
                                        <option value="Vacataire">Vacataire - Flux</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 opacity-60">Budget Mensuel Proposé</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                                    <input
                                        type="text"
                                        value={editingOffer.salary_range || ''}
                                        onChange={e => setEditingOffer(prev => ({ ...prev, salary_range: e.target.value }))}
                                        className="w-full bg-apple-gray pl-14 pr-6 py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-apple-text outline-none focus:bg-white border-2 border-transparent focus:border-apple-blue/10 transition-all"
                                        placeholder="Ex: 250.000 - 400.000 FCFA"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 opacity-60">Manifeste du Poste</label>
                                <textarea
                                    rows={4}
                                    value={editingOffer.description || ''}
                                    onChange={e => setEditingOffer(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full bg-apple-gray p-6 rounded-xl lg:rounded-2xl font-medium text-apple-text outline-none focus:bg-white border-2 border-transparent focus:border-apple-blue/10 transition-all resize-none italic"
                                    placeholder="Décrivez les attentes et la vision pedagogique du poste..."
                                />
                            </div>

                            <div className="pt-6 flex flex-col md:flex-row gap-4">
                                <button
                                    onClick={handleSaveOffer}
                                    disabled={isSubmittingOffer}
                                    className="flex-1 h-16 bg-apple-blue text-white rounded-2xl font-bold text-xs shadow-xl shadow-apple-blue/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSubmittingOffer ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingOffer as JobOffer).id ? 'Actualiser l\'Offre' : 'Publier l\'Offre'}
                                </button>
                                <button
                                    onClick={() => setShowOfferModal(false)}
                                    className="flex-1 h-16 bg-apple-gray text-apple-text rounded-2xl font-bold text-xs hover:bg-apple-gray/80 transition-all"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Notification Toast */}
            <AnimatePresence>
                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-24 lg:bottom-10 right-6 lg:right-10 z-[110] flex items-center gap-4 px-8 py-5 rounded-2xl shadow-3xl border border-white/20 ${
                            message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                        }`}
                    >
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <p className="text-[11px] font-bold tracking-tight">{message.text}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardDirector;
