'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardNavbar from '@/components/DashboardNavbar';
import { api, type Module } from '@/lib/api';
import { 
  Layers, CheckCircle2, Clock, UploadCloud, ArrowUpRight, 
  Search, GitMerge, FileCode2, Shield, Sparkles, Check, ChevronRight
} from 'lucide-react';

export default function ModulesPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unassigned' | 'in_progress' | 'standardized' | 'merged'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      // Load user projects to fetch their real modules
      const data = await api.projects.list();
      const userProjects = [...(data.owned || []), ...(data.participating || [])];
      
      const allMods: any[] = [];
      userProjects.forEach((p) => {
        (p.modules || []).forEach((m) => {
          allMods.push({
            ...m,
            projectName: p.name,
            projectId: p.id,
          });
        });
      });
      setModules(allMods);
    } catch (e) {
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = modules.filter((m) => {
    const matchesSearch = (m.type || '').toLowerCase().includes(search.toLowerCase()) || 
                          (m.projectName || '').toLowerCase().includes(search.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && m.status === filter;
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
              DISTRIBUTED ARCHITECTURE
            </div>
            <h1 className="page-title">Module Registry</h1>
            <p className="page-desc">
              Manage your decoupled modules, assign team members, and monitor code synchronization.
            </p>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="controls-bar">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by module type or project..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-group">
            {(['all', 'unassigned', 'in_progress', 'standardized', 'merged'] as const).map((tab) => (
              <button 
                key={tab} 
                onClick={() => setFilter(tab)}
                className={`filter-btn ${filter === tab ? 'active' : ''}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your module architecture...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Layers size={44} style={{ color: '#C9A45F', margin: '0 auto 12px' }} />
            <h3>No modules found</h3>
            <p>Create a project from the dashboard to automatically scaffold your 5-module pipeline.</p>
            <Link href="/dashboard/projects" className="primary-btn" style={{ display: 'inline-flex', marginTop: '16px', textDecoration: 'none' }}>
              Go to Projects →
            </Link>
          </div>
        ) : (
          <div className="modules-grid">
            {filtered.map((mod) => (
              <div key={mod.id} className="module-card">
                <div className="mod-top">
                  <span className={`mod-badge mod-${mod.type}`}>
                    {mod.type}
                  </span>
                  <span className={`status-pill status-${mod.status}`}>
                    {mod.status}
                  </span>
                </div>

                <h3 className="mod-name">{mod.projectName} / {mod.type}</h3>
                <p className="mod-desc">Assigned to: {mod.profiles?.username || (mod.assigned_to ? 'Team Member' : 'Unassigned')}</p>

                <div className="mod-footer">
                  <Link href={`/project/${mod.projectId}`} className="mod-link">
                    Open in Workspace <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx global>{`
        .modules-layout {
          min-height: 100vh;
          background: #FAFAF8;
          color: #111;
          font-family: 'Inter', sans-serif;
        }

        .modules-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 48px 80px;
        }

        .page-header {
          padding-bottom: 28px;
          border-bottom: 1px solid #EBE8E2;
          margin-bottom: 32px;
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
        }

        .page-title {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin: 0 0 8px;
        }

        .page-desc {
          color: #666;
          font-size: 0.9375rem;
          margin: 0;
        }

        .controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 32px;
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
          color: #999;
        }

        .search-input {
          width: 100%;
          padding: 10px 14px 10px 40px;
          border-radius: 10px;
          border: 1px solid #E2DED6;
          background: #fff;
          font-size: 0.875rem;
          outline: none;
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
          padding: 6px 14px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #666;
          border-radius: 8px;
          cursor: pointer;
        }

        .filter-btn.active {
          background: #fff;
          color: #111;
          box-shadow: 0 2px 4px rgba(0,0,0,0.06);
        }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .module-card {
          background: #fff;
          border: 1px solid #EBE8E2;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .mod-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .mod-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 6px;
          background: #F4F1EA;
          color: #776B5D;
        }

        .status-pill {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 12px;
          background: #eee;
        }

        .status-in_progress { background: rgba(201,164,95,0.15); color: #9A7736; }
        .status-merged { background: rgba(34,197,94,0.12); color: #16a34a; }
        .status-standardized { background: rgba(59,130,246,0.12); color: #2563eb; }

        .mod-name {
          font-size: 1.0625rem;
          font-weight: 700;
          margin: 0 0 6px;
        }

        .mod-desc {
          color: #666;
          font-size: 0.8125rem;
          margin: 0 0 20px;
        }

        .mod-footer {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid #F0EDE8;
        }

        .mod-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #111;
          font-size: 0.8125rem;
          font-weight: 600;
          text-decoration: none;
        }

        .mod-link:hover {
          color: #C9A45F;
        }

        .empty-state, .loading-state {
          text-align: center;
          padding: 80px 20px;
          color: #888;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(201,164,95,0.2);
          border-top-color: #C9A45F;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 12px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .primary-btn {
          background: #111;
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
