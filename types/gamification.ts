// Gamification Types for Teacher Dashboard
import {
    Sprout, BookOpen, Star, GraduationCap, Gem, Trophy, Crown, Sparkles, Orbit, Flame,
    Mail, Zap, Award, CheckCircle, User, Lightbulb, Calendar, Eye, LucideIcon
} from 'lucide-react';

export type AchievementType =
    | 'first_contact'      // Premier contact reçu
    | 'star_rising'        // 10 contacts
    | 'popular_mentor'     // 50 contacts
    | 'flash_response'     // Réponse < 2h
    | 'perfect_rating'     // 5.0 rating avec 10+ avis
    | 'certified_mentor'   // Diplôme vérifié
    | 'profile_master'     // Profil 100% complet
    | 'methodology_guru'   // Méthodologie renseignée
    | 'available_24_7'     // 5+ créneaux dispo
    | 'review_champion'    // 25+ avis
    | 'engagement_king';   // 100+ vues profil

export interface Achievement {
    type: AchievementType;
    title: string;
    description: string;
    icon: LucideIcon;
    xpReward: number;
    unlocked: boolean;
    unlockedAt?: string;
    progress?: number;  // 0-100 for progressive achievements
    target?: number;    // Required count for progressive achievements
}

export interface TeacherLevel {
    level: number;       // 1-10
    title: string;       // "Débutant", "Pro", "Expert", "Maître"
    minXp: number;
    maxXp: number;
    icon: LucideIcon;    // Icon for this level
    perks: string[];     // Benefits at this level
}

export interface TeacherStats {
    totalXp: number;
    currentLevel: number;
    contactsCount: number;
    viewsCount: number;
    reviewsCount: number;
    averageRating: number;
    responseTime: number; // in hours
    profileCompletion: number; // 0-100
    achievements: Achievement[];
    weeklyGoals: WeeklyGoal[];
}

export interface WeeklyGoal {
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    xpReward: number;
    deadline: string;
    completed: boolean;
}

// Level Definitions
export const TEACHER_LEVELS: TeacherLevel[] = [
    { level: 1, title: 'Débutant', minXp: 0, maxXp: 100, icon: Sprout, perks: ['Profil public'] },
    { level: 2, title: 'Apprenti', minXp: 100, maxXp: 300, icon: BookOpen, perks: ['Badge Nouveau'] },
    { level: 3, title: 'Confirmé', minXp: 300, maxXp: 600, icon: Star, perks: ['Boost visibilité +10%'] },
    { level: 4, title: 'Expérimenté', minXp: 600, maxXp: 1000, icon: GraduationCap, perks: ['Badge Vérifié'] },
    { level: 5, title: 'Professionnel', minXp: 1000, maxXp: 1500, icon: Gem, perks: ['Top 20% recherches'] },
    { level: 6, title: 'Expert', minXp: 1500, maxXp: 2200, icon: Trophy, perks: ['Badge Top Prof'] },
    { level: 7, title: 'Maître', minXp: 2200, maxXp: 3000, icon: Crown, perks: ['Featured homepage'] },
    { level: 8, title: 'Virtuose', minXp: 3000, maxXp: 4000, icon: Sparkles, perks: ['Priorité support'] },
    { level: 9, title: 'Légende', minXp: 4000, maxXp: 5500, icon: Orbit, perks: ['Badge Légende'] },
    { level: 10, title: 'Icône', minXp: 5500, maxXp: Infinity, icon: Flame, perks: ['Hall of Fame'] }
];

// Achievement Definitions
export const ACHIEVEMENT_DEFINITIONS: Record<AchievementType, Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>> = {
    first_contact: {
        type: 'first_contact',
        title: 'Premier Contact',
        description: 'Recevoir votre premier message',
        icon: Mail,
        xpReward: 10
    },
    star_rising: {
        type: 'star_rising',
        title: 'Étoile Montante',
        description: 'Recevoir 10 contacts',
        icon: Star,
        xpReward: 50,
        target: 10
    },
    popular_mentor: {
        type: 'popular_mentor',
        title: 'Mentor Populaire',
        description: 'Recevoir 50 contacts',
        icon: Sparkles,
        xpReward: 150,
        target: 50
    },
    flash_response: {
        type: 'flash_response',
        title: 'Flash Response',
        description: 'Répondre en moins de 2h',
        icon: Zap,
        xpReward: 30
    },
    perfect_rating: {
        type: 'perfect_rating',
        title: 'Perfection',
        description: 'Obtenir 5.0/5 avec 10+ avis',
        icon: Award,
        xpReward: 100
    },
    certified_mentor: {
        type: 'certified_mentor',
        title: 'Mentor Certifié',
        description: 'Diplôme vérifié ajouté',
        icon: CheckCircle,
        xpReward: 40
    },
    profile_master: {
        type: 'profile_master',
        title: 'Profil Parfait',
        description: 'Compléter 100% du profil',
        icon: User,
        xpReward: 80
    },
    methodology_guru: {
        type: 'methodology_guru',
        title: 'Pédagogue',
        description: 'Ajouter votre méthodologie',
        icon: Lightbulb,
        xpReward: 35
    },
    available_24_7: {
        type: 'available_24_7',
        title: 'Toujours Disponible',
        description: '5+ créneaux horaires',
        icon: Calendar,
        xpReward: 25
    },
    review_champion: {
        type: 'review_champion',
        title: 'Champion des Avis',
        description: 'Recevoir 25+ avis',
        icon: Trophy,
        xpReward: 120,
        target: 25
    },
    engagement_king: {
        type: 'engagement_king',
        title: "Roi de l'Engagement",
        description: '100+ vues de profil',
        icon: Eye,
        xpReward: 60,
        target: 100
    }
};

// Helper to calculate level from XP
export function calculateLevel(xp: number): number {
    for (let i = TEACHER_LEVELS.length - 1; i >= 0; i--) {
        if (xp >= TEACHER_LEVELS[i].minXp) {
            return TEACHER_LEVELS[i].level;
        }
    }
    return 1;
}

// Helper to get XP needed for next level
export function getXpForNextLevel(currentXp: number): { current: number; needed: number; level: number } {
    const currentLevel = calculateLevel(currentXp);
    const levelData = TEACHER_LEVELS.find(l => l.level === currentLevel);

    if (!levelData || currentLevel === 10) {
        return { current: currentXp, needed: 0, level: currentLevel };
    }

    return {
        current: currentXp - levelData.minXp,
        needed: levelData.maxXp - levelData.minXp,
        level: currentLevel
    };
}
