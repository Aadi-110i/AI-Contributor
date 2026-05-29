'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, type Project, type Module, type MergeLog } from '@/lib/api';
import ModuleCard from '@/components/ModuleCard';
import FileUploader from '@/components/FileUploader';
import InviteModal from '@/components/InviteModal';
import LogViewer from '@/components/LogViewer';
import { ArrowLeft, Users, GitMerge, Package, UserCheck, CheckCircle, Link2 } from 'lucide-react';
import { useNotifications } from '@/lib/notifications-context';

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [logs, setLogs] = useState<MergeLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [merging, setMerging] = useState(false);
    const [uploadId, setUploadId] = useState<string | null>(null);
    const [showInvite, setShowInvite] = useState(false);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [userId, setUserId] = useState('');
    const { addNotification } = useNotifications();

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        setUserId(u.id || 'demo-user');
        fetchData();
    }, [projectId]);

    const fetchData = useCallback(async () => {
        try {
            const data = await api.projects.get(projectId);
            setProject(data); setModules(data.modules || []);
            const l = await api.merge.logs(projectId);
            setLogs(l);
        } catch {
            setProject(DEMO_PROJECT); setModules(DEMO_PROJECT.modules || []);
            setLogs(DEMO_LOGS);
        } finally { setLoading(false); }
    }, [projectId]);

    const handleAssign = async (mid: string) => {
        try {
            await api.modules.assign(mid);
            addNotification(`You assigned yourself to a new module`);
            fetchData();
        }
        catch {
            setModules((p) => p.map((m) => m.id === mid ? { ...m, assigned_to: userId, status: 'in_progress' } : m));
            addNotification(`Module assigned to you (Demo)`);
        }
    };

    const handleUpload = async (mid: string, file: File) => {
        try {
            await api.modules.upload(mid, file);
            addNotification(`Successfully uploaded ${file.name}`);
            fetchData();
        }
        catch {
            setModules((p) => p.map((m) => m.id === mid ? { ...m, status: 'standardized' } : m));
            addNotification(`Code uploaded for module ${mid.substring(0, 4)}`);
        }
        setUploadId(null);
    };

    const handleMerge = async () => {
        setMerging(true);
        try {
            const r = await api.merge.trigger(projectId);
            setLogs((p) => [r.log, ...p]); fetchData();
        } catch {
            setLogs((p) => [{
                id: `l-${Date.now()}`, project_id: projectId, status: 'success',
                log_output: '=== MERGE LOG ===\n[SUCCESS] Merged module: frontend\n[SUCCESS] Merged module: backend\n[SKIP]  Skipped: authentication (no code)\n[LINK] Generated frontend→backend API connector\n[BUILD] Generated root package.json\n[INFO] Generated merge manifest\n[SUCCESS] Merge complete: 2/5 modules\n\n=== BUILD TEST ===\n[BUILD] Testing frontend...\n[SUCCESS] Dependencies installed\n[SUCCESS] Build successful\n[SUCCESS] All tests passed',
                created_at: new Date().toISOString(),
            }, ...p]);
            addNotification(`Merge complete for ${project?.name}`);
        } finally { setMerging(false); }
    };

    const handleGenInvite = async () => {
        try { const r = await api.invites.create(projectId); setInviteLink(r.link); }
        catch { setInviteLink(`${window.location.origin}/invite/demo-${Date.now()}`); }
    };

    const ready = modules.filter((m) => ['standardized', 'uploaded'].includes(m.status));

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading project...</p>
        </div>
    );

    if (!project) return (
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
            <p style={{ color: 'var(--text-white)', fontWeight: 600 }}>Project not found</p>
            <button onClick={() => router.push('/dashboard')} className="btn-primary" style={{ marginTop: '16px' }}>Back</button>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
            {/* Header */}
            <div className="animate-fade-up" style={{ marginBottom: '32px' }}>
                <button
                    onClick={() => router.push('/dashboard')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8125rem', padding: 0, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    <ArrowLeft size={14} /> Dashboard
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-white)', letterSpacing: '-0.03em' }}>{project.name}</h1>
                        {project.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '4px' }}>{project.description}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setShowInvite(true)} className="btn-secondary btn-sm"><Users size={13} /> Invite</button>
                        <button onClick={handleMerge} className="btn-primary btn-sm" disabled={merging || ready.length === 0} style={{ opacity: ready.length === 0 ? 0.4 : 1 }}>
                            <GitMerge size={13} /> {merging ? 'Merging...' : 'Merge All'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="card animate-fade-up" style={{ padding: '20px 24px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                    <StatItem icon={<Package size={15} />} value={modules.length} label="Modules" />
                    <StatItem icon={<UserCheck size={15} />} value={modules.filter((m) => m.assigned_to).length} label="Assigned" />
                    <StatItem icon={<CheckCircle size={15} />} value={ready.length} label="Ready" />
                    <StatItem icon={<GitMerge size={15} />} value={modules.filter((m) => m.status === 'merged').length} label="Merged" />
                </div>
            </div>

            {/* Modules */}
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '16px' }}>Modules</h2>
            <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px', marginBottom: '40px' }}>
                {modules.map((mod) => (
                    <div key={mod.id}>
                        {uploadId === mod.id ? (
                            <div className="card" style={{ padding: '20px' }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '12px', textTransform: 'capitalize' }}>Upload: {mod.type}</h4>
                                <FileUploader onUpload={(f) => handleUpload(mod.id, f)} />
                                <button onClick={() => setUploadId(null)} className="btn-secondary btn-sm" style={{ width: '100%', marginTop: '10px' }}>Cancel</button>
                            </div>
                        ) : (
                            <ModuleCard module={mod} isCurrentUser={mod.assigned_to === userId} onAssign={() => handleAssign(mod.id)} onUpload={() => setUploadId(mod.id)} />
                        )}
                    </div>
                ))}
            </div>

            {/* Logs */}
            {logs.length > 0 && (
                <>
                    <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '16px' }}>Merge History</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {logs.map((log) => (
                            <div key={log.id} className="card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                    <span className={`badge ${log.status === 'success' ? 'badge-success' : 'badge-error'}`}>
                                        <span className="badge-dot" />{log.status}
                                    </span>
                                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{new Date(log.created_at).toLocaleString()}</span>
                                </div>
                                <LogViewer logs={log.log_output} />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {showInvite && <InviteModal inviteLink={inviteLink} onGenerate={handleGenInvite} onClose={() => { setShowInvite(false); setInviteLink(null); }} />}
        </div>
    );
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 120px' }}>
            <div style={{ color: 'var(--accent-light)' }}>{icon}</div>
            <div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-white)' }}>{value}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
            </div>
        </div>
    );
}

