import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { verifyAccessToken } from '@/lib/auth-tokens';

function getAuthUser(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return verifyAccessToken(token);
}

// GET /api/projects/[id]
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
        }

        const { id } = await params;

        const { data, error } = await supabaseServer
            .from('projects')
            .select('*, modules(*)')
            .eq('id', id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Attach profiles to modules
        const assignedUserIds = Array.from(
            new Set((data.modules || []).map((m: any) => m.assigned_to).filter(Boolean))
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

            (data.modules || []).forEach((m: any) => {
                m.profiles = m.assigned_to && profileMap[m.assigned_to] ? profileMap[m.assigned_to] : null;
            });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/projects/[id]
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
        }

        const { id } = await params;

        const { data: project } = await supabaseServer
            .from('projects')
            .select('owner_id')
            .eq('id', id)
            .single();

        if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        if (project.owner_id !== user.id) {
            return NextResponse.json({ error: 'Only the project owner can delete it' }, { status: 403 });
        }

        await supabaseServer.from('modules').delete().eq('project_id', id);
        await supabaseServer.from('invites').delete().eq('project_id', id);
        await supabaseServer.from('merge_logs').delete().eq('project_id', id);
        const { error } = await supabaseServer.from('projects').delete().eq('id', id);

        if (error) throw error;
        return NextResponse.json({ message: 'Project deleted' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
