const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate } = require('../middleware/auth');
const { mergeProject } = require('../services/merger');
const { runBuildTest } = require('../services/tester');

// Trigger merge for a project
router.post('/project/:projectId/merge', authenticate, async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        // Verify project exists and user has access
        const { data: project } = await supabase
            .from('projects')
            .select('*, modules(*)')
            .eq('id', projectId)
            .single();

        if (!project) return res.status(404).json({ error: 'Project not found' });

        // Check that at least some modules are uploaded
        const readyModules = project.modules.filter(
            (m) => m.status === 'standardized' || m.status === 'uploaded'
        );

        if (readyModules.length === 0) {
            return res.status(400).json({
                error: 'No modules ready for merge. Upload code to at least one module first.',
            });
        }

        // Run merge
        const mergeResult = await mergeProject(projectId, project.modules);

        // Run auto-tests on merged output
        let testResult = { success: false, logs: 'Merge failed, skipping tests.' };
        if (mergeResult.success) {
            testResult = await runBuildTest(mergeResult.outputPath);
        }

        // Log results
        const status = mergeResult.success && testResult.success ? 'success' : 'error';
        const logOutput = [
            '=== MERGE LOG ===',
            mergeResult.logs,
            '',
            '=== BUILD TEST LOG ===',
            testResult.logs,
        ].join('\n');

        const { data: log, error } = await supabase
            .from('merge_logs')
            .insert({
                project_id: projectId,
                status,
                log_output: logOutput,
            })
            .select()
            .single();

        if (error) throw error;

        // Update project status
        await supabase
            .from('projects')
            .update({ status: status === 'success' ? 'merged' : 'error' })
            .eq('id', projectId);

        // Update merged module statuses
        if (mergeResult.success) {
            for (const mod of readyModules) {
                await supabase
                    .from('modules')
                    .update({ status: 'merged' })
                    .eq('id', mod.id);
            }
        }

        res.json({
            merge: mergeResult,
            test: testResult,
            log,
        });
    } catch (err) {
        next(err);
    }
});

// Get merge logs for a project
router.get('/project/:projectId/logs', authenticate, async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('merge_logs')
            .select('*')
            .eq('project_id', req.params.projectId)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
