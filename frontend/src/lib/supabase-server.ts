import { createClient } from '@supabase/supabase-js';

const SUPABASE_PROJECT_URL = 'https://kpflgzhxweuiedlwdpbg.supabase.co';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_SoCG6MEuykaC8E_GIo9VhQ_wTagDZWV';

export function getSupabaseServer() {
    let url = process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_PROJECT_URL;
    if (!url || !url.startsWith('http')) {
        url = SUPABASE_PROJECT_URL;
    }

    let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_PUBLIC_KEY;
    if (!key) {
        key = SUPABASE_PUBLIC_KEY;
    }

    return createClient(url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    });
}

export const supabaseServer = {
    from: (table: string) => getSupabaseServer().from(table)
};
