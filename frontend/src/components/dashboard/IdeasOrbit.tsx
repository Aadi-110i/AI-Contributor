'use client';

import { Lightbulb, FileText, Users, Rocket, BarChart3, ArrowDown } from 'lucide-react';

export default function IdeasOrbit({ onNewProject }: { onNewProject?: () => void }) {
  return (
    <div className="orbit-container">
      {/* 5 Orbit Action Nodes */}
      
      {/* Top: Build */}
      <div className="orbit-node node-top" onClick={onNewProject} style={{ cursor: 'pointer' }}>
        <div className="node-btn">
          <Lightbulb size={20} strokeWidth={1.5} />
        </div>
        <div className="node-text">
          <span className="node-title">Build</span>
          <span className="node-sub">Create with AI</span>
        </div>
      </div>

      {/* Upper Left: Plan */}
      <div className="orbit-node node-ul">
        <div className="node-text text-right">
          <span className="node-title">Plan</span>
          <span className="node-sub">Turn ideas into tasks</span>
        </div>
        <div className="node-btn">
          <FileText size={20} strokeWidth={1.5} />
        </div>
      </div>

      {/* Upper Right: Collaborate */}
      <div className="orbit-node node-ur">
        <div className="node-btn">
          <Users size={20} strokeWidth={1.5} />
        </div>
        <div className="node-text">
          <span className="node-title">Collaborate</span>
          <span className="node-sub">Work with your team</span>
        </div>
      </div>

      {/* Lower Left: Deploy */}
      <div className="orbit-node node-ll">
        <div className="node-text text-right">
          <span className="node-title">Deploy</span>
          <span className="node-sub">Ship to the world</span>
        </div>
        <div className="node-btn">
          <Rocket size={20} strokeWidth={1.5} />
        </div>
      </div>

      {/* Lower Right: Analyze */}
      <div className="orbit-node node-lr">
        <div className="node-btn">
          <BarChart3 size={20} strokeWidth={1.5} />
        </div>
        <div className="node-text">
          <span className="node-title">Analyze</span>
          <span className="node-sub">Track what matters</span>
        </div>
      </div>

      {/* Background Rings */}
      <div className="orbit-ring ring-1"></div>
      <div className="orbit-ring ring-2"></div>
      <div className="orbit-ring ring-3"></div>
      
      {/* Small Particles (Gold dots on rings) */}
      <div className="particle p1"></div>
      <div className="particle p2"></div>
      <div className="particle p3"></div>
      <div className="particle p4"></div>
      <div className="particle p5"></div>

      {/* Central Planet */}
      <div className="central-planet">
        <div className="planet-core">
          <h1 className="planet-title">WIIBUILD</h1>
          <p className="planet-subtitle">YOUR IDEAS<br/>ORBIT HERE</p>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="explore-bottom">
        <span>EXPLORE YOUR UNIVERSE</span>
        <ArrowDown size={14} className="explore-arrow" />
      </div>

      <style jsx>{`
        .orbit-container {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Central Planet ── */
        .central-planet {
          position: relative;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          background: #0A0A09;
          box-shadow: 0 0 40px rgba(201, 164, 95, 0.4), inset 0 0 40px rgba(0,0,0,1);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .planet-core {
          text-align: center;
        }

        .planet-title {
          color: #fff;
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          margin: 0 0 8px 0;
        }

        .planet-subtitle {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.5rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          line-height: 1.6;
          margin: 0;
        }

        /* ── Orbital Rings ── */
        .orbit-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.06);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .ring-1 { width: 380px; height: 380px; }
        .ring-2 { width: 520px; height: 520px; border-color: rgba(201, 164, 95, 0.15); }
        .ring-3 { width: 680px; height: 680px; }

        /* ── Particles ── */
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #C9A45F;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          z-index: 5;
        }
        .p1 { transform: translate(-50%, -50%) rotate(45deg) translateY(-190px); }
        .p2 { transform: translate(-50%, -50%) rotate(-120deg) translateY(-260px); }
        .p3 { transform: translate(-50%, -50%) rotate(15deg) translateY(-340px); }
        .p4 { transform: translate(-50%, -50%) rotate(-30deg) translateY(-190px); }
        .p5 { transform: translate(-50%, -50%) rotate(160deg) translateY(-260px); }

        /* ── Nodes ── */
        .orbit-node {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 20;
          cursor: pointer;
        }
        
        .node-top { top: 5%; left: 50%; transform: translateX(-50%); flex-direction: column; text-align: center; }
        .node-ul { top: 30%; left: 15%; }
        .node-ur { top: 30%; right: 15%; }
        .node-ll { bottom: 25%; left: 20%; }
        .node-lr { bottom: 25%; right: 20%; }

        .node-btn {
          width: 56px;
          height: 56px;
          background: #FAFAF8;
          border: 1px solid rgba(201, 164, 95, 0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .orbit-node:hover .node-btn {
          box-shadow: 0 0 20px rgba(201, 164, 95, 0.3);
          border-color: #C9A45F;
          transform: scale(1.05);
        }

        .node-text {
          display: flex;
          flex-direction: column;
        }
        
        .node-top .node-text { align-items: center; }
        .text-right { text-align: right; }

        .node-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #111;
        }

        .node-sub {
          font-size: 0.75rem;
          color: #666;
          margin-top: 2px;
        }

        /* ── Bottom Text ── */
        .explore-bottom {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.25em;
        }
        .explore-arrow {
          color: #C9A45F;
        }
      `}</style>
    </div>
  );
}
