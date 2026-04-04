import { supabase } from './supabaseClient';
import type { ApiResponse } from '../types';

export interface MonthlyReport {
    id: string;
    teacher_id: string;
    student_id: string;
    booking_id?: string;
    content: string;
    performance_rating: number;
    attendance_percent: number;
    next_steps?: string;
    status: 'sent' | 'archived';
    created_at: string;
}

export type CreateReportInput = Omit<MonthlyReport, 'id' | 'created_at' | 'status'>;

export const reportService = {
    /**
     * Submit a new monthly report
     */
    async submitReport(report: CreateReportInput): Promise<ApiResponse<MonthlyReport>> {
        try {
            const { data, error } = await supabase
                .from('monthly_reports')
                .insert([{
                    ...report,
                    status: 'sent'
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data: data as MonthlyReport, error: null };
        } catch (error: any) {
            console.error('[ReportService] Submit Error:', error);
            return { success: false, data: null, error: error.message || "Erreur lors de l'envoi du rapport." };
        }
    },

    /**
     * Get reports for a specific student (viewed by parent)
     */
    async getStudentReports(studentId: string): Promise<ApiResponse<MonthlyReport[]>> {
        try {
            const { data, error } = await supabase
                .from('monthly_reports')
                .select(`
                    *,
                    teacher:profiles!teacher_id (name, avatar_url)
                `)
                .eq('student_id', studentId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data: data as any[], error: null };
        } catch (error: any) {
            console.error('[ReportService] Fetch Student Reports Error:', error);
            return { success: false, data: [], error: error.message };
        }
    },

    /**
     * Get reports sent by a specific teacher
     */
    async getTeacherReports(teacherId: string): Promise<ApiResponse<MonthlyReport[]>> {
        try {
            const { data, error } = await supabase
                .from('monthly_reports')
                .select(`
                    *,
                    student:profiles!student_id (name, avatar_url)
                `)
                .eq('teacher_id', teacherId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data: data as any[], error: null };
        } catch (error: any) {
            console.error('[ReportService] Fetch Teacher Reports Error:', error);
            return { success: false, data: [], error: error.message };
        }
    }
};
