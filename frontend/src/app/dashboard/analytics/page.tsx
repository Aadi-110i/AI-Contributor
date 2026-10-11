'use client';

import { useState } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import { 
  Activity, TrendingUp, GitMerge, CheckCircle, Clock, Zap, 
  BarChart3, Cpu, AlertTriangle, ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');

  return (
    <div className="analytics-layout">
      <DashboardNavbar />

      <main className="analytics-main">
        {/* Header */}
        <header className="page-header">
          <div>
            <div className="section-tag">
              <span className="pulse-indicator"></span>
              SYSTEM TELEMETRY & PERFORMANCE
            </div>
            <h1 className="page-title">Workspace Analytics</h1>
            <p className="page-desc">
              Real-time compiler health, AST transformation velocity, API contract validation rates, and build statistics.
            </p>
          </div>

          <div className="timeframe-selector">
            {(['24h', '7d', '30d'] as const).map((t) => (
              <button 
                key={t}
                onClick={() => setTimeframe(t)}
                className={`time-btn ${timeframe === t ? 'active' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </header>

        {/* 4 KPI Big Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">Build Success Rate</span>
              <span className="kpi-trend positive">
                <ArrowUpRight size={14} /> +2.4%
              </span>
            </div>
            <div className="kpi-val">98.6%</div>
            <div className="kpi-sub">124 of 126 modular builds passed</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">Merge Velocity</span>
              <span className="kpi-trend positive">
                <ArrowUpRight size={14} /> -18% latency
              </span>
            </div>
            <div className="kpi-val">1.4s</div>
            <div className="kpi-sub">Average AI conflict resolution time</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">Total Code Standardized</span>
              <span className="kpi-trend positive">
                <ArrowUpRight size={14} /> +45k lines
              </span>
            </div>
            <div className="kpi-val">348k</div>
            <div className="kpi-sub">Normalized across 5 projects</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">Type & Contract Safety</span>
              <span className="kpi-trend positive">
                <ArrowUpRight size={14} /> 100%
              </span>
            </div>
            <div className="kpi-val">0</div>
            <div className="kpi-sub">Zero OpenAPI mismatches detected</div>
          </div>
        </div>

        {/* 2-Column Split: Build History & Chart Visualizer */}
        <div className="analytics-body-grid">
          {/* Main Visualizer Bar Chart Component */}
          <div className="chart-card">
            <div className="card-top-row">
              <div>
                <h3 className="card-title">Compilation & Merge Throughput</h3>
                <p className="card-sub">Daily module merges and autonomous code validations</p>
              </div>
              <div className="legend-pills">
                <span className="legend-item"><span className="dot gold"></span> Autonomous Merges</span>
                <span className="legend-item"><span className="dot dark"></span> Human Review</span>
              </div>
            </div>

            {/* Custom CSS Bar Graph */}
            <div className="bar-graph-container">
              {[
                { day: 'Mon', merges: 14, review: 3, height: '45%' },
                { day: 'Tue', merges: 22, review: 4, height: '65%' },
                { day: 'Wed', merges: 28, review: 6, height: '82%' },
                { day: 'Thu', merges: 18, review: 2, height: '55%' },
                { day: 'Fri', merges: 34, review: 5, height: '95%' },
                { day: 'Sat', merges: 12, review: 1, height: '35%' },
                { day: 'Sun', merges: 16, review: 2, height: '48%' },
              ].map((bar, i) => (
                <div key={i} className="bar-column">
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: bar.height }}>
                      <div className="bar-tooltip">
                        <span>{bar.merges} merges</span>
                        <small>{bar.review} reviews</small>
                      </div>
                    </div>
                  </div>
                  <span className="bar-label">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Module Health Breakdown */}
          <div className="health-card">
            <h3 className="card-title">Module Health Distribution</h3>
            <p className="card-sub">Real-time status breakdown across pipelines</p>

            <div className="health-bars">
              <div className="health-row">
                <div className="health-info">
                  <span>Standardized & Ready</span>
                  <strong>62%</strong>
                </div>
                <div className="h-track"><div className="h-fill ready" style={{ width: '62%' }}></div></div>
              </div>

              <div className="health-row">
                <div className="health-info">
                  <span>Merged into Production</span>
                  <strong>26%</strong>
                </div>
                <div className="h-track"><div className="h-fill merged" style={{ width: '26%' }}></div></div>
              </div>

              <div className="health-row">
                <div className="health-info">
                  <span>In Active Development</span>
                  <strong>9%</strong>
                </div>
                <div className="h-track"><div className="h-fill active" style={{ width: '9%' }}></div></div>
              </div>

              <div className="health-row">
                <div className="health-info">
                  <span>Validation Warning</span>
                  <strong>3%</strong>
                </div>
                <div className="h-track"><div className="h-fill warn" style={{ width: '3%' }}></div></div>
              </div>
            </div>

            <div className="system-ping-card">
              <div className="ping-left">
                <Zap size={16} className="ping-icon" />
                <div>
                  <div className="ping-title">All Edge Ingestion Nodes Healthy</div>
                  <div className="ping-desc">Next.js Turbopack runner responding within 12ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .analytics-layout {
          min-height: 100vh;
          background: #FAFAF8;
          color: #111;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
        }

        .analytics-main {
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

        .timeframe-selector {
          display: flex;
          background: #EFECE6;
          padding: 4px;
          border-radius: 10px;
          gap: 4px;
        }

        .time-btn {
          background: transparent;
          border: none;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }

        .time-btn.active {
          background: #FFFFFF;
          color: #111;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        /* KPI Grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin: 32px 0;
        }

        .kpi-card {
          background: #FFFFFF;
          border: 1px solid #EBE8E2;
          border-radius: 16px;
          padding: 22px 24px;
        }

        .kpi-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .kpi-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #777;
        }

        .kpi-trend {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 6px;
        }

        .kpi-trend.positive {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }

        .kpi-val {
          font-size: 2.25rem;
          font-weight: 800;
          color: #111;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 8px;
        }

        .kpi-sub {
          font-size: 0.75rem;
          color: #888;
        }

        /* Body Grid */
        .analytics-body-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .chart-card, .health-card {
          background: #FFFFFF;
          border: 1px solid #EBE8E2;
          border-radius: 16px;
          padding: 28px;
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .card-title {
          font-size: 1.1875rem;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: #111;
        }

        .card-sub {
          font-size: 0.8125rem;
          color: #777;
          margin: 0;
        }

        .legend-pills {
          display: flex;
          gap: 14px;
          font-size: 0.75rem;
          color: #666;
          font-weight: 500;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot.gold { background: #C9A45F; }
        .dot.dark { background: #111; }

        /* Custom Bar Graph */
        .bar-graph-container {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 240px;
          padding-top: 20px;
          border-bottom: 1px solid #EFECE6;
        }

        .bar-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          flex: 1;
          height: 100%;
        }

        .bar-track {
          width: 32px;
          height: 100%;
          display: flex;
          align-items: flex-end;
          background: #FAF8F5;
          border-radius: 6px;
          position: relative;
        }

        .bar-fill {
          width: 100%;
          background: linear-gradient(180deg, #D4B476, #9C7D40);
          border-radius: 6px;
          position: relative;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .bar-fill:hover {
          background: #111;
        }

        .bar-tooltip {
          display: none;
          position: absolute;
          bottom: 110%;
          left: 50%;
          transform: translateX(-50%);
          background: #111;
          color: #fff;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.6875rem;
          white-space: nowrap;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }

        .bar-fill:hover .bar-tooltip {
          display: flex;
        }

        .bar-label {
          font-size: 0.75rem;
          color: #888;
          font-weight: 600;
        }

        /* Health Bars */
        .health-bars {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin: 28px 0 32px;
        }

        .health-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.8125rem;
          color: #444;
          margin-bottom: 6px;
        }

        .h-track {
          width: 100%;
          height: 7px;
          background: #F0ECE4;
          border-radius: 4px;
          overflow: hidden;
        }

        .h-fill {
          height: 100%;
          border-radius: 4px;
        }

        .h-fill.ready { background: #C9A45F; }
        .h-fill.merged { background: #16a34a; }
        .h-fill.active { background: #3b82f6; }
        .h-fill.warn { background: #f59e0b; }

        .system-ping-card {
          background: #FAF9F6;
          border: 1px solid #EBE8E2;
          border-radius: 12px;
          padding: 14px 16px;
        }

        .ping-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ping-icon {
          color: #C9A45F;
        }

        .ping-title {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #111;
        }

        .ping-desc {
          font-size: 0.75rem;
          color: #777;
        }

        @media (max-width: 960px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .analytics-body-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 600px) {
          .kpi-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
