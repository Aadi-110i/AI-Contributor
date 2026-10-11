'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, type Project } from '@/lib/api';
import DashboardNavbar from '@/components/DashboardNavbar';
import IdeasOrbit from '@/components/dashboard/IdeasOrbit';
import RightColumn from '@/components/dashboard/RightColumn';
import RecentProjects from '@/components/dashboard/RecentProjects';
import { Plus, X, Check, Copy, Link as LinkIcon } from 'lucide-react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const DEMO: Project[] = [
  {
    id: 'demo-1', name: 'NovaChat', description: 'AI-powered chat platform',
    owner_id: 'demo', status: 'active', created_at: '2026-04-10T12:00:00Z',
    modules: ['frontend', 'backend', 'authentication', 'database', 'integrations'].map((t, i) => ({
      id: `m${i}`, project_id: 'demo-1', type: t as any, assigned_to: null, status: 'in_progress' as any, code_path: null, updated_at: '',
    })),
  },
  {
    id: 'demo-2', name: 'PixelForge', description: 'AI image generation tool',
    owner_id: 'demo', status: 'active', created_at: '2026-04-08T09:00:00Z',
    modules: ['frontend', 'backend', 'authentication', 'database', 'integrations'].map((t, i) => ({
      id: `m${i + 5}`, project_id: 'demo-2', type: t as any, assigned_to: null, status: 'standardized' as any, code_path: null, updated_at: '',
    })),
  },
  {
    id: 'demo-3', name: 'DocuMind', description: 'Smart documentation',
    owner_id: 'demo', status: 'active', created_at: '2026-04-06T15:00:00Z',
    modules: ['frontend', 'backend'].map((t, i) => ({
      id: `m${i + 10}`, project_id: 'demo-3', type: t as any, assigned_to: null, status: 'merged' as any, code_path: null, updated_at: '',
    })),
  },
  {
    id: 'demo-4', name: 'FlowOps', description: 'Automation workflows',
    owner_id: 'demo', status: 'error', created_at: '2026-04-01T10:00:00Z',
    modules: ['frontend'].map((t, i) => ({
      id: `m${i + 12}`, project_id: 'demo-4', type: t as any, assigned_to: null, status: 'unassigned' as any, code_path: null, updated_at: '',
    })),
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [createdProject, setCreatedProject] = useState<Project | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [idCopied, setIdCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('auth_token')) { router.push('/login'); return; }
    load();
  }, [router]);

  const load = async () => {
    try {
      const data = await api.projects.list();
      setProjects(data.owned?.length ? data.owned : DEMO);
    } catch {
      setProjects(DEMO);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const p = await api.projects.create({ name, description: desc });
      setProjects((prev) => [p, ...prev]);
      setCreatedProject(p);
    } catch {
      const demo: Project = {
        id: `demo-${Date.now()}`, name, description: desc,
        owner_id: 'demo', status: 'active', created_at: new Date().toISOString(),
        modules: ['frontend', 'backend', 'authentication', 'database', 'integrations'].map((t, i) => ({
          id: `m${i}`, project_id: '', type: t as any, assigned_to: null, status: 'unassigned' as any, code_path: null, updated_at: '',
        })),
      };
      setProjects((prev) => [demo, ...prev]);
      setCreatedProject(demo);
    } finally {
      setCreating(false);
    }
  };

  const handleResetCreate = () => {
    setShowCreate(false);
    setCreatedProject(null);
    setInviteLink(null);
    setIdCopied(false);
    setLinkCopied(false);
    setName('');
    setDesc('');
  };

  const copyToClipboard = (text: string, type: 'id' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') { setIdCopied(true); setTimeout(() => setIdCopied(false), 2000); }
    else { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); }
  };

  const handleGenerateInvite = async () => {
    if (!createdProject) return;
    try {
      const { link } = await api.invites.create(createdProject.id);
      setInviteLink(link);
    } catch {
      setInviteLink(`${window.location.origin}/invite/demo-${Date.now()}`);
    }
  };

  const totalModules = projects.reduce((s, p) => s + (p.modules?.length || 0), 0);
  const completedModules = projects.reduce((s, p) => s + (p.modules?.filter(m => ['merged', 'standardized', 'uploaded'].includes(m.status)).length || 0), 0);

  return (
    <div className="dash-layout">
      <DashboardNavbar />

      <main className="dash-main">
        <div className="dash-grid">
          {/* Left Column */}
          <div className="dash-col-left">
            <div className="left-column">
              <div className="eyebrow">
                <span>BUILD</span><span className="eyebrow-dot"></span>
                <span>COLLABORATE</span><span className="eyebrow-dot"></span>
                <span>SHIP</span>
              </div>

              <div className="greeting-block">
                <h2 className="greeting-sub">{getGreeting()},</h2>
                <h1 className="greeting-main">Aadarsh 👋</h1>
                <p className="greeting-desc">Turn your ideas into real products with the power of AI.</p>
              </div>

              <button className="new-project-btn" onClick={() => setShowCreate(true)}>
                <div className="btn-left">
                  <Plus size={16} style={{ color: '#C9A45F' }} />
                  <span>New Project</span>
                </div>
                <span className="btn-arrow">→</span>
              </button>

              <div className="stats-list">
                <div className="stat-item" onClick={() => {}}>
                  <span className="stat-val">{projects.length}</span>
                  <span className="stat-label">Projects</span>
                  <span className="stat-arrow">→</span>
                </div>
                <div className="stat-item">
                  <span className="stat-val">8</span>
                  <span className="stat-label">Collaborators</span>
                  <span className="stat-arrow">→</span>
                </div>
                <div className="stat-item">
                  <span className="stat-val">{totalModules}</span>
                  <span className="stat-label">Modules</span>
                  <span className="stat-arrow">→</span>
                </div>
                <div className="stat-item">
                  <span className="stat-val">{completedModules}</span>
                  <span className="stat-label">Deployments</span>
                  <span className="stat-arrow">→</span>
                </div>
              </div>

              <div className="quote-block">
                <p className="quote-text">&ldquo;Small ideas<br/>build big tomorrows.&rdquo;</p>
                <div className="quote-line"></div>
              </div>
            </div>
          </div>

          {/* Center */}
          <div className="dash-col-center">
            <IdeasOrbit onNewProject={() => setShowCreate(true)} />
          </div>

          {/* Right */}
          <div className="dash-col-right">
            <RightColumn />
          </div>
        </div>

        {/* Recent Projects */}
        {!loading && (
          <div className="dash-bottom">
            <RecentProjects projects={projects} onNewProject={() => setShowCreate(true)} />
          </div>
        )}
      </main>

      {/* ── New Project Modal ── */}
      {showCreate && (
        <div className="modal-backdrop" onClick={handleResetCreate}>
          {!createdProject ? (
            <form className="modal-box" onClick={(e) => e.stopPropagation()} onSubmit={handleCreate}>
              <button type="button" className="modal-close" onClick={handleResetCreate}><X size={18} /></button>
              <h3 className="modal-title">New Project</h3>
              <p className="modal-desc">Creates 5 modules ready to assign.</p>
              <div className="modal-field">
                <label className="modal-label">Project Name</label>
                <input className="modal-input" placeholder="My App" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
              </div>
              <div className="modal-field">
                <label className="modal-label">Description <span className="modal-optional">(optional)</span></label>
                <input className="modal-input" placeholder="What are you building?" value={desc} onChange={(e) => setDesc(e.target.value)} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleResetCreate}>Cancel</button>
                <button type="submit" className="btn-create" disabled={creating}>{creating ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          ) : (
            <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
              <div className="success-icon"><Check size={24} /></div>
              <h3 className="modal-title" style={{ marginTop: '16px' }}>Project Created!</h3>
              <p className="modal-desc">Your project is ready. Share the ID or an invite link to collaborate.</p>

              <div className="info-box">
                <label className="info-label">Project ID</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <code className="info-code">{createdProject.id}</code>
                  <button onClick={() => copyToClipboard(createdProject.id, 'id')} className="copy-btn" title="Copy ID">
                    {idCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {inviteLink ? (
                <div className="info-box" style={{ border: '1px solid rgba(201,169,110,0.25)' }}>
                  <label className="info-label" style={{ color: '#C9A45F' }}>Invite Link</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <code className="info-code">{inviteLink}</code>
                    <button onClick={() => copyToClipboard(inviteLink, 'link')} className="copy-btn">{linkCopied ? <Check size={14} /> : <Copy size={14} />}</button>
                  </div>
                </div>
              ) : (
                <button className="btn-create" style={{ width: '100%', marginBottom: '12px' }} onClick={handleGenerateInvite}>
                  <LinkIcon size={14} style={{ marginRight: '8px' }} /> Generate Invite Link
                </button>
              )}
              <button className="btn-cancel" style={{ width: '100%' }} onClick={handleResetCreate}>Done</button>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        body { margin: 0; font-family: 'Inter', sans-serif; background: #FAFAF8; }

        .dash-layout { min-height: 100vh; background: #FAFAF8; display: flex; flex-direction: column; }
        .dash-main { flex: 1; width: 100%; max-width: 1600px; margin: 0 auto; padding: 40px 56px 80px; box-sizing: border-box; }

        .dash-grid { display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 32px; width: 100%; }
        .dash-col-left { display: flex; flex-direction: column; }
        .dash-col-center { display: flex; justify-content: center; align-items: center; min-height: 580px; }
        .dash-col-right { display: flex; flex-direction: column; }
        .dash-bottom { margin-top: 16px; }

        /* Left Column */
        .left-column { display: flex; flex-direction: column; height: 100%; }
        .eyebrow { display: flex; align-items: center; gap: 12px; font-size: 0.6875rem; font-weight: 700; color: #888; letter-spacing: 0.2em; margin-bottom: 28px; }
        .eyebrow-dot { width: 4px; height: 4px; border-radius: 50%; background: #C9A45F; }
        .greeting-block { margin-bottom: 36px; }
        .greeting-sub { font-size: 1.25rem; font-weight: 400; color: #333; margin: 0 0 4px 0; }
        .greeting-main { font-size: 3rem; font-weight: 800; color: #111; margin: 0 0 16px 0; letter-spacing: -0.03em; line-height: 1.1; }
        .greeting-desc { font-size: 0.9375rem; color: #666; line-height: 1.5; max-width: 280px; margin: 0; }

        .new-project-btn { background: #0B0B0B; color: #fff; border: none; border-radius: 12px; width: 100%; max-width: 260px; height: 52px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; font-size: 0.9375rem; font-weight: 500; cursor: pointer; margin-bottom: 44px; transition: transform 0.2s, background 0.2s; font-family: inherit; }
        .new-project-btn:hover { background: #1a1a1a; transform: translateY(-2px); }
        .btn-left { display: flex; align-items: center; gap: 12px; }
        .btn-arrow { font-family: monospace; }

        .stats-list { display: flex; flex-direction: column; gap: 18px; margin-bottom: auto; }
        .stat-item { display: flex; align-items: center; gap: 16px; cursor: pointer; padding: 4px 0; }
        .stat-val { font-size: 1.5rem; font-weight: 700; color: #111; width: 45px; }
        .stat-label { font-size: 0.9375rem; font-weight: 500; color: #666; flex: 1; transition: color 0.2s; }
        .stat-arrow { color: #ccc; font-family: monospace; transition: all 0.2s; }
        .stat-item:hover .stat-label { color: #111; }
        .stat-item:hover .stat-arrow { color: #111; transform: translateX(4px); }

        .quote-block { margin-top: 48px; padding-bottom: 20px; }
        .quote-text { font-family: Georgia, serif; font-style: italic; font-size: 1.0625rem; color: #444; line-height: 1.4; margin: 0 0 14px 0; }
        .quote-line { width: 36px; height: 2px; background: #C9A45F; opacity: 0.5; }

        /* Modal */
        .modal-backdrop { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 24px; }
        .modal-box { background: #fff; border: 1px solid #E7E5E1; border-radius: 20px; padding: 32px; max-width: 440px; width: 100%; position: relative; box-shadow: 0 24px 60px rgba(0,0,0,0.12); }
        .modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; color: #888; cursor: pointer; }
        .modal-close:hover { color: #111; }
        .modal-title { font-size: 1.125rem; font-weight: 700; color: #111; margin: 0 0 4px 0; }
        .modal-desc { color: #666; font-size: 0.8125rem; margin: 0 0 24px 0; line-height: 1.5; }
        .modal-field { margin-bottom: 16px; }
        .modal-label { display: block; font-size: 0.75rem; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .modal-optional { font-weight: 400; text-transform: none; color: #aaa; }
        .modal-input { width: 100%; box-sizing: border-box; padding: 10px 14px; border: 1px solid #E7E5E1; border-radius: 8px; font-size: 0.875rem; font-family: inherit; color: #111; outline: none; }
        .modal-input:focus { border-color: #C9A45F; }
        .modal-actions { display: flex; gap: 10px; }
        .btn-cancel { flex: 1; padding: 10px; border: 1px solid #E7E5E1; background: transparent; border-radius: 8px; font-size: 0.875rem; font-family: inherit; cursor: pointer; color: #666; }
        .btn-cancel:hover { background: #f5f5f5; }
        .btn-create { flex: 1; padding: 10px; background: #111; color: #fff; border: none; border-radius: 8px; font-size: 0.875rem; font-family: inherit; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; }
        .btn-create:hover { background: #000; }
        .btn-create:disabled { opacity: 0.5; cursor: not-allowed; }
        .success-icon { width: 48px; height: 48px; border-radius: 50%; background: rgba(34,197,94,0.1); color: #22c55e; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
        .info-box { background: #F9F9F7; border: 1px solid #E7E5E1; border-radius: 10px; padding: 14px; margin-bottom: 14px; text-align: left; }
        .info-label { font-size: 0.625rem; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px; }
        .info-code { flex: 1; font-size: 0.75rem; color: #444; word-break: break-all; font-family: monospace; }
        .copy-btn { background: none; border: none; color: #888; cursor: pointer; } .copy-btn:hover { color: #C9A45F; }

        @media (max-width: 1100px) { .dash-grid { grid-template-columns: 1fr 1fr; } .dash-col-right { grid-column: span 2; } }
        @media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr; } .dash-col-right { grid-column: span 1; } .dash-main { padding: 24px; } }
      `}</style>
    </div>
  );
}
