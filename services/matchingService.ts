import { Teacher, MatchingResult } from '../types';
import { UserPreferences, PrimaryGoal } from '../types/preferences';

// ============ PERSONALIZED MATCHING ============

/**
 * Enhanced matching algorithm that uses user preferences to score teachers
 * Scores are weighted based on user's primary goal and preferences
 */
export const matchTeacherWithPreferences = (
    teachers: Teacher[],
    preferences: UserPreferences,
    userQuery?: string
): MatchingResult[] => {
    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const scoredTeachers = teachers.map(teacher => {
        let score = 0;
        const reasons: string[] = [];

        // 1. SUBJECT MATCH (Critical - 40 points)
        const hasSubjectMatch = preferences.subjects.some(subject =>
            normalize(teacher.subject).includes(normalize(subject))
        );
        if (hasSubjectMatch) {
            score += 40;
            reasons.push(`✅ Enseigne ${teacher.subject}`);
        }

        // 2. LEVEL MATCH (20 points)
        const hasLevelMatch = teacher.levels.some(level =>
            normalize(level).includes(normalize(preferences.studentLevel)) ||
            normalize(preferences.studentLevel).includes(normalize(level))
        );
        if (hasLevelMatch) {
            score += 20;
            reasons.push(`✅ Expert niveau ${preferences.studentLevel}`);
        }

        // 3. LOCATION MATCH (15 points)
        if (normalize(teacher.location).includes(normalize(preferences.location)) ||
            normalize(preferences.location).includes(normalize(teacher.location))) {
            score += 15;
            reasons.push(`📍 Disponible à ${teacher.location}`);
        }

        // 4. BUDGET MATCH (10 points)
        if (teacher.hourlyRate <= preferences.maxBudget) {
            score += 10;
            reasons.push(`💰 Dans votre budget (${teacher.hourlyRate} FCFA/h)`);
        } else {
            // Penalty for expensive teachers
            score -= 5;
        }

        // 5. SCHEDULE COMPATIBILITY (10 points)
        const scheduleMatches = preferences.preferredSchedule.filter(slot =>
            teacher.availability.includes(slot)
        );
        if (scheduleMatches.length > 0) {
            score += Math.min(10, scheduleMatches.length * 3);
            reasons.push(`⏰ Disponible ${scheduleMatches.slice(0, 2).join(', ')}`);
        }

        // 6. GOAL-BASED SCORING (Bonus 0-25 points)
        const goalBonus = calculateGoalBonus(teacher, preferences.primaryGoal);
        score += goalBonus.score;
        if (goalBonus.reason) {
            reasons.push(goalBonus.reason);
        }

        // 7. URGENCY BOOST (5-10 points)
        if (preferences.urgency === 'immediate') {
            // Boost teachers with "Réponse Rapide" badge
            if (teacher.badges.includes('Réponse Rapide')) {
                score += 10;
                reasons.push(`⚡ Répond rapidement`);
            }
        }

        // 8. QUERY KEYWORDS (if provided) - 15 points
        if (userQuery) {
            const query = normalize(userQuery);
            const keywords = query.split(/\s+/).filter(w => w.length > 2);

            keywords.forEach(keyword => {
                if (normalize(teacher.bio).includes(keyword)) {
                    score += 5;
                }
            });
        }

        // 9. QUALITY INDICATORS (5 points)
        if (teacher.rating >= 4.8) {
            score += 5;
            reasons.push(`⭐ Excellent (${teacher.rating}/5)`);
        }

        return {
            teacherId: teacher.id,
            matchScore: score,
            reasoning: reasons.join(' • '),
            ...teacher
        } as MatchingResult & Teacher;
    });

    // Filter and sort
    return scoredTeachers
        .filter(t => t.matchScore > 20) // Only show relevant matches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10)
        .map(t => ({
            teacherId: t.teacherId,
            reasoning: t.reasoning,
            matchScore: t.matchScore
        }));
};

/**
 * Calculate bonus score based on user's primary goal
 */
function calculateGoalBonus(teacher: Teacher, goal: PrimaryGoal): { score: number; reason?: string } {
    switch (goal) {
        case 'exam':
            // Prioritize experienced teachers with high success rate
            if (teacher.badges.includes('Expert BAC C/D') ||
                teacher.badges.includes('Expert BAC') ||
                teacher.experience.includes('10') ||
                teacher.experience.includes('15')) {
                return { score: 25, reason: '🎯 Spécialiste examens' };
            }
            if (parseInt(teacher.experience) >= 5) {
                return { score: 15, reason: '🎓 Expérience examens' };
            }
            return { score: 0 };

        case 'excellence':
            // Prioritize top-rated teachers
            if (teacher.rating >= 4.9 && teacher.badges.includes('Top Prof')) {
                return { score: 25, reason: '🚀 Excellence confirmée' };
            }
            if (teacher.rating >= 4.7) {
                return { score: 15, reason: '🌟 Très apprécié' };
            }
            return { score: 0 };

        case 'remedial':
            // Prioritize patient teachers with methodology
            if (teacher.methodology && teacher.methodology.includes('pédagog')) {
                return { score: 20, reason: '💡 Pédagogie adaptée' };
            }
            return { score: 10 };

        case 'improve':
            // Balanced teachers with good ratings
            if (teacher.rating >= 4.5 && parseInt(teacher.experience) >= 3) {
                return { score: 15, reason: '📈 Progression garantie' };
            }
            return { score: 5 };

        case 'regular':
            // Prioritize availability and consistency
            if (teacher.availability.length >= 3) {
                return { score: 15, reason: '📅 Très disponible' };
            }
            return { score: 5 };

        default:
            return { score: 0 };
    }
}

// ============ ORIGINAL KEYWORD MATCHING (Legacy) ============

export const matchTeacherWithKeywords = async (userInput: string, teachers: Teacher[]): Promise<MatchingResult[]> => {
    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const query = normalize(userInput);
    const keywords = query.split(/\s+/).filter(w => w.length > 2);

    const scoredTeachers = teachers.map(teacher => {
        let score = 0;
        const reasons: string[] = [];

        // Subject exact match
        if (normalize(teacher.subject).includes(query) || query.includes(normalize(teacher.subject))) {
            score += 30;
            reasons.push(`Matière : ${teacher.subject}`);
        }

        // Level match
        teacher.levels.forEach(level => {
            if (normalize(level).includes(query) || query.includes(normalize(level))) {
                score += 15;
                reasons.push(`Niveau : ${level}`);
            }
        });

        // Location match
        if (normalize(teacher.location).includes(query) || query.includes(normalize(teacher.location))) {
            score += 10;
            reasons.push(`Zone : ${teacher.location}`);
        }

        // Bio keywords
        keywords.forEach(keyword => {
            if (normalize(teacher.bio).includes(keyword)) {
                score += 3;
            }
        });

        // Badge boost
        if (teacher.badges.includes('Top Prof')) score += 5;
        if (teacher.badges.includes('Vérifié')) score += 3;

        return {
            teacherId: teacher.id,
            matchScore: score,
            reasoning: reasons.length > 0 ? reasons.join(' • ') : `Profil compatible`,
            ...teacher
        };
    });

    return scoredTeachers
        .filter(t => t.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3)
        .map(t => ({ teacherId: t.teacherId, reasoning: t.reasoning, matchScore: t.matchScore }));
};

// ============ AI LEARNING PLAN ============
// Délégué à geminiService.ts → Edge Function Supabase `gemini-match`
// Les plans statiques codés en dur ont été supprimés.
export { getLearningPlan } from './geminiService';
