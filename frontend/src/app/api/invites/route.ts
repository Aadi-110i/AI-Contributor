import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { verifyAccessToken } from '@/lib/auth-tokens';

function getAuthUser(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return verifyAccessToken(token);
}

// POST /api/invites
export async function POST(req: NextRequest) {
    try {
        const user = getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
        }

        const body = await req.json();
        const { project_id } = body;
        if (!project_id) {
            return NextResponse.json({ error: 'project_id is required' }, { status: 400 });
        }

        const token = 'inv_' + Math.random().toString(36).substring(2, 12);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        const { data: invite, error } = await supabaseServer
            .from('invites')
            .insert({
                project_id,
                token,
                created_by: user.id,
                expires_at: expiresAt,
            })
            .select()
            .single();

        if (error) throw error;

        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const link = `${protocol}://${host}/invite/${token}`;

        return NextResponse.json({ invite, link }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
