export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type UserRole = 'user' | 'admin'
export type UserPlan = 'free' | 'premium'
export type DrawMode = 'random' | 'manual' | 'analysis' | 'dream'
export type PointType =
  | 'earn_ad'
  | 'earn_event'
  | 'earn_login'
  | 'earn_signup'
  | 'spend_draw'
  | 'spend_premium'
  | 'admin_grant'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nickname: string | null
          email: string | null
          avatar_url: string | null
          provider: string | null
          role: string
          plan: string
          point_balance: number
          is_ad_removed: boolean
          created_at: string
          last_login_at: string | null
        }
        Insert: {
          id: string
          nickname?: string | null
          email?: string | null
          avatar_url?: string | null
          provider?: string | null
          role?: string
          plan?: string
          point_balance?: number
          is_ad_removed?: boolean
          created_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          nickname?: string | null
          email?: string | null
          avatar_url?: string | null
          provider?: string | null
          role?: string
          plan?: string
          point_balance?: number
          is_ad_removed?: boolean
          created_at?: string
          last_login_at?: string | null
        }
        Relationships: []
      }
      draws: {
        Row: {
          id: string
          user_id: string
          numbers: number[]
          mode: string
          meta: Json | null
          is_favorited: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          numbers: number[]
          mode: string
          meta?: Json | null
          is_favorited?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          numbers?: number[]
          mode?: string
          meta?: Json | null
          is_favorited?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'draws_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      point_transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: number
          balance_after: number
          ref_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          amount: number
          balance_after: number
          ref_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          amount?: number
          balance_after?: number
          ref_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'point_transactions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      winning_numbers: {
        Row: {
          id: string
          draw_no: number
          numbers: number[]
          bonus: number
          prize_1st: number | null
          winner_count_1st: number | null
          draw_date: string
          created_at: string
        }
        Insert: {
          id?: string
          draw_no: number
          numbers: number[]
          bonus: number
          prize_1st?: number | null
          winner_count_1st?: number | null
          draw_date: string
          created_at?: string
        }
        Update: {
          id?: string
          draw_no?: number
          numbers?: number[]
          bonus?: number
          prize_1st?: number | null
          winner_count_1st?: number | null
          draw_date?: string
          created_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          type: string
          reward_point: number
          start_at: string
          end_at: string
          is_active: boolean
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: string
          reward_point?: number
          start_at: string
          end_at: string
          is_active?: boolean
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: string
          reward_point?: number
          start_at?: string
          end_at?: string
          is_active?: boolean
          created_by?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'events_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      event_participants: {
        Row: {
          id: string
          event_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'event_participants_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'event_participants_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      dream_logs: {
        Row: {
          id: string
          user_id: string
          dream_text: string
          keywords: string[]
          numbers: number[]
          ai_reasoning: string | null
          draw_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dream_text: string
          keywords?: string[]
          numbers: number[]
          ai_reasoning?: string | null
          draw_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          dream_text?: string
          keywords?: string[]
          numbers?: number[]
          ai_reasoning?: string | null
          draw_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'dream_logs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      daily_stats: {
        Row: {
          date: string
          dau: number
          new_users: number
          total_draws: number
          ad_revenue: number
          point_spent: number
        }
        Insert: {
          date: string
          dau?: number
          new_users?: number
          total_draws?: number
          ad_revenue?: number
          point_spent?: number
        }
        Update: {
          date?: string
          dau?: number
          new_users?: number
          total_draws?: number
          ad_revenue?: number
          point_spent?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deduct_points: {
        Args: { p_user_id: string; p_amount: number; p_type: string; p_ref_id?: string }
        Returns: undefined
      }
      add_points: {
        Args: { p_user_id: string; p_amount: number; p_type: string; p_ref_id?: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
