'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardNavbar from '@/components/DashboardNavbar';
import { 
  Layers, Package, CheckCircle2, Clock, UploadCloud, ArrowUpRight, 
  Search, Filter, GitMerge, FileCode2, Shield, Sparkles, Check, ChevronRight
} from 'lucide-react';

interface ModuleItem {
  id: string;
  name: string;
  type: 'frontend' | 'backend' | 'authentication' | 'database' | 'integrations';
  project: string;
  projectId: string;
  assignedTo: string | null;
  status: 'standardized' | 'in_progress' | 'merged' | 'unassigned';
  filesCount: number;
  lastUpdated: string;
  size: string;
}

const SAMPLE_MODULES: ModuleItem[] = [
  {
    id: 'mod-1',
    name: 'Canvas Visualizer & Node Graph',
    type: 'frontend',
    project: 'NovaChat',
    projectId: 'demo-1',
    assignedTo: 'Marcus Vance',
    status: 'standardized',
    filesCount: 14,
    lastUpdated: '18m ago',
    size: '124 KB',
  },
  {
    id: 'mod-2',
    name: 'Streaming Gateway & Agent Websockets',
    type: 'backend',
    project: 'NovaChat',
    projectId: 'demo-1',
    assignedTo: 'Aadarsh',
    status: 'in_progress',
    filesCount: 8,
    lastUpdated: '45m ago',
    size: '88 KB',
  },
  {
    id: 'mod-3',
    name: 'JWT / OAuth2 & Session Encryption',
    type: 'authentication',
    project: 'NovaChat',
    projectId: 'demo-1',
    assignedTo: 'Elena Rostova',
    status: 'merged',
    filesCount: 6,
    lastUpdated: '2h ago',
    size: '42 KB',
  },
  {
    id: 'mod-4',
    name: 'PostgreSQL Relational Schema & Migrations',
    type: 'database',
    project: 'PixelForge Studio',
    projectId: 'demo-2',
    assignedTo: 'Devon Thorne',
    status: 'standardized',
    filesCount: 11,
    lastUpdated: '3h ago',
    size: '67 KB',
  },
  {
    id: 'mod-5',
    name: 'ComfyUI & Stable Diffusion Webhook Bus',
    type: 'integrations',
    project: 'PixelForge Studio',
    projectId: 'demo-2',
    assignedTo: null,
    status: 'unassigned',
    filesCount: 0,
    lastUpdated: '1d ago',
    size: '0 KB',
  },
  {
    id: 'mod-6',
    name: 'ChromaDB Vector Retrieval & Indexer',
    type: 'database',
    project: 'DocuMind Intelligence',
    projectId: 'demo-3',
    assignedTo: 'Alex Chen',
    status: 'merged',
    filesCount: 9,
    lastUpdated: '2d ago',
    size: '95 KB',
  },
];

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleItem[]>(SAMPLE_MODULES);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [assignedToast, setAssignedToast] = useState<string | null>(null);

  const handleSelfAssign = (moduleId: string, moduleName: string) => {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, assignedTo: 'Aadarsh (You)', status: 'in_progress' } : m));
    setAssignedToast(`Assigned ${moduleName} to yourself.`);
    setTimeout(() => setAssignedToast(null), 3000);
  };

  const filtered = modules.filter(m => {
    const matchType = filterType === 'all' || m.type === filterType;
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.project.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  return (
    <div className="modules-layout">
      <DashboardNavbar />

      <main className="modules-main">
        {/* Header */}
        <header className="page-header">
          <div>
            <div className="section-tag">
              <span className="pulse-indicator"></span>
              DECOUPLED CODE UNITS
            </div>
            <h1 className="page-title">Modular Architecture Registry</h1>
            <p className="page-desc">
              Every system is decomposed into five independent modules: Frontend, Backend, Authentication, Database, and Integrations.
            </p>
          </div>

          <div className="header-meta-stats">
            <div className="meta-box">
              <span className="meta-num">{modules.length}</span>
              <span className="meta-label">Total Modules</span>
            </div>
            <div className="meta-box">
              <span className="meta-num">{modules.filter(m => m.status === 'merged').length}</span>
              <span className="meta-label">Merged Units</span>
            </div>
          </div>
        </header>

        {/* Filters and Search Bar */}
        <div className="controls-bar">
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by module or parent project..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-dropdowns">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types (5)</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="authentication">Authentication</option>
              <option value="database">Database</option>
              <option value="integrations">Integrations</option>
            </select>

            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="unassigned">Unassigned</option>
              <option value="in_progress">In Progress</option>
              <option value="standardized">Standardized</option>
              <option value="merged">Merged</option>
            </select>
          </div>
        </div>

        {/* Toast */}
        {assignedToast && (
          <div className="toast-banner">
            <Check size={16} />
            <span>{assignedToast}</span>
          </div>
        )}

        {/* Modules Table / Cards List */}
        <div className="modules-list">
          {filtered.map((item) => (
            <div key={item.id} className="module-item-card">
              <div className="module-left">
                <div className={`module-type-icon type-${item.type}`}>
                  <Package size={18} />
                </div>
                <div className="module-info">
                  <div className="module-top-row">
                    <span className="module-type-badge">{item.type.toUpperCase()}</span>
                    <span className="project-link">
                      Part of <Link href={`/project/${item.projectId}`}>{item.project}</Link>
                    </span>
                  </div>
                  <h3 className="module-title">{item.name}</h3>
                  <div className="module-specs-row">
                    <span>{item.filesCount} source files</span>
                    <span className="bullet-dot">•</span>
                    <span>{item.size}</span>
                    <span className="bullet-dot">•</span>
                    <span>Updated {item.lastUpdated}</span>
                  </div>
                </div>
              </div>

              <div className="module-middle">
                <span className={`status-pill status-${item.status}`}>
                  {item.status === 'merged' && <CheckCircle2 size={13} />}
                  {item.status.replace('_', ' ')}
                </span>
                <span className="assignee-text">
                  {item.assignedTo ? `Lead: ${item.assignedTo}` : 'Unassigned'}
                </span>
              </div>

              <div className="module-actions">
                {item.status === 'unassigned' ? (
                  <button 
                    className="assign-btn" 
                    onClick={() => handleSelfAssign(item.id, item.name)}
                  >
                    Claim Module
                  </button>
                ) : (
                  <Link href={`/project/${item.projectId}`} className="inspect-btn">
                    <span>Inspect</span>
                    <ChevronRight size={15} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <style jsx global>{`
        .modules-layout {
          min-height: 100vh;
          background: #FAFAF8;
          color: #111;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
        }

        .modules-main {
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

        .header-meta-stats {
          display: flex;
          gap: 16px;
        }

        .meta-box {
          background: #FFFFFF;
          border: 1px solid #EBE8E2;
          padding: 12px 20px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .meta-num {
          font-size: 1.5rem;
          font-weight: 800;
          color: #111;
          line-height: 1.1;
        }

        .meta-label {
          font-size: 0.6875rem;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 32px 0 24px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-wrap {
          position: relative;
          flex: 1;
          max-width: 440px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }

        .search-input {
          width: 100%;
          padding: 10px 14px 10px 38px;
          border-radius: 10px;
          border: 1px solid #E2DED6;
          background: #FFFFFF;
          font-size: 0.875rem;
          outline: none;
          color: #111;
          box-sizing: border-box;
        }

        .search-input:focus { border-color: #C9A45F; }

        .filter-dropdowns {
          display: flex;
          gap: 10px;
        }

        .filter-select {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #E2DED6;
          background: #FFFFFF;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #444;
          outline: none;
          cursor: pointer;
        }

        .toast-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #111;
          color: #FAF8F5;
          padding: 12px 18px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-size: 0.84375rem;
          font-weight: 500;
        }

        .modules-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .module-item-card {
          background: #FFFFFF;
          border: 1px solid #EBE8E2;
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s ease;
          gap: 20px;
        }

        .module-item-card:hover {
          border-color: #D6D0C4;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.04);
        }

        .module-left {
          display: flex;
          align-items: center;
          gap: 18px;
          flex: 2;
        }

        .module-type-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .type-frontend { background: rgba(59, 130, 246, 0.1); color: #2563eb; }
        .type-backend { background: rgba(16, 185, 129, 0.1); color: #059669; }
        .type-authentication { background: rgba(245, 158, 11, 0.1); color: #d97706; }
        .type-database { background: rgba(139, 92, 246, 0.1); color: #7c3aed; }
        .type-integrations { background: rgba(201, 164, 95, 0.15); color: #A37F38; }

        .module-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .module-top-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .module-type-badge {
          font-size: 0.625rem;
          font-weight: 700;
          color: #888;
          letter-spacing: 0.08em;
        }

        .project-link {
          font-size: 0.75rem;
          color: #888;
        }

        .project-link a {
          color: #A37F38;
          text-decoration: none;
          font-weight: 600;
        }

        .module-title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: #111;
          margin: 0;
        }

        .module-specs-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: #777;
        }

        .bullet-dot { color: #ccc; }

        .module-middle {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          min-width: 140px;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-unassigned { background: #F3F1EC; color: #777; }
        .status-in_progress { background: rgba(234, 179, 8, 0.12); color: #b45309; }
        .status-standardized { background: rgba(59, 130, 246, 0.1); color: #1d4ed8; }
        .status-merged { background: rgba(34, 197, 94, 0.12); color: #15803d; }

        .assignee-text {
          font-size: 0.75rem;
          color: #888;
        }

        .module-actions {
          display: flex;
          align-items: center;
        }

        .assign-btn {
          background: #111;
          color: #fff;
          border: none;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .assign-btn:hover { background: #262626; }

        .inspect-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: 8px;
          border: 1px solid #E2DED6;
          color: #333;
          text-decoration: none;
          font-size: 0.8125rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .inspect-btn:hover {
          background: #FAF8F5;
          border-color: #C9A45F;
          color: #111;
        }

        @media (max-width: 820px) {
          .module-item-card { flex-direction: column; align-items: flex-start; }
          .module-actions { width: 100%; }
          .assign-btn, .inspect-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
