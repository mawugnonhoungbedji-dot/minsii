/**
 * Minsii Gemini Service
 * Appels IA proxifiés via la Edge Function Supabase `gemini-match`.
 * La clé API Gemini est stockée exclusivement côté serveur (secret Supabase).
 */

import { supabase } from './supabaseClient';
import { Teacher } from '../types';

export interface AIRecommendationRequest {
    subjects: string[];
    goals: string;
    budget?: number;
    location?: string;
}

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-match`;

/**
 * Retourne les headers d'authentification pour la Edge Function.
 * La Edge Function requiert un JWT utilisateur valide (verify_jwt: true).
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const jwt = session?.access_token;
  return {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    ...(jwt ? { 'Authorization': `Bearer ${jwt}` } : {}),
  };
}

/**
 * Recommande les 2 meilleurs enseignants via Gemini (Edge Function).
 * @param userInput Requête libre de l'utilisateur
 * @param teachers Liste pré-filtrée d'enseignants candidats
 * @returns Tableau trié par matchScore avec reasoning en français
 */
export const matchTeacherWithGemini = async (
  userInput: string,
  teachers: Teacher[]
): Promise<Array<{ teacherId: string; reasoning: string; matchScore: number }>> => {
  if (!userInput.trim() || teachers.length === 0) return [];

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'match', userInput, teachers }),
    });

    if (!response.ok) {
      console.error('gemini-match Edge Function error:', response.status, await response.text());
      return [];
    }

    const result = await response.json();
    return Array.isArray(result) ? result : [];
  } catch (err) {
    console.error('matchTeacherWithGemini failed:', err);
    return [];
  }
};

/**
 * Génère un plan d'apprentissage personnalisé de 4 semaines via Gemini.
 * @param subject Matière (ex: "Mathématiques", "SVT")
 * @param goal Objectif de l'élève
 * @returns Plan formaté en français
 */
export const getLearningPlan = async (subject: string, goal: string): Promise<string> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'learning_plan', subject, goal }),
    });

    if (!response.ok) {
      console.error('getLearningPlan Edge Function error:', response.status);
      return _fallbackPlan(subject);
    }

    const result = await response.json();
    return result.plan || _fallbackPlan(subject);
  } catch (err) {
    console.error('getLearningPlan failed:', err);
    return _fallbackPlan(subject);
  }
};

/** Plan de secours minimal si la Edge Function est indisponible */
function _fallbackPlan(subject: string): string {
  return `🎯 PLAN D'APPRENTISSAGE — ${subject.toUpperCase()}

Ce programme sera personnalisé lors du premier cours avec votre enseignant.

📅 Phase 1 (Semaines 1-2) : Diagnostic & Révision des bases
📈 Phase 2 (Semaines 3-4) : Progression méthodique & Exercices types

Votre enseignant adaptera ce plan à votre niveau et vos objectifs spécifiques.`;
}

/**
 * Minsii AI Service (Consolidated)
 */
export const aiService = {
    /**
     * Recommends teachers based on student preferences (Wrapper for Gemini)
     */
    async recommendTeachers(request: AIRecommendationRequest): Promise<string[]> {
        console.log('AI Recommendation requested via Consolidated Service:', request);
        // For now, this is a placeholder that will call matchTeacherWithGemini in V2
        return [];
    },

    /**
     * Improves a teacher's bio or description (Future integration)
     */
    async improveDescription(description: string): Promise<string> {
        return description;
    }
};
