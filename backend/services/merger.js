const path = require('path');
const fs = require('fs');

/**
 * Merge all uploaded modules into a single unified project.
 * Handles: frontend↔backend API wiring, auth↔database connections, missing modules.
 */
async function mergeProject(projectId, modules) {
    const logs = [];
    const mergedDir = path.join(__dirname, '..', 'merged', projectId);

    try {
        // Clean previous merge output
        if (fs.existsSync(mergedDir)) {
            fs.rmSync(mergedDir, { recursive: true, force: true });
        }
        fs.mkdirSync(mergedDir, { recursive: true });

        const uploadsBase = path.join(__dirname, '..', 'uploads', projectId);

        // Copy each module into its respective folder
        const mergedModules = [];
        const missingModules = [];

        for (const mod of modules) {
            const moduleDir = path.join(uploadsBase, mod.type);
            const targetDir = path.join(mergedDir, mod.type);

            if (mod.code_path && fs.existsSync(mod.code_path)) {
                copyRecursive(mod.code_path, targetDir);
                mergedModules.push(mod.type);
                logs.push(`✅ Merged module: ${mod.type}`);
            } else if (fs.existsSync(moduleDir)) {
                copyRecursive(moduleDir, targetDir);
                mergedModules.push(mod.type);
                logs.push(`✅ Merged module: ${mod.type}`);
            } else {
                missingModules.push(mod.type);
                logs.push(`⏭️  Skipped module: ${mod.type} (no code uploaded)`);
            }
        }

        // Generate API connector if both frontend and backend exist
        if (mergedModules.includes('frontend') && mergedModules.includes('backend')) {
            generateApiConnector(mergedDir, logs);
        }

        // Wire auth ↔ database if both exist
        if (mergedModules.includes('authentication') && mergedModules.includes('database')) {
            generateAuthDbBridge(mergedDir, logs);
        }

        // Generate root package.json for the merged project
        generateRootPackageJson(mergedDir, mergedModules, logs);

        // Generate merge manifest
        const manifest = {
            projectId,
            mergedAt: new Date().toISOString(),
            modules: mergedModules,
            missing: missingModules,
        };
        fs.writeFileSync(
            path.join(mergedDir, 'merge-manifest.json'),
            JSON.stringify(manifest, null, 2)
        );
        logs.push(`📋 Generated merge manifest`);
        logs.push(`✅ Merge complete: ${mergedModules.length}/${modules.length} modules merged`);

        return {
            success: true,
            outputPath: mergedDir,
            logs: logs.join('\n'),
            manifest,
        };
    } catch (err) {
        logs.push(`❌ Merge failed: ${err.message}`);
        return {
            success: false,
            outputPath: null,
            logs: logs.join('\n'),
            error: err.message,
        };
    }
}

/**
 * Generate an API connector file that wires frontend to backend endpoints.
 */
function generateApiConnector(mergedDir, logs) {
    const connectorContent = `// Auto-generated API connector — links frontend to backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiRequest(endpoint, options = {}) {
  const url = \`\${API_BASE}\${endpoint}\`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Attach auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = \`Bearer \${token}\`;
  }

  const response = await fetch(url, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || \`HTTP \${response.status}\`);
  }
  return response.json();
}

export const api = {
  projects: {
    list: () => apiRequest('/projects'),
    get: (id) => apiRequest(\`/projects/\${id}\`),
    create: (data) => apiRequest('/projects', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => apiRequest(\`/projects/\${id}\`, { method: 'DELETE' }),
  },
  modules: {
    list: (projectId) => apiRequest(\`/modules/project/\${projectId}\`),
    assign: (id) => apiRequest(\`/modules/\${id}/assign\`, { method: 'POST' }),
    status: (id) => apiRequest(\`/modules/\${id}/status\`),
  },
  merge: {
    trigger: (projectId) => apiRequest(\`/merge/project/\${projectId}/merge\`, { method: 'POST' }),
    logs: (projectId) => apiRequest(\`/merge/project/\${projectId}/logs\`),
  },
};
`;

    const connectorDir = path.join(mergedDir, 'frontend', 'src', 'utils');
    fs.mkdirSync(connectorDir, { recursive: true });
    fs.writeFileSync(path.join(connectorDir, 'api-connector.js'), connectorContent);
    logs.push(`🔗 Generated frontend→backend API connector`);
}

/**
 * Generate auth↔database bridge configuration.
 */
function generateAuthDbBridge(mergedDir, logs) {
    const bridgeContent = `// Auto-generated auth↔database bridge
// Connects authentication module with database module

const authConfig = {
  // Map auth user fields to database user table
  userMapping: {
    authId: 'id',
    email: 'email',
    displayName: 'username',
    createdAt: 'created_at',
  },
  // Hooks for auth events
  onUserCreated: 'database/seeds/create-user-profile',
  onUserDeleted: 'database/migrations/cleanup-user-data',
};

module.exports = authConfig;
`;

    const bridgeDir = path.join(mergedDir, 'integrations');
    fs.mkdirSync(bridgeDir, { recursive: true });
    fs.writeFileSync(path.join(bridgeDir, 'auth-db-bridge.js'), bridgeContent);
    logs.push(`🔗 Generated auth↔database bridge`);
}

/**
 * Generate a root package.json that orchestrates all modules.
 */
function generateRootPackageJson(mergedDir, mergedModules, logs) {
    const scripts = {};
    if (mergedModules.includes('frontend')) {
        scripts['dev:frontend'] = 'cd frontend && npm run dev';
        scripts['build:frontend'] = 'cd frontend && npm run build';
    }
    if (mergedModules.includes('backend')) {
        scripts['dev:backend'] = 'cd backend && npm run dev';
        scripts['start:backend'] = 'cd backend && npm start';
    }
    scripts['install:all'] = mergedModules
        .filter((m) => ['frontend', 'backend'].includes(m))
        .map((m) => `cd ${m} && npm install`)
        .join(' && ');

    const pkg = {
        name: 'merged-project',
        version: '1.0.0',
        private: true,
        scripts,
    };

    fs.writeFileSync(path.join(mergedDir, 'package.json'), JSON.stringify(pkg, null, 2));
    logs.push(`📦 Generated root package.json with orchestration scripts`);
}

/**
 * Recursively copy a directory.
 */
function copyRecursive(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

module.exports = { mergeProject };
