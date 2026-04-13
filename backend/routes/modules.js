const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const supabase = require('../lib/supabase');
const { authenticate } = require('../middleware/auth');
const { standardizeModule } = require('../services/standardizer');

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
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
            cb(null, true);
        } else {
            cb(new Error('Only ZIP files are allowed'));
        }
    },
});

// Get all modules for a project
router.get('/project/:projectId', authenticate, async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('modules')
            .select('*, profiles:assigned_to(id, username, avatar_url)')
            .eq('project_id', req.params.projectId)
            .order('type');

        if (error) throw error;
        res.json(data);
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
        res.json(data);
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

// Get module status and details
router.get('/:id/status', authenticate, async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('modules')
            .select('*, profiles:assigned_to(id, username, avatar_url)')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Module not found' });

        res.json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
