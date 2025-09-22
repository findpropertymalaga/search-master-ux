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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      newsletter_signups: {
        Row: {
          confirmed: boolean | null
          created_at: string
          email: string
          id: string
          source: string | null
        }
        Insert: {
          confirmed?: boolean | null
          created_at?: string
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          confirmed?: boolean | null
          created_at?: string
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      property_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          property_id: string
          property_ref: string | null
          property_title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          property_id: string
          property_ref?: string | null
          property_title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          property_id?: string
          property_ref?: string | null
          property_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      rent_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: number
          name: string | null
          phone: number | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          phone?: number | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          name?: string | null
          phone?: number | null
        }
        Relationships: []
      }
      resales_feed: {
        Row: {
          area: string | null
          baths: number | null
          beds: number | null
          currency: string | null
          description: string | null
          description_translated: string | null
          development_name: string | null
          embedding: string | null
          features: Json | null
          has_garage: boolean | null
          has_garden: boolean | null
          has_pool: boolean | null
          id: number | null
          images: Json | null
          latitude: number | null
          listed_date: string | null
          longitude: number | null
          price: number | null
          property_id: string
          province: string | null
          status: string | null
          status_date: string | null
          summary_translated: string | null
          surface_area: Json | null
          town: string | null
          type: string | null
          urbanisation_name: string | null
          views: Json | null
        }
        Insert: {
          area?: string | null
          baths?: number | null
          beds?: number | null
          currency?: string | null
          description?: string | null
          description_translated?: string | null
          development_name?: string | null
          embedding?: string | null
          features?: Json | null
          has_garage?: boolean | null
          has_garden?: boolean | null
          has_pool?: boolean | null
          id?: number | null
          images?: Json | null
          latitude?: number | null
          listed_date?: string | null
          longitude?: number | null
          price?: number | null
          property_id: string
          province?: string | null
          status?: string | null
          status_date?: string | null
          summary_translated?: string | null
          surface_area?: Json | null
          town?: string | null
          type?: string | null
          urbanisation_name?: string | null
          views?: Json | null
        }
        Update: {
          area?: string | null
          baths?: number | null
          beds?: number | null
          currency?: string | null
          description?: string | null
          description_translated?: string | null
          development_name?: string | null
          embedding?: string | null
          features?: Json | null
          has_garage?: boolean | null
          has_garden?: boolean | null
          has_pool?: boolean | null
          id?: number | null
          images?: Json | null
          latitude?: number | null
          listed_date?: string | null
          longitude?: number | null
          price?: number | null
          property_id?: string
          province?: string | null
          status?: string | null
          status_date?: string | null
          summary_translated?: string | null
          surface_area?: Json | null
          town?: string | null
          type?: string | null
          urbanisation_name?: string | null
          views?: Json | null
        }
        Relationships: []
      }
      resales_new_devs: {
        Row: {
          area: string | null
          baths: number | null
          beds: number | null
          currency: string | null
          description: string | null
          development_name: string | null
          features: Json | null
          has_garage: boolean | null
          has_garden: boolean | null
          has_pool: boolean | null
          id: number | null
          images: Json | null
          latitude: number | null
          listed_date: string | null
          longitude: number | null
          price: number | null
          property_id: string
          province: string | null
          status: string | null
          status_date: string | null
          surface_area: Json | null
          town: string | null
          type: string | null
          urbanisation_name: string | null
          views: Json | null
        }
        Insert: {
          area?: string | null
          baths?: number | null
          beds?: number | null
          currency?: string | null
          description?: string | null
          development_name?: string | null
          features?: Json | null
          has_garage?: boolean | null
          has_garden?: boolean | null
          has_pool?: boolean | null
          id?: number | null
          images?: Json | null
          latitude?: number | null
          listed_date?: string | null
          longitude?: number | null
          price?: number | null
          property_id: string
          province?: string | null
          status?: string | null
          status_date?: string | null
          surface_area?: Json | null
          town?: string | null
          type?: string | null
          urbanisation_name?: string | null
          views?: Json | null
        }
        Update: {
          area?: string | null
          baths?: number | null
          beds?: number | null
          currency?: string | null
          description?: string | null
          development_name?: string | null
          features?: Json | null
          has_garage?: boolean | null
          has_garden?: boolean | null
          has_pool?: boolean | null
          id?: number | null
          images?: Json | null
          latitude?: number | null
          listed_date?: string | null
          longitude?: number | null
          price?: number | null
          property_id?: string
          province?: string | null
          status?: string | null
          status_date?: string | null
          surface_area?: Json | null
          town?: string | null
          type?: string | null
          urbanisation_name?: string | null
          views?: Json | null
        }
        Relationships: []
      }
      resales_own_properties: {
        Row: {
          area: string | null
          baths: number | null
          beds: number | null
          currency: string | null
          description: string | null
          features: Json | null
          has_garage: boolean | null
          has_garden: boolean | null
          has_pool: boolean | null
          images: Json | null
          latitude: number | null
          listed_date: string | null
          longitude: number | null
          price: number | null
          property_id: string
          province: string | null
          status_date: string | null
          subtype: string | null
          surface_area: Json | null
          town: string | null
          type: string | null
          type_rental: string | null
          views: Json | null
        }
        Insert: {
          area?: string | null
          baths?: number | null
          beds?: number | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          has_garage?: boolean | null
          has_garden?: boolean | null
          has_pool?: boolean | null
          images?: Json | null
          latitude?: number | null
          listed_date?: string | null
          longitude?: number | null
          price?: number | null
          property_id: string
          province?: string | null
          status_date?: string | null
          subtype?: string | null
          surface_area?: Json | null
          town?: string | null
          type?: string | null
          type_rental?: string | null
          views?: Json | null
        }
        Update: {
          area?: string | null
          baths?: number | null
          beds?: number | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          has_garage?: boolean | null
          has_garden?: boolean | null
          has_pool?: boolean | null
          images?: Json | null
          latitude?: number | null
          listed_date?: string | null
          longitude?: number | null
          price?: number | null
          property_id?: string
          province?: string | null
          status_date?: string | null
          subtype?: string | null
          surface_area?: Json | null
          town?: string | null
          type?: string | null
          type_rental?: string | null
          views?: Json | null
        }
        Relationships: []
      }
      resales_rentals: {
        Row: {
          area: string | null
          baths: number | null
          beds: number | null
          currency: string | null
          description: string | null
          features: Json | null
          has_garage: boolean | null
          has_garden: boolean | null
          has_pool: boolean | null
          images: Json | null
          last_updated: string | null
          listed_date: string | null
          longterm: number | null
          price: number | null
          property_id: string
          province: string | null
          shortterm_high: number | null
          shortterm_low: number | null
          status_date: string | null
          subtype: string | null
          surface_area: Json | null
          town: string | null
          type: string | null
          type_rental: string | null
        }
        Insert: {
          area?: string | null
          baths?: number | null
          beds?: number | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          has_garage?: boolean | null
          has_garden?: boolean | null
          has_pool?: boolean | null
          images?: Json | null
          last_updated?: string | null
          listed_date?: string | null
          longterm?: number | null
          price?: number | null
          property_id: string
          province?: string | null
          shortterm_high?: number | null
          shortterm_low?: number | null
          status_date?: string | null
          subtype?: string | null
          surface_area?: Json | null
          town?: string | null
          type?: string | null
          type_rental?: string | null
        }
        Update: {
          area?: string | null
          baths?: number | null
          beds?: number | null
          currency?: string | null
          description?: string | null
          features?: Json | null
          has_garage?: boolean | null
          has_garden?: boolean | null
          has_pool?: boolean | null
          images?: Json | null
          last_updated?: string | null
          listed_date?: string | null
          longterm?: number | null
          price?: number | null
          property_id?: string
          province?: string | null
          shortterm_high?: number | null
          shortterm_low?: number | null
          status_date?: string | null
          subtype?: string | null
          surface_area?: Json | null
          town?: string | null
          type?: string | null
          type_rental?: string | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          property_id: string
          property_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          property_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          property_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
