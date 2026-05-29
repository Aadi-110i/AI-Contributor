'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, type Project } from '@/lib/api';
import ProjectCard from '@/components/ProjectCard';
import { Plus, X, FolderOpen, Users2, Copy, Check, Link as LinkIcon, Activity, Layers, TrendingUp, Globe2 } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import dynamic from 'next/dynamic';

const TeamShowcase = dynamic(() => import('@/components/ui/team-showcase'), { ssr: false });

import { GlobeLive } from '@/components/ui/cobe-globe-live';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const router = useRouter();
  const [owned, setOwned] = useState<Project[]>([]);
  const [participating, setParticipating] = useState<Project[]>([]);
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
      // If we got real data from the backend, use it
      if (data.owned || data.participating) {
        setOwned(data.owned || []);
        setParticipating(data.participating || []);
      } else {
        setOwned(DEMO);
      }
    } catch (err) {
      console.warn('API unavailable, falling back to static DEMO data', err);
      setOwned(DEMO);
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
      setOwned((prev) => [p, ...prev]);
      setCreatedProject(p);
    } catch {
      const demo: Project = {
        id: `demo-${Date.now()}`, name, description: desc, owner_id: 'demo', status: 'active', created_at: new Date().toISOString(),
        modules: ['frontend', 'backend', 'authentication', 'database', 'integrations'].map((t, i) => ({ id: `m${i}`, project_id: '', type: t as any, assigned_to: null, status: 'unassigned' as any, code_path: null, updated_at: '' })),
      };
      setOwned((prev) => [demo, ...prev]);
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
    if (type === 'id') {
      setIdCopied(true);
      setTimeout(() => setIdCopied(false), 2000);
    } else {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleGenerateInvite = async () => {
    if (!createdProject) return;
    try {
      const { link } = await api.invites.create(createdProject.id);
      setInviteLink(link);
    } catch {
      setInviteLink(`${window.location.origin}/invite/demo-token-${Date.now()}`);
    }
  };

  // Stats
  const totalModules = owned.reduce((sum, p) => sum + (p.modules?.length || 0), 0);
  const completedModules = owned.reduce((sum, p) => sum + (p.modules?.filter(m => ['merged', 'standardized', 'uploaded'].includes(m.status)).length || 0), 0);

  return (
    <div className="db-root">
      <Sidebar />

      <div className="db-main">
        {/* ── Welcome Section ── */}
        <div className="db-welcome animate-fade-up">
          <div className="db-welcome-text">
            <h1>{getGreeting()}, Aadarsh 👋</h1>
            <p>Here&apos;s what&apos;s happening with your projects today.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus size={15} /> New Project
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="db-stats animate-fade-up" style={{ animationDelay: '0.05s' }}>
          <StatCard
            icon={<FolderOpen size={20} />}
            label="Projects"
            value={owned.length}
            color="var(--accent)"
            bg="var(--accent-muted)"
          />
          <StatCard
            icon={<Users2 size={20} />}
            label="Collaborations"
            value={participating.length}
            color="var(--info)"
            bg="rgba(106, 155, 212, 0.1)"
          />
          <StatCard
            icon={<Layers size={20} />}
            label="Modules"
            value={`${completedModules}/${totalModules}`}
            color="var(--success)"
            bg="rgba(109, 184, 122, 0.1)"
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            label="Active"
            value={owned.filter(p => p.status === 'active').length}
            color="var(--warning)"
            bg="rgba(212, 160, 74, 0.1)"
          />
        </div>

        {/* Create modal */}
        {showCreate && (
          <div onClick={handleResetCreate} className="db-modal-backdrop">
            {!createdProject ? (
              <form onClick={(e) => e.stopPropagation()} onSubmit={handleCreate} className="db-modal animate-fade-up">
                <button type="button" onClick={handleResetCreate} className="db-modal-close">
                  <X size={18} />
                </button>
                <h3 className="db-modal-title">New Project</h3>
                <p className="db-modal-desc">Creates 5 modules ready to assign</p>
                <div style={{ marginBottom: '14px' }}>
                  <label className="label">Project Name</label>
                  <input className="input" placeholder="My App" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label className="label">Description <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
                  <input className="input" placeholder="What are you building?" value={desc} onChange={(e) => setDesc(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={handleResetCreate} style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={creating} style={{ flex: 1, opacity: creating ? 0.6 : 1 }}>{creating ? 'Creating...' : 'Create'}</button>
                </div>
              </form>
            ) : (
              <div onClick={(e) => e.stopPropagation()} className="db-modal animate-fade-up" style={{ textAlign: 'center' }}>
                <div className="db-modal-success-icon">
                  <Check size={24} />
                </div>
                <h3 className="db-modal-title" style={{ marginTop: '16px' }}>Project Created!</h3>
                <p className="db-modal-desc">Your project is ready. Share the ID or an invite link to start collaborating.</p>

                <div className="db-modal-info-box">
                  <label className="db-modal-info-label">Project ID</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <code className="db-modal-code">{createdProject.id}</code>
                    <button onClick={() => copyToClipboard(createdProject.id, 'id')} className="db-modal-copy-btn" title="Copy ID">
                      {idCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {inviteLink ? (
                  <div className="db-modal-info-box" style={{ border: '1px solid rgba(201, 169, 110, 0.25)' }}>
                    <label className="db-modal-info-label" style={{ color: 'var(--accent)' }}>Invite Link</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <code className="db-modal-code">{inviteLink}</code>
                      <button onClick={() => copyToClipboard(inviteLink, 'link')} className="db-modal-copy-btn" title="Copy Link">
                        {linkCopied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={handleGenerateInvite} className="btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
                    <LinkIcon size={14} style={{ marginRight: '8px' }} /> Generate Invite Link
                  </button>
                )}

                <button onClick={handleResetCreate} className="btn-secondary" style={{ width: '100%' }}>
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading your workspace...</p>
          </div>
        ) : (
          <div className="db-content">
            {/* My Projects */}
            <section id="projects" className="db-section animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="db-section-header">
                <div className="db-section-icon" style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}>
                  <FolderOpen size={18} />
                </div>
                <h2 className="db-section-title">My Projects</h2>
                <span className="badge badge-accent" style={{ marginLeft: 'auto' }}><span className="badge-dot" />{owned.length}</span>
              </div>
              {owned.length > 0 ? (
                <div className="db-project-grid stagger">
                  {owned.map((p) => <ProjectCard key={p.id} project={p} />)}
                </div>
              ) : (
                <div className="db-empty-state">
                  <FolderOpen size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                  <p>No projects yet. Create your first one above!</p>
                </div>
              )}
            </section>

            {/* Collaborations */}
            {participating.length > 0 && (
              <section className="db-section animate-fade-up" style={{ animationDelay: '0.15s' }}>
                <div className="db-section-header">
                  <div className="db-section-icon" style={{ background: 'rgba(106, 155, 212, 0.1)', color: 'var(--info)' }}>
                    <Users2 size={18} />
                  </div>
                  <h2 className="db-section-title">Collaborations</h2>
                  <span className="badge badge-active" style={{ marginLeft: 'auto' }}><span className="badge-dot" />{participating.length}</span>
                </div>
                <div className="db-project-grid stagger">
                  {participating.map((p) => <ProjectCard key={p.id} project={p} />)}
                </div>
              </section>
            )}

            {/* Team Members */}
            <section className="db-section animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="db-section-header">
                <div className="db-section-icon" style={{ background: 'rgba(212, 160, 74, 0.1)', color: 'var(--warning)' }}>
                  <Users2 size={18} />
                </div>
                <h2 className="db-section-title">Team Members</h2>
              </div>
              <TeamShowcase />
            </section>

            {/* Global Activity */}
            <section id="globe" className="db-section animate-fade-up" style={{ animationDelay: '0.25s' }}>
              <div className="db-section-header">
                <div className="db-section-icon" style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}>
                  <Globe2 size={18} />
                </div>
                <h2 className="db-section-title">Global Activity</h2>
                <span className="badge badge-accent" style={{ marginLeft: 'auto' }}><span className="badge-dot" />Live</span>
              </div>
              <div style={{
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                padding: '24px 16px',
                background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
                border: '1px solid var(--border)',
              }}>
                <GlobeLive />
              </div>
            </section>
          </div>
        )}
      </div>

      {/* ── Dashboard Styles ── */}
      <style>{`
                .db-root {
                    position: relative;
                    min-height: 100vh;
                    background: var(--bg);
                    transition: background 0.35s ease;
                }
                .db-main {
                    position: relative;
                    z-index: 1;
                    padding: 84px 40px 80px;
                    width: 100%;
                    box-sizing: border-box;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                @media (max-width: 768px) {
                    .db-main {
                        padding: 76px 16px 60px !important;
                    }
                }

                /* ── Welcome ── */
                .db-welcome {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 28px;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .db-welcome h1 {
                    font-size: 1.625rem;
                    font-weight: 700;
                    color: var(--text-white);
                    letter-spacing: -0.03em;
                    line-height: 1.3;
                }
                .db-welcome p {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    margin-top: 2px;
                    line-height: 1.5;
                }
                @media (max-width: 640px) {
                    .db-welcome {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .db-welcome h1 { font-size: 1.375rem; }
                }

                /* ── Stat Cards ── */
                .db-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 14px;
                    margin-bottom: 28px;
                }
                @media (max-width: 1100px) {
                    .db-stats { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 540px) {
                    .db-stats { grid-template-columns: 1fr; }
                }
                .db-stat-card {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 24px;
                    box-shadow: var(--card-shadow);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .db-stat-card:hover {
                    border-color: var(--accent-soft);
                    box-shadow: var(--card-shadow-hover);
                    transform: translateY(-4px);
                }
                .db-stat-card::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--accent);
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .db-stat-card:hover::after {
                    opacity: 1;
                }
                .db-stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: transform 0.3s;
                }
                .db-stat-card:hover .db-stat-icon {
                    transform: scale(1.1);
                }
                .db-stat-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 4px;
                }
                .db-stat-value {
                    font-size: 1.625rem;
                    font-weight: 800;
                    color: var(--text-white);
                    letter-spacing: -0.02em;
                    line-height: 1;
                }

                /* ── Content ── */
                .db-content {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .db-section {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 24px;
                    box-shadow: var(--card-shadow);
                    transition: all 0.25s ease;
                }
                .db-section:hover {
                    border-color: var(--border-hover);
                }
                .db-section-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .db-section-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .db-section-title {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text-white);
                }

                /* ── Project Grid ── */
                .db-project-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 14px;
                }
                @media (max-width: 640px) {
                    .db-project-grid {
                        grid-template-columns: 1fr;
                    }
                }

                /* ── Empty State ── */
                .db-empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 48px 24px;
                    text-align: center;
                    border: 1px dashed var(--border);
                    border-radius: var(--radius);
                    background: var(--surface-2);
                }
                .db-empty-state p {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                /* ── Modal ── */
                .db-modal-backdrop {
                    position: fixed;
                    inset: 0;
                    z-index: 300;
                    background: rgba(0,0,0,0.4);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                }
                .db-modal {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 28px;
                    max-width: 440px;
                    width: 100%;
                    position: relative;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
                }
                .db-modal-close {
                    position: absolute;
                    top: 14px;
                    right: 14px;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .db-modal-close:hover { color: var(--text-white); }
                .db-modal-title {
                    font-size: 1.0625rem;
                    font-weight: 700;
                    color: var(--text-white);
                    margin-bottom: 4px;
                }
                .db-modal-desc {
                    color: var(--text-secondary);
                    font-size: 0.8125rem;
                    margin-bottom: 20px;
                    line-height: 1.5;
                }
                .db-modal-success-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(109, 184, 122, 0.1);
                    color: var(--success);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                }
                .db-modal-info-box {
                    background: var(--surface-2);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 16px;
                    text-align: left;
                }
                .db-modal-info-label {
                    font-size: 0.625rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    display: block;
                    margin-bottom: 8px;
                }
                .db-modal-code {
                    flex: 1;
                    font-size: 0.8125rem;
                    color: var(--text-primary);
                    word-break: break-all;
                    font-family: monospace;
                }
                .db-modal-copy-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .db-modal-copy-btn:hover { color: var(--accent); }
            `}</style>
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: string | number; color: string; bg: string }) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-icon" style={{ background: bg, color }}>
        {icon}
      </div>
      <div>
        <p className="db-stat-label">{label}</p>
        <p className="db-stat-value">{value}</p>
      </div>
    </div>
  );
}

const DEMO: Project[] = [
  {
    id: 'demo-1', name: 'E-Commerce Platform', description: 'Full-stack e-commerce app with payments and admin',
    owner_id: 'demo', status: 'active', created_at: '2026-04-10T12:00:00Z',
    modules: [
      { id: 'm1', project_id: 'demo-1', type: 'frontend', assigned_to: 'demo', status: 'in_progress', code_path: null, updated_at: '' },
      { id: 'm2', project_id: 'demo-1', type: 'backend', assigned_to: 'u2', status: 'standardized', code_path: null, updated_at: '', profiles: { id: 'u2', username: 'Alex', avatar_url: '' } } as any,
      { id: 'm3', project_id: 'demo-1', type: 'authentication', assigned_to: null, status: 'unassigned', code_path: null, updated_at: '' },
      { id: 'm4', project_id: 'demo-1', type: 'database', assigned_to: 'u3', status: 'uploaded', code_path: null, updated_at: '', profiles: { id: 'u3', username: 'Sam', avatar_url: '' } } as any,
      { id: 'm5', project_id: 'demo-1', type: 'integrations', assigned_to: null, status: 'unassigned', code_path: null, updated_at: '' },
    ],
  },
  {
    id: 'demo-2', name: 'Social Analytics Dashboard', description: 'Real-time analytics with team collaboration features',
    owner_id: 'demo', status: 'merged', created_at: '2026-04-08T09:00:00Z',
    modules: ['frontend', 'backend', 'authentication', 'database', 'integrations'].map((t, i) => ({
      id: `m${i + 6}`, project_id: 'demo-2', type: t as any, assigned_to: 'x', status: 'merged' as any, code_path: null, updated_at: '',
    })),
  },
  {
    id: 'demo-3', name: 'AI Chat App', description: 'Multi-model chatbot with streaming and memory',
    owner_id: 'demo', status: 'error', created_at: '2026-04-06T15:00:00Z',
    modules: [
      { id: 'm11', project_id: 'demo-3', type: 'frontend', assigned_to: 'demo', status: 'standardized', code_path: null, updated_at: '' },
      { id: 'm12', project_id: 'demo-3', type: 'backend', assigned_to: 'u7', status: 'error', code_path: null, updated_at: '', profiles: { id: 'u7', username: 'Jordan', avatar_url: '' } } as any,
      { id: 'm13', project_id: 'demo-3', type: 'authentication', assigned_to: null, status: 'unassigned', code_path: null, updated_at: '' },
      { id: 'm14', project_id: 'demo-3', type: 'database', assigned_to: 'u8', status: 'standardized', code_path: null, updated_at: '', profiles: { id: 'u8', username: 'Riley', avatar_url: '' } } as any,
      { id: 'm15', project_id: 'demo-3', type: 'integrations', assigned_to: 'demo', status: 'in_progress', code_path: null, updated_at: '' },
    ],
  },
];
