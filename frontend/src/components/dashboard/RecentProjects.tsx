'use client';

import { type Project } from '@/lib/api';

export default function RecentProjects({ projects = [], onNewProject }: { projects?: Project[]; onNewProject?: () => void }) {
  return (
    <div className="recent-projects-section">
      <div className="section-header">
        <h2>Recent Projects</h2>
        <div className="view-all">View All →</div>
      </div>

      <div className="filter-tabs">
        <div className="tab active">All</div>
        <div className="tab">In Progress</div>
        <div className="tab">Deployed</div>
        <div className="tab">Starred</div>
      </div>

      <div className="projects-grid">
        {/* NovaChat */}
        <div className="proj-card">
          <div className="proj-thumb" style={{ background: 'linear-gradient(135deg, #0A0A09 0%, #2a2a2a 100%)' }}>
             {/* Abstract white circle representing a planet */}
             <div className="abstract-shape shape-1"></div>
             <div className="proj-more">⋮</div>
          </div>
          <div className="proj-body">
            <h4>NovaChat</h4>
            <p>AI-powered chat platform</p>
            <div className="proj-footer">
              <div className="proj-avatars">
                <div className="p-avatar">A</div>
                <div className="p-avatar">J</div>
                <div className="p-avatar">R</div>
                <div className="p-avatar p-more">+3</div>
              </div>
              <div className="proj-status">
                <span className="status-dot green"></span> Active
              </div>
            </div>
          </div>
        </div>

        {/* PixelForge */}
        <div className="proj-card">
          <div className="proj-thumb" style={{ background: '#f5f5f5' }}>
             {/* Abstract lines */}
             <div className="abstract-shape shape-2"></div>
             <div className="proj-more dark">⋮</div>
          </div>
          <div className="proj-body">
            <h4>PixelForge</h4>
            <p>AI image generation tool</p>
            <div className="proj-footer">
              <div className="proj-avatars">
                <div className="p-avatar">S</div>
                <div className="p-avatar">P</div>
                <div className="p-avatar p-more">+2</div>
              </div>
              <div className="proj-status">
                <span className="status-dot yellow"></span> In Progress
              </div>
            </div>
          </div>
        </div>

        {/* DocuMind */}
        <div className="proj-card">
          <div className="proj-thumb" style={{ background: '#eaeaea' }}>
             {/* Abstract spheres */}
             <div className="abstract-shape shape-3"></div>
             <div className="abstract-shape shape-4"></div>
             <div className="proj-more dark">⋮</div>
          </div>
          <div className="proj-body">
            <h4>DocuMind</h4>
            <p>Smart documentation</p>
            <div className="proj-footer">
              <div className="proj-avatars">
                <div className="p-avatar">M</div>
                <div className="p-avatar">D</div>
                <div className="p-avatar">L</div>
                <div className="p-avatar p-more">+4</div>
              </div>
              <div className="proj-status">
                <span className="status-dot green"></span> Active
              </div>
            </div>
          </div>
        </div>

        {/* FlowOps */}
        <div className="proj-card">
          <div className="proj-thumb" style={{ background: '#f0f0f0' }}>
             {/* Abstract waves */}
             <div className="abstract-shape shape-5"></div>
             <div className="proj-more dark">⋮</div>
          </div>
          <div className="proj-body">
            <h4>FlowOps</h4>
            <p>Automation workflows</p>
            <div className="proj-footer">
              <div className="proj-avatars">
                <div className="p-avatar">T</div>
                <div className="p-avatar">B</div>
                <div className="p-avatar p-more">+3</div>
              </div>
              <div className="proj-status">
                <span className="status-dot blue"></span> Planning
              </div>
            </div>
          </div>
        </div>
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
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          z-index: 10;
        }
        .proj-more.dark { color: #666; }

        .abstract-shape { position: absolute; pointer-events: none; }
        
        .shape-1 {
          width: 160px; height: 160px;
          background: #fff; border-radius: 50%;
          bottom: -80px; left: -40px; opacity: 0.9;
        }

        .shape-2 {
          width: 200%; height: 1px; background: #ccc;
          top: 40px; left: -20px; transform: rotate(-15deg);
          box-shadow: 0 10px 0 #d9d9d9, 0 20px 0 #e6e6e6;
        }

        .shape-3 {
          width: 60px; height: 60px; background: #666; border-radius: 50%;
          top: 20px; left: 40px; box-shadow: inset -10px -10px 20px rgba(0,0,0,0.5);
        }
        .shape-4 {
          width: 40px; height: 40px; background: #999; border-radius: 50%;
          bottom: 10px; right: 40px; box-shadow: inset -5px -5px 10px rgba(0,0,0,0.3);
        }

        .shape-5 {
          width: 120%; height: 60px; border-top: 1px solid #ccc;
          border-radius: 50%; top: 60px; left: -10%;
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
        .p-more { background: #f0f0f0; color: #888; }

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