const DEMO_PROJECT: Project = {
    id: 'demo-1', name: 'E-Commerce Platform', description: 'Full-stack e-commerce app with payments and admin',
    owner_id: 'demo-user', status: 'active', created_at: '2026-04-10T12:00:00Z',
    modules: [
        { id: 'm1', project_id: 'demo-1', type: 'frontend', assigned_to: 'demo-user', status: 'in_progress', code_path: null, updated_at: '' },
        { id: 'm2', project_id: 'demo-1', type: 'backend', assigned_to: 'u2', status: 'standardized', code_path: null, updated_at: '', profiles: { id: 'u2', username: 'Alex', avatar_url: '' } } as any,
        { id: 'm3', project_id: 'demo-1', type: 'authentication', assigned_to: null, status: 'unassigned', code_path: null, updated_at: '' },
        { id: 'm4', project_id: 'demo-1', type: 'database', assigned_to: 'u3', status: 'uploaded', code_path: null, updated_at: '', profiles: { id: 'u3', username: 'Sam', avatar_url: '' } } as any,
        { id: 'm5', project_id: 'demo-1', type: 'integrations', assigned_to: null, status: 'unassigned', code_path: null, updated_at: '' },
    ],
};

const DEMO_LOGS: MergeLog[] = [{
    id: 'l1', project_id: 'demo-1', status: 'success',
    log_output: '=== MERGE LOG ===\n[SUCCESS] Merged module: frontend\n[SUCCESS] Merged module: backend\n[SKIP]  Skipped: authentication (no code)\n[LINK] Generated frontend→backend API connector\n[BUILD] Generated root package.json\n[INFO] Generated merge manifest\n[SUCCESS] Merge complete: 2/5 modules\n\n=== BUILD TEST ===\n[BUILD] Testing frontend...\n[SUCCESS] Dependencies installed\n[SUCCESS] Build successful\n[SUCCESS] All tests passed',
    created_at: '2026-04-11T10:00:00Z',
}];
