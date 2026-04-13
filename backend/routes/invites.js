const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const supabase = require('../lib/supabase');
const { authenticate } = require('../middleware/auth');

// Generate invite link for a project
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { project_id } = req.body;
        if (!project_id) return res.status(400).json({ error: 'project_id is required' });

        // Verify user owns the project
        const { data: project } = await supabase
            .from('projects')
            .select('owner_id')
            .eq('id', project_id)
            .single();

        if (!project) return res.status(404).json({ error: 'Project not found' });
        if (project.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Only the project owner can create invites' });
        }

        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const { data, error } = await supabase
            .from('invites')
            .insert({
                project_id,
                token,
                created_by: req.user.id,
                expires_at: expiresAt.toISOString(),
            })
            .select()
            .single();

        if (error) throw error;

        const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invite/${token}`;
        res.status(201).json({ invite: data, link: inviteLink });
    } catch (err) {
        next(err);
    }
});

// Accept an invite
router.post('/accept/:token', authenticate, async (req, res, next) => {
    try {
        const { data: invite, error } = await supabase
            .from('invites')
            .select('*')
            .eq('token', req.params.token)
            .single();

        if (error || !invite) {
            return res.status(404).json({ error: 'Invalid invite link' });
        }

        if (new Date(invite.expires_at) < new Date()) {
            return res.status(410).json({ error: 'Invite link has expired' });
        }

        // Return the project so the user can select a module
        const { data: project } = await supabase
            .from('projects')
            .select('*, modules(*)')
            .eq('id', invite.project_id)
            .single();

        res.json({ message: 'Invite accepted', project });
    } catch (err) {
        next(err);
    }
});

// Get invite details (public, for preview)
router.get('/:token', async (req, res, next) => {
    try {
        const { data: invite } = await supabase
            .from('invites')
            .select('*, projects(name, description)')
            .eq('token', req.params.token)
            .single();

        if (!invite) return res.status(404).json({ error: 'Invalid invite' });

        const expired = new Date(invite.expires_at) < new Date();
        res.json({ invite, expired });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
