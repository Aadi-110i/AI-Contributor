// Shared types for AI Collab Builder

export type ModuleType = 'frontend' | 'backend' | 'authentication' | 'database' | 'integrations';

export type ModuleStatus =
    | 'unassigned'
    | 'in_progress'
    | 'uploaded'
    | 'standardized'
    | 'merged'
    | 'error';

export type ProjectStatus = 'active' | 'merged' | 'error';

export interface User {
    id: string;
    email: string;
    username: string;
    avatar_url: string | null;
    created_at: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    owner_id: string;
    status: ProjectStatus;
    created_at: string;
    modules?: Module[];
}

export interface Module {
    id: string;
    project_id: string;
    type: ModuleType;
    assigned_to: string | null;
    status: ModuleStatus;
    code_path: string | null;
    updated_at: string;
}

export interface Invite {
    id: string;
    project_id: string;
    token: string;
    created_by: string;
    expires_at: string;
}

export interface MergeLog {
    id: string;
    project_id: string;
    status: 'success' | 'error';
    log_output: string;
    created_at: string;
}
