import { supabase } from './supabaseClient';
import type { ApiResponse } from '../types';

export interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
    is_read: boolean;
}

export interface Conversation {
    other_user_id: string;
    other_user_name: string;
    other_user_avatar: string;
    last_message: string;
    last_message_at: string;
    unread_count: number;
}

import { withTimeout } from './utils';


export const messageService = {
    /**
     * Envoyer un message
     */
    async sendMessage(receiverId: string, content: string, senderId?: string): Promise<ApiResponse<Message>> {
        try {
            let userId = senderId;

            if (!userId) {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) return { data: null, error: 'Session expirée', success: false };
                userId = session.user.id;
            }

            const trimmedContent = content.trim();
            const now = new Date().toISOString();

            const { error } = await withTimeout(
                supabase
                    .from('messages')
                    .insert({
                        sender_id: userId,
                        receiver_id: receiverId,
                        content: trimmedContent
                    })
            );

            if (error) throw error;

            const localMessage: Message = {
                id: `local-${Date.now()}`,
                sender_id: userId,
                receiver_id: receiverId,
                content: trimmedContent,
                is_read: false,
                created_at: now
            };

            return { data: localMessage, error: null, success: true };
        } catch (error: any) {
            console.error('[MessageService] sendMessage error:', error);
            return { data: null, error: 'Échec de l\'envoi du message', success: false };
        }
    },

    /**
     * Récupérer les messages entre deux utilisateurs
     */
    async getMessages(otherUserId: string, currentUserId?: string): Promise<ApiResponse<Message[]>> {
        try {
            let userId = currentUserId;

            if (!userId) {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) return { data: [], error: 'Non authentifié', success: false };
                userId = session.user.id;
            }

            const { data, error } = await withTimeout(
                supabase
                    .from('messages')
                    .select('*')
                    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
                    .order('created_at', { ascending: true })
            );

            if (error) throw error;
            return { data: data || [], error: null, success: true };
        } catch (error: any) {
            console.error('[MessageService] getMessages error:', error);
            return { data: [], error: 'Impossible de charger la conversation', success: false };
        }
    },

    /**
     * Marquer comme lu
     */
    async markAsRead(senderId: string, currentUserId?: string): Promise<ApiResponse<null>> {
        try {
            let userId = currentUserId;

            if (!userId) {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) return { data: null, error: 'Auth required', success: false };
                userId = session.user.id;
            }

            const { error } = await withTimeout(
                supabase
                    .from('messages')
                    .update({ is_read: true })
                    .eq('sender_id', senderId)
                    .eq('receiver_id', userId)
                    .eq('is_read', false)
            );

            if (error) throw error;
            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[MessageService] markAsRead error:', error);
            return { data: null, error: 'Erreur lors de la mise à jour des notifications', success: false };
        }
    },

    /**
     * Loguer une interaction de contact
     */
    async logContact(teacherId: string, contactType: string): Promise<ApiResponse<null>> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return { data: null, error: 'Auth required', success: false };

            const { error } = await withTimeout(
                supabase
                    .from('contact_logs')
                    .insert({
                        parent_id: session.user.id,
                        teacher_id: teacherId,
                        contact_type: contactType
                    })
            );

            if (error) throw error;
            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[MessageService] logContact error:', error);
            return { data: null, error: 'Erreur lors de l\'enregistrement de l\'interaction', success: false };
        }
    },

    /**
     * Récupérer la liste des conversations (via RPC)
     */
    async getConversations(currentUserId?: string): Promise<ApiResponse<Conversation[]>> {
        try {
            let userId = currentUserId;

            if (!userId) {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.user) return { data: [], error: 'Non authentifié', success: false };
                userId = session.user.id;
            }

            const { data, error } = await withTimeout(
                supabase.rpc('get_conversations', { user_id: userId })
            );

            if (error) throw error;
            return { data: data || [], error: null, success: true };
        } catch (error: any) {
            console.error('[MessageService] getConversations error:', error);
            return { data: [], error: 'Échec du chargement des discussions', success: false };
        }
    },

    /**
     * S'abonner aux nouveaux messages (Realtime)
     */
    subscribeToMessages(currentUserId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`messages:${currentUserId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `receiver_id=eq.${currentUserId}`
            }, callback)
            .subscribe();
    },

    /**
     * Tracking de présence
     */
    subscribeToPresence(channelName: string, userId: string, onSync: (state: any) => void) {
        const channel = supabase.channel(`presence:${channelName}`, {
            config: {
                presence: { key: userId },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                onSync(state);
            });

        channel.subscribe(async (status: string) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({ online_at: new Date().toISOString() });
            }
        });

        return channel;
    },

    /**
     * Statut de frappe (Broadcasting)
     */
    subscribeToTyping(channelName: string, onTyping: (payload: any) => void) {
        const channel = supabase.channel(`typing:${channelName}`);

        channel
            .on('broadcast', { event: 'typing' }, (payload: any) => {
                onTyping(payload);
            })
            .subscribe();

        return channel;
    },

    /**
     * Envoyer le statut de frappe
     */
    async sendTypingStatus(channel: any, userId: string, isTyping: boolean) {
        await channel.send({
            type: 'broadcast',
            event: 'typing',
            payload: { userId, isTyping },
        });
    }
};
