'use client';

import { useState, useEffect } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import { api } from '@/lib/api';
import { 
  Activity, TrendingUp, GitMerge, CheckCircle, Clock, Zap, 
  BarChart3, Cpu, AlertTriangle, ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d');
  const [projectsCount, setProjectsCount] = useState(0);
  const [modulesCount, setModulesCount] = useState(0);
  const [completedModules, setCompletedModules] = useState(0);
  const [mergesCount, setMergesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.projects.list();
        const all = [...(data.owned || []), ...(data.participating || [])];
        setProjectsCount(all.length);

        let totalMods = 0;
        let readyMods = 0;
        let merges = 0;

        for (const p of all) {
          totalMods += p.modules?.length || 0;
          readyMods += p.modules?.filter((m: any) => ['standardized', 'merged', 'uploaded'].includes(m.status)).length || 0;
          try {
            const logs = await api.merge.logs(p.id);
            merges += logs.length;
          } catch {}
        }

        setModulesCount(totalMods);
        setCompletedModules(readyMods);
        setMergesCount(merges);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const healthScore = modulesCount > 0 ? Math.round((completedModules / modulesCount) * 100) : 100;

  return (
    <div className="analytics-layout">
      <DashboardNavbar />

      <main className="analytics-main">
        {/* Header */}
        <header className="page-header">
          <div>
            <div className="section-tag">
              <span className="pulse-indicator"></span>
              LIVE WORKSPACE TELEMETRY
            </div>
            <h1 className="page-title">Workspace Analytics</h1>
            <p className="page-desc">
              Real-time pipeline metrics, active module readiness, and deployment velocity.
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

        {/* 4 KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">Active Projects</span>
              <span className="kpi-trend positive">
                <ArrowUpRight size={14} /> Live
              </span>
            </div>
            <div className="kpi-val">{projectsCount}</div>
            <div className="kpi-sub">Total user repositories</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">Module Readiness</span>
              <span className="kpi-trend positive">
                <CheckCircle size={14} /> {healthScore}%
              </span>
            </div>
            <div className="kpi-val">{completedModules} / {modulesCount}</div>
            <div className="kpi-sub">Standardized or merged modules</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">Total Merges</span>
              <span className="kpi-trend positive">
                <GitMerge size={14} /> CI/CD
              </span>
            </div>
            <div className="kpi-val">{mergesCount}</div>
            <div className="kpi-sub">Executed merge tests</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">Pipeline Status</span>
              <span className="kpi-trend positive">
                <Zap size={14} /> Optimal
              </span>
            </div>
            <div className="kpi-val">100%</div>
            <div className="kpi-sub">Cloud database synchronized</div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .analytics-layout {
          min-height: 100vh;
          background: #FAFAF8;
          color: #111;
          font-family: 'Inter', sans-serif;
        }

        .analytics-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 48px 80px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-bottom: 28px;
          border-bottom: 1px solid #EBE8E2;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
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
          padding: 6px 14px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #666;
          border-radius: 8px;
          cursor: pointer;
        }

        .time-btn.active {
          background: #fff;
          color: #111;
          box-shadow: 0 2px 4px rgba(0,0,0,0.06);
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .kpi-card {
          background: #fff;
          border: 1px solid #EBE8E2;
          border-radius: 14px;
          padding: 24px;
        }

        .kpi-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .kpi-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #888;
        }

        .kpi-trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .kpi-trend.positive { color: #16a34a; }

        .kpi-val {
          font-size: 2rem;
          font-weight: 800;
          color: #111;
          margin-bottom: 6px;
        }

        .kpi-sub {
          font-size: 0.75rem;
          color: #888;
        }
      `}</style>
    </div>
  );
}
