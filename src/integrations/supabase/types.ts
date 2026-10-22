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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      abandoned_checkouts: {
        Row: {
          address: string | null
          converted: boolean
          created_at: string
          device: string | null
          full_name: string | null
          id: string
          package_name: string | null
          phone: string
          quantity: number
          session_id: string
          status: string
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          converted?: boolean
          created_at?: string
          device?: string | null
          full_name?: string | null
          id?: string
          package_name?: string | null
          phone: string
          quantity?: number
          session_id: string
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          converted?: boolean
          created_at?: string
          device?: string | null
          full_name?: string | null
          id?: string
          package_name?: string | null
          phone?: string
          quantity?: number
          session_id?: string
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_config: {
        Row: {
          admin_password: string
          id: number
          password_hash: string | null
          updated_at: string
        }
        Insert: {
          admin_password?: string
          id?: number
          password_hash?: string | null
          updated_at?: string
        }
        Update: {
          admin_password?: string
          id?: number
          password_hash?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_login_attempts: {
        Row: { created_at: string; id: number; ip: string }
        Insert: { created_at?: string; id?: never; ip: string }
        Update: { created_at?: string; id?: never; ip?: string }
        Relationships: []
      }
      admin_sessions: {
        Row: { created_at: string; expires_at: string; token_hash: string }
        Insert: { created_at?: string; expires_at: string; token_hash: string }
        Update: { created_at?: string; expires_at?: string; token_hash?: string }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          device: string
          event: string
          id: string
          path: string | null
          props: Json
          session_id: string | null
        }
        Insert: {
          created_at?: string
          device?: string
          event: string
          id?: string
          path?: string | null
          props?: Json
          session_id?: string | null
        }
        Update: {
          created_at?: string
          device?: string
          event?: string
          id?: string
          path?: string | null
          props?: Json
          session_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          consignment_id: string | null
          courier_error: string | null
          courier_pushed_at: string | null
          courier_status: string | null
          created_at: string
          delivery_charge: number
          district: string
          full_name: string
          id: string
          items: Json
          order_note: string | null
          payment_method: string
          phone: string
          product_name: string
          product_price: number
          quantity: number
          status: string
          total_amount: number
          tracking_code: string | null
        }
        Insert: {
          address: string
          consignment_id?: string | null
          courier_error?: string | null
          courier_pushed_at?: string | null
          courier_status?: string | null
          created_at?: string
          delivery_charge: number
          district: string
          full_name: string
          id?: string
          items?: Json
          order_note?: string | null
          payment_method?: string
          phone: string
          product_name?: string
          product_price: number
          quantity?: number
          status?: string
          total_amount: number
          tracking_code?: string | null
        }
        Update: {
          address?: string
          consignment_id?: string | null
          courier_error?: string | null
          courier_pushed_at?: string | null
          courier_status?: string | null
          created_at?: string
          delivery_charge?: number
          district?: string
          full_name?: string
          id?: string
          items?: Json
          order_note?: string | null
          payment_method?: string
          phone?: string
          product_name?: string
          product_price?: number
          quantity?: number
          status?: string
          total_amount?: number
          tracking_code?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          call_number: string
          delivery_charge: number
          disclaimer_text: string
          id: number
          product_image: string | null
          product_price: number
          site_logo: string | null
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          call_number?: string
          delivery_charge?: number
          disclaimer_text?: string
          id?: number
          product_image?: string | null
          product_price?: number
          site_logo?: string | null
          updated_at?: string
          whatsapp_number?: string
        }
        Update: {
          call_number?: string
          delivery_charge?: number
          disclaimer_text?: string
          id?: number
          product_image?: string | null
          product_price?: number
          site_logo?: string | null
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      stats: {
        Row: {
          avg_rating: number
          delivered_orders: number
          happy_customers: number
          id: number
          updated_at: string
          urgency_text: string
        }
        Insert: {
          avg_rating?: number
          delivered_orders?: number
          happy_customers?: number
          id?: number
          updated_at?: string
          urgency_text?: string
        }
        Update: {
          avg_rating?: number
          delivered_orders?: number
          happy_customers?: number
          id?: number
          updated_at?: string
          urgency_text?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          location: string | null
          name: string
          rating: number
          sort_order: number
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string | null
          name: string
          rating?: number
          sort_order?: number
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string | null
          name?: string
          rating?: number
          sort_order?: number
          text?: string
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
