const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

// Expected folder structures per module type
const MODULE_STRUCTURES = {
    frontend: {
        dirs: ['src', 'src/components', 'src/pages', 'src/styles', 'src/utils', 'public'],
        requiredFiles: ['package.json'],
    },
    backend: {
        dirs: ['src', 'src/routes', 'src/middleware', 'src/models', 'src/utils'],
        requiredFiles: ['package.json'],
    },
    authentication: {
        dirs: ['src', 'src/providers', 'src/hooks', 'src/middleware'],
        requiredFiles: [],
    },
    database: {
        dirs: ['migrations', 'seeds', 'models'],
        requiredFiles: [],
    },
    integrations: {
        dirs: ['src', 'src/connectors', 'src/adapters'],
        requiredFiles: [],
    },
};

// Naming conventions: lowercase with hyphens
const NAMING_RULES = {
    dirPattern: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
    filePattern: /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?$/,
};

/**
 * Standardize an uploaded module ZIP file.
 * Extracts, enforces folder structure, normalizes naming, detects dependencies.
 */
async function standardizeModule(zipPath, moduleType, projectId) {
    const logs = [];
    const outputDir = path.join(__dirname, '..', 'uploads', projectId, moduleType);

    try {
        // Clean previous output
        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true, force: true });
        }

        // Extract ZIP
        const zip = new AdmZip(zipPath);
        const tempExtract = path.join(__dirname, '..', 'uploads', projectId, `_temp_${moduleType}`);
        zip.extractAllTo(tempExtract, true);
        logs.push(`✅ Extracted ZIP to temporary directory`);

        // Find root (handle nested root folders)
        let sourceRoot = tempExtract;
        const topLevel = fs.readdirSync(tempExtract);
        if (topLevel.length === 1 && fs.statSync(path.join(tempExtract, topLevel[0])).isDirectory()) {
            sourceRoot = path.join(tempExtract, topLevel[0]);
            logs.push(`📁 Detected nested root: ${topLevel[0]}`);
        }

        // Create standardized output directory
        fs.mkdirSync(outputDir, { recursive: true });

        // Enforce expected folder structure
        const structure = MODULE_STRUCTURES[moduleType] || MODULE_STRUCTURES.integrations;
        for (const dir of structure.dirs) {
            fs.mkdirSync(path.join(outputDir, dir), { recursive: true });
        }
        logs.push(`📂 Created standard directory structure for "${moduleType}" module`);

        // Copy files from source to output, normalizing names
        copyAndNormalize(sourceRoot, outputDir, logs);

        // Check for required files
        const missingFiles = [];
        for (const reqFile of structure.requiredFiles) {
            if (!fs.existsSync(path.join(outputDir, reqFile))) {
                missingFiles.push(reqFile);
            }
        }
        if (missingFiles.length > 0) {
            logs.push(`⚠️  Missing required files: ${missingFiles.join(', ')}`);
        }

        // Analyze dependencies if package.json exists
        const pkgPath = path.join(outputDir, 'package.json');
        let dependencies = {};
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
                dependencies = {
                    ...(pkg.dependencies || {}),
                    ...(pkg.devDependencies || {}),
                };
                logs.push(`📦 Found ${Object.keys(dependencies).length} dependencies`);
            } catch {
                logs.push(`⚠️  Could not parse package.json`);
            }
        }

        // Cleanup temp directory
        fs.rmSync(tempExtract, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
        logs.push(`🧹 Cleaned up temporary files`);
        logs.push(`✅ Standardization complete`);

        return {
            success: true,
            outputPath: outputDir,
            logs: logs.join('\n'),
            dependencies,
            missingFiles,
        };
    } catch (err) {
        logs.push(`❌ Standardization failed: ${err.message}`);
        return {
            success: false,
            outputPath: null,
            logs: logs.join('\n'),
            error: err.message,
        };
    }
}

/**
 * Recursively copy files, normalizing directory and file names.
 */
function copyAndNormalize(src, dest, logs) {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        // Skip hidden files and node_modules
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

        const srcPath = path.join(src, entry.name);
        let normalizedName = entry.name;

        // Normalize directory names to lowercase-hyphen
        if (entry.isDirectory()) {
            normalizedName = entry.name.toLowerCase().replace(/[_ ]+/g, '-');
            if (normalizedName !== entry.name) {
                logs.push(`🔄 Renamed directory: ${entry.name} → ${normalizedName}`);
            }
            const destPath = path.join(dest, normalizedName);
            fs.mkdirSync(destPath, { recursive: true });
            copyAndNormalize(srcPath, destPath, logs);
        } else {
            // Keep file names mostly intact, just remove spaces
            normalizedName = entry.name.replace(/ /g, '-');
            if (normalizedName !== entry.name) {
                logs.push(`🔄 Renamed file: ${entry.name} → ${normalizedName}`);
            }
            const destPath = path.join(dest, normalizedName);
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

module.exports = { standardizeModule };
