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
      alerts: {
        Row: {
          created_at: string
          device_id: string | null
          farm_id: string
          id: string
          is_read: boolean
          level: Database["public"]["Enums"]["alert_level"]
          message: string
          title: string
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          farm_id: string
          id?: string
          is_read?: boolean
          level: Database["public"]["Enums"]["alert_level"]
          message: string
          title: string
        }
        Update: {
          created_at?: string
          device_id?: string | null
          farm_id?: string
          id?: string
          is_read?: boolean
          level?: Database["public"]["Enums"]["alert_level"]
          message?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          created_at: string
          device_code: string
          device_type: Database["public"]["Enums"]["device_type"]
          farm_id: string
          firmware_version: string | null
          id: string
          is_online: boolean
          last_seen: string | null
          name: string
          signal_strength: number | null
        }
        Insert: {
          created_at?: string
          device_code: string
          device_type: Database["public"]["Enums"]["device_type"]
          farm_id: string
          firmware_version?: string | null
          id?: string
          is_online?: boolean
          last_seen?: string | null
          name: string
          signal_strength?: number | null
        }
        Update: {
          created_at?: string
          device_code?: string
          device_type?: Database["public"]["Enums"]["device_type"]
          farm_id?: string
          firmware_version?: string | null
          id?: string
          is_online?: boolean
          last_seen?: string | null
          name?: string
          signal_strength?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          area_hectares: number | null
          created_at: string
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string
          owner_id: string
        }
        Insert: {
          area_hectares?: number | null
          created_at?: string
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name: string
          owner_id: string
        }
        Update: {
          area_hectares?: number | null
          created_at?: string
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          organization: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          organization?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          organization?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sensor_readings: {
        Row: {
          ambient_temp: number | null
          device_id: string
          farm_id: string
          humidity: number | null
          id: number
          luminosity: number | null
          recorded_at: string
          soil_temp: number | null
          solar_power: number | null
          solar_radiation: number | null
          wind_direction: number | null
          wind_speed: number | null
        }
        Insert: {
          ambient_temp?: number | null
          device_id: string
          farm_id: string
          humidity?: number | null
          id?: number
          luminosity?: number | null
          recorded_at?: string
          soil_temp?: number | null
          solar_power?: number | null
          solar_radiation?: number | null
          wind_direction?: number | null
          wind_speed?: number | null
        }
        Update: {
          ambient_temp?: number | null
          device_id?: string
          farm_id?: string
          humidity?: number | null
          id?: number
          luminosity?: number | null
          recorded_at?: string
          soil_temp?: number | null
          solar_power?: number | null
          solar_radiation?: number | null
          wind_direction?: number | null
          wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sensor_readings_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sensor_readings_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      thresholds: {
        Row: {
          enabled: boolean
          farm_id: string
          id: string
          max_value: number | null
          min_value: number | null
          sensor_kind: Database["public"]["Enums"]["sensor_kind"]
          warning_max: number | null
          warning_min: number | null
        }
        Insert: {
          enabled?: boolean
          farm_id: string
          id?: string
          max_value?: number | null
          min_value?: number | null
          sensor_kind: Database["public"]["Enums"]["sensor_kind"]
          warning_max?: number | null
          warning_min?: number | null
        }
        Update: {
          enabled?: boolean
          farm_id?: string
          id?: string
          max_value?: number | null
          min_value?: number | null
          sensor_kind?: Database["public"]["Enums"]["sensor_kind"]
          warning_max?: number | null
          warning_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "thresholds_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      alert_level: "info" | "warning" | "critical" | "success"
      app_role: "admin" | "tecnico" | "cliente"
      device_type:
        | "gateway"
        | "ambiental"
        | "suelo"
        | "viento"
        | "solar"
        | "luminosidad"
      sensor_kind:
        | "ambient_temp"
        | "humidity"
        | "soil_temp"
        | "wind_speed"
        | "solar_radiation"
        | "solar_power"
        | "luminosity"
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
      alert_level: ["info", "warning", "critical", "success"],
      app_role: ["admin", "tecnico", "cliente"],
      device_type: [
        "gateway",
        "ambiental",
        "suelo",
        "viento",
        "solar",
        "luminosidad",
      ],
      sensor_kind: [
        "ambient_temp",
        "humidity",
        "soil_temp",
        "wind_speed",
        "solar_radiation",
        "solar_power",
        "luminosity",
      ],
    },
  },
} as const
