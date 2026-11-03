import { createClient, SupabaseClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://kpflgzhxweuiedlwdpbg.supabase.co';
const FALLBACK_KEY = 'sb_publishable_SoCG6MEuykaC8E_GIo9VhQ_wTagDZWV';

let client: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient {
    if (client) return client;

    let url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || FALLBACK_URL;
    let key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || FALLBACK_KEY;

    // Safety checks for valid URL format to prevent build-time crashes
    if (!url || !url.startsWith('http://') && !url.startsWith('https://')) {
        url = FALLBACK_URL;
    }
    if (!key) {
        key = FALLBACK_KEY;
    }

    client = createClient(url, key);
    return client;
}

// Proxy wrapper so imports like `supabaseServer.from(...)` continue working smoothly
export const supabaseServer = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        const instance = getSupabaseServer();
        const value = (instance as any)[prop];
        return typeof value === 'function' ? value.bind(instance) : value;
    }
});
