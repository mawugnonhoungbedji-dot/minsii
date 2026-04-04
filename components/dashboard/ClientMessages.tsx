import React from 'react';
import { 
    MessageSquare, Send, Clock, Loader2, MoreVertical, 
    ArrowLeft, Search, Phone 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Conversation, Message } from '../../services/messageService';

interface ClientMessagesProps {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    setActiveConversation: (conv: Conversation | null) => void;
    chatMessages: Message[];
    newMessage: string;
    setNewMessage: (val: string) => void;
    handleSendMessage: (e: React.FormEvent) => void;
    isSending: boolean;
    onlineUsers: Record<string, any>;
    userProfileId: string;
}

const ClientMessages: React.FC<ClientMessagesProps> = ({
    conversations, activeConversation, setActiveConversation,
    chatMessages, newMessage, setNewMessage, handleSendMessage,
    isSending, onlineUsers, userProfileId
}) => {
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    return (
        <div className="h-[calc(100vh-180px)] lg:h-[calc(100vh-120px)] lg:-m-14 flex overflow-hidden bg-white lg:bg-transparent rounded-[40px] border border-[var(--border-main)]/50 shadow-premium animate-soft-in">
            {/* Sidebar: Conversations List */}
            <div className={`w-full lg:w-[400px] flex-col border-r border-[var(--border-main)]/50 bg-white ${activeConversation ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-10 lg:p-12 border-b border-[var(--border-main)]/50 bg-[var(--bg-section)]">
                    <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tighter uppercase italic font-serif">Messagerie</h3>
                    <p className="text-[9px] font-black text-[var(--primary)] uppercase tracking-[0.4em] mt-2 opacity-50">Liaisons & Archives</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-2 scrollbar-hide bg-white">
                    {conversations.length > 0 ? (
                        conversations.map(conv => (
                            <button 
                                key={conv.other_user_id}
                                onClick={() => setActiveConversation(conv)}
                                className={`w-full flex items-center gap-5 p-5 rounded-[24px] transition-all relative group ${
                                    activeConversation?.other_user_id === conv.other_user_id 
                                    ? 'bg-[var(--bg-section)] border border-[var(--border-main)]/50' 
                                    : 'hover:bg-[var(--bg-section)]/50 border border-transparent hover:border-[var(--border-main)]/30'
                                }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className={`w-12 h-12 rounded-xl bg-white border border-[var(--border-main)]/5 shadow-sm overflow-hidden group-hover:scale-110 transition-transform flex items-center justify-center font-black text-[var(--primary)]`}>
                                        {conv.other_user_avatar ? (
                                            <img src={conv.other_user_avatar} className="w-full h-full object-cover" alt="" />
                                        ) : conv.other_user_name.charAt(0)}
                                    </div>
                                    {onlineUsers[conv.other_user_id] && (
                                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                                    )}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className={`font-black tracking-tight truncate text-[13px] ${activeConversation?.other_user_id === conv.other_user_id ? 'text-[var(--text-main)]' : 'text-[var(--text-main)]'}`}>
                                            {conv.other_user_name}
                                        </p>
                                        <span className={`text-[8px] font-black uppercase opacity-30 ${activeConversation?.other_user_id === conv.other_user_id ? 'text-[var(--text-muted)]' : 'text-[var(--text-muted)]'}`}>
                                            {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className={`text-[10px] font-bold truncate opacity-40 uppercase tracking-tight ${activeConversation?.other_user_id === conv.other_user_id ? 'text-[var(--text-muted)]' : 'text-[var(--text-muted)]'}`}>
                                        {conv.last_message}
                                    </p>
                                </div>
                                {conv.unread_count > 0 && activeConversation?.other_user_id !== conv.other_user_id && (
                                    <div className="absolute top-5 right-5 w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse" />
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="py-32 text-center opacity-20">
                            <MessageSquare className="w-16 h-16 mx-auto mb-6 text-[#1A1008]" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1A1008]">Silence Radio</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Chat Area */}
            <div className={`flex-1 flex flex-col bg-[var(--bg-section)] relative ${activeConversation ? 'flex' : 'hidden lg:flex'}`}>
                <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl z-0" />
                
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-8 bg-white border-b border-[var(--border-main)]/50 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-5">
                                <button 
                                    onClick={() => setActiveConversation(null)}
                                    className="lg:hidden p-3 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <div className="w-12 h-12 rounded-xl bg-white border border-[var(--border-main)]/30 flex items-center justify-center font-black text-[var(--primary)] shadow-sm overflow-hidden">
                                    {activeConversation.other_user_avatar ? (
                                        <img src={activeConversation.other_user_avatar} className="w-full h-full object-cover" alt="" />
                                    ) : activeConversation.other_user_name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xl font-black text-[var(--text-main)] tracking-tighter leading-none mb-1 font-serif italic uppercase">{activeConversation.other_user_name}</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${onlineUsers[activeConversation.other_user_id] ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                                        <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-30">
                                            {onlineUsers[activeConversation.other_user_id] ? 'En ligne' : 'Hors ligne'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="w-11 h-11 bg-white border border-[var(--border-main)]/50 rounded-xl text-[var(--text-muted)] border-opacity-50 hover:text-[var(--primary)] flex items-center justify-center transition-all shadow-sm">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="w-11 h-11 bg-white border border-[var(--border-main)]/50 rounded-xl text-[var(--text-muted)] border-opacity-50 hover:text-[var(--text-main)] flex items-center justify-center transition-all shadow-sm">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
 
                        {/* Messages Content */}
                        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 scrollbar-hide relative z-[1]">
                            <AnimatePresence>
                                {chatMessages.map((msg, i) => (
                                    <motion.div 
                                        key={msg.id || i}
                                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                                        className={`flex ${msg.sender_id === userProfileId ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] lg:max-w-[65%] p-5 rounded-[24px] shadow-sm relative text-[13px] leading-relaxed border ${
                                            msg.sender_id === userProfileId 
                                            ? 'bg-[var(--primary)] text-white border-transparent rounded-tr-none' 
                                            : 'bg-white text-[var(--text-main)] border-[var(--border-main)]/50 rounded-tl-none font-bold italic'
                                        }`}>
                                            <p>{msg.content}</p>
                                            <div className={`mt-3 flex items-center gap-2 ${msg.sender_id === userProfileId ? 'justify-end text-white/50' : 'text-[var(--text-muted)] opacity-20 text-right justify-end'}`}>
                                                <span className="text-[8px] font-black uppercase tracking-widest">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>


                        {/* Chat Input */}
                        <div className="p-6 lg:p-8 bg-white border-t border-[var(--border-main)]/50 relative z-10 shadow-premium">
                            <form onSubmit={handleSendMessage} className="flex gap-4 max-w-5xl mx-auto">
                                <div className="flex-1 relative group bg-[var(--bg-section)] rounded-[20px] border border-transparent focus-within:bg-white focus-within:border-[var(--primary)]/10 transition-all shadow-inner">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="ÉCRIRE UN MESSAGE..." 
                                        className="w-full bg-transparent py-4 px-8 text-[11px] font-black tracking-widest outline-none uppercase placeholder:text-[var(--text-muted)]/20 text-[var(--text-main)]"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={!newMessage.trim() || isSending}
                                    className="w-12 h-12 bg-[var(--primary)] text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-110 transition-all flex items-center justify-center disabled:opacity-50 active:scale-95"
                                >
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-14 text-center space-y-10 animate-soft-in relative z-10 opacity-30">
                         <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center shadow-xl border border-[var(--border-main)]/50 group-hover:scale-105 transition-transform">
                            <MessageSquare className="w-10 h-10 text-[var(--primary)]" />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tighter uppercase italic font-serif">Ondes de Savoir</h3>
                            <p className="text-[var(--text-muted)] max-w-sm mx-auto font-bold text-sm leading-relaxed uppercase tracking-tight">
                                Sélectionnez un mentor pour démarrer votre ascension.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientMessages;
