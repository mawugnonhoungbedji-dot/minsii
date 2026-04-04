import { supabase } from './supabaseClient';

export interface ContactHistory {
    id: string;
    teacherId: string;
    teacherName: string;
    studentName?: string; // Nom de l'étudiant ou parent qui a contacté
    contactType: 'whatsapp' | 'call' | 'view';
    date: string;
}

export const analyticsService = {
    /**
     * Enregistre un contact (WhatsApp, Appel ou Vue du profil) dans la base de données.
     */
    async recordContact(teacherId: string, teacherName: string, contactType: 'whatsapp' | 'call' | 'view', studentName?: string) {
        // Migrated from getUser() to getSession() to avoid hangs
        const { data: { session } } = await supabase.auth.getSession();

        const { error } = await supabase
            .from('contact_logs')
            .insert({
                teacher_id: teacherId,
                parent_id: session?.user?.id || null,
                contact_type: contactType,
                student_name: studentName || 'Visiteur'
            });

        if (error) {
            console.error('Erreur lors de l\'enregistrement du contact:', error);
        }
    },

    /**
     * Récupère l'historique des contacts du client connecté.
     * BUGFIX: filtre par parent_id pour isoler les contacts de l'utilisateur courant.
     */
    async getContactHistory(): Promise<ContactHistory[]> {
        // Migrated from getUser() to getSession() — safe, no hang risk
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return [];

        const { data, error } = await supabase
            .from('contact_logs')
            .select(`
                id,
                teacher_id,
                contact_type,
                created_at,
                student_name,
                profiles:teacher_id (name)
            `)
            .eq('parent_id', session.user.id)   // ← BUGFIX: was missing this filter
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Erreur lors de la récupération de l\'historique:', error);
            return [];
        }

        return data.map((item: any) => ({
            id: item.id,
            teacherId: item.teacher_id,
            teacherName: item.profiles?.name || 'Enseignant inconnu',
            studentName: item.student_name,
            contactType: item.contact_type as 'whatsapp' | 'call' | 'view',
            date: item.created_at
        }));
    },

    /**
     * Récupère l'historique des interactions pour un enseignant spécifique.
     */
    async getTeacherInteractions(teacherId: string): Promise<ContactHistory[]> {
        const { data, error } = await supabase
            .from('contact_logs')
            .select('*')
            .eq('teacher_id', teacherId)
            .order('created_at', { ascending: false })
            .limit(50); // Optimization: avoid loading infinite history by default

        if (error) {
            console.error('Erreur lors de la récupération des interactions de l\'enseignant:', error);
            return [];
        }

        return data.map(item => ({
            id: item.id,
            teacherId: item.teacher_id,
            teacherName: '',
            studentName: item.student_name,
            contactType: item.contact_type as 'whatsapp' | 'call' | 'view',
            date: item.created_at
        }));
    },

    /**
     * Récupère les statistiques de contact pour un enseignant.
     * Optimisé: utilise { count: 'exact', head: true } — aucune donnée chargée, juste le COUNT SQL
     */
    async getTeacherStats(teacherId: string): Promise<{ whatsapp: number; call: number; view: number }> {
        const [whatsappRes, callRes, viewRes] = await Promise.all([
            supabase
                .from('contact_logs')
                .select('*', { count: 'exact', head: true })
                .eq('teacher_id', teacherId)
                .eq('contact_type', 'whatsapp'),
            supabase
                .from('contact_logs')
                .select('*', { count: 'exact', head: true })
                .eq('teacher_id', teacherId)
                .eq('contact_type', 'call'),
            supabase
                .from('contact_logs')
                .select('*', { count: 'exact', head: true })
                .eq('teacher_id', teacherId)
                .eq('contact_type', 'view'),
        ]);

        return {
            whatsapp: whatsappRes.count || 0,
            call: callRes.count || 0,
            view: viewRes.count || 0,
        };
    },

    /**
     * Récupère toutes les statistiques de tous les enseignants.
     */
    async getAllTeacherStats(): Promise<Record<string, { whatsapp: number; call: number; view: number }>> {
        const { data, error } = await supabase
            .from('contact_logs')
            .select('teacher_id, contact_type');

        const statsMap: Record<string, { whatsapp: number; call: number; view: number }> = {};
        if (error || !data) return statsMap;

        data.forEach(item => {
            if (!statsMap[item.teacher_id]) {
                statsMap[item.teacher_id] = { whatsapp: 0, call: 0, view: 0 };
            }
            if (item.contact_type in statsMap[item.teacher_id]) {
                statsMap[item.teacher_id][item.contact_type as keyof (typeof statsMap)[string]]++;
            }
        });
        return statsMap;
    },

    /**
     * Subscribe to new contact logs for a specific parent (filtered)
     * Bug fix: was broadcasting ALL contacts to everyone — now filtered by parent_id
     */
    subscribeToContacts(userId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`contact_logs:parent:${userId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'contact_logs',
                filter: `parent_id=eq.${userId}`
            }, callback)
            .subscribe();
    },

    /**
     * Subscribe to new contact logs for a specific teacher
     */
    subscribeToContactsForTeacher(teacherId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`contact_logs:teacher:${teacherId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'contact_logs',
                filter: `teacher_id=eq.${teacherId}`
            }, callback)
            .subscribe();
    }
};
