import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// ===== CEK VARIABLE =====
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

console.log('=====================================')
console.log('🔗 URL:', supabaseUrl)
console.log('🔑 KEY:', supabaseKey ? supabaseKey.substring(0, 30) + '...' : '❌ KOSONG')
console.log('📏 Panjang Key:', supabaseKey ? supabaseKey.length : 0)
console.log('=====================================')

export const supabase = createClient(
  supabaseUrl!,
  supabaseKey!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)