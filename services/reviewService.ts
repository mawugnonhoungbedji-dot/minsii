import { supabase } from './supabaseClient';

export interface Review {
    id: string;
    teacherId: string;
    authorId?: string;
    authorName: string;
    authorPhone?: string;
    authorEmail?: string;
    authorAvatar?: string;
    rating: number;
    comment: string;
    date: string;
    isVerified: boolean; // Si posté par un utilisateur connecté
}

export const reviewService = {
    /**
     * Récupère tous les avis pour un enseignant spécifique.
     */
    async getReviewsForTeacher(teacherId: string): Promise<Review[]> {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('teacher_id', teacherId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erreur lors de la récupération des avis:', error);
            return [];
        }

        return data.map(r => ({
            id: r.id,
            teacherId: r.teacher_id,
            authorId: r.author_id,
            authorName: r.author_name,
            authorAvatar: r.author_avatar,
            rating: Number(r.rating),
            comment: r.comment,
            date: r.created_at,
            isVerified: r.is_verified
        }));
    },

    /**
     * Récupère tous les avis de la plateforme.
     */
    async getAllReviews(): Promise<Review[]> {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erreur lors de la récupération de tous les avis:', error);
            return [];
        }

        return data.map(r => ({
            id: r.id,
            teacherId: r.teacher_id,
            authorId: r.author_id,
            authorName: r.author_name,
            authorAvatar: r.author_avatar,
            rating: Number(r.rating),
            comment: r.comment,
            date: r.created_at,
            isVerified: r.is_verified
        }));
    },

    /**
     * Ajoute un nouvel avis pour un enseignant.
     */
    async addReview(review: Omit<Review, 'id' | 'date'>): Promise<Review | null> {
        // Migrated from getUser() to getSession() to avoid hangs
        const { data: { session } } = await supabase.auth.getSession();

        const { data, error } = await supabase
            .from('reviews')
            .insert({
                teacher_id: review.teacherId,
                author_id: session?.user?.id || null,
                author_name: review.authorName,
                author_avatar: review.authorAvatar,
                rating: review.rating,
                comment: review.comment,
                is_verified: !!session?.user
            })
            .select()
            .single();

        if (error) {
            console.error('Erreur lors de l\'ajout de l\'avis:', error);
            return null;
        }

        return {
            id: data.id,
            teacherId: data.teacher_id,
            authorId: data.author_id,
            authorName: data.author_name,
            authorAvatar: data.author_avatar,
            rating: Number(data.rating),
            comment: data.comment,
            date: data.created_at,
            isVerified: data.is_verified
        };
    },

    /**
     * Calcule la note moyenne d'un enseignant.
     */
    /**
     * Subscribe to new reviews for a specific teacher
     */
    subscribeToReviewsForTeacher(teacherId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`reviews:teacher:${teacherId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'reviews',
                filter: `teacher_id=eq.${teacherId}`
            }, callback)
            .subscribe();
    },

    async getAverageRating(teacherId: string): Promise<{ average: number; count: number }> {
        const { data, error } = await supabase
            .from('reviews')
            .select('rating')
            .eq('teacher_id', teacherId);

        if (error || !data || data.length === 0) return { average: 0, count: 0 };

        const sum = data.reduce((acc, r) => acc + Number(r.rating), 0);
        return {
            average: Math.round((sum / data.length) * 10) / 10,
            count: data.length
        };
    }
};
