const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Run build checks on a merged project directory.
 * Attempts npm install + npm run build, captures output.
 */
async function runBuildTest(mergedDir) {
    const logs = [];
    let success = true;

    try {
        // Check if merged directory exists
        if (!fs.existsSync(mergedDir)) {
            return { success: false, logs: '❌ Merged directory not found' };
        }

        // Look for frontend and backend directories
        const frontendDir = path.join(mergedDir, 'frontend');
        const backendDir = path.join(mergedDir, 'backend');

        // Test frontend build
        if (fs.existsSync(frontendDir) && fs.existsSync(path.join(frontendDir, 'package.json'))) {
            logs.push('🔨 Testing frontend build...');
            try {
                const installOut = execSync('npm install --legacy-peer-deps 2>&1', {
                    cwd: frontendDir,
                    timeout: 120000,
                    encoding: 'utf-8',
                });
                logs.push('✅ Frontend dependencies installed');

                // Try build
                try {
                    const buildOut = execSync('npm run build 2>&1', {
                        cwd: frontendDir,
                        timeout: 120000,
                        encoding: 'utf-8',
                    });
                    logs.push('✅ Frontend build successful');
                } catch (buildErr) {
                    logs.push(`⚠️  Frontend build warning: ${truncateOutput(buildErr.stdout || buildErr.message)}`);
                    success = false;
                }
            } catch (installErr) {
                logs.push(`❌ Frontend install failed: ${truncateOutput(installErr.message)}`);
                success = false;
            }
        }

        // Test backend (just check syntax / require resolution)
        if (fs.existsSync(backendDir) && fs.existsSync(path.join(backendDir, 'package.json'))) {
            logs.push('🔨 Testing backend...');
            try {
                execSync('npm install --legacy-peer-deps 2>&1', {
                    cwd: backendDir,
                    timeout: 120000,
                    encoding: 'utf-8',
                });
                logs.push('✅ Backend dependencies installed');

                // Syntax check all .js files
                const jsFiles = findJsFiles(backendDir);
                let syntaxErrors = 0;
                for (const file of jsFiles) {
                    try {
                        execSync(`node --check "${file}" 2>&1`, { encoding: 'utf-8' });
                    } catch {
                        logs.push(`❌ Syntax error in: ${path.relative(backendDir, file)}`);
                        syntaxErrors++;
                    }
                }
                if (syntaxErrors === 0) {
                    logs.push('✅ Backend syntax check passed');
                } else {
                    logs.push(`⚠️  ${syntaxErrors} syntax error(s) found`);
                    success = false;
                }
            } catch (installErr) {
                logs.push(`❌ Backend install failed: ${truncateOutput(installErr.message)}`);
                success = false;
            }
        }

        // Check merge manifest
        const manifest = path.join(mergedDir, 'merge-manifest.json');
        if (fs.existsSync(manifest)) {
            const data = JSON.parse(fs.readFileSync(manifest, 'utf-8'));
            logs.push(`📋 Modules merged: ${data.modules.join(', ')}`);
            if (data.missing.length > 0) {
                logs.push(`⚠️  Missing modules: ${data.missing.join(', ')}`);
            }
        }

        logs.push(success ? '✅ All build tests passed' : '⚠️  Some tests had warnings/errors');

        return { success, logs: logs.join('\n') };
    } catch (err) {
        logs.push(`❌ Test runner error: ${err.message}`);
        return { success: false, logs: logs.join('\n') };
    }
}

/**
 * Find all .js files recursively, excluding node_modules.
 */
function findJsFiles(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findJsFiles(fullPath));
        } else if (entry.name.endsWith('.js')) {
            results.push(fullPath);
        }
    }
    return results;
}

/**
 * Truncate long output to keep logs readable.
 */
function truncateOutput(str, maxLen = 500) {
    if (!str) return '';
    return str.length > maxLen ? str.slice(0, maxLen) + '\n... (truncated)' : str;
}

module.exports = { runBuildTest };
