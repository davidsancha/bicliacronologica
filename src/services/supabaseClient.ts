import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Init Debug:', {
    hasUrl: !!supabaseUrl,
    urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 8) : 'N/A',
    hasKey: !!supabaseAnonKey
});

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key missing. Supabase features will be disabled. Check your .env.local file.');
}

export const supabase = (supabaseUrl && supabaseUrl.startsWith('http'))
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
