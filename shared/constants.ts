// Shared constants for AI Collab Builder

export const MODULE_TYPES = ['frontend', 'backend', 'authentication', 'database', 'integrations'] as const;

export const MODULE_STATUS = [
    'unassigned',
    'in_progress',
    'uploaded',
    'standardized',
    'merged',
    'error',
] as const;

export const PROJECT_STATUS = ['active', 'merged', 'error'] as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const MODULE_LABELS: Record<string, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    authentication: 'Authentication',
    database: 'Database',
    integrations: 'Integrations',
};

export const STATUS_LABELS: Record<string, string> = {
    unassigned: 'Unassigned',
    in_progress: 'In Progress',
    uploaded: 'Uploaded',
    standardized: 'Standardized',
    merged: 'Merged',
    error: 'Error',
};
