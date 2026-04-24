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

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nickname: string | null
          email: string | null
          avatar_url: string | null
          provider: string | null
          role: UserRole
          plan: UserPlan
          point_balance: number
          is_ad_removed: boolean
          created_at: string
          last_login_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      draws: {
        Row: {
          id: string
          user_id: string
          numbers: number[]
          mode: DrawMode
          meta: Json | null
          is_favorited: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['draws']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['draws']['Insert']>
      }
      point_transactions: {
        Row: {
          id: string
          user_id: string
          type: PointType
          amount: number
          balance_after: number
          ref_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['point_transactions']['Row'], 'id' | 'created_at'>
        Update: never
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
        Insert: Omit<Database['public']['Tables']['winning_numbers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['winning_numbers']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['events']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['dream_logs']['Row'], 'id' | 'created_at'>
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
