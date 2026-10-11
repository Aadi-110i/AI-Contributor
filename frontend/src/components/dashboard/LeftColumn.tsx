'use client';

import { Plus } from 'lucide-react';

export default function LeftColumn() {
  return (
    <div className="left-column">
      {/* Eyebrow */}
      <div className="eyebrow">
        <span>BUILD</span>
        <span className="dot"></span>
        <span>COLLABORATE</span>
        <span className="dot"></span>
        <span>SHIP</span>
      </div>

      {/* Greeting */}
      <div className="greeting-block">
        <h2 className="greeting-sub">Good evening,</h2>
        <h1 className="greeting-main">Aadarsh 👋</h1>
        <p className="greeting-desc">
          Turn your ideas into real products with the power of AI.
        </p>
      </div>

      {/* Action */}
      <button className="new-project-btn">
        <div className="btn-left">
          <Plus size={16} className="btn-icon" />
          <span>New Project</span>
        </div>
        <span className="btn-arrow">→</span>
      </button>

      {/* Stats List */}
      <div className="stats-list">
        <div className="stat-item">
          <span className="stat-val">12</span>
          <span className="stat-label">Projects</span>
          <span className="stat-arrow">→</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">8</span>
          <span className="stat-label">Collaborators</span>
          <span className="stat-arrow">→</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">28</span>
          <span className="stat-label">Modules</span>
          <span className="stat-arrow">→</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">5</span>
          <span className="stat-label">Deployments</span>
          <span className="stat-arrow">→</span>
        </div>
      </div>

      {/* Quote */}
      <div className="quote-block">
        <p className="quote-text">
          "Small ideas<br />
          build big tomorrows."
        </p>
        <div className="quote-line"></div>
      </div>

      <style jsx>{`
        .left-column {
          display: flex;
          flex-direction: column;
          padding-right: 40px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #666666;
          letter-spacing: 0.25em;
          margin-bottom: 24px;
        }

        .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #C9A45F;
        }

        .greeting-block {
          margin-bottom: 40px;
        }

        .greeting-sub {
          font-size: 1.5rem;
          font-weight: 500;
          color: #111;
          margin: 0 0 4px 0;
          letter-spacing: -0.02em;
        }

        .greeting-main {
          font-size: 3.5rem;
          font-weight: 800;
          color: #111;
          margin: 0 0 16px 0;
          letter-spacing: -0.04em;
          line-height: 1.1;
        }

        .greeting-desc {
          font-size: 1rem;
          color: #666;
          line-height: 1.5;
          max-width: 300px;
          margin: 0;
        }

        .new-project-btn {
          background: #0B0B0B;
          color: #fff;
          border: none;
          border-radius: 12px;
          width: 100%;
          max-width: 280px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 48px;
          transition: transform 0.2s, background 0.2s;
        }

        .new-project-btn:hover {
          background: #1a1a1a;
          transform: translateY(-2px);
        }

        .btn-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-icon {
          color: #C9A45F;
        }

        .btn-arrow {
          font-family: monospace;
          font-size: 1.1rem;
        }

        .stats-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 60px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          cursor: pointer;
          group: hover;
        }

        .stat-val {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111;
          width: 50px;
        }

        .stat-label {
          font-size: 1rem;
          font-weight: 500;
          color: #666;
          flex: 1;
          transition: color 0.2s;
        }

        .stat-arrow {
          color: #ccc;
          font-family: monospace;
          transition: color 0.2s, transform 0.2s;
        }

        .stat-item:hover .stat-label {
          color: #111;
        }

        .stat-item:hover .stat-arrow {
          color: #111;
          transform: translateX(4px);
        }

        .quote-block {
          margin-top: auto;
          padding-bottom: 40px;
        }

        .quote-text {
          font-family: 'Georgia', serif;
          font-style: italic;
          font-size: 1.125rem;
          color: #444;
          line-height: 1.4;
          margin: 0 0 16px 0;
        }

        .quote-line {
          width: 40px;
          height: 2px;
          background: #C9A45F;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
