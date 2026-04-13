const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate } = require('../middleware/auth');

// Create a new project
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ error: 'Project name is required' });

        const { data, error } = await supabase
            .from('projects')
            .insert({
                name,
                description: description || '',
                owner_id: req.user.id,
                status: 'active',
            })
            .select()
            .single();

        if (error) throw error;

        // Auto-create default modules for the project
        const moduleTypes = ['frontend', 'backend', 'authentication', 'database', 'integrations'];
        const modules = moduleTypes.map((type) => ({
            project_id: data.id,
            type,
            status: 'unassigned',
        }));

        const { error: modError } = await supabase.from('modules').insert(modules);
        if (modError) throw modError;

        res.status(201).json(data);
    } catch (err) {
        next(err);
    }
});

// List projects for the authenticated user (owned + participating)
router.get('/', authenticate, async (req, res, next) => {
    try {
        // Projects the user owns
        const { data: owned, error: ownErr } = await supabase
            .from('projects')
            .select('*, modules(*)')
            .eq('owner_id', req.user.id)
            .order('created_at', { ascending: false });

        if (ownErr) throw ownErr;

        // Projects the user is assigned to a module in
        const { data: assigned, error: assErr } = await supabase
            .from('modules')
            .select('project_id')
            .eq('assigned_to', req.user.id);

        if (assErr) throw assErr;

        const assignedProjectIds = assigned
            .map((m) => m.project_id)
            .filter((id) => !owned.some((p) => p.id === id));

        let participating = [];
        if (assignedProjectIds.length > 0) {
            const { data, error } = await supabase
                .from('projects')
                .select('*, modules(*)')
                .in('id', assignedProjectIds);
            if (error) throw error;
            participating = data;
        }

        res.json({ owned, participating });
    } catch (err) {
        next(err);
    }
});

// Get single project with modules and contributor info
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*, modules(*, profiles:assigned_to(id, username, avatar_url))')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Project not found' });

        res.json(data);
    } catch (err) {
        next(err);
    }
});

// Delete a project (owner only)
router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        const { data: project } = await supabase
            .from('projects')
            .select('owner_id')
            .eq('id', req.params.id)
            .single();

        if (!project) return res.status(404).json({ error: 'Project not found' });
        if (project.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Only the project owner can delete it' });
        }

        await supabase.from('modules').delete().eq('project_id', req.params.id);
        await supabase.from('invites').delete().eq('project_id', req.params.id);
        await supabase.from('merge_logs').delete().eq('project_id', req.params.id);
        const { error } = await supabase.from('projects').delete().eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Project deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
