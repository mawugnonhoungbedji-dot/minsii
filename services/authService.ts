import { supabase } from './supabaseClient';
import type { Database } from '../types/database';
import type { ApiResponse } from '../types';

export type UserRole = Database['public']['Enums']['user_role'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type StudentProfile = Database['public']['Tables']['student_profiles']['Row'];
export type TeacherProfile = Database['public']['Tables']['teacher_profiles']['Row'];
export type DirectorProfile = Database['public']['Tables']['director_profiles']['Row'];

export interface SignupData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    location?: string;
    // Student-specific
    level?: string;
    goals?: string;
    budget?: number;
    // Teacher-specific
    subjects?: string[];
    experience_years?: number;
    hourly_rate?: number;
    teaching_philosophy?: string;
    phone_number?: string;
    education?: string;
    // Director-specific
    establishment_name?: string;
    establishment_type?: string;
}

export interface AuthUser {
    email: string;
    profile: Profile;
    studentProfile?: StudentProfile;
    teacherProfile?: TeacherProfile;
    directorProfile?: DirectorProfile;
}

let currentUserCache: AuthUser | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5000; // 5 seconds cache

const clearCache = () => {
    currentUserCache = null;
    lastFetchTime = 0;
};

export const authService = {
    /**
     * S'inscrire (Signup)
     * Crée l'entrée auth.users et déclenche public.handle_new_user()
     */
    async signup(data: SignupData): Promise<ApiResponse<AuthUser>> {
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                        role: data.role,
                        location: data.location || null,
                        level: data.level || null,
                        goals: data.goals || null,
                        budget: data.budget || null,
                        subjects: data.subjects || [],
                        experience_years: data.experience_years || 0,
                        hourly_rate: data.hourly_rate || null,
                        teaching_philosophy: data.teaching_philosophy || null,
                        phone_number: data.phone_number || null,
                        education: data.education || null,
                        establishment_name: data.establishment_name || null,
                        establishment_type: data.establishment_type || null,
                    },
                    emailRedirectTo: window.location.origin,
                },
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('Échec de la création de compte');

            const user = await this.getCurrentUser();
            return { data: user, error: null, success: true };
        } catch (error: any) {
            console.error('[AuthService] Signup error:', error);
            return { data: null, error: error.message || 'Erreur lors de l\'inscription', success: false };
        }
    },

    /**
     * Connexion (Login)
     */
    async login(email: string, password: string): Promise<ApiResponse<AuthUser>> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            if (!data.user) throw new Error('Échec de la connexion');

            const user = await this.getCurrentUser();
            return { data: user, error: null, success: true };
        } catch (error: any) {
            console.error('[AuthService] Login error:', error);
            return { data: null, error: error.message || 'Identifiants invalides', success: false };
        }
    },

    /**
     * Connexion avec Google
     */
    async signInWithGoogle(): Promise<ApiResponse<null>> {
        try {
            const redirectTo = window.location.origin;
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo,
                    queryParams: { access_type: 'offline', prompt: 'select_account' },
                },
            });
            if (error) throw error;
            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[AuthService] Google login error:', error);
            return { data: null, error: error.message || 'Échec de la connexion Google', success: false };
        }
    },

    /**
     * Mot de passe oublié (Envoi de l'email de réinitialisation)
     */
    async resetPasswordForEmail(email: string): Promise<ApiResponse<null>> {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/login`,
            });
            if (error) throw error;
            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[AuthService] Reset password error:', error);
            return { data: null, error: error.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation', success: false };
        }
    },

    /**
     * Déconnexion
     */
    async logout(): Promise<ApiResponse<null>> {
        try {
            clearCache();
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[AuthService] Logout error:', error);
            return { data: null, error: error.message || 'Erreur lors de la déconnexion', success: false };
        }
    },

    /**
     * Récupérer l'utilisateur actuel avec son profil complet (Jointure unique)
     * Optimisé chirurgicalement pour éviter les round-trips multiples.
     */
    async getCurrentUser(): Promise<AuthUser | null> {
        try {
            const now = Date.now();
            if (currentUserCache && (now - lastFetchTime < CACHE_DURATION)) {
                return currentUserCache;
            }

            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                currentUserCache = null;
                return null;
            }

            // Récupération jointe en une seule passe
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select(`
                    *,
                    student_profiles(*),
                    teacher_profiles(*),
                    director_profiles(*)
                `)
                .eq('id', user.id)
                .single();

            if (profileError || !profile) {
                console.error('[AuthService] Profile fetch error:', profileError);
                currentUserCache = null;
                return null;
            }

            const result: AuthUser = {
                email: user.email || '',
                profile: profile as any,
                studentProfile: profile.student_profiles?.[0] || profile.student_profiles || undefined,
                teacherProfile: profile.teacher_profiles?.[0] || profile.teacher_profiles || undefined,
                directorProfile: profile.director_profiles?.[0] || profile.director_profiles || undefined
            };

            currentUserCache = result;
            lastFetchTime = now;
            return result;
        } catch (error) {
            console.error('[AuthService] getCurrentUser error:', error);
            currentUserCache = null;
            return null;
        }
    },

    /**
     * Récupérer la session active
     */
    async getSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    },

    /**
     * Mettre à jour le profil utilisateur (Table profiles)
     */
    async updateProfile(updates: Partial<Profile>): Promise<ApiResponse<null>> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const sanitized = { ...updates };
            // Empêcher la mise à jour des champs virtuels via cette méthode
            const virtualFields = ['unread_count', 'teacher_profiles', 'student_profiles', 'director_profiles'];
            virtualFields.forEach(field => delete (sanitized as any)[field]);

            const { error } = await supabase
                .from('profiles')
                .update(sanitized)
                .eq('id', user.id);

            if (error) throw error;
            clearCache();
            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[AuthService] Update profile error:', error);
            return { data: null, error: error.message || 'Erreur lors de la mise à jour', success: false };
        }
    },

    /**
     * Mettre à jour le profil spécifique enseignant
     */
    async updateTeacherProfile(updates: Database['public']['Tables']['teacher_profiles']['Update']): Promise<ApiResponse<null>> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const { error } = await supabase
                .from('teacher_profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;
            clearCache();
            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[AuthService] Update teacher profile error:', error);
            return { data: null, error: error.message || 'Erreur lors de la mise à jour', success: false };
        }
    },

    /**
     * Mettre à jour le profil spécifique élève
     */
    async updateStudentProfile(updates: Database['public']['Tables']['student_profiles']['Update']): Promise<ApiResponse<null>> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const { error } = await supabase
                .from('student_profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;
            clearCache();
            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[AuthService] Update student profile error:', error);
            return { data: null, error: error.message || 'Erreur lors de la mise à jour', success: false };
        }
    },

    /**
     * Alias pour updateStudentProfile utilisé dans le DashboardClient.
     */
    async updateClientProfile(updates: Database['public']['Tables']['student_profiles']['Update']): Promise<ApiResponse<null>> {
        return this.updateStudentProfile(updates);
    },

    /**
     * Mettre à jour le profil spécifique directeur
     */
    async updateDirectorProfile(updates: Database['public']['Tables']['director_profiles']['Update']): Promise<ApiResponse<null>> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const { error } = await supabase
                .from('director_profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;
            clearCache();
            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[AuthService] Update director profile error:', error);
            return { data: null, error: error.message || 'Erreur lors de la mise à jour', success: false };
        }
    },

    /**
     * Mettre à jour le mot de passe
     */
    async updatePassword(newPassword: string): Promise<ApiResponse<null>> {
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[AuthService] Update password error:', error);
            return { data: null, error: error.message || 'Erreur lors du changement de mot de passe', success: false };
        }
    },

    /**
     * Upload de l'avatar vers Supabase Storage
     */
    async uploadAvatar(file: File): Promise<ApiResponse<string>> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            clearCache();
            return { data: publicUrl, error: null, success: true };
        } catch (error: any) {
            console.error('[AuthService] Upload avatar error:', error);
            return { data: null, error: error.message || 'Erreur lors de l\'envoi de l\'image', success: false };
        }
    },

    /**
     * Suppression de l'avatar du Storage
     */
    async deleteAvatar(url: string): Promise<ApiResponse<null>> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non authentifié');

            const parts = url.split('/avatars/');
            if (parts.length < 2) throw new Error('URL d\'avatar invalide');
            const filePath = parts[1];

            const { error: removeError } = await supabase.storage
                .from('avatars')
                .remove([filePath]);

            if (removeError) throw removeError;

            const res = await this.updateProfile({ avatar_url: null });
            if (res.error) throw new Error(res.error);

            return { data: null, error: null, success: true };
        } catch (error: any) {
            console.error('[AuthService] Delete avatar error:', error);
            return { data: null, error: error.message || 'Erreur lors de la suppression de l\'image', success: false };
        }
    },

    /**
     * Écouter les changements d'état d'authentification
     */
    onAuthStateChange(callback: (user: AuthUser | null) => void) {
        return supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const user = await this.getCurrentUser();
                callback(user);
            } else {
                callback(null);
            }
        });
    },
};
