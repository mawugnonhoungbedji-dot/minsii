import { supabase } from './supabaseClient';
import { UserPreferences } from '../types/preferences';

const STORAGE_KEY = 'minsii_user_preferences';

export const preferencesService = {
    /**
     * Calcule l'objet preferences final à partir des données DB
     */
    mapRowToPreferences(row: any): UserPreferences {
        return {
            studentLevel: row.student_level,
            primaryGoal: row.primary_goal,
            subjects: row.subjects || [],
            location: row.location,
            maxBudget: row.max_budget,
            preferredSchedule: row.preferred_schedule || [],
            urgency: row.urgency,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    },

    /**
     * Sauvegarde les préférences (Supabase + LocalStorage fallback)
     */
    async savePreferences(preferences: Omit<UserPreferences, 'createdAt' | 'updatedAt'>): Promise<UserPreferences> {
        const now = new Date().toISOString();
        const existingLocal = this.getPreferencesLocal();

        const savedPreferences: UserPreferences = {
            ...preferences,
            createdAt: existingLocal?.createdAt || now,
            updatedAt: now
        };

        // 1. Sauvegarde locale (immédiate)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPreferences));

        // 2. Sauvegarde Supabase (si connecté)
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { error } = await (supabase as any)
                    .from('user_preferences')
                    .upsert({
                        user_id: session.user.id,
                        student_level: preferences.studentLevel,
                        primary_goal: preferences.primaryGoal,
                        subjects: preferences.subjects,
                        location: preferences.location,
                        max_budget: preferences.maxBudget,
                        preferred_schedule: preferences.preferredSchedule,
                        updated_at: now,
                        urgency: preferences.urgency
                    });
                if (error) console.warn('[PreferencesService] Remote save failed:', error);
            }
        } catch (e) {
            console.error('[PreferencesService] savePreferences error:', e);
        }

        return savedPreferences;
    },

    /**
     * Récupère les préférences depuis LocalStorage (synchrone)
     */
    getPreferencesLocal(): UserPreferences | null {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    },

    /**
     * Récupère et synchronise les préférences (Asynchrone)
     */
    async getPreferences(): Promise<UserPreferences | null> {
        // Priorité 1: Session Supabase
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const { data, error } = await (supabase as any)
                    .from('user_preferences')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();

                if (data && !error) {
                    const mapped = this.mapRowToPreferences(data);
                    // Sync local storage if different
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
                    return mapped;
                }
            }
        } catch (e) {
            console.warn('[PreferencesService] Remote fetch failed, using local.');
        }

        // Priorité 2: LocalStorage
        return this.getPreferencesLocal();
    },

    /**
     * Vérifie si l'onboarding est terminé
     */
    hasCompletedOnboarding(): boolean {
        return this.getPreferencesLocal() !== null;
    },

    /**
     * Mise à jour partielle
     */
    async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences | null> {
        const existing = await this.getPreferences();
        if (!existing) return null;

        const updated: UserPreferences = {
            ...existing,
            ...updates,
            updatedAt: new Date().toISOString()
        };

        return this.savePreferences(updated);
    },

    /**
     * Nettoyage
     */
    async clearPreferences(): Promise<void> {
        localStorage.removeItem(STORAGE_KEY);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await (supabase as any).from('user_preferences').delete().eq('user_id', session.user.id);
            }
        } catch (e) {}
    }
};
