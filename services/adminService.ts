import { supabase } from './supabaseClient';
import { Database } from '../types/database';
import type { ApiResponse } from '../types';

export interface AdminStats {
  totalUsers: number;
  totalTeachers: number;
  pendingVerifications: number;
  pendingInstitutions: number;
  activeMatches: number;
  growth: string;
}

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'revision_required' | 'deactivated';

export interface PendingTeacher {
  id: string;
  name: string;
  role: string;
  avatar_url?: string;
  location?: string;
  city_village?: string;
  teacher_profiles: {
    subjects?: string[];
    education?: string;
    experience_years?: number;
    bio?: string;
    teaching_philosophy?: string;
    diploma_url?: string;
    phone_number?: string;
    hourly_rate?: number;
    is_verified: boolean;
    status: VerificationStatus;
    created_at: string;
  };
}

export interface PendingInstitution {
  id: string;
  name: string;
  role: string;
  avatar_url?: string;
  director_profiles: {
    establishment_name: string;
    establishment_type: string;
    phone_number?: string;
    is_verified: boolean;
    status: VerificationStatus;
    created_at: string;
  };
}

export const adminService = {
  /**
   * Get real-time stats for the admin dashboard
   */
  async getDashboardStats(): Promise<ApiResponse<AdminStats>> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

      const [
        { count: totalUsers },
        { count: totalTeachers },
        { count: pendingCount },
        { count: pendingInstitutionsCount },
        { count: activeBookings },
        { count: recentUsers }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('teacher_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('teacher_profiles').select('*', { count: 'exact', head: true }).in('status', ['pending', 'revision_required']),
        supabase.from('director_profiles').select('*', { count: 'exact', head: true }).in('status', ['pending', 'revision_required']),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['pending', 'confirmed']),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgoISO)
      ]);

      // Calcul du taux de croissance mensuel (nouveaux users / total)
      const total = totalUsers || 0;
      const recent = recentUsers || 0;
      const growthRate = total > 0 ? ((recent / total) * 100).toFixed(1) : '0.0';

      return {
        success: true,
        data: {
          totalUsers: total,
          totalTeachers: totalTeachers || 0,
          pendingVerifications: pendingCount || 0,
          pendingInstitutions: pendingInstitutionsCount || 0,
          activeMatches: activeBookings || 0,
          growth: `+${growthRate}%`
        },
        error: null
      };
    } catch (error) {
      console.error('[AdminService] Stats Error:', error);
      return {
        success: false,
        data: null,
        error: "Erreur lors de la récupération des statistiques."
      };
    }
  },

  /**
   * Get list of teachers pending verification
   */
  async getPendingTeachers(): Promise<ApiResponse<PendingTeacher[]>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          role,
          avatar_url,
          location,
          city_village,
          teacher_profiles!inner (
            subjects,
            education,
            experience_years,
            bio,
            teaching_philosophy,
            diploma_url,
            phone_number,
            hourly_rate,
            is_verified,
            created_at
          )
        `)
        .eq('role', 'teacher')
        .in('teacher_profiles.status', ['pending', 'revision_required']);

      if (error) throw error;
      return { success: true, data: data || [], error: null };
    } catch (error) {
      console.error('[AdminService] Pending Teachers Error:', error);
      return { success: false, data: [], error: "Erreur lors de la récupération des mentors en attente." };
    }
  },

  /**
   * Get list of institutions pending verification
   */
  async getPendingInstitutions(): Promise<ApiResponse<PendingInstitution[]>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          role,
          avatar_url,
          director_profiles!inner (
            establishment_name,
            establishment_type,
            phone_number,
            is_verified,
            created_at
          )
        `)
        .eq('role', 'director')
        .in('director_profiles.status', ['pending', 'revision_required']);

      if (error) throw error;
      return { success: true, data: data || [], error: null };
    } catch (error) {
      console.error('[AdminService] Pending Institutions Error:', error);
      return { success: false, data: [], error: "Erreur lors de la récupération des établissements en attente." };
    }
  },

  /**
   * Universal status update (Verify, Reject, Deactivate, Revision Request)
   */
  async updateVerificationStatus(params: {
    userId: string;
    status: VerificationStatus;
    feedback?: string;
  }): Promise<ApiResponse<null>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.rpc('secure_update_verification_status', {
        p_user_id: params.userId,
        p_status: params.status,
        p_feedback: params.feedback || null,
        p_admin_id: user?.id || null
      });

      if (error) throw error;

      // If feedback is provided, automatically send a notification
      if (params.feedback) {
        await this.sendNotification({
          receiverId: params.userId,
          title: params.status === 'revision_required' ? "Action Requise : Révision de Profil" : "Mise à jour de votre statut",
          content: params.feedback,
          type: params.status === 'revision_required' ? 'warning' : 'info'
        });
      }

      return { success: true, data: null, error: null };
    } catch (error: any) {
      console.error('[AdminService] Update Status Error:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  /**
   * Send a system notification (targeted or broadcast)
   */
  async sendNotification(params: {
    receiverId: string | null;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'alert';
  }): Promise<ApiResponse<null>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('admin_notifications').insert({
        admin_id: user?.id,
        receiver_id: params.receiverId,
        title: params.title,
        content: params.content,
        type: params.type
      });

      if (error) throw error;
      return { success: true, data: null, error: null };
    } catch (error: any) {
      console.error('[AdminService] Send Notification Error:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  /**
   * Get admin message history
   */
  async getAdminNotifications(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select(`
          *,
          receiver:profiles!receiver_id(name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [], error: null };
    } catch (error: any) {
      console.error('[AdminService] Get Notifications Error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  /**
   * Legacy verifyTeacher (Wrapped for safety)
   */
  async verifyTeacher(teacherId: string, verified: boolean): Promise<ApiResponse<null>> {
    return this.updateVerificationStatus({
      userId: teacherId,
      status: verified ? 'verified' : 'rejected'
    });
  },

  /**
   * Legacy verifyInstitution (Wrapped for safety)
   */
  async verifyInstitution(directorId: string, verified: boolean): Promise<ApiResponse<null>> {
    return this.updateVerificationStatus({
      userId: directorId,
      status: verified ? 'verified' : 'rejected'
    });
  },

  /**
   * Subscriptions
   */
  subscribeToNewUsers(callback: (payload: any) => void) {
    return supabase.channel('profiles:new_users').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, callback).subscribe();
  },

  subscribeToTeacherVerifications(callback: (payload: any) => void) {
    return supabase.channel('teacher_profiles:verifications').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'teacher_profiles' }, callback).subscribe();
  },

  subscribeToInstitutionVerifications(callback: (payload: any) => void) {
    return supabase.channel('director_profiles:verifications').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'director_profiles' }, callback).subscribe();
  },

  /**
   * Subscribe to global admin notifications
   */
  subscribeToAdminNotifications(callback: (payload: any) => void) {
    return supabase.channel('admin_notifications:realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_notifications' }, callback)
      .subscribe();
  },

  /**
   * Get all users (Admin only)
   */
  async getAllUsers(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          *,
          teacher_profiles(status, subjects),
          director_profiles(status, establishment_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [], error: null };
    } catch (error: any) {
      console.error('[AdminService] Get All Users Error:', error);
      return { success: false, data: [], error: error.message || "Erreur lors de la récupération des citoyens." };
    }
  }
};
