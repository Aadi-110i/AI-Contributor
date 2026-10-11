'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardNavbar from '@/components/DashboardNavbar';
import { api, type Project } from '@/lib/api';
import { 
  FolderOpen, Plus, Search, Filter, ArrowUpRight, GitBranch, 
  Clock, CheckCircle2, AlertCircle, Layers, Users, Sparkles, X, Check, Copy, Link as LinkIcon
} from 'lucide-react';

const DEMO_PROJECTS: Project[] = [
  {
    id: 'demo-1',
    name: 'NovaChat',
    description: 'AI-powered real-time collaborative workspace with streaming agent copilot.',
    owner_id: 'demo',
    status: 'active',
    created_at: '2026-04-10T12:00:00Z',
    modules: ['frontend', 'backend', 'authentication', 'database', 'integrations'].map((t, i) => ({
      id: `m${i}`, project_id: 'demo-1', type: t as any, assigned_to: i < 3 ? 'Aadarsh' : null, 
      status: i === 0 ? 'standardized' : i === 1 ? 'in_progress' : 'unassigned' as any, code_path: null, updated_at: '',
    })),
  },
  {
    id: 'demo-2',
    name: 'PixelForge Studio',
    description: 'Generative image studio pipeline using ComfyUI microservices and Canvas UI.',
    owner_id: 'demo',
    status: 'active',
    created_at: '2026-04-08T09:00:00Z',
    modules: ['frontend', 'backend', 'authentication', 'database', 'integrations'].map((t, i) => ({
      id: `m${i + 5}`, project_id: 'demo-2', type: t as any, assigned_to: 'Aadarsh', 
      status: 'standardized' as any, code_path: null, updated_at: '',
    })),
  },
  {
    id: 'demo-3',
    name: 'DocuMind Intelligence',
    description: 'Automated retrieval-augmented semantic document parsing with vector caching.',
    owner_id: 'demo',
    status: 'active',
    created_at: '2026-04-06T15:00:00Z',
    modules: ['frontend', 'backend'].map((t, i) => ({
      id: `m${i + 10}`, project_id: 'demo-3', type: t as any, assigned_to: 'Alex', 
      status: 'merged' as any, code_path: null, updated_at: '',
    })),
  },
  {
    id: 'demo-4',
    name: 'FlowOps Orchestrator',
    description: 'Fault-tolerant distributed webhook orchestrator & event bus.',
    owner_id: 'demo',
    status: 'error',
    created_at: '2026-04-01T10:00:00Z',
    modules: ['frontend', 'backend'].map((t, i) => ({
      id: `m${i + 12}`, project_id: 'demo-4', type: t as any, assigned_to: null, 
      status: 'unassigned' as any, code_path: null, updated_at: '',
    })),
  },
  {
    id: 'demo-5',
    name: 'Synthetix Audio API',
    description: 'High-throughput low latency neural speech generation streaming bridge.',
    owner_id: 'demo',
    status: 'active',
    created_at: '2026-03-28T18:30:00Z',
    modules: ['backend', 'integrations'].map((t, i) => ({
      id: `m${i + 15}`, project_id: 'demo-5', type: t as any, assigned_to: 'Sarah K.', 
      status: 'standardized' as any, code_path: null, updated_at: '',
    })),
  },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'merged' | 'error'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [createdProject, setCreatedProject] = useState<Project | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [idCopied, setIdCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.projects.list();
      const combined = [...(data.owned || []), ...(data.participating || [])];
      setProjects(combined.length ? combined : DEMO_PROJECTS);
    } catch {
      setProjects(DEMO_PROJECTS);
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
        id: `demo-${Date.now()}`,
        name,
        description: desc || 'Architected module pipeline',
        owner_id: 'demo',
        status: 'active',
        created_at: new Date().toISOString(),
        modules: ['frontend', 'backend', 'authentication', 'database', 'integrations'].map((t, i) => ({
          id: `m-${Date.now()}-${i}`,
          project_id: '',
          type: t as any,
          assigned_to: null,
          status: 'unassigned' as any,
          code_path: null,
          updated_at: '',
        })),
      };
      setProjects((prev) => [demo, ...prev]);
      setCreatedProject(demo);
    } finally {
      setCreating(false);
    }
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

  const copyToClipboard = (text: string, type: 'id' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') { setIdCopied(true); setTimeout(() => setIdCopied(false), 2000); }
    else { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.description || '').toLowerCase().includes(search.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && p.status === filter;
  });

  return (
    <div className="projects-layout">
      <DashboardNavbar />

      <main className="projects-main">
        {/* Header section with refined typography and gold warm accenting */}
        <header className="page-header">
          <div className="header-meta">
            <span className="section-tag">
              <span className="pulse-indicator"></span>
              REPOSITORIES & WORKSPACES
            </span>
            <h1 className="page-title">Project Directory</h1>
            <p className="page-desc">
              Manage your high-velocity engineering projects, modular AI pipelines, and collaborative codebases.
            </p>
          </div>

          <div className="header-actions">
            <button className="primary-btn" onClick={() => setShowCreate(true)}>
              <Plus size={16} />
              <span>Create Project</span>
            </button>
          </div>
        </header>

        {/* Filters and Search Bar */}
        <section className="controls-bar">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by project name, description or module..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="clear-btn" onClick={() => setSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="filters-group">
            {(['all', 'active', 'merged', 'error'] as const).map((tab) => (
              <button 
                key={tab} 
                onClick={() => setFilter(tab)}
                className={`filter-btn ${filter === tab ? 'active' : ''}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Project Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Scanning project registries...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <FolderOpen size={48} className="empty-icon" />
            <h3>No projects found</h3>
            <p>Try adjusting your query or create a fresh workspace.</p>
            <button className="secondary-btn" onClick={() => setShowCreate(true)}>
              <Plus size={14} /> New Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => {
              const totalMods = project.modules?.length || 5;
              const completedMods = project.modules?.filter(m => 
                ['standardized', 'merged', 'uploaded'].includes(m.status)
              ).length || 0;
              const progressPct = Math.round((completedMods / totalMods) * 100);

              return (
                <div key={project.id} className="project-card">
                  <div className="card-top">
                    <div className="project-badges">
                      <span className={`status-pill status-${project.status || 'active'}`}>
                        {project.status === 'active' ? (
                          <>
                            <span className="dot active"></span> Active
                          </>
                        ) : project.status === 'merged' ? (
                          <>
                            <CheckCircle2 size={12} /> Merged
                          </>
                        ) : (
                          <>
                            <AlertCircle size={12} /> Error
                          </>
                        )}
                      </span>
                      <span className="tech-badge">Next.js 14 + Node</span>
                    </div>

                    <Link href={`/project/${project.id}`} className="open-link" title="Open Workspace">
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>

                  <div className="card-body">
                    <h3 className="project-name">
                      <Link href={`/project/${project.id}`}>{project.name}</Link>
                    </h3>
                    <p className="project-desc">{project.description || 'No description provided.'}</p>
                  </div>

                  {/* Modules Progress Bar */}
                  <div className="card-progress">
                    <div className="progress-label">
                      <span>Module Pipeline ({completedMods}/{totalMods})</span>
                      <span className="progress-percent">{progressPct}%</span>
                    </div>
                    <div className="progress-track">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer">
                    <div className="footer-stat">
                      <Layers size={13} />
                      <span>{totalMods} modules</span>
                    </div>
                    <div className="footer-stat">
                      <Users size={13} />
                      <span>3 devs</span>
                    </div>
                    <div className="footer-stat date">
                      <Clock size={13} />
                      <span>{new Date(project.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Creation Modal */}
      {showCreate && (
        <div className="modal-backdrop" onClick={() => setShowCreate(false)}>
          {!createdProject ? (
            <form className="modal-box" onClick={(e) => e.stopPropagation()} onSubmit={handleCreate}>
              <button type="button" className="modal-close" onClick={() => setShowCreate(false)}>
                <X size={18} />
              </button>
              <div className="modal-tag">ARCHITECTURE SETUP</div>
              <h3 className="modal-title">Create Collaborative Project</h3>
              <p className="modal-desc">
                Bootstraps a multi-module architecture equipped with automated validation and standardized AI pipelines.
              </p>
              
              <div className="modal-field">
                <label className="modal-label">Project Name</label>
                <input 
                  className="modal-input" 
                  placeholder="e.g. Omnisearch AI" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  autoFocus 
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">Scope & Purpose <span className="modal-optional">(optional)</span></label>
                <textarea 
                  className="modal-input modal-textarea" 
                  placeholder="What will this system do?" 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)} 
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreate(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-create" disabled={creating}>
                  {creating ? 'Architecting...' : 'Initialize Project'}
                </button>
              </div>
            </form>
          ) : (
            <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
              <div className="success-icon"><Check size={26} /></div>
              <h3 className="modal-title" style={{ marginTop: '16px' }}>Project Ready!</h3>
              <p className="modal-desc">Workspace created with 5 scaffolded modules ready for your team.</p>

              <div className="info-box">
                <label className="info-label">Project Identifier</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <code className="info-code">{createdProject.id}</code>
                  <button onClick={() => copyToClipboard(createdProject.id, 'id')} className="copy-btn" title="Copy ID">
                    {idCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {inviteLink ? (
                <div className="info-box invite">
                  <label className="info-label invite-label">Collaborator Link</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <code className="info-code">{inviteLink}</code>
                    <button onClick={() => copyToClipboard(inviteLink, 'link')} className="copy-btn">
                      {linkCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              ) : (
                <button className="btn-create" style={{ width: '100%', marginBottom: '12px' }} onClick={handleGenerateInvite}>
                  <LinkIcon size={14} style={{ marginRight: '8px' }} /> Generate Collaboration Invite
                </button>
              )}

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => { setShowCreate(false); setCreatedProject(null); }}>
                  Close
                </button>
                <button className="btn-create" onClick={() => router.push(`/project/${createdProject.id}`)}>
                  Open Workspace →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .projects-layout {
          min-height: 100vh;
          background: #FAFAF8;
          color: #111;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
        }

        .projects-main {
          flex: 1;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 48px 80px;
          box-sizing: border-box;
        }

        .page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-bottom: 32px;
          border-bottom: 1px solid #EBE8E2;
          gap: 24px;
          flex-wrap: wrap;
        }

        .section-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #8C827A;
          letter-spacing: 0.15em;
          margin-bottom: 10px;
        }

        .pulse-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C9A45F;
          box-shadow: 0 0 10px rgba(201, 164, 95, 0.6);
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #111;
          margin: 0 0 8px 0;
          line-height: 1.1;
        }

        .page-desc {
          font-size: 0.9375rem;
          color: #666;
          margin: 0;
          max-width: 600px;
          line-height: 1.5;
        }

        .primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #111;
          color: #fff;
          border: none;
          padding: 12px 22px;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(0,0,0,0.08);
        }

        .primary-btn:hover {
          background: #222;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        }

        .controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 32px 0 28px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 280px;
          max-width: 480px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .search-input {
          width: 100%;
          padding: 11px 36px 11px 40px;
          border-radius: 10px;
          border: 1px solid #E2DED6;
          background: #FFFFFF;
          font-size: 0.875rem;
          outline: none;
          color: #111;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .search-input:focus {
          border-color: #C9A45F;
          box-shadow: 0 0 0 3px rgba(201, 164, 95, 0.15);
        }

        .clear-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
        }

        .filters-group {
          display: flex;
          background: #EFECE6;
          padding: 4px;
          border-radius: 10px;
          gap: 4px;
        }

        .filter-btn {
          background: transparent;
          border: none;
          padding: 7px 16px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #666;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn.active {
          background: #FFFFFF;
          color: #111;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }

        .project-card {
          background: #FFFFFF;
          border: 1px solid #EBE8E2;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: all 0.25s ease;
          position: relative;
        }

        .project-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.06);
          border-color: #DCD6CA;
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .project-badges {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .status-active {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }

        .dot.active {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
        }

        .status-merged {
          background: rgba(201, 164, 95, 0.12);
          color: #A37F38;
        }

        .status-error {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .tech-badge {
          font-size: 0.6875rem;
          color: #888;
          background: #F5F3EF;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 500;
        }

        .open-link {
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #F8F7F4;
          text-decoration: none;
          transition: all 0.2s;
        }

        .open-link:hover {
          color: #111;
          background: #ECE9E2;
          transform: scale(1.05);
        }

        .card-body {
          margin-bottom: 20px;
          flex: 1;
        }

        .project-name {
          font-size: 1.1875rem;
          font-weight: 700;
          margin: 0 0 8px;
          line-height: 1.3;
        }

        .project-name a {
          color: #111;
          text-decoration: none;
        }

        .project-name a:hover {
          color: #C9A45F;
        }

        .project-desc {
          font-size: 0.84375rem;
          color: #666;
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-progress {
          margin-bottom: 20px;
          padding: 12px 14px;
          background: #FBF9F6;
          border-radius: 10px;
          border: 1px solid #F0ECE4;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 600;
          color: #666;
          margin-bottom: 8px;
        }

        .progress-percent {
          color: #C9A45F;
          font-weight: 700;
        }

        .progress-track {
          width: 100%;
          height: 6px;
          background: #EAE6DF;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #D4B476, #9C7D40);
          border-radius: 4px;
          transition: width 0.4s ease;
        }

        .card-footer {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 14px;
          border-top: 1px solid #F2EFE9;
          font-size: 0.75rem;
          color: #888;
        }

        .footer-stat {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .footer-stat.date {
          margin-left: auto;
        }

        /* Empty & Loading */
        .loading-state, .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #888;
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(201, 164, 95, 0.2);
          border-top-color: #C9A45F;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-icon {
          color: #C9A45F;
          opacity: 0.6;
          margin-bottom: 12px;
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 300;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .modal-box {
          background: #FFFFFF;
          border: 1px solid #E7E5E1;
          border-radius: 20px;
          padding: 32px;
          max-width: 480px;
          width: 100%;
          position: relative;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.15);
        }

        .modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
        }

        .modal-close:hover { color: #111; }

        .modal-tag {
          font-size: 0.625rem;
          font-weight: 700;
          color: #C9A45F;
          letter-spacing: 0.12em;
          margin-bottom: 8px;
        }

        .modal-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #111;
          margin: 0 0 6px 0;
          letter-spacing: -0.02em;
        }

        .modal-desc {
          color: #666;
          font-size: 0.84375rem;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .modal-field { margin-bottom: 16px; }

        .modal-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .modal-optional {
          font-weight: 400;
          text-transform: none;
          color: #aaa;
        }

        .modal-input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 14px;
          border: 1px solid #E2DED6;
          border-radius: 10px;
          font-size: 0.875rem;
          font-family: inherit;
          color: #111;
          outline: none;
          background: #FAF8F5;
        }

        .modal-input:focus {
          border-color: #C9A45F;
          background: #fff;
        }

        .modal-textarea {
          resize: vertical;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 24px;
        }

        .btn-cancel {
          flex: 1;
          padding: 11px;
          border: 1px solid #E2DED6;
          background: transparent;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #666;
          cursor: pointer;
        }

        .btn-cancel:hover { background: #F5F3EF; }

        .btn-create {
          flex: 1;
          padding: 11px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-create:hover { background: #000; }
        .btn-create:disabled { opacity: 0.5; cursor: not-allowed; }

        .success-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.12);
          color: #16a34a;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .info-box {
          background: #FAF9F6;
          border: 1px solid #EAE6DF;
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 14px;
          text-align: left;
        }

        .info-box.invite {
          border-color: rgba(201, 164, 95, 0.3);
          background: rgba(201, 164, 95, 0.05);
        }

        .info-label {
          font-size: 0.625rem;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 6px;
        }

        .invite-label { color: #A37F38; }

        .info-code {
          flex: 1;
          font-size: 0.78125rem;
          color: #333;
          word-break: break-all;
          font-family: monospace;
        }

        .copy-btn {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px;
        }

        .copy-btn:hover { color: #C9A45F; }

        @media (max-width: 768px) {
          .projects-main { padding: 24px 20px; }
          .page-title { font-size: 2rem; }
          .projects-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
