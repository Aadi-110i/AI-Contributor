'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardNavbar from '@/components/DashboardNavbar';
import { api } from '@/lib/api';
import { 
  Rocket, CheckCircle2, Clock, Terminal, GitBranch, ArrowUpRight
} from 'lucide-react';

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeployments();
  }, []);

  const loadDeployments = async () => {
    try {
      // Get real projects and their real merge logs
      const projData = await api.projects.list();
      const allProjects = [...(projData.owned || []), ...(projData.participating || [])];

      const allLogs: any[] = [];
      for (const p of allProjects) {
        try {
          const logs = await api.merge.logs(p.id);
          logs.forEach((log) => {
            allLogs.push({
              id: log.id,
              projectName: p.name,
              projectId: p.id,
              status: log.status,
              logOutput: log.log_output,
              createdAt: log.created_at,
            });
          });
        } catch {}
      }
      setDeployments(allLogs);
    } catch {
      setDeployments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deploy-layout">
      <DashboardNavbar />

      <main className="deploy-main">
        <header className="page-header">
          <div className="section-tag">
            <span className="pulse-indicator"></span>
            CI/CD PIPELINE & RELEASES
          </div>
          <h1 className="page-title">Deployments & Merge Logs</h1>
          <p className="page-desc">
            Monitor verified integration logs, automated AST build outputs, and module merges.
          </p>
        </header>

        {loading ? (
          <div className="state-box">
            <div className="spinner"></div>
            <p>Scanning build telemetry...</p>
          </div>
        ) : deployments.length === 0 ? (
          <div className="state-box">
            <Rocket size={44} style={{ color: '#C9A45F', margin: '0 auto 12px' }} />
            <h3>No deployments yet</h3>
            <p>Merge a project in your workspace to trigger automated testing and log deployment history.</p>
            <Link href="/dashboard/projects" className="primary-btn" style={{ display: 'inline-flex', marginTop: '16px', textDecoration: 'none' }}>
              View Projects →
            </Link>
          </div>
        ) : (
          <div className="deploy-list">
            {deployments.map((d) => (
              <div key={d.id} className="deploy-card">
                <div className="card-top">
                  <div>
                    <h3 className="proj-title">{d.projectName}</h3>
                    <div className="meta-row">
                      <span className={`status-tag ${d.status === 'success' ? 'status-ok' : 'status-err'}`}>
                        <CheckCircle2 size={12} /> {d.status}
                      </span>
                      <span className="time-str">
                        <Clock size={12} /> {new Date(d.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Link href={`/project/${d.projectId}`} className="primary-btn" style={{ textDecoration: 'none', fontSize: '0.8125rem' }}>
                    Open Workspace <ArrowUpRight size={13} />
                  </Link>
                </div>

                <pre className="log-snippet">
                  {d.logOutput}
                </pre>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx global>{`
        .deploy-layout {
          min-height: 100vh;
          background: #FAFAF8;
          color: #111;
          font-family: 'Inter', sans-serif;
        }

        .deploy-main {
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

        .deploy-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .deploy-card {
          background: #fff;
          border: 1px solid #EBE8E2;
          border-radius: 14px;
          padding: 24px;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 12px;
        }

        .proj-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0 0 6px;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.75rem;
          color: #888;
        }

        .status-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 12px;
        }

        .status-ok { background: rgba(34,197,94,0.12); color: #16a34a; }
        .status-err { background: rgba(239,68,68,0.12); color: #dc2626; }

        .time-str {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .log-snippet {
          background: #111;
          color: #A3E635;
          padding: 16px;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.75rem;
          overflow-x: auto;
          margin: 0;
          line-height: 1.5;
        }

        .state-box {
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
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #111;
          color: #fff;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
