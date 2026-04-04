import { supabase } from './supabaseClient';
import { ApiResponse } from '../types';

export interface Booking {
    id: string;
    teacher_id: string;
    student_id: string;
    subject: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    requested_date: string | null;
    created_at: string;
    teacher?: { id: string; name: string; avatar_url: string | null };
    student?: { id: string; name: string; avatar_url: string | null };
}

export const bookingService = {
    /**
     * Récupère les réservations pour l'utilisateur connecté (en tant qu'élève ou prof).
     */
    async getMyBookings(): Promise<ApiResponse<Booking[]>> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    teacher:profiles!teacher_id(id, name, avatar_url),
                    student:profiles!student_id(id, name, avatar_url)
                `)
                .or(`teacher_id.eq.${user.id},student_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data: data as any, error: null, success: true };
        } catch (error: any) {
            console.error('[BookingService] getMyBookings error:', error);
            return { data: [], error: error.message, success: false };
        }
    },

    /**
     * Crée une nouvelle demande de cours.
     */
    async createBooking(booking: { teacher_id: string; subject: string; requested_date?: string }): Promise<ApiResponse<Booking>> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const { data, error } = await supabase
                .from('bookings')
                .insert({
                    teacher_id: booking.teacher_id,
                    student_id: user.id,
                    subject: booking.subject,
                    requested_date: booking.requested_date || null,
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;
            return { data: data as any, error: null, success: true };
        } catch (error: any) {
            console.error('[BookingService] createBooking error:', error);
            return { data: null as any, error: error.message, success: false };
        }
    },

    /**
     * Met à jour le statut d'une réservation.
     */
    async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<ApiResponse<null>> {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status })
                .eq('id', bookingId);

            if (error) throw error;
            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[BookingService] updateBookingStatus error:', error);
            return { data: null, error: error.message, success: false };
        }
    },

    /**
     * Alias for getMyBookings for code consistency in DashboardClient.
     */
    async getClientBookings(): Promise<ApiResponse<Booking[]>> {
        return this.getMyBookings();
    },

    /**
     * Récupère la liste des mentors favoris de l'élève.
     */
    async getFavorites(): Promise<ApiResponse<any[]>> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const { data, error } = await supabase
                .from('teacher_favorites')
                .select(`
                    teacher_id,
                    profiles:teacher_id (
                        id,
                        name,
                        avatar_url,
                        location,
                        city_village,
                        teacher_profiles (
                            subjects,
                            hourly_rate,
                            experience_years,
                            rating,
                            reviews_count,
                            levels,
                            bio,
                            education,
                            availability,
                            phone_number,
                            diploma_url,
                            teaching_philosophy,
                            is_verified
                        )
                    )
                `)
                .eq('user_id', user.id);

            if (error) throw error;
            
            // Transformer en format Teacher (simplifié pour la démo/début)
            const teachers = data?.map(f => {
                const p = f.profiles as any;
                const t = p.teacher_profiles as any;
                return {
                    id: p.id,
                    name: p.name,
                    avatar: p.avatar_url,
                    subject: t.subjects?.[0] || 'Général',
                    rating: t.rating || 0,
                    location: p.city_village || p.location || 'Bénin',
                    experience: `${t.experience_years || 0} ans`,
                    hourlyRate: t.hourly_rate || 0,
                    bio: t.bio || '',
                    badges: t.is_verified ? ['Vérifié'] : [],
                    levels: t.levels || [],
                    education: t.education || '',
                    availability: t.availability || [],
                    phoneNumber: t.phone_number || '',
                    reviewsCount: t.reviews_count || 0
                };
            });

            return { data: teachers || [], error: null, success: true };
        } catch (error: any) {
            console.error('[BookingService] getFavorites error:', error);
            return { data: [], error: error.message, success: false };
        }
    },

    async addFavorite(teacherId: string): Promise<ApiResponse<null>> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const { error } = await supabase
                .from('teacher_favorites')
                .upsert({ user_id: user.id, teacher_id: teacherId });

            if (error) throw error;
            return { data: null, error: null, success: true };
        } catch (error: any) {
            return { data: null, error: error.message, success: false };
        }
    },

    async removeFavorite(teacherId: string): Promise<ApiResponse<null>> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const { error } = await supabase
                .from('teacher_favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('teacher_id', teacherId);

            if (error) throw error;
            return { data: null, error: null, success: true };
        } catch (error: any) {
            return { data: null, error: error.message, success: false };
        }
    },

    /**
     * Écoute les réservations où l'utilisateur est l'enseignant.
     * NOTE: Supabase Realtime ne supporte PAS les filtres or() composites.
     * On utilise deux canaux distincts, un par rôle.
     */
    subscribeToBookingsAsTeacher(userId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`bookings:teacher:${userId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'bookings',
                filter: `teacher_id=eq.${userId}`
            }, callback)
            .subscribe();
    },

    /**
     * Écoute les réservations où l'utilisateur est l'étudiant.
     */
    subscribeToBookingsAsStudent(userId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`bookings:student:${userId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'bookings',
                filter: `student_id=eq.${userId}`
            }, callback)
            .subscribe();
    }
};
