import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { verifyAccessToken } from '@/lib/auth-tokens';

function getAuthUser(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return verifyAccessToken(token);
}

// GET /api/modules
export async function GET(req: NextRequest) {
    try {
        const user = getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get('projectId');

        let query = supabaseServer
            .from('modules')
            .select('*, projects:project_id(name, id)');

        if (projectId) {
            query = query.eq('project_id', projectId);
        }

        const { data, error } = await query;
        if (error) throw error;

        const modules = data || [];
        const assignedUserIds = Array.from(
            new Set(modules.map((m: any) => m.assigned_to).filter(Boolean))
        );

        if (assignedUserIds.length > 0) {
            const { data: profiles } = await supabaseServer
                .from('profiles')
                .select('id, username, avatar_url')
                .in('id', assignedUserIds);

            const profileMap: Record<string, any> = {};
            (profiles || []).forEach((prof: any) => {
                profileMap[prof.id] = prof;
            });

            modules.forEach((m: any) => {
                m.profiles = m.assigned_to && profileMap[m.assigned_to] ? profileMap[m.assigned_to] : null;
            });
        }

        return NextResponse.json(modules);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
