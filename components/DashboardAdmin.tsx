import React, { useState, useEffect, useRef } from 'react';
import {
    Layout, Users, ShieldCheck, AlertCircle, CheckCircle, XCircle,
    TrendingUp, BarChart3, Settings, Search, Filter, MoreVertical,
    FileText, UserCheck, UserPlus, MessageSquare, Ban, Eye,
    ChevronDown, ChevronRight, ChevronLeft, ArrowUpRight, ArrowDownRight,
    Star, Award, Zap, Globe, Lock, GraduationCap, Clock,
    Shield, User, X, Loader2, Upload, ImageIcon, Save, LogOut, Sparkles, Activity, Building2,
    Paperclip, Smile, Send, Mail, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService, AuthUser } from '../services/authService';
import { adminService, AdminStats, PendingTeacher, PendingInstitution } from '../services/adminService';
import { supabase } from '../services/supabaseClient';
import BrandedLoader from './BrandedLoader';
import { messageService, Message, Conversation } from '../services/messageService';
import SearchableSelect from './SearchableSelect';

interface DashboardAdminProps {
    onBack: () => void;
    user: AuthUser;
}

const DashboardAdmin: React.FC<DashboardAdminProps> = ({ onBack, user }) => {
    const [admin, setAdmin] = useState<any>(user?.profile || null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'users' | 'messages' | 'liaison' | 'settings'>('overview');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem('minsii_admin_sidebar_collapsed');
        return saved ? saved === 'true' : false;
    });

    // Population State
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        totalTeachers: 0,
        pendingVerifications: 0,
        activeMatches: 0,
        growth: '0%'
    });

    const [pendingTeachers, setPendingTeachers] = useState<PendingTeacher[]>([]);
    const [pendingInstitutions, setPendingInstitutions] = useState<PendingInstitution[]>([]);

    // Chat states
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [onlineUsers, setOnlineUsers] = useState<Record<string, any>>({});
    const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const activeConversationRef = useRef<Conversation | null>(null);
    const typingChannelRef = useRef<any>(null);

    // Audit State
    const [selectedAudit, setSelectedAudit] = useState<PendingTeacher | PendingInstitution | null>(null);
    const [auditType, setAuditType] = useState<'teacher' | 'institution' | null>(null);
    const [revisionFeedback, setRevisionFeedback] = useState('');
    const [showRevisionModal, setShowRevisionModal] = useState(false);

    // Communications State
    const [notifications, setNotifications] = useState<any[]>([]);
    const [newNotification, setNewNotification] = useState({ title: '', content: '', type: 'info' as any, receiverId: null as string | null });

    useEffect(() => {
        activeConversationRef.current = activeConversation;
    }, [activeConversation]);

    useEffect(() => {
        const loadAdminData = async () => {
            setIsLoading(true);
            try {
                const [statsRes, pendingTeachersRes, pendingInstitutionsRes, convRes, usersRes, notifyRes] = await Promise.all([
                    adminService.getDashboardStats(),
                    adminService.getPendingTeachers(),
                    adminService.getPendingInstitutions(),
                    messageService.getConversations(user.profile.id),
                    adminService.getAllUsers(),
                    adminService.getAdminNotifications()
                ]);

                if (statsRes.success && statsRes.data) setStats(statsRes.data);
                if (pendingTeachersRes.success && pendingTeachersRes.data) setPendingTeachers(pendingTeachersRes.data);
                if (pendingInstitutionsRes.success && pendingInstitutionsRes.data) setPendingInstitutions(pendingInstitutionsRes.data);
                if (convRes.data) setConversations(convRes.data);
                if (usersRes.success && usersRes.data) setUsers(usersRes.data);
                if (notifyRes.success && notifyRes.data) setNotifications(notifyRes.data);
            } catch (error) {
                console.error('Error loading admin data:', error);
                showMessage('error', 'Échec de la synchronisation des données.');
            } finally {
                setIsLoading(false);
            }
        };
        loadAdminData();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (activeTab === 'messages' && activeConversation) scrollToBottom();
    }, [chatMessages, activeConversation]);

    useEffect(() => {
        if (!user?.profile?.id) return;

        const msgSubscription = messageService.subscribeToMessages(user.profile.id, async (payload) => {
            const msg = payload.new as Message;
            if (!msg) return;
            const { data: freshConversations } = await messageService.getConversations(user.profile.id);
            if (freshConversations) setConversations(freshConversations);

            const currentConv = activeConversationRef.current;
            if (currentConv && (msg.sender_id === currentConv.other_user_id || msg.receiver_id === currentConv.other_user_id)) {
                setChatMessages(prev => {
                    if (prev.find(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
                if (msg.receiver_id === user.profile.id) {
                    await messageService.markAsRead(msg.sender_id, user.profile.id);
                }
            } else if (msg.receiver_id === user.profile.id) {
                showMessage('success', 'Nouveau message reçu !');
            }
        });

        const presenceChannel = messageService.subscribeToPresence('global', user.profile.id, (state) => {
            setOnlineUsers(state);
        });

        const typingChannel = messageService.subscribeToTyping('global', (payload) => {
            const { userId, isTyping } = payload.payload;
            if (userId !== user.profile.id) setTypingUsers(prev => ({ ...prev, [userId]: isTyping }));
        });
        typingChannelRef.current = typingChannel;

        return () => {
            msgSubscription?.unsubscribe();
            presenceChannel?.unsubscribe();
            typingChannel?.unsubscribe();
        };
    }, [user?.profile?.id]);

    useEffect(() => {
        if (!user?.profile?.id) return;

        // Subscribe to administrative signals (Liaison Hub)
        const notifySub = adminService.subscribeToAdminNotifications(async () => {
            const res = await adminService.getAdminNotifications();
            if (res.success && res.data) setNotifications(res.data);
        });

        // Subscribe to profile status changes to keep Population Index in sync
        const teacherSub = adminService.subscribeToTeacherVerifications(async () => {
            const [usersRes, statsRes] = await Promise.all([
                adminService.getAllUsers(),
                adminService.getDashboardStats()
            ]);
            if (usersRes.success) setUsers(usersRes.data);
            if (statsRes.success) setStats(statsRes.data);
        });

        const instSub = adminService.subscribeToInstitutionVerifications(async () => {
            const [usersRes, statsRes] = await Promise.all([
                adminService.getAllUsers(),
                adminService.getDashboardStats()
            ]);
            if (usersRes.success) setUsers(usersRes.data);
            if (statsRes.success) setStats(statsRes.data);
        });

        return () => {
            notifySub?.unsubscribe();
            teacherSub?.unsubscribe();
            instSub?.unsubscribe();
        };
    }, [user?.profile?.id]);

    useEffect(() => {
        if (activeConversation) {
            const loadMessages = async () => {
                const { data } = await messageService.getMessages(activeConversation.other_user_id, user.profile.id);
                if (data) setChatMessages(data);
                await messageService.markAsRead(activeConversation.other_user_id, user.profile.id);
                const convs = await messageService.getConversations(user.profile.id);
                if (convs.data) setConversations(convs.data);
            };
            loadMessages();
        }
    }, [activeConversation]);

    const toggleSidebar = () => {
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem('minsii_admin_sidebar_collapsed', String(newState));
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            const { success, error } = await authService.updateProfile({
                name: admin.name,
                avatar_url: admin.avatar_url
            });
            if (!success) throw new Error(error || 'Échec de sauvegarde');
            showMessage('success', 'Protocole Minsii Mis à Jour');
        } catch (err: any) {
            showMessage('error', err.message || 'Échec de la Transmission');
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
            if (!res.success || !res.data) throw new Error(res.error || 'Échec upload');
            setAdmin({ ...admin, avatar_url: res.data });
            await authService.updateProfile({ avatar_url: res.data });
            showMessage('success', 'Protocole d\'Identification Mis à Jour');
        } catch (err: any) {
            showMessage('error', err.message || 'Échec de la Transmission');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeConversation || !newMessage.trim() || isSending) return;
        const content = newMessage.trim();
        setIsSending(true);
        setNewMessage('');
        try {
            const { data, error } = await messageService.sendMessage(activeConversation.other_user_id, content, user.profile.id);
            if (!error && data) {
                setChatMessages(prev => [...prev, data]);
                const { data: fresh } = await messageService.getConversations(user.profile.id);
                if (fresh) setConversations(fresh);
            }
        } catch (err) {
            showMessage('error', 'Transmission Interrompue');
        } finally {
            setIsSending(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: any, feedback?: string) => {
        setIsSending(true);
        try {
            const { success, error } = await adminService.updateVerificationStatus({
                userId: id,
                status,
                feedback
            });

            if (success) {
                // Refresh local lists
                setPendingTeachers(prev => prev.filter(t => t.id !== id));
                setPendingInstitutions(prev => prev.filter(i => i.id !== id));
                
                // Refresh stats
                const statsRes = await adminService.getDashboardStats();
                if (statsRes.success) setStats(statsRes.data);

                showMessage('success', `Statut mis à jour : ${status}`);
                setSelectedAudit(null);
                setShowRevisionModal(false);
                setRevisionFeedback('');
            } else {
                showMessage('error', error || 'Échec de la mise à jour');
            }
        } catch (error) {
            showMessage('error', 'Erreur de protocole administrative');
        } finally {
            setIsSending(false);
        }
    };

    const handleSendNotification = async () => {
        if (!newNotification.title || !newNotification.content) return;
        setIsSending(true);
        try {
            const { success, error } = await adminService.sendNotification(newNotification);
            if (success) {
                showMessage('success', 'Communication Diffusée');
                setNewNotification({ title: '', content: '', type: 'info', receiverId: null });
                const { data } = await adminService.getAdminNotifications();
                if (data) setNotifications(data);
            } else {
                showMessage('error', error || 'Échec de Transmission');
            }
        } catch (error) {
            showMessage('error', 'Signal Interrompu');
        } finally {
            setIsSending(false);
        }
    };

    const handleVerify = (id: string, verified: boolean) => {
        handleUpdateStatus(id, verified ? 'verified' : 'rejected');
    };

    const handleVerifyInstitution = (id: string, verified: boolean) => {
        handleUpdateStatus(id, verified ? 'verified' : 'rejected');
    };

    if (isLoading && !admin) return <BrandedLoader message="Initialisation du Terminal Core..." />;

    if (admin.role !== 'admin') {
        return (
            <div className="min-h-screen bg-[#FCFAF7] flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-10 animate-soft-in">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20 relative">
                        <Lock className="w-12 h-12 text-red-500" />
                        <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-full animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-main mb-4 tracking-tighter uppercase italic">Signal Brouillé</h2>
                        <p className="text-text-muted text-xs font-black uppercase tracking-[0.3em] leading-relaxed">
                            Ce terminal de contrôle est strictement réservé à la direction Minsii.
                            Votre empreinte numérique a été archivée.
                        </p>
                    </div>
                    <button onClick={onBack} className="btn-minsii bg-primary text-white w-full py-6 text-xs shadow-blue">RETOUR À L'INTERFACE PUBLIQUE</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FCFAF7] font-sans selection:bg-primary/10 flex flex-col lg:flex-row overflow-x-hidden">
            {/* Header Mobile (Hamburger) */}
            <div className="lg:hidden h-16 bg-[#0a0a1a] flex items-center justify-between px-6 z-[60] sticky top-0 shadow-xl">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-[#1e1edc]" />
                    <h1 className="text-xl font-bold text-white tracking-tight font-serif italic">Minsii <span className="text-[#1e1edc] not-italic">Core</span></h1>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white active:scale-95 transition-all"
                >
                    <Layout className={`w-6 h-6 transition-transform duration-500 ${isMobileMenuOpen ? 'rotate-90' : ''}`} />
                </button>
            </div>

            {/* Sidebar Navigation — Responsive Drawer */}
            <aside className={`
                fixed inset-y-0 left-0 bg-[#0a0a1a] z-[70] flex flex-col transition-all duration-500 ease-premium shadow-2xl overflow-visible
                ${isSidebarCollapsed ? 'w-[70px] lg:w-[80px] p-3' : 'w-[240px] lg:w-[250px] p-4'}
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Desktop Collapse Toggle */}
                <button 
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-10 w-8 h-8 bg-[#1e1edc] text-white rounded-full hidden lg:flex items-center justify-center shadow-2xl active:scale-90 transition-all z-[80] group"
                >
                    {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>

                <div className={`flex items-center gap-3 group cursor-pointer transition-all duration-500 ${isSidebarCollapsed ? 'mb-4 justify-center' : 'mb-6'}`} onClick={onBack}>
                    <div className="w-10 h-10 bg-[#1e1edc] rounded-[14px] flex items-center justify-center shadow-2xl shadow-[#1e1edc]/20 rotate-2 group-hover:rotate-0 transition-all duration-500 shrink-0">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    {!isSidebarCollapsed && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col whitespace-nowrap overflow-hidden">
                            <h1 className="text-lg font-bold text-white tracking-tight font-serif italic leading-none">Minsii <span className="text-[#1e1edc] not-italic">Core</span></h1>
                            <p className="text-[9px] font-semibold text-white/30 tracking-wider mt-1.5 group-hover:text-white/50 transition-colors uppercase">Terminal Admin</p>
                        </motion.div>
                    )}
                </div>

                <nav className={`flex-1 transition-all duration-500 ${isSidebarCollapsed ? 'space-y-3' : 'space-y-1.5'}`}>
                    {[
                        { id: 'accueil', label: 'Accueil', icon: ArrowLeft, action: onBack },
                        { id: 'overview', label: 'Centrale', icon: Layout },
                        { id: 'verifications', label: 'Accréditations', icon: UserCheck, count: pendingTeachers.length + pendingInstitutions.length },
                        { id: 'users', label: 'Population', icon: Users },
                        { id: 'liaison', label: 'Liaison', icon: Globe },
                        { id: 'messages', label: 'Canal Radio', icon: MessageSquare, count: conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0) },
                        { id: 'settings', label: 'Configuration', icon: Settings }
                    ].map((item) => {
                        const unread = item.count || 0;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.action) item.action();
                                    else {
                                        setActiveTab(item.id as any);
                                        setIsMobileMenuOpen(false);
                                    }
                                }}
                                className={`w-full rounded-[14px] flex items-center transition-all relative group h-8 lg:h-9 ${
                                    isActive 
                                    ? 'bg-[#1e1edc] text-white shadow-2xl shadow-[#1e1edc]/20 scale-105 z-10' 
                                    : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'
                                } ${isSidebarCollapsed ? 'px-0 justify-center' : 'px-4 gap-2.5'}`}
                            >
                                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-white/20 group-hover:text-white'} transition-colors`} />
                                {!isSidebarCollapsed && (
                                    <motion.span 
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        exit={{ opacity: 0 }}
                                        className="text-[9px] font-bold tracking-tight whitespace-nowrap overflow-hidden uppercase"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                                {unread > 0 && (
                                    <span className={`w-4 h-4 flex items-center justify-center text-[8px] font-black rounded-full transition-all ${
                                        isActive ? 'bg-white text-[#1e1edc]' : 'bg-[#1e1edc] text-white'
                                    } ${isSidebarCollapsed ? 'absolute -top-1 -right-1 scale-90 border-2 border-[#0a0a1a]' : 'ml-auto'}`}>
                                        {unread}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className={`mt-auto pt-4 border-t border-white/5 transition-all duration-500 ${isSidebarCollapsed ? 'space-y-4' : 'space-y-3'}`}>
                     <div className={`flex items-center rounded-[16px] bg-white/5 border border-white/5 transition-all h-[54px] ${isSidebarCollapsed ? 'px-0 justify-center' : 'gap-3 p-2.5'}`}>
                        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-[12px] bg-[#1e1edc] flex items-center justify-center font-black text-white text-base shadow-lg shrink-0">
                            {admin?.name?.charAt(0) || 'A'}
                        </div>
                        {!isSidebarCollapsed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
                                <p className="font-bold text-white truncate text-[10px] tracking-tight leading-none">{admin?.name || 'ADMIN'}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                    <p className="text-[8px] text-emerald-500 font-extrabold opacity-60 whitespace-nowrap uppercase">Etat Major</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                    
                    <button 
                        onClick={async () => { await authService.logout(); onBack(); }} 
                        className={`w-full flex items-center rounded-[14px] transition-all group border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 hover:text-white shadow-lg active:scale-95 ${
                            isSidebarCollapsed ? 'h-[40px] justify-center px-0' : 'px-4 py-3 gap-3'
                        }`}
                    >
                        <LogOut className={`w-4 h-4 shrink-0 transition-transform ${isSidebarCollapsed ? '' : 'group-hover:-translate-x-1'} ${isSidebarCollapsed ? 'text-rose-500 group-hover:text-white' : 'text-rose-500 group-hover:text-white'}`} />
                        {!isSidebarCollapsed && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[8px] font-black tracking-widest uppercase text-rose-500 group-hover:text-white">
                                Déconnecter
                            </motion.span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Overlay Mobile */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[65] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main 
                className={`flex-1 min-h-screen relative p-4 md:p-6 lg:p-8 bg-[#FDFAF7] transition-all duration-500 ease-premium ${isSidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[250px]'}`}
            >
                {message && (
                    <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-[2rem] flex items-center gap-4 border border-white/20 shadow-2xl animate-soft-in ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                        {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <p className="font-bold text-[10px] tracking-tight">{message.text}</p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-soft-in">
                                <section className="bg-white border border-[#1A1008]/5 rounded-[32px] p-6 lg:p-8 shadow-premium relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1e1edc]/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-[#1e1edc]/10 transition-all duration-1000" />
                                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
                                        <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-[24px] lg:rounded-[28px] bg-[#FDFAF7] border-4 border-white p-1 flex items-center justify-center shadow-xl group-hover:rotate-3 transition-transform duration-700 relative">
                                            {admin?.avatar_url ? (
                                                <img src={admin.avatar_url} className="w-full h-full rounded-[20px] lg:rounded-[24px] object-cover shadow-inner" alt="" />
                                            ) : (
                                                <ShieldCheck className="w-14 h-14 lg:w-16 lg:h-16 text-[#1e1edc]/20" />
                                            )}
                                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-[#1A1008]/5">
                                                <Sparkles className="w-5 h-5 text-amber-500" />
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center lg:text-left">
                                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                                                 <span className="text-[10px] font-semibold text-[#1e1edc] opacity-60 tracking-wider">Poste Central de Contrôle</span>
                                                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                                            </div>
                                            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-[#1A1008] tracking-tighter mb-2 italic leading-none font-serif">
                                                Bonjour, <em className="text-[#1e1edc] not-italic">Capitaine</em>
                                            </h2>
                                            <p className="text-[#5C5248] text-sm lg:text-base font-bold max-w-xl mx-auto lg:mx-0 leading-relaxed italic opacity-60">
                                                "La clarté est le pouvoir. Pilotez l'écosystème Minsii avec excellence."
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                                    {[
                                        { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, trend: stats.growth, color: '#1e1edc' },
                                        { label: 'Experts Certifiés', value: stats.totalTeachers, icon: GraduationCap, trend: 'STABLE', color: '#1A1008' },
                                        { label: 'En Attente', value: stats.pendingVerifications, icon: Shield, trend: stats.pendingVerifications > 0 ? 'ACTION' : 'CALME', color: stats.pendingVerifications > 0 ? '#ef4444' : '#10b981' },
                                        { label: 'Liaisons', value: stats.activeMatches, icon: Activity, trend: 'OPTIMISÉ', color: '#1e1edc' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white rounded-[24px] p-5 lg:p-6 border border-[#1A1008]/5 shadow-premium hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#FDFAF7] rounded-full -mr-8 -mt-8 group-hover:bg-[#1e1edc]/5 transition-colors" />
                                            <div className="w-10 h-10 bg-[#FDFAF7] rounded-[14px] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <stat.icon size={18} className="text-[#1A1008]/30 group-hover:text-[#1e1edc] transition-colors" />
                                            </div>
                                            <div className="relative z-10">
                                                <h3 className="text-xl lg:text-2xl font-black tracking-tighter text-[#1A1008] mb-1 leading-none">{stat.value}</h3>
                                                <p className="text-[9px] font-semibold text-[#1A1008]/30 tracking-wider mb-4 uppercase">{stat.label}</p>
                                                <span className="inline-block px-3 py-1 rounded-full text-[8px] font-black tracking-widest border uppercase" style={{ color: stat.color, borderColor: `${stat.color}20`, backgroundColor: `${stat.color}05` }}>
                                                    {stat.trend}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
                                     <section className="lg:col-span-2 bg-white rounded-[48px] p-10 lg:p-12 border border-[#1A1008]/5 shadow-premium relative overflow-hidden">
                                        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                                            <div>
                                                <h3 className="text-xl font-black text-[#1A1008] italic tracking-tighter flex items-center gap-3 font-serif">
                                                    <Activity className="w-5 h-5 text-[#1e1edc]" />
                                                    Audit des Candidatures
                                                </h3>
                                                <p className="text-[9px] font-semibold text-[#5C5248]/40 tracking-wider mt-1">Vérification de l'élite académique</p>
                                            </div>
                                            <button onClick={() => setActiveTab('verifications')} className="h-10 px-6 bg-[#FDFAF7] text-[#1A1008] border border-[#1A1008]/5 rounded-[18px] text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#1e1edc] hover:text-white transition-all shadow-sm">
                                                FLUX COMPLET
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {[...pendingTeachers, ...pendingInstitutions].slice(0, 3).map((item) => (
                                                <div key={item.id} className="p-4 lg:p-5 bg-[#FDFAF7]/50 rounded-[24px] border border-transparent hover:border-[#1e1edc]/10 hover:bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 group transition-all">
                                                    <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => { setSelectedAudit(item); setAuditType(item.role as any); }}>
                                                        <div className="w-12 h-12 rounded-[14px] bg-white border border-[#1A1008]/5 flex items-center justify-center text-[#1e1edc] font-black text-lg shadow-md uppercase overflow-hidden group-hover:scale-110 transition-transform">
                                                            {item.avatar_url ? <img src={item.avatar_url} className="w-full h-full object-cover" alt="" /> : item.name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <p className="text-lg font-bold text-[#1A1008] tracking-tight group-hover:text-[#1e1edc] transition-colors">{item.name}</p>
                                                                <span className="px-3 py-1 bg-white text-[#1e1edc] rounded-full text-[8px] font-bold tracking-tight border border-[#1e1edc]/10 shadow-sm">
                                                                    {item.role === 'teacher' ? 'MENTOR' : 'INSTITUT'}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-4 text-[9px] font-medium text-[#5C5248]/40 tracking-tight">
                                                                <span className="text-[#1e1edc]">{item.role === 'teacher' ? (item.teacher_profiles?.subjects)?.[0] || 'Expert' : (item as any).director_profiles?.establishment_name}</span>
                                                                <div className="w-1 h-1 bg-[#1e1edc]/10 rounded-full" />
                                                                <span className="flex items-center gap-2 group-hover:text-[#1A1008] transition-colors font-semibold opacity-60"><Eye size={10} /> Dossier</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.stopPropagation();
                                                                item.role === 'teacher' ? handleVerify(item.id, true) : handleVerifyInstitution(item.id, true) 
                                                            }} 
                                                            className="w-10 h-10 bg-white text-emerald-500 rounded-[12px] border border-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all shadow-md active:scale-95 flex items-center justify-center group/btn"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                item.role === 'teacher' ? handleVerify(item.id, false) : handleVerifyInstitution(item.id, false)
                                                            }} 
                                                            className="w-10 h-10 bg-white text-rose-500 rounded-[12px] border border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all shadow-md active:scale-95 flex items-center justify-center group/btn"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {pendingTeachers.length + pendingInstitutions.length === 0 && (
                                                <div className="py-32 text-center space-y-8 opacity-20 group">
                                                    <CheckCircle size={80} className="text-[#1A1008] mx-auto group-hover:scale-110 transition-transform" />
                                                    <p className="font-black text-[11px] uppercase tracking-[0.4em]">Ciel sans dossiers</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <div className="space-y-6">
                                        <div className="bg-[#0a0a1a] rounded-[32px] p-8 lg:p-10 text-white shadow-3xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#1e1edc]/10 rounded-full blur-[60px] -mr-24 -mt-24 transition-all duration-1000 group-hover:bg-[#1e1edc]/20" />
                                            <h4 className="text-lg font-black mb-6 italic tracking-tighter flex items-center gap-3 font-serif">
                                                <Zap className="w-5 h-5 text-[#1e1edc] fill-[#1e1edc]" />
                                                Actions Critiques
                                            </h4>
                                            <div className="space-y-3 relative z-10">
                                                {[
                                                    { label: 'Annonce de Sécurité', icon: ShieldCheck },
                                                    { label: 'Extraction Données', icon: FileText },
                                                    { label: 'Maintenance', icon: Lock },
                                                    { label: 'Modération', icon: Ban }
                                                ].map((action, i) => (
                                                    <button key={i} className="w-full p-4 bg-white/5 hover:bg-[#1e1edc] rounded-[16px] border border-white/5 flex items-center gap-4 text-[9px] font-semibold tracking-wider transition-all text-left group/btn">
                                                        <action.icon className="w-4 h-4 text-white/20 group-hover/btn:text-white transition-colors" />
                                                        {action.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-[#1A1008]/5 shadow-premium">
                                             <h4 className="text-lg font-bold mb-8 italic tracking-tight text-[#1A1008] font-serif">Pulse Santé</h4>
                                             <div className="space-y-8">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-[9px] font-semibold text-[#5C5248]/40 tracking-wider">Uptime Infra</p>
                                                        <span className="text-emerald-500 font-bold text-xs tracking-tight">99.9%</span>
                                                    </div>
                                                    <div className="h-2 bg-[#FDFAF7] rounded-full overflow-hidden border border-[#1A1008]/5">
                                                        <div className="w-[99.9%] h-full bg-emerald-500 shadow-[0_0_15px_#10b981]" />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-[9px] font-semibold text-[#5C5248]/40 tracking-wider">Latence IA</p>
                                                        <span className="text-[#1e1edc] font-bold text-xs tracking-tight">180ms</span>
                                                    </div>
                                                    <div className="h-2 bg-[#FDFAF7] rounded-full overflow-hidden border border-[#1A1008]/5">
                                                        <div className="w-[65%] h-full bg-[#1e1edc] shadow-[0_0_15px_#2563eb]" />
                                                    </div>
                                                </div>
                                             </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'verifications' && (
                            <div className="space-y-8 animate-soft-in">
                                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-[#1e1edc] rounded-full animate-pulse" />
                                            <span className="text-[9px] font-black text-[#1e1edc] uppercase tracking-[0.4em]">Audit en Cours</span>
                                        </div>
                                        <h2 className="text-3xl font-black text-[#1A1008] tracking-tighter uppercase italic leading-none">Accréditations</h2>
                                        <p className="text-[#5C5248]/60 font-bold text-sm lg:text-base italic leading-relaxed max-w-xl">Certification de l'élite académique de la nation.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="relative group">
                                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1008]/20 group-focus-within:text-[#1e1edc] transition-colors" />
                                            <input type="text" placeholder="FILTRER L'ÉLITE..." className="pl-12 pr-6 py-4 bg-white border border-[#1A1008]/5 rounded-[20px] text-[9px] font-black tracking-[0.2em] outline-none focus:border-[#1e1edc]/20 w-[260px] transition-all uppercase placeholder:italic shadow-sm" />
                                        </div>
                                    </div>
                                </header>

                                <div className="grid grid-cols-1 gap-6">
                                    {[...pendingTeachers, ...pendingInstitutions].length > 0 ? (
                                        [...pendingTeachers, ...pendingInstitutions].map(item => (
                                            <div key={item.id} className="bg-white rounded-[32px] p-6 lg:p-8 border border-[#1A1008]/5 shadow-premium hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1e1edc]/5 rounded-full blur-[60px] -mr-32 -mt-32 transition-all duration-1000 group-hover:bg-[#1e1edc]/10" />
                                                <div className="flex flex-col md:flex-row items-center gap-8 flex-1 relative z-10 w-full lg:w-auto">
                                                     <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-[28px] bg-[#FDFAF7] border-4 border-white flex items-center justify-center text-[#1e1edc] font-black text-2xl lg:text-3xl shadow-xl group-hover:rotate-3 group-hover:scale-105 transition-all duration-700 uppercase overflow-hidden shrink-0">
                                                        {item.avatar_url ? <img src={item.avatar_url} className="w-full h-full object-cover" alt="" /> : item.name?.charAt(0)}
                                                    </div>
                                                    <div className="space-y-6 text-center md:text-left flex-1">
                                                        <div className="space-y-2">
                                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                                                <h3 className="text-xl lg:text-2xl font-black text-[#1A1008] leading-none tracking-tighter uppercase italic">{item.name}</h3>
                                                                <span className="px-3 py-1 bg-[#FDFAF7] text-[#1e1edc] border border-[#1e1edc]/10 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-sm">
                                                                    {item.role === 'teacher' ? 'MENTOR' : 'INSTITUTION'}
                                                                </span>
                                                            </div>
                                                            <p className="text-[#5C5248]/40 text-[9px] font-bold uppercase tracking-[0.3em] italic">Dossier N° {item.id.slice(0, 8).toUpperCase()}</p>
                                                        </div>

                                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 lg:gap-12">
                                                            {item.role === 'teacher' ? (
                                                                <>
                                                                    <div className="space-y-1">
                                                                        <p className="text-[8px] font-black text-[#5C5248]/30 uppercase tracking-[0.3em]">Spécialisation</p>
                                                                        <div className="flex items-center gap-3 text-[10px] font-black text-[#1A1008] uppercase tracking-widest">
                                                                            <GraduationCap className="w-4 h-4 text-[#1e1edc]" /> {(item.teacher_profiles?.subjects)?.[0] || 'Expert Élite'}
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-1 border-l md:border-[#1A1008]/5 md:pl-8">
                                                                        <p className="text-[8px] font-black text-[#5C5248]/30 uppercase tracking-[0.3em]">Expérience</p>
                                                                        <div className="flex items-center gap-3 text-[10px] font-black text-[#1A1008] uppercase tracking-widest">
                                                                            <Star className="w-4 h-4 text-amber-500" /> {item.teacher_profiles?.experience_years || 5} CYCLES
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="space-y-1">
                                                                        <p className="text-[8px] font-black text-[#5C5248]/30 uppercase tracking-[0.3em]">Etablissement</p>
                                                                        <div className="flex items-center gap-3 text-[10px] font-black text-[#1A1008] uppercase tracking-widest">
                                                                            <Building2 className="w-4 h-4 text-[#1e1edc]" /> {item.director_profiles?.establishment_name}
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-1 border-l md:border-[#1A1008]/5 md:pl-8">
                                                                        <p className="text-[8px] font-black text-[#5C5248]/30 uppercase tracking-[0.3em]">Type</p>
                                                                        <div className="flex items-center gap-3 text-[10px] font-black text-[#1A1008] uppercase tracking-widest">
                                                                            <Globe className="w-4 h-4 text-[#1e1edc]" /> {item.director_profiles?.establishment_type}
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                            <div className="space-y-1 border-l md:border-[#1A1008]/5 md:pl-8">
                                                                <p className="text-[8px] font-black text-[#5C5248]/30 uppercase tracking-[0.3em]">Date</p>
                                                                <div className="flex items-center gap-3 text-[10px] font-black text-[#1A1008] uppercase tracking-widest">
                                                                    <Clock className="w-4 h-4 text-[#1e1edc]" /> {new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).toUpperCase()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto relative z-10">
                                                    <button 
                                                        onClick={() => item.role === 'teacher' ? handleVerify(item.id, false) : handleVerifyInstitution(item.id, false)} 
                                                        className="w-full sm:w-auto px-6 py-4 bg-white text-rose-500 border border-rose-500/10 rounded-[18px] font-black text-[9px] uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 group/btn"
                                                    >
                                                        <XCircle className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-500" />
                                                        Rejeter
                                                    </button>
                                                    <button 
                                                        onClick={() => item.role === 'teacher' ? handleVerify(item.id, true) : handleVerifyInstitution(item.id, true)} 
                                                        className="w-full sm:w-auto px-8 py-4 bg-[#1e1edc] text-white rounded-[18px] font-black text-[9px] uppercase tracking-[0.3em] shadow-2xl shadow-[#1e1edc]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group/btn"
                                                    >
                                                        <CheckCircle className="w-4 h-4 group-hover/btn:scale-125 transition-transform duration-500" />
                                                        Accrédi...
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-32 text-center space-y-6 group opacity-10">
                                            <ShieldCheck size={80} className="mx-auto group-hover:scale-110 transition-transform duration-1000" />
                                            <p className="font-black text-xl uppercase tracking-[0.4em] italic">Archive Vide</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'messages' && (
                            <div className="bg-white rounded-[48px] h-[calc(100vh-250px)] min-h-[600px] flex overflow-hidden animate-soft-in border border-[#1A1008]/5 shadow-premium">
                                 {/* Conversations Terminal */}
                                <div className="w-[350px] border-r border-[#1A1008]/5 flex flex-col bg-white shrink-0">
                                    <div className="p-8 border-b border-[#1A1008]/5 space-y-2">
                                        <h3 className="text-2xl font-black text-[#1A1008] tracking-tighter uppercase italic leading-none">Terminal Radio</h3>
                                        <p className="text-[9px] font-black text-[#5C5248]/40 uppercase tracking-[0.4em]">Flux de Liaison Centrale</p>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3 scrollbar-hide">
                                        {conversations.map(conv => (
                                            <button 
                                                key={conv.other_user_id}
                                                onClick={() => setActiveConversation(conv)}
                                                className={`w-full flex items-center gap-4 p-5 rounded-[24px] transition-all group relative overflow-hidden ${
                                                    activeConversation?.other_user_id === conv.other_user_id 
                                                    ? 'bg-[#1e1edc] text-white shadow-xl shadow-[#1e1edc]/20 scale-[1.02]' 
                                                    : 'hover:bg-[#FDFAF7] text-[#1A1008]'
                                                }`}
                                            >
                                                <div className="relative shrink-0">
                                                     <div className="w-14 h-14 rounded-[18px] bg-[#FDFAF7] border border-[#1A1008]/5 flex items-center justify-center font-black text-[#1e1edc] text-xl uppercase group-hover:scale-110 transition-transform overflow-hidden shadow-inner">
                                                        {conv.other_user_avatar ? <img src={conv.other_user_avatar} className="w-full h-full object-cover" alt="" /> : conv.other_user_name.charAt(0)}
                                                    </div>
                                                    {onlineUsers[conv.other_user_id] && <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white shadow-lg animate-pulse" />}
                                                </div>
                                                <div className="text-left flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <p className={`font-black truncate text-base tracking-tighter uppercase italic leading-none ${activeConversation?.other_user_id === conv.other_user_id ? 'text-white' : 'text-[#1A1008]'}`}>{conv.other_user_name}</p>
                                                        <span className="text-[8px] font-black opacity-30 whitespace-nowrap">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <p className={`text-[9px] font-black uppercase tracking-[0.15em] truncate opacity-40 ${activeConversation?.other_user_id === conv.other_user_id ? 'text-white' : 'text-[#5C5248]'}`}>{conv.last_message}</p>
                                                </div>
                                                {conv.unread_count > 0 && activeConversation?.other_user_id !== conv.other_user_id && (
                                                    <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-[#1e1edc] rounded-full shadow-[0_0_10px_#1e1edc]" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Chat Interface */}
                                <div className="flex-1 flex flex-col bg-[#FDFAF7] relative">
                                    {activeConversation ? (
                                        <>
                                             <div className="px-8 py-6 bg-white border-b border-[#1A1008]/5 flex items-center justify-between shadow-sm relative z-10 transition-all">
                                                <div className="flex items-center gap-6">
                                                     <div className="w-16 h-16 rounded-[24px] bg-[#1e1edc] flex items-center justify-center font-black text-white text-2xl shadow-2xl rotate-2 transition-transform overflow-hidden">
                                                        {activeConversation.other_user_avatar ? <img src={activeConversation.other_user_avatar} className="w-full h-full object-cover" alt="" /> : activeConversation.other_user_name.charAt(0)}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-xl font-black text-[#1A1008] tracking-tighter uppercase italic leading-none">{activeConversation.other_user_name}</p>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2.5 h-2.5 rounded-full ${onlineUsers[activeConversation.other_user_id] ? 'bg-emerald-500 animate-pulse' : 'bg-[#1A1008]/10'}`} />
                                                            <span className="text-[9px] font-black text-[#5C5248]/40 uppercase tracking-[0.4em]">{onlineUsers[activeConversation.other_user_id] ? 'Liaison Stable (DIRECT)' : 'Liaison en Différé'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                     <button className="w-12 h-12 rounded-[18px] bg-[#FDFAF7] border border-[#1A1008]/5 flex items-center justify-center text-[#1A1008]/40 hover:text-[#1e1edc] hover:bg-white transition-all shadow-sm">
                                                        <MoreVertical className="w-6 h-6" />
                                                     </button>
                                                </div>
                                            </div>

                                            <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-10 scrollbar-hide">
                                                 {chatMessages.map((msg, i) => (
                                                    <div key={msg.id || i} className={`flex ${msg.sender_id === user.profile.id ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[80%] p-6 lg:p-8 rounded-[32px] shadow-sm relative group transition-all ${
                                                            msg.sender_id === user.profile.id 
                                                            ? 'bg-[#0a0a1a] text-white rounded-tr-none border border-white/5 shadow-xl' 
                                                            : 'bg-white text-[#1A1008] rounded-tl-none border border-[#1A1008]/5'
                                                        }`}>
                                                            <p className="text-sm lg:text-base font-bold leading-relaxed">{msg.content}</p>
                                                            <div className={`mt-4 flex items-center gap-3 ${msg.sender_id === user.profile.id ? 'justify-end text-white/30' : 'text-[#5C5248]/40'}`}>
                                                                <Clock className="w-3.5 h-3.5 opacity-50" />
                                                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div ref={messagesEndRef} />
                                            </div>

                                            <div className="p-8 lg:p-10 bg-white border-t border-[#1A1008]/5">
                                                <form onSubmit={handleSendMessage} className="flex gap-6 max-w-5xl mx-auto">
                                                    <div className="flex-1 relative group">
                                                        <input 
                                                            type="text" 
                                                            value={newMessage}
                                                            onChange={(e) => setNewMessage(e.target.value)}
                                                            placeholder="COMMANDER LA RÉPONSE..." 
                                                            className="w-full bg-[#FDFAF7] border-2 border-transparent focus:border-[#1e1edc]/20 focus:bg-white rounded-[24px] py-6 px-10 text-sm font-black text-[#1A1008] outline-none transition-all uppercase tracking-[0.2em] placeholder:italic shadow-inner"
                                                        />
                                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-4 opacity-30 group-focus-within:opacity-100 transition-opacity">
                                                            <Paperclip className="w-6 h-6 cursor-pointer hover:text-[#1e1edc] transition-colors" />
                                                            <Smile className="w-6 h-6 cursor-pointer hover:text-[#1e1edc] transition-colors" />
                                                        </div>
                                                    </div>
                                                    <button type="submit" disabled={!newMessage.trim() || isSending} className="w-20 h-20 bg-[#0a0a1a] text-white rounded-[24px] font-black text-[9px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#1e1edc] transition-all active:scale-90 disabled:opacity-20 flex items-center justify-center shrink-0">
                                                        {isSending ? <Loader2 className="w-7 h-7 animate-spin" /> : <Send className="w-7 h-7 rotate-[-20deg] group-hover:rotate-0 transition-transform" />}
                                                    </button>
                                                </form>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-16 opacity-10">
                                            <div className="w-64 h-64 rounded-[80px] bg-white border border-[#1A1008]/5 flex items-center justify-center shadow-premium rotate-3 group-hover:rotate-0 transition-transform duration-1000">
                                                <MessageSquare size={120} className="text-[#1A1008]" />
                                            </div>
                                            <div className="space-y-6">
                                                <h4 className="text-5xl font-black text-[#1A1008] uppercase italic tracking-tighter leading-none">Canal Radio Discret</h4>
                                                <p className="text-[12px] font-black text-[#5C5248] uppercase tracking-[0.6em]">Sélectionnez une liaison pour opérer</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-6xl mx-auto space-y-16 lg:space-y-24 animate-soft-in">
                                <header className="flex flex-col md:flex-row items-center justify-between gap-12">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-[#1e1edc] rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black text-[#1e1edc] uppercase tracking-[0.4em]">Configuration Système Core</span>
                                        </div>
                                        <h2 className="text-3xl lg:text-5xl font-black text-[#1A1008] tracking-tighter uppercase italic leading-none">Paramètres</h2>
                                        <p className="text-[#5C5248]/60 font-bold text-base lg:text-lg italic leading-relaxed max-w-xl">Ajustement des protocoles et de l'identité administrative.</p>
                                    </div>
                                    <button 
                                        onClick={handleSaveSettings} 
                                        disabled={isSaving}
                                        className="h-16 px-10 bg-[#0a0a1a] text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-[#1e1edc] transition-all shadow-3xl active:scale-95 group shrink-0 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />} 
                                        {isSaving ? 'SYNCHRONISATION...' : 'ENREGISTRER'}
                                    </button>
                                </header>

                                <div className="bg-white rounded-[48px] p-10 lg:p-14 space-y-12 border border-[#1A1008]/5 shadow-premium overflow-hidden relative">
                                     <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1e1edc]/5 rounded-full blur-[80px] -mr-24 -mt-24 transition-all duration-1000" />
                                     <div className="flex flex-col lg:flex-row items-center gap-12 pb-12 border-b border-[#1A1008]/5 relative z-10">
                                        <div className="relative group shrink-0">
                                            <div className="w-48 h-48 rounded-[48px] bg-[#FDFAF7] border-4 border-white shadow-2xl overflow-hidden group-hover:-rotate-3 transition-transform duration-1000 relative">
                                                {admin.avatar_url ? <img src={admin.avatar_url} className="w-full h-full object-cover shadow-inner" alt="" /> : <div className="w-full h-full flex items-center justify-center text-[#1e1edc]/10 font-black text-4xl uppercase">ADM</div>}
                                            </div>
                                            <label className="absolute inset-0 bg-[#0a0a1a]/95 rounded-[72px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-4 border-[#1e1edc]/20">
                                                <input type="file" className="hidden" onChange={handleAvatarUpload} />
                                                <Upload className="w-16 h-16 text-white mb-4 animate-bounce" />
                                                <span className="text-[10px] font-semibold text-white tracking-widest text-center px-8 leading-relaxed">Mise à jour Empreinte Digitale</span>
                                            </label>
                                        </div>
                                        <div className="flex-1 space-y-8 w-full">
                                             <div className="space-y-3">
                                                <label className="text-[10px] font-semibold text-[#5C5248]/30 tracking-wider ml-4 flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5" /> Designation Publique
                                                </label>
                                                <input type="text" value={admin?.name || ''} onChange={e => setAdmin({...admin, name: e.target.value})} className="w-full bg-[#FDFAF7] px-8 py-5 rounded-[24px] font-bold text-[#1A1008] text-lg outline-none focus:bg-white border-2 border-transparent focus:border-[#1e1edc]/20 transition-all shadow-inner tracking-tight" placeholder="NOM DU CAPITAINE" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-[#5C5248]/30 uppercase tracking-[0.4em] ml-4 flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5" /> Accès de Liaison Privé
                                                </label>
                                                <div className="relative group">
                                                    <input type="email" value={admin?.email || ''} disabled className="w-full bg-[#FDFAF7]/50 px-8 py-5 rounded-[24px] font-black text-[#5C5248]/30 border border-[#1A1008]/5 cursor-not-allowed uppercase tracking-widest text-base" />
                                                    <Lock className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1008]/10" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-10 flex flex-col sm:flex-row gap-12 items-center justify-between relative z-10">
                                        <div className="flex items-center gap-8">
                                            <div className="w-20 h-20 bg-emerald-50 rounded-[28px] flex items-center justify-center border border-emerald-100 shadow-sm"><ShieldCheck className="w-10 h-10 text-emerald-600" /></div>
                                            <div className="space-y-2">
                                                <p className="text-[11px] font-black text-[#1A1008] uppercase tracking-[0.4em] leading-none italic">SÉCURITÉ CORE ACTIVÉE</p>
                                                <p className="text-[10px] font-black text-[#5C5248]/40 uppercase tracking-[0.3em] leading-relaxed italic">Protocole AES-256 GPR-X. Intégrité des données garantie.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="space-y-8 animate-soft-in">
                                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-[#1e1edc] uppercase tracking-[0.4em]">Indexation des Citoyens</p>
                                        <h2 className="text-2xl lg:text-3xl font-black text-[#1A1008] tracking-tighter uppercase italic leading-none font-serif">Population</h2>
                                    </div>
                                    <div className="relative group w-full md:w-80">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1008]/20 group-focus-within:text-[#1e1edc] transition-colors" />
                                        <input 
                                            type="text" 
                                            placeholder="RECHERCHER UN NOM..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-6 py-4 bg-white border border-[#1A1008]/5 rounded-2xl text-[9px] font-bold tracking-widest outline-none focus:border-[#1e1edc]/20 transition-all placeholder:italic shadow-sm"
                                        />
                                    </div>
                                </header>

                                <div className="bg-white rounded-[32px] border border-[#1A1008]/5 shadow-premium overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-[#1A1008]/5 text-[9px] font-black text-[#5C5248]/40 uppercase tracking-[0.3em]">
                                                    <th className="px-6 py-5">Individu</th>
                                                    <th className="px-6 py-5">Rôle</th>
                                                    <th className="px-6 py-5">Localisation</th>
                                                    <th className="px-6 py-5">Status</th>
                                                    <th className="px-6 py-5 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((u) => (
                                                    <tr key={u.id} className="hover:bg-[#FDFAF7] transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-[#0a0a1a] flex items-center justify-center font-black text-white text-base uppercase overflow-hidden shrink-0">
                                                                    {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" alt="" /> : u.name?.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-[#1A1008] text-xs tracking-tight">{u.name}</p>
                                                                    <p className="text-[8px] text-[#5C5248]/40 font-medium">{u.id.slice(0, 8).toUpperCase()}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-[8px] font-black px-2 py-0.5 bg-[#1A1008]/5 text-[#1A1008] rounded-full uppercase tracking-widest">{u.role}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-[9px] font-black text-[#5C5248]/60 uppercase tracking-widest">{u.city_village || 'NON DÉFINI'}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                                    (u.teacher_profiles?.status === 'verified' || u.director_profiles?.status === 'verified') ? 'bg-emerald-500' : 
                                                                    (u.teacher_profiles?.status === 'revision_required' || u.director_profiles?.status === 'revision_required') ? 'bg-amber-500 animate-pulse' :
                                                                    (u.teacher_profiles?.status === 'deactivated') ? 'bg-rose-500' : 'bg-[#5C5248]/20'
                                                                }`} />
                                                                <span className="text-[8px] font-black uppercase tracking-widest">
                                                                    {u.teacher_profiles?.status || u.director_profiles?.status || 'VISITEUR'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                                            <button 
                                                                onClick={() => {
                                                                    const status = (u.teacher_profiles?.status || u.director_profiles?.status);
                                                                    handleUpdateStatus(u.id, status === 'deactivated' ? 'pending' : 'deactivated');
                                                                }}
                                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                                                    (u.teacher_profiles?.status === 'deactivated' || u.director_profiles?.status === 'deactivated')
                                                                    ? 'bg-[#1e1edc] text-white shadow-lg'
                                                                    : 'hover:bg-rose-500 hover:text-white text-[#1A1008]/20'
                                                                }`}
                                                                title={ (u.teacher_profiles?.status === 'deactivated' || u.director_profiles?.status === 'deactivated') ? 'Rétablir' : 'Interdire' }
                                                            >
                                                                <Ban size={14} />
                                                            </button>
                                                            <button 
                                                                onClick={() => { setSelectedAudit(u); setAuditType(u.role as any); }}
                                                                className="w-8 h-8 hover:bg-emerald-500 hover:text-white rounded-lg transition-all text-[#1A1008]/20 flex items-center justify-center"
                                                                title="Analyser"
                                                            >
                                                                <Eye size={14} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <button onClick={onBack} className="flex items-center gap-3 text-[9px] font-black text-[#1e1edc] uppercase tracking-[0.4em] hover:opacity-100 opacity-50 transition-all mt-16 group">
                                    <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour à l'accueil
                                </button>
                            </div>
                        )}

                        {activeTab === 'reports' && (
                            <div className="py-64 text-center space-y-12 animate-soft-in opacity-10">
                                <AlertCircle size={120} className="mx-auto" />
                                <div className="space-y-4">
                                    <h4 className="text-4xl font-black text-[#1A1008] uppercase italic tracking-tighter leading-none">Centre de Vigilance</h4>
                                    <p className="text-[12px] font-black text-[#5C5248] uppercase tracking-[0.6em]">Intégrité du réseau à 100%. Aucun signalement.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'liaison' && (
                            <div className="space-y-12 animate-soft-in max-w-6xl mx-auto">
                                <header className="space-y-2">
                                     <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-[#1e1edc] rounded-full animate-pulse" />
                                        <span className="text-[9px] font-black text-[#1e1edc] uppercase tracking-[0.4em]">Centre de Liaison Centrale</span>
                                    </div>
                                    <h2 className="text-3xl lg:text-5xl font-black text-[#1A1008] tracking-tighter uppercase italic leading-none font-serif">Canal Liaison</h2>
                                    <p className="text-[#5C5248]/60 font-bold text-base lg:text-lg italic leading-relaxed max-w-xl">Diffusion de protocoles administratifs et d'alertes système.</p>
                                </header>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                    {/* Notification Composer */}
                                    <div className="lg:col-span-1 space-y-6">
                                        <div className="bg-white rounded-[40px] p-10 border border-[#1A1008]/5 shadow-premium space-y-8">
                                            <h3 className="text-lg font-black text-[#1A1008] tracking-tighter uppercase italic leading-none">Nouveau Signal</h3>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-[#1A1008]/30 uppercase tracking-[0.4em] ml-2">Type d'alerte</label>
                                                    <div className="flex gap-2">
                                                        {['info', 'warning', 'success', 'alert'].map(type => (
                                                            <button 
                                                                key={type} 
                                                                onClick={() => setNewNotification(prev => ({ ...prev, type }))}
                                                                className={`flex-1 py-3 rounded-xl border text-[8px] font-black uppercase tracking-widest transition-all ${
                                                                    newNotification.type === type 
                                                                    ? 'bg-[#1e1edc] text-white border-[#1e1edc] shadow-lg' 
                                                                    : 'bg-white text-[#1A1008]/40 border-[#1A1008]/5'
                                                                }`}
                                                            >
                                                                {type}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-[#1A1008]/30 uppercase tracking-[0.4em] ml-2">Titre du Signal</label>
                                                    <input 
                                                        type="text" 
                                                        value={newNotification.title}
                                                        onChange={e => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                                                        placeholder="OBJET DE LA DIFFUSION..." 
                                                        className="w-full bg-[#FDFAF7] border-2 border-transparent focus:border-[#1e1edc]/20 focus:bg-white rounded-[20px] p-5 text-[11px] font-bold text-[#1A1008] outline-none transition-all uppercase tracking-tight shadow-inner"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-[#1A1008]/30 uppercase tracking-[0.4em] ml-2">Manifeste</label>
                                                    <textarea 
                                                        value={newNotification.content}
                                                        onChange={e => setNewNotification(prev => ({ ...prev, content: e.target.value }))}
                                                        placeholder="MESSAGE À DESTINATION DE L'ÉLITE..." 
                                                        className="w-full h-32 bg-[#FDFAF7] border-2 border-transparent focus:border-[#1e1edc]/20 focus:bg-white rounded-[20px] p-6 text-sm font-bold text-[#1A1008] outline-none transition-all uppercase tracking-tight shadow-inner"
                                                    />
                                                </div>
                                                <button 
                                                    onClick={handleSendNotification}
                                                    disabled={isSending || !newNotification.title || !newNotification.content}
                                                    className="w-full py-6 bg-[#0a0a1a] text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#1e1edc] transition-all shadow-3xl active:scale-95 group disabled:opacity-50"
                                                >
                                                    <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
                                                    DIFFUSER LE SIGNAL
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Signal History */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white rounded-[40px] p-10 border border-[#1A1008]/5 shadow-premium min-h-[600px] flex flex-col">
                                            <div className="flex items-center justify-between mb-10 border-b border-[#1A1008]/5 pb-6">
                                                <h3 className="text-lg font-black text-[#1A1008] tracking-tighter uppercase italic mb-0">Historique des Signaux</h3>
                                                <span className="text-[10px] font-black text-[#1e1edc] bg-[#1e1edc]/5 px-4 py-1.5 rounded-full">{notifications.length} TRANSMISSIONS</span>
                                            </div>
                                            <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide pr-2">
                                                {notifications.map(note => (
                                                    <div key={note.id} className="p-8 bg-[#FDFAF7] rounded-[32px] border border-[#1A1008]/5 space-y-4 hover:bg-white hover:shadow-xl transition-all group">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center shadow-lg ${
                                                                    note.type === 'info' ? 'bg-[#1e1edc] text-white' :
                                                                    note.type === 'warning' ? 'bg-amber-500 text-white' :
                                                                    note.type === 'alert' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                                                                }`}>
                                                                    {note.type === 'info' ? <Globe size={18} /> : 
                                                                     note.type === 'warning' ? <AlertCircle size={18} /> :
                                                                     note.type === 'alert' ? <Ban size={18} /> : <CheckCircle size={18} />}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-black text-[#1A1008] text-base tracking-tighter uppercase italic leading-none">{note.title}</h4>
                                                                    <p className="text-[8px] font-black text-[#5C5248]/40 uppercase tracking-[0.3em] mt-1.5">
                                                                        {note.receiver_id ? `CIBLE : ${note.receiver?.name || 'CITOYEN'}` : 'BROADCAST : RÉSEAU MINSII'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span className="text-[8px] font-black text-[#5C5248]/30 uppercase italic">{new Date(note.created_at).toLocaleString()}</span>
                                                        </div>
                                                        <p className="text-sm font-bold text-[#1A1008]/70 leading-relaxed italic">"{note.content}"</p>
                                                    </div>
                                                ))}
                                                {notifications.length === 0 && (
                                                    <div className="flex-1 flex flex-col items-center justify-center opacity-10 space-y-6">
                                                        <Globe size={64} />
                                                        <p className="font-black text-[10px] uppercase tracking-[0.5em]">Silence Radio</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Strategic Audit Modal — PREMIUM 2026 */}
                <AnimatePresence>
                    {selectedAudit && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedAudit(null)}
                                className="absolute inset-0 bg-[#0a0a1a]/60 backdrop-blur-3xl"
                            />
                            
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-premium overflow-hidden border border-[#1A1008]/10 flex flex-col lg:flex-row h-[90vh] lg:h-auto max-h-[90vh]"
                            >
                                {/* Identity Section */}
                                <div className="lg:w-72 bg-[#0a0a1a] p-8 text-white flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#1e1edc]/10 rounded-full blur-[60px] -mr-24 -mt-24" />
                                    <div className="relative z-10 text-center space-y-6">
                                        <div className="w-32 h-32 rounded-[32px] bg-white/10 p-1.5 border border-white/20 mx-auto shadow-2xl rotate-2 flex items-center justify-center overflow-hidden">
                                            {selectedAudit.avatar_url ? (
                                                <img src={selectedAudit.avatar_url} className="w-full h-full object-cover rounded-[24px]" alt="" />
                                            ) : (
                                                <div className="w-full h-full bg-[#1e1edc]/20 flex items-center justify-center font-black text-4xl rounded-[24px] uppercase">
                                                    {selectedAudit.name?.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black tracking-tighter uppercase italic leading-none text-white">Audit <span className="text-[#1e1edc] not-italic">Core</span></h3>
                                            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em]">Identité Certifiée</p>
                                        </div>
                                        <div className="space-y-3 w-full">
                                            <div className="px-6 py-4 bg-white/5 rounded-[20px] border border-white/10 flex items-center justify-between">
                                                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Origine</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1e1edc]">{(selectedAudit as any).city_village || 'Bénin'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 p-8 lg:p-12 overflow-y-auto bg-[#FDFAF7] scrollbar-hide">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="space-y-3">
                                            <h2 className="text-3xl font-black text-[#1A1008] tracking-tighter leading-none italic uppercase">{selectedAudit.name}</h2>
                                            <div className="flex items-center gap-4">
                                                <span className="px-5 py-2 bg-[#1e1edc] text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#1e1edc]/20">
                                                    {auditType === 'teacher' ? 'Candidature Expert' : 'Dossier Institutionnel'}
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedAudit(null)} className="w-12 h-12 bg-white rounded-2xl shadow-premium flex items-center justify-center group hover:rotate-90 transition-all duration-500 border border-[#1A1008]/5">
                                            <X className="w-5 h-5 text-[#1A1008]/20 group-hover:text-rose-500" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                        <div className="space-y-2 text-center md:text-left">
                                            <p className="text-[9px] font-black text-[#5C5248]/30 uppercase tracking-[0.4em] ml-3">Domaine d'Influence</p>
                                            <div className="p-5 bg-white rounded-[24px] border border-[#1A1008]/5 font-black text-[#1A1008] shadow-sm text-sm uppercase tracking-widest leading-relaxed flex flex-wrap gap-2.5">
                                                {auditType === 'teacher' ? (
                                                    (selectedAudit as PendingTeacher).teacher_profiles?.subjects?.map(s => (
                                                        <span key={s} className="px-3 py-1 bg-[#FDFAF7] text-[#1e1edc] rounded-lg border border-[#1e1edc]/5">{s}</span>
                                                    ))
                                                ) : (selectedAudit as PendingInstitution).director_profiles?.establishment_name}
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-center md:text-left">
                                            <p className="text-[9px] font-black text-[#5C5248]/30 uppercase tracking-[0.4em] ml-3">Certification</p>
                                            <div className="p-5 bg-white rounded-[24px] border border-[#1A1008]/5 font-black text-[#1A1008] shadow-sm text-sm uppercase tracking-widest leading-relaxed flex items-center gap-4">
                                                <Award className="w-5 h-5 text-[#1e1edc]" />
                                                {auditType === 'teacher' ? (selectedAudit as PendingTeacher).teacher_profiles?.education : (selectedAudit as PendingInstitution).director_profiles?.establishment_type}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-12">
                                        <p className="text-[9px] font-black text-[#5C5248]/30 uppercase tracking-[0.4em] ml-3">Manifeste Stratégique</p>
                                        <div className="p-8 bg-white rounded-[32px] border border-[#1A1008]/5 shadow-premium italic text-base leading-relaxed text-[#1A1008]/80 relative group">
                                            <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-[#1e1edc] opacity-10 group-hover:opacity-30 transition-opacity" />
                                            "{auditType === 'teacher' ? (selectedAudit as PendingTeacher).teacher_profiles?.bio : 'Revue institutionnelle approfondie en attente de validation physique.'}"
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-[#1A1008]/5 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <button 
                                            onClick={() => handleUpdateStatus(selectedAudit.id, 'rejected')}
                                            className="h-14 bg-white border border-rose-500/10 text-rose-500 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                        >
                                            Révoquer
                                        </button>
                                        <button 
                                            onClick={() => setShowRevisionModal(true)}
                                            className="h-14 bg-[#5C5248]/5 text-[#5C5248] rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] hover:bg-[#1A1008] hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            <AlertCircle className="w-4 h-4" /> Demander Révision
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(selectedAudit.id, 'verified')}
                                            className="h-14 bg-[#1e1edc] text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] shadow-2xl shadow-[#1e1edc]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                                        >
                                            <ShieldCheck className="w-5 h-5 group-hover:scale-125 transition-transform" /> Accréditer
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Revision Request Modal */}
                <AnimatePresence>
                    {showRevisionModal && selectedAudit && (
                        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-[#0a0a1a]/80 backdrop-blur-md">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-white rounded-[32px] w-full max-w-lg p-10 space-y-8 shadow-3xl border border-[#1A1008]/10"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-[#1A1008] tracking-tighter uppercase italic leading-none">Protocole de Révision</h3>
                                    <p className="text-[10px] font-black text-[#5C5248]/40 uppercase tracking-[0.4em]">Spécifiez les points de mise en examen</p>
                                </div>
                                <div className="space-y-4">
                                     <textarea 
                                        value={revisionFeedback}
                                        onChange={(e) => setRevisionFeedback(e.target.value)}
                                        placeholder="EX: DIPLÔME ILLISIBLE, MANQUE DE DÉTAILS SUR L'EXPÉRIENCE..."
                                        className="w-full h-40 bg-[#FDFAF7] border-2 border-transparent focus:border-[#1e1edc]/20 rounded-[20px] p-6 text-sm font-bold text-[#1A1008] outline-none transition-all uppercase tracking-tight shadow-inner"
                                    />
                                    <div className="flex gap-4">
                                        <button onClick={() => { setShowRevisionModal(false); setRevisionFeedback(''); }} className="flex-1 py-5 bg-[#FDFAF7] text-[#1A1008] rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm">ANNULER</button>
                                        <button 
                                            onClick={() => handleUpdateStatus(selectedAudit.id, 'revision_required', revisionFeedback)}
                                            disabled={!revisionFeedback.trim() || isSending}
                                            className="flex-1 py-5 bg-[#1e1edc] text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#1e1edc]/20 active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {isSending ? 'TRANSMISSION...' : 'ENVOYER LE SIGNAL'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    export default DashboardAdmin;
