import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { verifyAccessToken } from '@/lib/auth-tokens';

function getAuthUser(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return verifyAccessToken(token);
}

async function attachProfilesToProjects(projects: any[]) {
    if (!projects || projects.length === 0) return;
    const allModules = projects.flatMap((p: any) => p.modules || []);
    const assignedUserIds = Array.from(new Set(allModules.map((m: any) => m.assigned_to).filter(Boolean)));
    if (assignedUserIds.length === 0) return;

    const { data: profiles } = await supabaseServer
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', assignedUserIds);

    const profileMap: Record<string, any> = {};
    (profiles || []).forEach((prof: any) => {
        profileMap[prof.id] = prof;
    });

    projects.forEach((p: any) => {
        (p.modules || []).forEach((m: any) => {
            m.profiles = m.assigned_to && profileMap[m.assigned_to] ? profileMap[m.assigned_to] : null;
        });
    });
}

// GET /api/projects - list projects for user
export async function GET(req: NextRequest) {
    try {
        const user = getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
        }

        // Projects the user owns
        const { data: owned, error: ownErr } = await supabaseServer
            .from('projects')
            .select('*, modules(*)')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false });

        if (ownErr) throw ownErr;

        // Projects the user is assigned to a module in
        const { data: assigned, error: assErr } = await supabaseServer
            .from('modules')
            .select('project_id')
            .eq('assigned_to', user.id);

        if (assErr) throw assErr;

        const assignedProjectIds = (assigned || [])
            .map((m: any) => m.project_id)
            .filter((id: string) => !(owned || []).some((p: any) => p.id === id));

        let participating: any[] = [];
        if (assignedProjectIds.length > 0) {
            const { data, error } = await supabaseServer
                .from('projects')
                .select('*, modules(*)')
                .in('id', assignedProjectIds);
            if (error) throw error;
            participating = data || [];
        }

        const ownedList = owned || [];
        await attachProfilesToProjects(ownedList);
        await attachProfilesToProjects(participating);

        return NextResponse.json({ owned: ownedList, participating });
    } catch (err: any) {
        console.error('List projects error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

// POST /api/projects - create new project
export async function POST(req: NextRequest) {
    try {
        const user = getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
        }

        const body = await req.json();
        const { name, description } = body;
        if (!name || !name.trim()) {
            return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
        }

        const projectId = 'proj_' + Math.random().toString(36).substring(2, 10);

        const { data, error } = await supabaseServer
            .from('projects')
            .insert({
                id: projectId,
                name: name.trim(),
                description: description || '',
                owner_id: user.id,
                status: 'active',
            })
            .select()
            .single();

        if (error) throw error;

        // Auto-create default modules for the project
        const moduleTypes = ['frontend', 'backend', 'authentication', 'database', 'integrations'];
        const modules = moduleTypes.map((type) => ({
            id: 'mod_' + Math.random().toString(36).substring(2, 10),
            project_id: data.id,
            type,
            status: 'unassigned',
        }));

        const { error: modError } = await supabaseServer.from('modules').insert(modules);
        if (modError) throw modError;

        data.modules = modules;

        return NextResponse.json(data, { status: 201 });
    } catch (err: any) {
        console.error('Create project error:', err);
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
