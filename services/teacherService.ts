import { supabase } from './supabaseClient';
import { Teacher, ApiResponse } from '../types';

import { withTimeout } from './utils';


/** 
 * Convertit une ligne brute de la DB en objet Teacher typé.
 * Gère les jointures imbriquées et les valeurs par défaut.
 */
function rowToTeacher(item: any): Teacher {
    // Dans une jointure unique, teacher_profiles est un objet. 
    const tp = Array.isArray(item.teacher_profiles) ? item.teacher_profiles[0] : item.teacher_profiles;
    
    const rating = Number(tp?.rating) || 0;
    const reviewsCount = Number(tp?.reviews_count) || 0;
    const isVerified = tp?.is_verified === true;

    const badges: string[] = [];
    if (isVerified) badges.push('Vérifié');
    if (rating > 4.5 && reviewsCount > 5) badges.push('Top Prof');

    return {
        id: item.id,
        name: item.name || 'Enseignant',
        subject: (tp?.subjects)?.[0] || 'Enseignant',
        rating,
        reviewsCount,
        hourlyRate: Number(tp?.hourly_rate) || 0,
        bio: tp?.bio || '',
        avatar: item.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'U')}&background=random`,
        experience: `${tp?.experience_years || 0} ans`,
        education: tp?.education || 'Non spécifié',
        availability: tp?.availability ? (Array.isArray(tp.availability) ? tp.availability : Object.keys(tp.availability)) : [],
        badges,
        location: item.location || 'Bénin',
        city_village: item.city_village || undefined,
        levels: tp?.levels || [],
        phoneNumber: tp?.phone_number || '',
        diplomaUrl: tp?.diploma_url || undefined,
        methodology: tp?.teaching_philosophy || undefined,
    };
}

export const teacherService = {
    /**
     * Récupère tous les enseignants vérifiés.
     */
    async getAllTeachers(): Promise<ApiResponse<Teacher[]>> {
        try {
            console.log('[TeacherService] Fetching all verified teachers...');
            const { data, error } = await withTimeout(
                supabase
                    .from('profiles')
                    .select(`
                        id,
                        name,
                        location,
                        city_village,
                        avatar_url,
                        role,
                        teacher_profiles!inner (
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
                    `)
                    .eq('role', 'teacher')
                    .eq('teacher_profiles.is_verified', true)
            );

            if (error) {
                console.error('[TeacherService] getAllTeachers precision error:', error);
                throw error;
            }

            console.log(`[TeacherService] Found ${data?.length || 0} verified teachers.`);
            const teachers = (data || []).map(rowToTeacher);
            return { data: teachers, error: null, success: true };
        } catch (error: any) {
            console.error('[TeacherService] getAllTeachers critical error:', error);
            return { data: [], error: 'Échec de la récupération des mentors.', success: false };
        }
    },

    /**
     * Recherche d'enseignants via RPC.
     */
    async getMatchedTeachers(
        subjects: string[] = [],
        level: string = '',
        maxBudget: number = 999999
    ): Promise<ApiResponse<Teacher[]>> {
        try {
            const { data, error } = await withTimeout(
                supabase.rpc('match_teachers_prefilter', {
                    p_subjects: subjects.length > 0 ? subjects : null,
                    p_level: level || null,
                    p_max_budget: maxBudget,
                })
            );

            if (error) throw error;

            const teachers = (data as any[]).map(row => ({
                id: row.id,
                name: row.name,
                subject: row.subjects?.[0] || 'Enseignant',
                rating: row.rating || 0,
                reviewsCount: row.reviews_count || 0,
                hourlyRate: row.hourly_rate || 0,
                bio: row.bio || row.teaching_philosophy || '',
                avatar: row.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=random`,
                experience: `${row.experience_years || 0} ans`,
                education: row.education || 'Non spécifié',
                availability: row.availability ? (Array.isArray(row.availability) ? row.availability : Object.keys(row.availability)) : [],
                badges: (row.rating || 0) > 4.5 ? ['Vérifié', 'Top Prof'] : ['Vérifié'],
                location: row.location || 'Bénin',
                city_village: row.city_village || undefined,
                levels: row.levels || [],
                phoneNumber: row.phone_number || '',
                diplomaUrl: row.diploma_url || undefined,
                methodology: row.teaching_philosophy || undefined,
            }));

            return { data: teachers, error: null, success: true };
        } catch (error: any) {
            console.error('[TeacherService] getMatchedTeachers error:', error);
            return { data: [], error: 'Erreur lors du matching.', success: false };
        }
    },

    /**
     * Récupère un enseignant par son ID.
     */
    async getTeacherById(id: string): Promise<ApiResponse<Teacher>> {
        try {
            console.log(`[TeacherService] Fetching profile for ID: ${id}`);
            const { data, error } = await withTimeout(
                supabase
                    .from('profiles')
                    .select(`
                        id,
                        name,
                        location,
                        city_village,
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
                    `)
                    .eq('id', id)
                    .single()
            );

            if (error) {
                console.error(`[TeacherService] getTeacherById error for ${id}:`, error);
                throw error;
            }
            if (!data) {
                console.warn(`[TeacherService] No data found for ID: ${id}`);
                return { data: null, error: 'Mentor non trouvé.', success: false };
            }

            console.log(`[TeacherService] Profile found: ${data.name}`);
            return { data: rowToTeacher(data), error: null, success: true };
        } catch (error: any) {
            console.error('[TeacherService] getTeacherById critical error:', error);
            return { data: null, error: 'Erreur lors de la récupération du profil.', success: false };
        }
    },

    /**
     * Compte le nombre total d'enseignants.
     */
    async countTotalTeachers(): Promise<ApiResponse<number>> {
        try {
            // Augmentation du timeout à 20s pour le comptage de masse (plus lent)
            const { count, error } = await withTimeout(
                supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'teacher'),
                20_000
            );

            if (error) {
                console.warn('[TeacherService] Supabase count error details:', error);
                throw error;
            }
            return { data: count || 0, error: null, success: true };
        } catch (error: any) {
            console.error('[TeacherService] countTotalTeachers critical error:', error);
            // Retourne 0 par défaut pour ne pas bloquer l'UI
            return { data: 0, error: 'Impossible de synchroniser le nombre de mentors.', success: false };
        }
    },

    /**
     * Postuler pour devenir mentor.
     */
    async applyToBeMentor(application: {
        full_name: string;
        email: string;
        subject: string;
        bio: string;
    }): Promise<ApiResponse<null>> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const { error } = await withTimeout(
                supabase
                    .from('mentor_applications')
                    .insert({
                        ...application,
                        user_id: session?.user?.id || null,
                        status: 'pending'
                    })
            );

            if (error) throw error;
            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[TeacherService] applyToBeMentor error:', error);
            return { data: null, error: error.message || 'Erreur lors de l\'envoi.', success: false };
        }
    },

    /**
     * Upload le diplôme.
     */
    async uploadDiploma(file: File): Promise<ApiResponse<string>> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié.');

            const fileExt = file.name.split('.').pop();
            const fileName = `diploma-${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await withTimeout(
                supabase.storage
                    .from('diplomas')
                    .upload(filePath, file)
            );

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('diplomas')
                .getPublicUrl(filePath);

            const { error: updateError } = await withTimeout(
                supabase
                    .from('teacher_profiles')
                    .update({ diploma_url: publicUrl })
                    .eq('id', user.id)
            );

            if (updateError) throw updateError;

            return { data: publicUrl, error: null, success: true };
        } catch (error: any) {
            console.error('[TeacherService] uploadDiploma error:', error);
            return { data: null, error: error.message || 'Échec de l\'envoi du diplôme.', success: false };
        }
    },

    /**
     * Supprime le diplôme.
     */
    async deleteDiploma(url: string): Promise<ApiResponse<null>> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié.');

            const parts = url.split('/diplomas/');
            if (parts.length < 2) throw new Error('URL invalide.');
            const filePath = parts[1];

            const { error: removeError } = await withTimeout(
                supabase.storage
                    .from('diplomas')
                    .remove([filePath])
            );

            if (removeError) throw removeError;

            const { error: updateError } = await withTimeout(
                supabase
                    .from('teacher_profiles')
                    .update({ diploma_url: null })
                    .eq('id', user.id)
            );

            if (updateError) throw updateError;

            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[TeacherService] deleteDiploma error:', error);
            return { data: null, error: error.message || 'Erreur lors de la suppression.', success: false };
        }
    }
};

