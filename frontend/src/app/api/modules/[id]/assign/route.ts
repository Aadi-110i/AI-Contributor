import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { verifyAccessToken } from '@/lib/auth-tokens';

function getAuthUser(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return verifyAccessToken(token);
}

// POST /api/modules/[id]/assign
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
        }

        const { id } = await params;

        const { data: mod, error: findError } = await supabaseServer
            .from('modules')
            .select('*')
            .eq('id', id)
            .single();

        if (findError || !mod) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        const { data, error } = await supabaseServer
            .from('modules')
            .update({
                assigned_to: user.id,
                status: 'in_progress',
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json(data || { ...mod, assigned_to: user.id, status: 'in_progress' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
