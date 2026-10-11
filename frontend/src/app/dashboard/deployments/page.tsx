'use client';

import { useState } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import { 
  Rocket, Globe, ExternalLink, Play, CheckCircle2, AlertCircle, 
  Terminal, Server, RefreshCw, GitBranch, ShieldCheck, Cpu, ArrowUpRight
} from 'lucide-react';

interface DeploymentItem {
  id: string;
  project: string;
  environment: 'Production' | 'Staging' | 'Preview';
  url: string;
  status: 'Ready' | 'Building' | 'Failed';
  commit: string;
  branch: string;
  deployedAt: string;
  duration: string;
}

const SAMPLE_DEPLOYMENTS: DeploymentItem[] = [
  {
    id: 'd-1092',
    project: 'NovaChat AI',
    environment: 'Production',
    url: 'https://novachat.wiibuild.app',
    status: 'Ready',
    commit: 'fdd97b5',
    branch: 'main',
    deployedAt: '14m ago',
    duration: '28s',
  },
  {
    id: 'd-1091',
    project: 'NovaChat AI',
    environment: 'Preview',
    url: 'https://preview-novachat-34.wiibuild.app',
    status: 'Ready',
    commit: 'a12e804',
    branch: 'feat/audio-orbit',
    deployedAt: '1h ago',
    duration: '22s',
  },
  {
    id: 'd-1090',
    project: 'PixelForge Studio',
    environment: 'Production',
    url: 'https://pixelforge.wiibuild.app',
    status: 'Ready',
    commit: 'c8812bf',
    branch: 'main',
    deployedAt: '4h ago',
    duration: '45s',
  },
  {
    id: 'd-1089',
    project: 'DocuMind Intelligence',
    environment: 'Staging',
    url: 'https://staging-documind.wiibuild.app',
    status: 'Ready',
    commit: '7b419fa',
    branch: 'staging',
    deployedAt: '1d ago',
    duration: '31s',
  },
  {
    id: 'd-1088',
    project: 'FlowOps Orchestrator',
    environment: 'Preview',
    url: 'https://flowops-test.wiibuild.app',
    status: 'Failed',
    commit: '09aef81',
    branch: 'fix/webhook-retry',
    deployedAt: '2d ago',
    duration: '14s',
  },
];

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<DeploymentItem[]>(SAMPLE_DEPLOYMENTS);
  const [deploying, setDeploying] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState<'All' | 'Production' | 'Staging' | 'Preview'>('All');

  const triggerDeploy = () => {
    setDeploying(true);
    setTimeout(() => {
      const newDeploy: DeploymentItem = {
        id: `d-${Date.now().toString().slice(-4)}`,
        project: 'NovaChat AI',
        environment: 'Production',
        url: 'https://novachat.wiibuild.app',
        status: 'Ready',
        commit: 'e992a10',
        branch: 'main',
        deployedAt: 'Just now',
        duration: '24s',
      };
      setDeployments([newDeploy, ...deployments]);
      setDeploying(false);
    }, 2000);
  };

  const filtered = deployments.filter(d => selectedEnv === 'All' || d.environment === selectedEnv);

  return (
    <div className="deploy-layout">
      <DashboardNavbar />

      <main className="deploy-main">
        {/* Header */}
        <header className="page-header">
          <div>
            <div className="section-tag">
              <span className="pulse-indicator"></span>
              EDGE GLOBAL CLUSTERS
            </div>
            <h1 className="page-title">Deployments & Hosting</h1>
            <p className="page-desc">
              Zero-config automated edge deployments with automated SSL, serverless function bindings, and instant rollbacks.
            </p>
          </div>

          <button 
            className="primary-btn" 
            onClick={triggerDeploy}
            disabled={deploying}
          >
            {deploying ? <RefreshCw size={15} className="spin-icon" /> : <Rocket size={15} />}
            <span>{deploying ? 'Deploying to Edge...' : 'Deploy Latest Build'}</span>
          </button>
        </header>

        {/* Global Edge Network Status Banner */}
        <div className="edge-banner">
          <div className="edge-left">
            <div className="edge-title-row">
              <Server size={18} className="gold-icon" />
              <h3>Global Edge Mesh: Online</h3>
            </div>
            <p className="edge-desc">
              Your applications are replicated across 42 regions worldwide with Anycast DNS routing and instant edge SSR caching.
            </p>
          </div>

          <div className="edge-stats">
            <div className="edge-stat-box">
              <span className="stat-label">Fastest Edge TTL</span>
              <span className="stat-value">18ms</span>
            </div>
            <div className="edge-stat-box">
              <span className="stat-label">SSL Encryption</span>
              <span className="stat-value">TLS 1.3 Active</span>
            </div>
            <div className="edge-stat-box">
              <span className="stat-label">Uptime</span>
              <span className="stat-value">100%</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="filter-row">
          <div className="env-pills">
            {(['All', 'Production', 'Staging', 'Preview'] as const).map((env) => (
              <button 
                key={env} 
                onClick={() => setSelectedEnv(env)}
                className={`env-pill ${selectedEnv === env ? 'active' : ''}`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* Deployment List */}
        <div className="deployments-list">
          {filtered.map((item) => (
            <div key={item.id} className="deploy-item">
              <div className="deploy-meta">
                <div className="deploy-title-line">
                  <h3 className="project-heading">{item.project}</h3>
                  <span className={`env-tag env-${item.environment.toLowerCase()}`}>
                    {item.environment}
                  </span>
                  <span className={`status-badge status-${item.status.toLowerCase()}`}>
                    {item.status === 'Ready' && <CheckCircle2 size={13} />}
                    {item.status === 'Failed' && <AlertCircle size={13} />}
                    {item.status}
                  </span>
                </div>

                <a href={item.url} target="_blank" rel="noreferrer" className="deploy-url">
                  <span>{item.url}</span>
                  <ExternalLink size={13} />
                </a>

                <div className="deploy-commit-details">
                  <div className="detail-item">
                    <GitBranch size={13} />
                    <span>{item.branch}</span>
                  </div>
                  <div className="detail-item commit-code">
                    <span>{item.commit}</span>
                  </div>
                  <span className="bullet-dot">•</span>
                  <span>{item.deployedAt}</span>
                  <span className="bullet-dot">•</span>
                  <span>Built in {item.duration}</span>
                </div>
              </div>

              <div className="deploy-actions">
                <a href={item.url} target="_blank" rel="noreferrer" className="visit-btn">
                  <span>Visit Domain</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style jsx global>{`
        .deploy-layout {
          min-height: 100vh;
          background: #FAFAF8;
          color: #111;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
        }

        .deploy-main {
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

        .primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #111;
          color: #fff;
          border: none;
          padding: 12px 22px;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .primary-btn:hover { background: #222; transform: translateY(-1px); }
        .primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Edge Banner */
        .edge-banner {
          margin: 32px 0;
          background: linear-gradient(135deg, #12110F, #1E1B17);
          border: 1px solid #363127;
          border-radius: 16px;
          padding: 24px 28px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }

        .edge-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .edge-title-row h3 {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0;
          color: #FAF8F5;
        }

        .gold-icon { color: #C9A45F; }

        .edge-desc {
          font-size: 0.8125rem;
          color: #A8A195;
          margin: 0;
          max-width: 580px;
          line-height: 1.5;
        }

        .edge-stats {
          display: flex;
          gap: 20px;
        }

        .edge-stat-box {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 10px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 0.6875rem;
          color: #8E887D;
          margin-bottom: 2px;
        }

        .stat-value {
          font-size: 0.875rem;
          font-weight: 700;
          color: #C9A45F;
        }

        /* Filter Row */
        .filter-row {
          margin-bottom: 20px;
        }

        .env-pills {
          display: flex;
          gap: 8px;
        }

        .env-pill {
          background: #EFECE6;
          border: none;
          padding: 7px 16px;
          border-radius: 20px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          transition: all 0.2s;
        }

        .env-pill.active {
          background: #111;
          color: #fff;
        }

        /* Deployments List */
        .deployments-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .deploy-item {
          background: #FFFFFF;
          border: 1px solid #EBE8E2;
          border-radius: 16px;
          padding: 22px 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          transition: all 0.2s;
        }

        .deploy-item:hover {
          border-color: #D6D0C4;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.04);
        }

        .deploy-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .deploy-title-line {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .project-heading {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111;
          margin: 0;
        }

        .env-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .env-production { background: rgba(201, 164, 95, 0.15); color: #A37F38; }
        .env-staging { background: rgba(59, 130, 246, 0.1); color: #2563eb; }
        .env-preview { background: #F2EFE9; color: #666; }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 20px;
        }

        .status-ready { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
        .status-failed { background: rgba(239, 68, 68, 0.1); color: #dc2626; }

        .deploy-url {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #555;
          text-decoration: none;
          font-size: 0.84375rem;
          font-family: monospace;
          transition: color 0.2s;
        }

        .deploy-url:hover { color: #C9A45F; }

        .deploy-commit-details {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: #888;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .commit-code {
          font-family: monospace;
          background: #F5F3EF;
          padding: 2px 6px;
          border-radius: 4px;
          color: #555;
        }

        .bullet-dot { color: #ccc; }

        .visit-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: #FAF8F5;
          border: 1px solid #E2DED6;
          border-radius: 10px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #111;
          text-decoration: none;
          transition: all 0.2s;
        }

        .visit-btn:hover {
          background: #111;
          color: #fff;
          border-color: #111;
        }

        .spin-icon {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .deploy-item { flex-direction: column; align-items: flex-start; }
          .visit-btn { width: 100%; justify-content: center; }
          .edge-stats { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}
