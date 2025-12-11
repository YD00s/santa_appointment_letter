import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 사용자 타입 정의
export interface User {
  id: string;
  kakao_id: string;
  email?: string;
  nickname?: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}
