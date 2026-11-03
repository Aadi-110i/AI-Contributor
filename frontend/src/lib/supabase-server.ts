import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kpflgzhxweuiedlwdpbg.supabase.co';
// Use the valid anon/publishable key which was tested and works for public schema tables
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_SoCG6MEuykaC8E_GIo9VhQ_wTagDZWV';

let client: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient {
    if (client) return client;

    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')) 
        ? process.env.NEXT_PUBLIC_SUPABASE_URL 
        : SUPABASE_URL;

    // In Next.js, prioritize the valid publishable key that connects directly to the Supabase project
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_KEY;

    client = createClient(url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    });

    return client;
}

export const supabaseServer = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        const instance = getSupabaseServer();
        const value = (instance as any)[prop];
        return typeof value === 'function' ? value.bind(instance) : value;
    }
});
