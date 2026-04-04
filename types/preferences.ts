// User Preferences Types for Personalized Matching

export type PrimaryGoal =
    | 'exam'        // Réussir un examen (BEPC, BAC)
    | 'improve'     // Améliorer moyenne générale
    | 'remedial'    // Rattrapage matière spécifique
    | 'excellence'  // Excellence & mention
    | 'regular';    // Soutien régulier

export type Urgency =
    | 'immediate'   // Dans la semaine
    | 'this_month'  // Ce mois-ci
    | 'flexible';   // Flexible

export interface UserPreferences {
    userId?: string;
    studentLevel: string;        // "3ème", "Tle C", etc.
    primaryGoal: PrimaryGoal;
    subjects: string[];          // ["Mathématiques", "Physique"]
    location: string;            // "Cotonou - Akpakpa"
    maxBudget: number;           // Max FCFA/heure
    preferredSchedule: string[]; // ["Lundi Soir", "Samedi"]
    urgency: Urgency;
    createdAt: string;
    updatedAt: string;
}

export const AVAILABLE_LEVELS = [
    // Primaire
    'CI', 'CP', 'CE1', 'CE2', 'CM1', 'CM2',
    // Collège
    '6ème', '5ème', '4ème', '3ème',
    // Lycée général
    '2nde', '1ère A', '1ère C', '1ère D', 'Tle A', 'Tle C', 'Tle D',
    // Lycée technique
    '1ère G', 'Tle G',
    // Autre
    'Adulte', 'Université'
];

export const AVAILABLE_SUBJECTS = [
    'Mathématiques',
    'Physique-Chimie (PCT)',
    'SVT',
    'Français & Philo',
    'Anglais',
    'Espagnol',
    'Histoire-Géographie',
    'Philosophie',
    'Comptabilité & Gestion',
    'Soutien Scolaire Primaire'
];

export const GOAL_LABELS: Record<PrimaryGoal, string> = {
    exam: '🎯 Réussir un examen (BEPC/BAC)',
    improve: '📈 Améliorer la moyenne',
    remedial: '🆘 Rattrapage de matière',
    excellence: '🚀 Viser l\'excellence',
    regular: '📚 Soutien régulier'
};

export const URGENCY_LABELS: Record<Urgency, string> = {
    immediate: '⚡ Urgent (cette semaine)',
    this_month: '📅 Ce mois-ci',
    flexible: '🕐 Flexible'
};
