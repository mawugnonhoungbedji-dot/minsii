import { supabase } from './supabaseClient';
import { Teacher } from '../types';

export const favoriteService = {
    /**
     * Fetch all favorite teachers for the current user
     */
    async getFavorites(): Promise<Teacher[]> {
        try {
            // Migrated from getUser() to getSession() to avoid hangs
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return [];

            const { data, error } = await supabase
                .from('teacher_favorites')
                .select(`
                    teacher_id,
                    profiles:teacher_id (
                        id,
                        name,
                        location,
                        avatar_url,
                        role,
                        teacher_profiles (
                            subjects,
                            hourly_rate,
                            experience_years,
                            teaching_philosophy,
                            phone_number,
                            education,
                            availability,
                            rating,
                            reviews_count,
                            diploma_url,
                            levels,
                            bio,
                            is_verified
                        )
                    )
                `)
                .eq('user_id', session.user.id);

            if (error) {
                console.error('[FavoriteService] Error fetching favorites:', error);
                return [];
            }

            return (data || []).map((item: any) => {
                const profile = item.profiles;
                // Supabase may return a single object or an array for nested 1-to-1 relations
                const rawTp = profile?.teacher_profiles;
                const tp: Record<string, any> = Array.isArray(rawTp) ? (rawTp[0] ?? {}) : (rawTp ?? {});

                return {
                    id: profile.id,
                    name: profile.name,
                    subject: (tp.subjects)?.[0] || 'Enseignant',
                    rating: Number(tp.rating) || 0,
                    reviewsCount: Number(tp.reviews_count) || 0,
                    hourlyRate: Number(tp.hourly_rate) || 0,
                    bio: tp.bio || '',
                    avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`,
                    experience: `${tp.experience_years || 0} ans`,
                    education: tp.education || 'Non spécifié',
                    availability: tp.availability
                        ? (Array.isArray(tp.availability) ? tp.availability : Object.keys(tp.availability))
                        : [],
                    badges: [
                            ...(tp.is_verified ? ['Vérifié'] : []),
                            ...((Number(tp.rating) || 0) > 4.5 && (Number(tp.reviews_count) || 0) >= 3 ? ['Top Prof'] : [])
                        ],
                    location: profile.location || 'Bénin',
                    levels: tp.levels || [],
                    phoneNumber: tp.phone_number || '',
                    diplomaUrl: tp.diploma_url || undefined,
                    methodology: tp.teaching_philosophy || undefined,
                };
            });
        } catch (error) {
            console.error('[FavoriteService] getFavorites error:', error);
            return [];
        }
    },

    /**
     * Toggle a teacher in/out of favorites
     */
    async toggleFavorite(teacherId: string): Promise<{ isFavorite: boolean; error: Error | null }> {
        try {
            // Migrated from getUser() to getSession() to avoid hangs
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) throw new Error('Not authenticated');
            const userId = session.user.id;

            const { data: existing, error: fetchError } = await supabase
                .from('teacher_favorites')
                .select('id')
                .eq('user_id', userId)
                .eq('teacher_id', teacherId)
                .maybeSingle();

            if (fetchError) throw fetchError;

            if (existing) {
                const { error: deleteError } = await supabase
                    .from('teacher_favorites')
                    .delete()
                    .eq('id', existing.id);
                if (deleteError) throw deleteError;
                return { isFavorite: false, error: null };
            } else {
                const { error: insertError } = await supabase
                    .from('teacher_favorites')
                    .insert({ user_id: userId, teacher_id: teacherId });
                if (insertError) throw insertError;
                return { isFavorite: true, error: null };
            }
        } catch (error) {
            console.error('[FavoriteService] toggleFavorite error:', error);
            return { isFavorite: false, error: error as Error };
        }
    },

    /**
     * Check if a specific teacher is favorited
     */
    async isFavorite(teacherId: string): Promise<boolean> {
        try {
            // Migrated from getUser() to getSession() to avoid hangs
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return false;

            const { data, error } = await supabase
                .from('teacher_favorites')
                .select('id')
                .eq('user_id', session.user.id)
                .eq('teacher_id', teacherId)
                .maybeSingle();

            if (error) return false;
            return !!data;
        } catch (error) {
            return false;
        }
    },

    /**
     * Subscribe to favorite changes for a specific user (INSERT + DELETE)
     */
    subscribeToFavorites(userId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`favorites:user:${userId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'teacher_favorites',
                filter: `user_id=eq.${userId}`
            }, callback)
            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'teacher_favorites',
                filter: `user_id=eq.${userId}`
            }, callback)
            .subscribe();
    }
};
