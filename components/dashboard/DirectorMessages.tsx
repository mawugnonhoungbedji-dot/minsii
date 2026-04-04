import React from 'react';
import { 
    MessageSquare, Send, Clock, Loader2, MoreVertical, 
    ArrowLeft, Search, Phone 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Conversation, Message } from '../../services/messageService';

interface DirectorMessagesProps {
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

const DirectorMessages: React.FC<DirectorMessagesProps> = ({
    conversations, activeConversation, setActiveConversation,
    chatMessages, newMessage, setNewMessage, handleSendMessage,
    isSending, onlineUsers, userProfileId
}) => {
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    return (
        <div className="h-[calc(100vh-140px)] lg:h-[calc(100vh-80px)] lg:-m-10 flex overflow-hidden bg-white lg:bg-transparent">
            {/* Sidebar: Conversations List */}
            <div className={`w-full lg:w-96 flex-col border-r border-black/5 bg-white ${activeConversation ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-8 lg:p-10 border-b border-black/5">
                    <h3 className="text-2xl font-black text-apple-text tracking-tight">Terminal Radio</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Liaison Talents & Experts</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-2 scrollbar-hide">
                    {conversations.length > 0 ? (
                        conversations.map(conv => (
                            <button 
                                key={conv.other_user_id}
                                onClick={() => setActiveConversation(conv)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative group ${
                                    activeConversation?.other_user_id === conv.other_user_id 
                                    ? 'bg-apple-blue text-white shadow-lg shadow-apple-blue/20' 
                                    : 'hover:bg-apple-gray'
                                }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-black/5 flex items-center justify-center font-bold text-apple-blue shadow-sm overflow-hidden uppercase">
                                        {conv.other_user_avatar ? <img src={conv.other_user_avatar} className="w-full h-full object-cover" /> : conv.other_user_name.charAt(0)}
                                    </div>
                                    {onlineUsers[conv.other_user_id] && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <p className={`font-bold tracking-tight truncate text-sm ${activeConversation?.other_user_id === conv.other_user_id ? 'text-white' : 'text-apple-text'}`}>{conv.other_user_name}</p>
                                        <span className={`text-[9px] ${activeConversation?.other_user_id === conv.other_user_id ? 'text-white/60' : 'text-gray-400'}`}>
                                            {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className={`text-[10px] font-medium truncate ${activeConversation?.other_user_id === conv.other_user_id ? 'text-white/70' : 'text-gray-500'}`}>{conv.last_message}</p>
                                </div>
                                {conv.unread_count > 0 && activeConversation?.other_user_id !== conv.other_user_id && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="py-24 text-center opacity-40">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Signal Radio Inactif</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Chat Area */}
            <div className={`flex-1 flex flex-col bg-apple-gray/30 relative ${activeConversation ? 'flex' : 'hidden lg:flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 lg:p-6 bg-white/80 backdrop-blur-xl border-b border-black/5 flex items-center justify-between shadow-sm relative z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setActiveConversation(null)} className="lg:hidden p-2 text-gray-400 hover:text-apple-text transition-colors"><ArrowLeft className="w-6 h-6" /></button>
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-apple-blue flex items-center justify-center font-bold text-white shadow-lg shadow-apple-blue/20 overflow-hidden uppercase">
                                    {activeConversation.other_user_avatar ? <img src={activeConversation.other_user_avatar} className="w-full h-full object-cover" /> : activeConversation.other_user_name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm lg:text-base font-bold text-apple-text leading-tight">{activeConversation.other_user_name}</p>
                                    <div className="flex items-center gap-1.5 pt-0.5">
                                        <div className={`w-2 h-2 rounded-full ${onlineUsers[activeConversation.other_user_id] ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {onlineUsers[activeConversation.other_user_id] ? 'Liaison Active' : 'Signal Faible'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-white border border-black/5 rounded-xl text-gray-400 hover:text-apple-blue transition-all shadow-sm"><Phone className="w-5 h-5" /></button>
                                <button className="p-3 bg-white border border-black/5 rounded-xl text-gray-400 hover:text-apple-text transition-all shadow-sm"><MoreVertical className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Messages Content */}
                        <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6 lg:space-y-8 scrollbar-hide">
                            <AnimatePresence>
                                {chatMessages.map((msg, i) => (
                                    <motion.div 
                                        key={msg.id || i}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${msg.sender_id === userProfileId ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] lg:max-w-[70%] p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2.25rem] shadow-premium relative overflow-hidden ${
                                            msg.sender_id === userProfileId 
                                            ? 'bg-apple-text text-white rounded-tr-none' 
                                            : 'bg-white text-apple-text rounded-tl-none border border-black/5'
                                        }`}>
                                            <p className="text-sm lg:text-base font-medium leading-relaxed">{msg.content}</p>
                                            <div className={`mt-2 flex items-center gap-2 ${msg.sender_id === userProfileId ? 'justify-end text-white/40' : 'text-gray-400'}`}>
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-4 lg:p-8 bg-white border-t border-black/5 relative z-10">
                            <form onSubmit={handleSendMessage} className="flex gap-3 lg:gap-4 max-w-4xl mx-auto">
                                <div className="flex-1 relative group bg-apple-gray rounded-2xl lg:rounded-3xl border border-transparent focus-within:bg-white focus-within:border-black/5 transition-all">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="TRANSMETTRE UNE RÉPONSE..." 
                                        className="w-full bg-transparent py-4 px-6 text-sm font-bold outline-none uppercase tracking-tight placeholder:text-gray-300"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={!newMessage.trim() || isSending}
                                    className="px-8 lg:px-12 bg-apple-blue text-white rounded-2xl lg:rounded-3xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-apple-blue/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
                                >
                                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Émettre'}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-10 animate-soft-in">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 bg-white rounded-[2.5rem] lg:rounded-[4rem] flex items-center justify-center shadow-premium border border-black/5 rotate-3 hover:rotate-0 transition-transform duration-700">
                            <MessageSquare className="w-10 h-10 lg:w-14 lg:h-14 text-apple-blue" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-apple-text tracking-tight">Signal Radio Institutionnel</h3>
                            <p className="text-gray-400 max-w-sm mx-auto font-medium text-sm lg:text-base italic">"Sélectionnez une station pour initier la transmission avec vos talents."</p>
                        </div>
                        <button onClick={() => (window as any).setDirectorTab?.('candidates')} className="px-10 py-5 bg-apple-text text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Rechercher un Talent</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DirectorMessages;
