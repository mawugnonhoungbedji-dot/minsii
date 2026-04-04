export type BadgeType = 'Vérifié' | 'Top Prof' | 'Réponse Rapide' | 'Nouveau' | string;

export type Page = 'home' | 'login' | 'signup' | 'dashboard-client' | 'dashboard-teacher';

/** Standard API Response wrapper for service methods */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  rating: number;
  reviewsCount: number;
  hourlyRate: number; // In FCFA
  bio: string;
  avatar: string;
  experience: string;
  education: string;
  availability: string[];
  badges: BadgeType[];
  location: string; // Neighborhood in Benin (e.g., Cotonou - Cadjèhoun)
  city_village?: string; // NEW: Precise geolocation (Bénin context)
  levels: string[]; // e.g., ["6ème", "Terminale S"]
  phoneNumber: string; // NEW: Contact number
  diplomaUrl?: string; // NEW: Proof of expertise
  methodology?: string; // NEW: Teaching approach and methods
}

export interface MatchingResult {
  teacherId: string;
  reasoning: string;
  matchScore: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
