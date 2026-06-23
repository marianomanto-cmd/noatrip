import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://efmnnlnyixmdkljhxrjc.supabase.co'
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Y7rjhMaugqv6fBFzcpo3ig_Arr1wLiU'

export const supabase = createClient(url, key, {
  realtime: { params: { eventsPerSecond: 6 } },
})
