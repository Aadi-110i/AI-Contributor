const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Typed fetch wrapper for backend API
async function apiRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    // Attach auth token if available
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${res.status}`);
    }

    return res.json();
}

// Upload file (multipart form data)
async function apiUpload<T = unknown>(endpoint: string, file: File): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const formData = new FormData();
    formData.append('code', file);

    const headers: Record<string, string> = {};
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, { method: 'POST', headers, body: formData });
    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || `HTTP ${res.status}`);
    }
    return res.json();
}

export const api = {
    projects: {
        list: () => apiRequest<{ owned: Project[]; participating: Project[] }>('/projects'),
        get: (id: string) => apiRequest<Project>(`/projects/${id}`),
        create: (data: { name: string; description?: string }) =>
            apiRequest<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id: string) =>
            apiRequest<{ message: string }>(`/projects/${id}`, { method: 'DELETE' }),
    },
    modules: {
        list: (projectId: string) => apiRequest<Module[]>(`/modules/project/${projectId}`),
        assign: (id: string) =>
            apiRequest<Module>(`/modules/${id}/assign`, { method: 'POST' }),
        unassign: (id: string) =>
            apiRequest<Module>(`/modules/${id}/unassign`, { method: 'POST' }),
        upload: (id: string, file: File) => apiUpload(`/modules/${id}/upload`, file),
        status: (id: string) => apiRequest<Module>(`/modules/${id}/status`),
    },
    invites: {
        create: (projectId: string) =>
            apiRequest<{ invite: Invite; link: string }>('/invites', {
                method: 'POST',
                body: JSON.stringify({ project_id: projectId }),
            }),
        accept: (token: string) =>
            apiRequest<{ message: string; project: Project }>(`/invites/accept/${token}`, {
                method: 'POST',
            }),
        get: (token: string) =>
            apiRequest<{ invite: Invite & { projects: { name: string; description: string } }; expired: boolean }>(
                `/invites/${token}`
            ),
    },
    merge: {
        trigger: (projectId: string) =>
            apiRequest<MergeResult>(`/merge/project/${projectId}/merge`, { method: 'POST' }),
        logs: (projectId: string) => apiRequest<MergeLog[]>(`/merge/project/${projectId}/logs`),
    },
};

// Types
export interface Project {
    id: string;
    name: string;
    description: string;
    owner_id: string;
    status: string;
    created_at: string;
    modules?: Module[];
}

export interface Module {
    id: string;
    project_id: string;
    type: 'frontend' | 'backend' | 'authentication' | 'database' | 'integrations';
    assigned_to: string | null;
    status: string;
    code_path: string | null;
    updated_at: string;
    profiles?: { id: string; username: string; avatar_url: string } | null;
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
    status: string;
    log_output: string;
    created_at: string;
}

export interface MergeResult {
    merge: { success: boolean; logs: string };
    test: { success: boolean; logs: string };
    log: MergeLog;
}
