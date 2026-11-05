const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const supabase = require('../lib/supabase');
const { authenticate } = require('../middleware/auth');
const { standardizeModule } = require('../services/standardizer');
const { validateZipSecurity } = require('../services/zip-security');

// Configure multer for ZIP uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'uploads', req.params.id);
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `module-${Date.now()}.zip`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB safe threshold — protects against zip bombs and resource exhaustion
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
            cb(null, true);
        } else {
            cb(new Error('Only ZIP files are allowed'));
        }
    },
});

// Helper: attach profile to a single module (avoids PGRST200)
async function attachProfile(mod) {
    if (!mod || !mod.assigned_to) return { ...mod, profiles: null };
    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', mod.assigned_to);
    return { ...mod, profiles: profiles?.[0] || null };
}

// Get all modules for a project
router.get('/project/:projectId', authenticate, async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('modules')
            .select('*')
            .eq('project_id', req.params.projectId)
            .order('type');

        if (error) throw error;

        const modules = data || [];
        const userIds = [...new Set(modules.map((m) => m.assigned_to).filter(Boolean))];
        let profileMap = {};
        if (userIds.length > 0) {
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
                .in('id', userIds);
            (profiles || []).forEach((p) => { profileMap[p.id] = p; });
        }
        const result = modules.map((m) => ({
            ...m,
            profiles: m.assigned_to ? (profileMap[m.assigned_to] || null) : null,
        }));

        res.json(result);
    } catch (err) {
        next(err);
    }
});

// Assign a module to the current user
router.post('/:id/assign', authenticate, async (req, res, next) => {
    try {
        // Check if module is already assigned
        const { data: existing } = await supabase
            .from('modules')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (!existing) return res.status(404).json({ error: 'Module not found' });
        if (existing.assigned_to && existing.assigned_to !== req.user.id) {
            return res.status(409).json({ error: 'Module is already assigned to another user' });
        }

        const { data, error } = await supabase
            .from('modules')
            .update({
                assigned_to: req.user.id,
                status: 'in_progress',
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(await attachProfile(data));
    } catch (err) {
        next(err);
    }
});

// Unassign a module
router.post('/:id/unassign', authenticate, async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('modules')
            .update({
                assigned_to: null,
                status: 'unassigned',
            })
            .eq('id', req.params.id)
            .eq('assigned_to', req.user.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// Upload code for a module (ZIP file)
router.post('/:id/upload', authenticate, upload.single('code'), async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        // Security inspection: check for zip bombs, path traversal, malicious extensions
        const fileBuf = fs.readFileSync(req.file.path);
        const check = validateZipSecurity(fileBuf);
        if (!check.safe) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: check.error });
        }

        const { data: module } = await supabase
            .from('modules')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (!module) return res.status(404).json({ error: 'Module not found' });
        if (module.assigned_to !== req.user.id) {
            return res.status(403).json({ error: 'You are not assigned to this module' });
        }

        // Run standardization on the uploaded code
        const result = await standardizeModule(req.file.path, module.type, module.project_id);

        // Update module status and code path
        const { data, error } = await supabase
            .from('modules')
            .update({
                status: result.success ? 'standardized' : 'error',
                code_path: result.outputPath,
                updated_at: new Date().toISOString(),
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            module: data,
            standardization: result,
        });
    } catch (err) {
        next(err);
    }
});

// Delete/remove uploaded code for a module
router.delete('/:id/upload', authenticate, async (req, res, next) => {
    try {
        const { data: module } = await supabase
            .from('modules')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (!module) return res.status(404).json({ error: 'Module not found' });
        if (module.assigned_to !== req.user.id) {
            return res.status(403).json({ error: 'Only the assigned contributor can delete uploaded code' });
        }

        const { data, error } = await supabase
            .from('modules')
            .update({
                status: 'in_progress',
                code_path: null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ message: 'Uploaded code removed', module: data });
    } catch (err) {
        next(err);
    }
});

// Get module status and details
router.get('/:id/status', authenticate, async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('modules')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Module not found' });

        res.json(await attachProfile(data));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
