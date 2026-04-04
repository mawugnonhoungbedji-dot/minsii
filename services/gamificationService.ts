import { supabase } from './supabaseClient';
import { TeacherStats, Achievement, WeeklyGoal, ACHIEVEMENT_DEFINITIONS, calculateLevel, AchievementType } from '../types/gamification';
import { Teacher } from '../types';

export const gamificationService = {
    // Get teacher stats from Supabase
    async getTeacherStats(teacherId: string): Promise<TeacherStats> {
        // Fetch XP and counts from teacher_profiles and contact_logs
        const [profileRes, unlockedRes, contactsCountRes, viewsCountRes, responseTimeRes] = await Promise.all([
            supabase.from('teacher_profiles').select('total_xp, rating, reviews_count, subjects, bio, diploma_url, availability, levels, teaching_philosophy').eq('id', teacherId).single(),
            supabase.from('teacher_achievements').select('achievement_type, unlocked_at').eq('teacher_id', teacherId),
            supabase.from('contact_logs').select('*', { count: 'exact', head: true }).eq('teacher_id', teacherId).in('contact_type', ['whatsapp', 'call']),
            supabase.from('contact_logs').select('*', { count: 'exact', head: true }).eq('teacher_id', teacherId).eq('contact_type', 'view'),
            // Temps de réponse : délai moyen entre 1er message reçu et 1ère réponse
            supabase.from('messages').select('created_at, sender_id, receiver_id').or(`sender_id.eq.${teacherId},receiver_id.eq.${teacherId}`).order('created_at', { ascending: true }).limit(100)
        ]);

        const profile = profileRes.data;
        const unlocked = unlockedRes.data;
        const totalXp = profile?.total_xp || 0;
        const currentLevel = calculateLevel(totalXp);
        const unlockedMap = new Map(unlocked?.map(a => [a.achievement_type, a.unlocked_at]) || []);

        // Calculate profile completion
        let completionScore = 0;
        if (profile) {
            if (profile.subjects && profile.subjects.length > 0) completionScore += 20;
            if (profile.bio || profile.teaching_philosophy) completionScore += 20;
            if (profile.diploma_url) completionScore += 20;
            if (profile.availability && Object.keys(profile.availability as object).length > 0) completionScore += 20;
            if (profile.levels && profile.levels.length > 0) completionScore += 20;
        }

        // Estimate response time: median minutes between first received message and first reply per thread
        let responseTime = 0;
        const msgs = responseTimeRes.data || [];
        if (msgs.length >= 2) {
            const firstReceived = msgs.find((m: any) => m.receiver_id === teacherId);
            const firstReply = firstReceived
                ? msgs.find((m: any) => m.sender_id === teacherId && m.created_at > firstReceived.created_at)
                : null;
            if (firstReceived && firstReply) {
                const diffMinutes = Math.round(
                    (new Date(firstReply.created_at).getTime() - new Date(firstReceived.created_at).getTime()) / 60000
                );
                responseTime = Math.min(diffMinutes, 1440); // cap at 24h
            }
        }

        // Fetch weekly goals with real DB data
        const weeklyGoals = await this.generateWeeklyGoals(teacherId);

        const stats: TeacherStats = {
            totalXp,
            currentLevel,
            contactsCount: contactsCountRes.count || 0,
            viewsCount: viewsCountRes.count || 0,
            reviewsCount: profile?.reviews_count || 0,
            averageRating: Number(profile?.rating) || 0,
            responseTime,
            profileCompletion: completionScore,
            achievements: Object.values(ACHIEVEMENT_DEFINITIONS).map(def => ({
                ...def,
                unlocked: unlockedMap.has(def.type),
                unlockedAt: unlockedMap.get(def.type) || undefined,
                progress: def.target ? 0 : undefined
            })),
            weeklyGoals
        };

        return stats;
    },

    // Award XP and check for level up
    async awardXp(teacherId: string, xp: number, reason: string): Promise<{ leveledUp: boolean; newLevel?: number }> {
        const { data: profile, error: fetchError } = await supabase
            .from('teacher_profiles')
            .select('total_xp')
            .eq('id', teacherId)
            .single();

        if (fetchError) return { leveledUp: false };

        const oldXp = profile.total_xp || 0;
        const newXp = oldXp + xp;
        const oldLevel = calculateLevel(oldXp);
        const newLevel = calculateLevel(newXp);

        const { error: updateError } = await supabase
            .from('teacher_profiles')
            .update({ total_xp: newXp })
            .eq('id', teacherId);

        if (updateError) {
            console.error('Error updating XP:', updateError);
            return { leveledUp: false };
        }

        return {
            leveledUp: newLevel > oldLevel,
            newLevel: newLevel > oldLevel ? newLevel : undefined
        };
    },

    // Unlock achievement
    async unlockAchievement(teacherId: string, achievementType: AchievementType): Promise<boolean> {
        // Check if already unlocked locally/cached or just try to insert
        const { error } = await supabase
            .from('teacher_achievements')
            .insert({
                teacher_id: teacherId,
                achievement_type: achievementType
            });

        if (error) {
            if (error.code === '23505') return false; // Unique violation, already unlocked
            console.error('Error unlocking achievement:', error);
            return false;
        }

        // Award XP
        const achievementDef = ACHIEVEMENT_DEFINITIONS[achievementType];
        if (achievementDef) {
            await this.awardXp(teacherId, achievementDef.xpReward, `Achievement: ${achievementDef.title}`);
        }

        return true;
    },

    // Record interaction and update stats
    async recordInteraction(teacherId: string, type: 'view' | 'contact'): Promise<void> {
        // This is now handled via Supabase triggers or explicit calls in other services
        // but we can trigger achievements here if needed.
        if (type === 'contact') {
            await this.unlockAchievement(teacherId, 'first_contact');
        }
    },

    // Calculate profile completion
    calculateProfileCompletion(teacher: Teacher): number {
        let score = 0;
        const maxScore = 10;

        if (teacher.name && teacher.subject && teacher.bio) score += 3;
        if (teacher.diplomaUrl) score += 2;
        if (teacher.methodology) score += 2;
        if (teacher.availability.length >= 3) score += 1;
        if (teacher.levels.length >= 2) score += 1;
        if (teacher.avatar) score += 1;

        return Math.round((score / maxScore) * 100);
    },

    // Generate weekly goals with REAL progress from DB
    async generateWeeklyGoals(teacherId: string): Promise<WeeklyGoal[]> {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Start of current week (Monday)
        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        const day = startOfWeek.getDay();
        const diffToMonday = (day === 0 ? -6 : 1 - day);
        startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);

        // Fetch contacts this week and profile completion in parallel
        const [weekContactsRes, profileRes] = await Promise.all([
            supabase
                .from('contact_logs')
                .select('*', { count: 'exact', head: true })
                .eq('teacher_id', teacherId)
                .in('contact_type', ['whatsapp', 'call'])
                .gte('created_at', startOfWeek.toISOString()),
            supabase
                .from('teacher_profiles')
                .select('subjects, bio, diploma_url, availability, levels, teaching_philosophy')
                .eq('id', teacherId)
                .single()
        ]);

        const weeklyContacts = weekContactsRes.count || 0;

        // Calculate profile completion dynamically
        let completionScore = 0;
        const profile = profileRes.data;
        if (profile) {
            if (profile.subjects && profile.subjects.length > 0) completionScore += 20;
            if (profile.bio || profile.teaching_philosophy) completionScore += 20;
            if (profile.diploma_url) completionScore += 20;
            if (profile.availability && Object.keys(profile.availability as object).length > 0) completionScore += 20;
            if (profile.levels && profile.levels.length > 0) completionScore += 20;
        }

        return [
            {
                id: '1',
                title: 'Recevoir 5 contacts',
                description: 'Objectif hebdomadaire',
                target: 5,
                current: weeklyContacts,
                xpReward: 30,
                deadline: nextWeek.toISOString(),
                completed: weeklyContacts >= 5
            },
            {
                id: '2',
                title: 'Compléter votre profil',
                description: 'Atteindre 100% de complétion',
                target: 100,
                current: completionScore,
                xpReward: 50,
                deadline: nextWeek.toISOString(),
                completed: completionScore >= 100
            }
        ];
    }
};
