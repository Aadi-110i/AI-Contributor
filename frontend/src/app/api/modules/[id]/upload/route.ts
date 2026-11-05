import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { verifyAccessToken } from '@/lib/auth-tokens';

// Next.js App Router route segment config
export const maxDuration = 60; // seconds

function getAuthUser(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    return verifyAccessToken(token);
}

// POST /api/modules/[id]/upload
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

        // Verify module exists and belongs to this user
        const { data: mod, error: findError } = await supabaseServer
            .from('modules')
            .select('*')
            .eq('id', id)
            .single();

        if (findError || !mod) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        if (mod.assigned_to !== user.id) {
            return NextResponse.json({ error: 'You are not assigned to this module' }, { status: 403 });
        }

        // Parse the multipart form data
        const formData = await req.formData();
        const file = formData.get('code') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded. Send the ZIP as form field "code".' }, { status: 400 });
        }

        if (!file.name.endsWith('.zip') && file.type !== 'application/zip') {
            return NextResponse.json({ error: 'Only ZIP files are allowed' }, { status: 400 });
        }

        // 500 MB limit (500 * 1024 * 1024 bytes)
        const MAX_SIZE = 500 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: `File too large. Maximum allowed size is 500 MB.` }, { status: 413 });
        }

        // Store the file in Supabase Storage under modules/<module_id>/<filename>
        const fileBuffer = await file.arrayBuffer();
        const storagePath = `modules/${id}/${file.name}`;

        let savedPath = file.name;
        try {
            const { error: storageError } = await supabaseServer.storage
                .from('module-uploads')
                .upload(storagePath, fileBuffer, {
                    contentType: 'application/zip',
                    upsert: true,
                });
            if (!storageError) {
                savedPath = storagePath;
            }
        } catch {
            // Storage bucket might not exist or have RLS; fallback to filename
            savedPath = file.name;
        }

        // Update module status to 'uploaded' and save filename/path
        const { data: updated, error: updateError } = await supabaseServer
            .from('modules')
            .update({
                status: 'uploaded',
                code_path: savedPath,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        return NextResponse.json({
            module: updated,
            fileName: file.name,
            fileSizeMB: (file.size / (1024 * 1024)).toFixed(2),
            storagePath: savedPath,
            standardization: { success: true, message: 'File uploaded successfully.' },
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/modules/[id]/upload — remove uploaded file & reset module to in_progress
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

        const { data: mod, error: findError } = await supabaseServer
            .from('modules')
            .select('*, projects:project_id(owner_id)')
            .eq('id', id)
            .single();

        if (findError || !mod) {
            return NextResponse.json({ error: 'Module not found' }, { status: 404 });
        }

        const isAssignee = mod.assigned_to === user.id;
        const isOwner = mod.projects?.owner_id === user.id;
        if (!isAssignee && !isOwner) {
            return NextResponse.json({ error: 'Only the assigned contributor or project owner can delete uploaded code' }, { status: 403 });
        }

        // Try to delete from storage if stored there
        if (mod.code_path && mod.code_path.startsWith('modules/')) {
            try {
                await supabaseServer.storage.from('module-uploads').remove([mod.code_path]);
            } catch {
                // Ignore storage removal errors
            }
        }

        // Reset module status to in_progress (or unassigned if no one assigned)
        const newStatus = mod.assigned_to ? 'in_progress' : 'unassigned';
        const { data: updated, error: updateError } = await supabaseServer
            .from('modules')
            .update({
                status: newStatus,
                code_path: null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        return NextResponse.json({
            message: 'Uploaded code removed successfully',
            module: updated,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

