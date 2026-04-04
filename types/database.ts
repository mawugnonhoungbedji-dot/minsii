export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string | null
          id: string
          requested_date: string | null
          status: string
          student_id: string
          subject: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          requested_date?: string | null
          status?: string
          student_id: string
          subject: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          requested_date?: string | null
          status?: string
          student_id?: string
          subject?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_logs: {
        Row: {
          contact_type: string
          created_at: string | null
          id: string
          parent_id: string | null
          student_name: string | null
          teacher_id: string
        }
        Insert: {
          contact_type: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          student_name?: string | null
          teacher_id: string
        }
        Update: {
          contact_type?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          student_name?: string | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_logs_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_logs_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      director_profiles: {
        Row: {
          created_at: string | null
          establishment_name: string
          establishment_type: string | null
          id: string
          is_verified: boolean | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          establishment_name: string
          establishment_type?: string | null
          id: string
          is_verified?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          establishment_name?: string
          establishment_type?: string | null
          id?: string
          is_verified?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "director_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          id: string
          offer_id: string
          status: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          offer_id: string
          status?: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          offer_id?: string
          status?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "job_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_offers: {
        Row: {
          contract_type: string
          created_at: string | null
          description: string | null
          director_id: string
          id: string
          levels: string[] | null
          location: string | null
          salary_range: string | null
          status: string
          subject: string
          title: string
          updated_at: string | null
        }
        Insert: {
          contract_type?: string
          created_at?: string | null
          description?: string | null
          director_id: string
          id?: string
          levels?: string[] | null
          location?: string | null
          salary_range?: string | null
          status?: string
          subject: string
          title: string
          updated_at?: string | null
        }
        Update: {
          contract_type?: string
          created_at?: string | null
          description?: string | null
          director_id?: string
          id?: string
          levels?: string[] | null
          location?: string | null
          salary_range?: string | null
          status?: string
          subject?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_offers_director_id_fkey"
            columns: ["director_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_applications: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          status: string
          subject: string
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          status?: string
          subject: string
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          status?: string
          subject?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentor_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_reports: {
        Row: {
          attendance_percent: number | null
          booking_id: string | null
          content: string
          created_at: string | null
          id: string
          next_steps: string | null
          performance_rating: number | null
          status: string | null
          student_id: string
          teacher_id: string
        }
        Insert: {
          attendance_percent?: number | null
          booking_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          next_steps?: string | null
          performance_rating?: number | null
          status?: string | null
          student_id: string
          teacher_id: string
        }
        Update: {
          attendance_percent?: number | null
          booking_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          next_steps?: string | null
          performance_rating?: number | null
          status?: string | null
          student_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_reports_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_reports_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_reports_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          external_reference: string | null
          id: string
          meta_data: Json | null
          provider: string | null
          status: string | null
          teacher_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          external_reference?: string | null
          id?: string
          meta_data?: Json | null
          provider?: string | null
          status?: string | null
          teacher_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          external_reference?: string | null
          id?: string
          meta_data?: Json | null
          provider?: string | null
          status?: string | null
          teacher_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city_village: string | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          city_village?: string | null
          created_at?: string | null
          id: string
          location?: string | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          city_village?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_avatar: string | null
          author_id: string | null
          author_name: string
          comment: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          rating: number
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          author_avatar?: string | null
          author_id?: string | null
          author_name: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating: number
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          author_avatar?: string | null
          author_id?: string | null
          author_name?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          budget: number | null
          created_at: string | null
          goals: string | null
          id: string
          level: string
          preferred_schedule: string[] | null
          subjects_of_interest: string[] | null
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          goals?: string | null
          id: string
          level: string
          preferred_schedule?: string[] | null
          subjects_of_interest?: string[] | null
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          goals?: string | null
          id?: string
          level?: string
          preferred_schedule?: string[] | null
          subjects_of_interest?: string[] | null
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_profiles: {
        Row: {
          availability: Json | null
          bio: string | null
          created_at: string | null
          diploma_url: string | null
          education: string | null
          experience_years: number | null
          hourly_rate: number
          id: string
          is_verified: boolean | null
          levels: string[] | null
          phone_number: string | null
          rating: number | null
          reviews_count: number | null
          subjects: string[] | null
          teaching_philosophy: string | null
          total_xp: number | null
          updated_at: string | null
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          created_at?: string | null
          diploma_url?: string | null
          education?: string | null
          experience_years?: number | null
          hourly_rate?: number
          id: string
          is_verified?: boolean | null
          levels?: string[] | null
          phone_number?: string | null
          rating?: number | null
          reviews_count?: number | null
          subjects?: string[] | null
          teaching_philosophy?: string | null
          total_xp?: number | null
          updated_at?: string | null
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          created_at?: string | null
          diploma_url?: string | null
          education?: string | null
          experience_years?: number | null
          hourly_rate?: number
          id?: string
          is_verified?: boolean | null
          levels?: string[] | null
          phone_number?: string | null
          rating?: number | null
          reviews_count?: number | null
          subjects?: string[] | null
          teaching_philosophy?: string | null
          total_xp?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_conversations: {
        Args: { user_id: string }
        Returns: {
          last_message: string
          last_message_at: string
          other_user_avatar: string
          other_user_id: string
          other_user_name: string
          unread_count: number
        }[]
      }
      match_teachers_prefilter: {
        Args: { p_level?: string; p_max_budget?: number; p_subjects?: string[] }
        Returns: {
          availability: Json
          avatar_url: string
          bio: string
          diploma_url: string
          education: string
          experience_years: number
          hourly_rate: number
          id: string
          is_verified: boolean
          levels: string[]
          location: string
          name: string
          phone_number: string
          rating: number
          reviews_count: number
          subjects: string[]
          teaching_philosophy: string
        }[]
      }
      secure_verify_profile: {
        Args: { p_target_table: string; p_user_id: string; p_verified: boolean }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "student" | "teacher" | "director" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["student", "teacher", "director", "admin"],
    },
  },
} as const
