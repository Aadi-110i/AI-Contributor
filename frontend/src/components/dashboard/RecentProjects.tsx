'use client';

import Link from 'next/link';
import { type Project } from '@/lib/api';
import { Plus } from 'lucide-react';

const THUMB_GRADIENTS = [
  'linear-gradient(135deg, #0A0A09 0%, #2a2a2a 100%)',
  'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
  'linear-gradient(135deg, #eaeaea 0%, #d5d5d5 100%)',
  'linear-gradient(135deg, #f0f0f0 0%, #e5e5e5 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  'linear-gradient(135deg, #fdf6ec 0%, #f5e6d0 100%)',
];

const THUMB_TEXT_COLORS = ['#fff', '#666', '#555', '#666', '#C9A45F', '#C9A45F'];

export default function RecentProjects({ projects = [], onNewProject }: { projects?: Project[]; onNewProject?: () => void }) {
  const recent = projects.slice(0, 4);

  return (
    <div className="recent-projects-section">
      <div className="section-header">
        <h2>Recent Projects</h2>
        <Link href="/dashboard/projects" className="view-all">View All →</Link>
      </div>

      <div className="filter-tabs">
        <div className="tab active">All</div>
        <div className="tab">In Progress</div>
        <div className="tab">Deployed</div>
        <div className="tab">Starred</div>
      </div>

      <div className="projects-grid">
        {recent.map((project, idx) => {
          const gradient = THUMB_GRADIENTS[idx % THUMB_GRADIENTS.length];
          const textColor = THUMB_TEXT_COLORS[idx % THUMB_TEXT_COLORS.length];
          const statusColor = project.status === 'active' ? 'green' : project.status === 'merged' ? 'yellow' : 'blue';
          const statusLabel = project.status === 'active' ? 'Active' : project.status === 'merged' ? 'Deployed' : project.status === 'error' ? 'Error' : 'Planning';
          const assignedModules = project.modules?.filter(m => m.assigned_to) || [];
          const initials = ['A','B','C','D','E'].slice(0, Math.min(assignedModules.length || 1, 3));

          return (
            <Link key={project.id} href={`/project/${project.id}`} style={{ textDecoration: 'none' }}>
              <div className="proj-card">
                <div className="proj-thumb" style={{ background: gradient }}>
                  <div style={{ position: 'absolute', bottom: '12px', left: '16px', fontSize: '0.75rem', fontWeight: 700, color: textColor, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
                    {project.modules?.length || 5} modules
                  </div>
                  <div className="proj-more" style={{ color: textColor }}>⋮</div>
                </div>
                <div className="proj-body">
                  <h4>{project.name}</h4>
                  <p>{project.description || 'No description'}</p>
                  <div className="proj-footer">
                    <div className="proj-avatars">
                      {initials.map((letter, i) => (
                        <div key={i} className="p-avatar">{letter}</div>
                      ))}
                    </div>
                    <div className="proj-status">
                      <span className={`status-dot ${statusColor}`}></span>
                      {statusLabel}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {/* New Project Card */}
        {recent.length < 4 && (
          <div className="proj-card proj-card-new" onClick={onNewProject}>
            <div className="proj-thumb" style={{ background: '#F9F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EBE8E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={20} color="#888" />
              </div>
            </div>
            <div className="proj-body">
              <h4 style={{ color: '#888' }}>New Project</h4>
              <p>Start building something new</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .recent-projects-section {
          width: 100%;
          margin-top: 60px;
          padding-top: 40px;
          border-top: 1px solid #E7E5E1;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111;
          margin: 0;
        }

        .view-all {
          font-size: 0.8125rem;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          font-family: monospace;
          transition: color 0.2s;
          text-decoration: none;
        }
        .view-all:hover { color: #111; }

        .filter-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
        }

        .tab {
          font-size: 0.8125rem;
          font-weight: 500;
          color: #666;
          padding: 6px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab:hover { color: #111; }
        .tab.active {
          background: #FDF9F1;
          color: #111;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .proj-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #E7E5E1;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .proj-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.05);
        }
        .proj-card-new {
          cursor: pointer;
          border-style: dashed;
          border-color: #D5D0C8;
        }

        .proj-thumb {
          height: 120px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .proj-more {
          position: absolute;
          top: 12px;
          right: 12px;
          font-weight: bold;
          cursor: pointer;
          z-index: 10;
        }

        .proj-body {
          padding: 16px;
        }

        .proj-body h4 {
          margin: 0 0 4px 0;
          font-size: 0.9375rem;
          color: #111;
          font-weight: 700;
        }

        .proj-body p {
          margin: 0 0 20px 0;
          font-size: 0.75rem;
          color: #666;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .proj-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .proj-avatars {
          display: flex;
        }

        .p-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #333;
          color: #fff;
          font-size: 0.625rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
          margin-left: -8px;
        }
        .p-avatar:first-child { margin-left: 0; }

        .proj-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #444;
          font-weight: 500;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .status-dot.green { background: #22c55e; }
        .status-dot.yellow { background: #eab308; }
        .status-dot.blue { background: #3b82f6; }
        .status-dot.red { background: #ef4444; }

        @media (max-width: 1200px) {
          .projects-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .projects-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
