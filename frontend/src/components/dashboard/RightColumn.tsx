'use client';

import { Sparkles, Sun, Plus, MoreHorizontal, CheckCircle2, Circle } from 'lucide-react';

export default function RightColumn() {
  return (
    <div className="right-column">
      {/* ── AI Co-Pilot ── */}
      <div className="dash-card copilot-card">
        <div className="card-header">
          <div className="copilot-title">
            <div className="ai-icon">
              <Sparkles size={14} className="sparkle" />
            </div>
            <div>
              <h3 className="card-h3">AI Co-Pilot</h3>
              <div className="status-indicator">
                <span className="status-dot"></span> Online
              </div>
            </div>
          </div>
          <button className="icon-btn"><MoreHorizontal size={16} /></button>
        </div>
        
        <p className="card-desc">
          Ask, build, debug, or get suggestions — right here.
        </p>

        <div className="ai-input-wrapper">
          <input type="text" placeholder="What do you want to build today?" className="ai-input" />
          <button className="ai-submit">→</button>
        </div>

        <div className="ai-suggestions">
          <span className="ai-pill">Generate a landing page</span>
          <span className="ai-pill">Fix an error in my code</span>
          <span className="ai-pill">Create a new module</span>
        </div>
      </div>

      {/* ── Today's Focus ── */}
      <div className="dash-card">
        <div className="card-header">
          <div className="card-title-group">
            <Sun size={16} color="#C9A45F" />
            <h3 className="card-h3">Today's Focus</h3>
          </div>
          <button className="icon-btn-bordered"><Plus size={14} /></button>
        </div>

        <div className="todo-list">
          <div className="todo-item completed">
            <CheckCircle2 size={18} className="todo-icon" />
            <span>Finish auth module</span>
          </div>
          <div className="todo-item">
            <Circle size={18} className="todo-icon" />
            <span>Review PR from Priya</span>
          </div>
          <div className="todo-item">
            <Circle size={18} className="todo-icon" />
            <span>Deploy staging build</span>
          </div>
          <div className="todo-item">
            <Circle size={18} className="todo-icon" />
            <span>Plan next sprint</span>
          </div>
        </div>
      </div>

      {/* ── Team Online ── */}
      <div className="dash-card compact-card">
        <div className="card-header" style={{ marginBottom: 0 }}>
          <div className="card-title-group">
            <UsersIcon size={16} color="#111" />
            <h3 className="card-h3">Team Online</h3>
          </div>
          <span className="arrow-right">→</span>
        </div>
        <div className="team-avatars">
          <div className="t-avatar">P</div>
          <div className="t-avatar">R</div>
          <div className="t-avatar">S</div>
          <div className="t-avatar">K</div>
          <div className="t-avatar t-more">+3</div>
        </div>
      </div>

      {/* ── Brand Card ── */}
      <div className="dash-card brand-card">
        <div className="brand-icon">
          <Plus size={14} color="#fff" />
        </div>
        <div className="brand-text">
          <p>Ideas don't wait.<br/>Neither should you.</p>
        </div>
        <div className="brand-arcs">
          <div className="arc arc1"></div>
          <div className="arc arc2"></div>
        </div>
      </div>

      <style jsx>{`
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-left: 20px;
        }

        .dash-card {
          background: #fff;
          border: 1px solid #E7E5E1;
          border-radius: 16px;
          padding: 24px;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .card-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-h3 {
          margin: 0;
          font-size: 0.9375rem;
          font-weight: 700;
          color: #111;
        }

        .icon-btn {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
        }

        .icon-btn-bordered {
          background: transparent;
          border: 1px solid #E7E5E1;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111;
          cursor: pointer;
        }

        /* ── Copilot ── */
        .copilot-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .ai-icon {
          width: 36px;
          height: 36px;
          background: #0B0B0B;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(201, 164, 95, 0.3);
        }
        
        .sparkle { color: #C9A45F; }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.6875rem;
          color: #666;
          margin-top: 2px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
        }

        .card-desc {
          font-size: 0.8125rem;
          color: #666;
          margin: 0 0 16px 0;
          line-height: 1.4;
        }

        .ai-input-wrapper {
          display: flex;
          align-items: center;
          background: #F5F5F5;
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 16px;
        }

        .ai-input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 8px 12px;
          font-size: 0.8125rem;
          font-family: inherit;
          color: #111;
          outline: none;
        }

        .ai-submit {
          width: 32px;
          height: 32px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .ai-suggestions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ai-pill {
          font-size: 0.75rem;
          color: #666;
          background: #F9F9F9;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #E7E5E1;
          cursor: pointer;
          transition: background 0.2s;
        }
        .ai-pill:hover { background: #F0F0F0; }

        /* ── ToDo ── */
        .todo-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .todo-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.875rem;
          color: #111;
        }

        .todo-icon { color: #ccc; }
        .completed .todo-icon { color: #C9A45F; }
        .completed span { color: #666; text-decoration: line-through; }

        /* ── Team ── */
        .compact-card {
          padding: 20px 24px;
        }

        .arrow-right {
          color: #888;
          font-family: monospace;
          font-size: 1rem;
        }

        .team-avatars {
          display: flex;
          margin-top: 16px;
        }

        .t-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #F5F5F5;
          border: 2px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #444;
          margin-left: -8px;
        }
        .t-avatar:first-child { margin-left: 0; }
        .t-more { background: #f0f0f0; color: #888; }

        /* ── Brand Card ── */
        .brand-card {
          background: #FDFBF7; /* warm cream */
          border: 1px solid #F0EBE1;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 140px;
        }

        .brand-icon {
          width: 24px;
          height: 24px;
          background: #D0AD6D;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: auto;
        }

        .brand-text p {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 600;
          color: #111;
          line-height: 1.5;
        }

        .brand-arcs {
          position: absolute;
          bottom: -20px;
          right: -20px;
          width: 100px;
          height: 100px;
          pointer-events: none;
        }
        .arc {
          position: absolute;
          bottom: 0;
          right: 0;
          border: 1px solid rgba(201, 164, 95, 0.2);
          border-radius: 50%;
        }
        .arc1 { width: 80px; height: 80px; }
        .arc2 { width: 140px; height: 140px; border-width: 0.5px; }
      `}</style>
    </div>
  );
}

function UsersIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke={props.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}
