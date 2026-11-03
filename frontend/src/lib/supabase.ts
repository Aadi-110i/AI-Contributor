import { createClient, SupabaseClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://kpflgzhxweuiedlwdpbg.supabase.co';
const FALLBACK_KEY = 'sb_publishable_SoCG6MEuykaC8E_GIo9VhQ_wTagDZWV';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    if (client) return client;

    let url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
    let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
        url = FALLBACK_URL;
    }
    if (!key) {
        key = FALLBACK_KEY;
    }

    client = createClient(url, key);
    return client;
}

export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        const instance = getSupabase();
        const value = (instance as any)[prop];
        return typeof value === 'function' ? value.bind(instance) : value;
    }
});
