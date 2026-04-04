import { supabase } from './supabaseClient';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface JobOffer {
  id: string;
  director_id: string;
  title: string;
  subject: string;
  description?: string;
  contract_type: string;
  salary_range?: string;
  location?: string;
  levels?: string[];
  status: 'active' | 'draft' | 'closed';
  created_at: string;
  updated_at: string;
  // Joined data
  director_name?: string;
  establishment_name?: string;
  applications_count?: number;
}

export interface JobApplication {
  id: string;
  offer_id: string;
  teacher_id: string;
  cover_letter?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: string;
  // Joined data
  teacher_name?: string;
  teacher_subjects?: string[];
  teacher_experience_years?: number;
  offer_title?: string;
  establishment_name?: string;
}

export const jobOfferService = {
  /**
   * Create a new job offer (Director only)
   */
  async createOffer(offer: Omit<JobOffer, 'id' | 'created_at' | 'updated_at' | 'director_id'>): Promise<ApiResponse<JobOffer>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const sanitizedOffer = this.sanitizeOffer(offer);
      const { data, error } = await supabase
        .from('job_offers')
        .insert({
          ...sanitizedOffer,
          director_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('[JobOfferService] createOffer error:', error);
      return { success: false, data: null, error: "Erreur lors de la création de l'offre." };
    }
  },

  /**
   * Sanitizes an offer object
   */
  sanitizeOffer(offer: Partial<JobOffer>): any {
    const sanitized = { ...offer };
    const virtualFields = ['applications_count', 'applications', 'director_profile', 'profiles'];
    virtualFields.forEach(field => delete (sanitized as any)[field]);
    return sanitized;
  },

  async updateOffer(id: string, updates: Partial<JobOffer>): Promise<ApiResponse<null>> {
    try {
      const sanitizedUpdates = this.sanitizeOffer(updates);
      const { error } = await supabase
        .from('job_offers')
        .update({ ...sanitizedUpdates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return { success: true, data: null, error: null };
    } catch (error) {
      console.error('[JobOfferService] updateOffer error:', error);
      return { success: false, data: null, error: "Erreur lors de la mise à jour de l'offre." };
    }
  },

  async deleteOffer(id: string): Promise<ApiResponse<null>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('job_offers')
        .delete()
        .eq('id', id)
        .eq('director_id', user.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Offre introuvable.');

      return { success: true, data: null, error: null };
    } catch (error) {
      console.error('[JobOfferService] deleteOffer error:', error);
      return { success: false, data: null, error: "Erreur lors de la suppression de l'offre." };
    }
  },

  /**
   * Get all offers by the current director
   * Optimized: Use count join if possible, but for simplicity here we do a join
   */
  async getMyOffers(): Promise<ApiResponse<JobOffer[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('job_offers')
        .select(`
          *,
          job_applications (id)
        `)
        .eq('director_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enriched = (data || []).map(offer => ({
        ...offer,
        applications_count: (offer as any).job_applications?.length || 0
      }));

      return { success: true, data: enriched, error: null };
    } catch (error) {
      console.error('[JobOfferService] getMyOffers error:', error);
      return { success: false, data: [], error: "Erreur lors de la récupération de vos offres." };
    }
  },

  /**
   * Get all active offers (Marketplace)
   */
  async getAllActiveOffers(): Promise<ApiResponse<JobOffer[]>> {
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select(`
          *,
          profiles!director_id (
            name,
            director_profiles (establishment_name)
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enriched = (data || []).map((o: any) => ({
        ...o,
        director_name: o.profiles?.name || null,
        establishment_name: o.profiles?.director_profiles?.establishment_name || null,
      }));

      return { success: true, data: enriched, error: null };
    } catch (error) {
      console.error('[JobOfferService] getAllActiveOffers error:', error);
      return { success: false, data: [], error: "Erreur lors de la récupération des offres." };
    }
  },

  /**
   * Get all applications for a specific offer
   */
  async getApplicationsForOffer(offerId: string): Promise<ApiResponse<JobApplication[]>> {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          profiles!teacher_id (name),
          teacher_profiles!teacher_id (subjects, experience_years)
        `)
        .eq('offer_id', offerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enriched = (data || []).map((a: any) => ({
        ...a,
        teacher_name: a.profiles?.name,
        teacher_subjects: a.teacher_profiles?.subjects,
        teacher_experience_years: a.teacher_profiles?.experience_years,
      }));

      return { success: true, data: enriched, error: null };
    } catch (error) {
      console.error('[JobOfferService] getApplicationsForOffer error:', error);
      return { success: false, data: [], error: "Erreur lors de la récupération des candidatures." };
    }
  },

  /**
   * Get all applications for the current director
   */
  async getAllMyApplications(): Promise<ApiResponse<JobApplication[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          profiles!teacher_id (name),
          teacher_profiles!teacher_id (subjects, experience_years),
          job_offers!offer_id!inner (title, director_id)
        `)
        .eq('job_offers.director_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enriched = (data || []).map((a: any) => ({
        ...a,
        teacher_name: a.profiles?.name,
        teacher_subjects: a.teacher_profiles?.subjects,
        teacher_experience_years: a.teacher_profiles?.experience_years,
        offer_title: a.job_offers?.title || 'Offre supprimée',
      }));

      return { success: true, data: enriched, error: null };
    } catch (error) {
      console.error('[JobOfferService] getAllMyApplications error:', error);
      return { success: false, data: [], error: "Erreur lors de la récupération des candidatures." };
    }
  },

  /**
   * Apply to an offer
   */
  async applyToOffer(offerId: string, coverLetter?: string): Promise<ApiResponse<JobApplication>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          offer_id: offerId,
          teacher_id: user.id,
          cover_letter: coverLetter || null,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data, error: null };
    } catch (error) {
      console.error('[JobOfferService] applyToOffer error:', error);
      return { success: false, data: null, error: "Erreur lors de l'envoi de la candidature." };
    }
  },

  /**
   * Get applications for the current teacher
   * FIXED JOIN: Correctly joining through profiles to get director_profiles
   */
  async getMyApplications(): Promise<ApiResponse<JobApplication[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_offers!offer_id (
            title, 
            subject, 
            director_id,
            profiles!director_id (
                director_profiles (establishment_name)
            )
          )
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enriched = (data || []).map((a: any) => ({
        ...a,
        offer_title: a.job_offers?.title || 'Offre supprimée',
        establishment_name: a.job_offers?.profiles?.director_profiles?.establishment_name || 'Établissement inconnu',
      }));

      return { success: true, data: enriched, error: null };
    } catch (error) {
      console.error('[JobOfferService] getMyApplications error:', error);
      return { success: false, data: [], error: "Erreur lors de la récupération de vos candidatures." };
    }
  },

  async updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected'): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      if (error) throw error;
      return { success: true, data: null, error: null };
    } catch (error) {
      console.error('[JobOfferService] updateApplicationStatus error:', error);
      return { success: false, data: null, error: "Erreur lors de la mise à jour." };
    }
  },

  async cancelApplication(applicationId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;
      return { success: true, data: null, error: null };
    } catch (error) {
      console.error('[JobOfferService] cancelApplication error:', error);
      return { success: false, data: null, error: "Erreur lors de l'annulation." };
    }
  },

  /**
   * Subscriptions
   */
  subscribeToApplications(teacherId: string, callback: (payload: any) => void) {
    return supabase.channel(`job_applications:teacher:${teacherId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications', filter: `teacher_id=eq.${teacherId}` }, callback).subscribe();
  },

  subscribeToOffers(callback: (payload: any) => void) {
    return supabase.channel('job_offers_active').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'job_offers', filter: `status=eq.active` }, callback).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'job_offers', filter: `status=eq.active` }, callback).subscribe();
  }
};
