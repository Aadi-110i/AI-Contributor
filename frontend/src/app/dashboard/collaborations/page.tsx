'use client';

import { useState } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import { 
  Users2, UserPlus, Mail, Shield, Check, Copy, Link as LinkIcon, 
  Search, ExternalLink, Sparkles, MessageSquare, Terminal, Clock, Activity, CheckCircle2
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Architect' | 'Frontend Lead' | 'Backend Engineer' | 'AI Systems';
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  assignedModules: string[];
  activeProject: string;
  joinedAt: string;
}

interface ActivityEvent {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'usr-1',
    name: 'Aadarsh',
    email: 'aadarsh@wiibuild.ai',
    role: 'Architect',
    avatar: 'A',
    status: 'online',
    assignedModules: ['System Architecture', 'Core Integration Engine'],
    activeProject: 'NovaChat',
    joinedAt: 'Feb 2026',
  },
  {
    id: 'usr-2',
    name: 'Elena Rostova',
    email: 'elena@wiibuild.ai',
    role: 'AI Systems',
    avatar: 'E',
    status: 'online',
    assignedModules: ['Neural Cache', 'Context Stream'],
    activeProject: 'PixelForge Studio',
    joinedAt: 'Mar 2026',
  },
  {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'marcus.v@wiibuild.ai',
    role: 'Frontend Lead',
    avatar: 'M',
    status: 'busy',
    assignedModules: ['Interactive Canvas', 'Audio Visualizer'],
    activeProject: 'NovaChat',
    joinedAt: 'Mar 2026',
  },
  {
    id: 'usr-4',
    name: 'Devon Thorne',
    email: 'devon@wiibuild.ai',
    role: 'Backend Engineer',
    avatar: 'D',
    status: 'offline',
    assignedModules: ['Postgres Schema', 'Edge API Gateway'],
    activeProject: 'DocuMind Intelligence',
    joinedAt: 'Apr 2026',
  },
];

const RECENT_ACTIVITIES: ActivityEvent[] = [
  { id: 'act-1', user: 'Aadarsh', avatar: 'A', action: 'merged module', target: 'Frontend UI into NovaChat', time: '12m ago' },
  { id: 'act-2', user: 'Elena Rostova', avatar: 'E', action: 'calibrated model', target: 'FLUX.2 Schnell LoRA adapter', time: '34m ago' },
  { id: 'act-3', user: 'Marcus Vance', avatar: 'M', action: 'committed update', target: 'Canvas Orbit Physics Engine', time: '1h ago' },
  { id: 'act-4', user: 'Devon Thorne', avatar: 'D', action: 'standardized endpoints', target: 'Auth / OAuth2 Session tokens', time: '3h ago' },
];

export default function CollaborationsPage() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Architect' | 'Frontend Lead' | 'Backend Engineer' | 'AI Systems'>('Backend Engineer');
  const [invited, setInvited] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [search, setSearch] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: selectedRole,
      avatar: inviteEmail.charAt(0).toUpperCase(),
      status: 'offline',
      assignedModules: ['Pending Allocation'],
      activeProject: 'NovaChat',
      joinedAt: 'Just now',
    };

    setMembers([newMember, ...members]);
    setInviteEmail('');
    setInvited(true);
    setTimeout(() => setInvited(false), 3000);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/join-team-${Date.now()}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="collab-layout">
      <DashboardNavbar />

      <main className="collab-main">
        {/* Header */}
        <header className="page-header">
          <div>
            <div className="section-tag">
              <span className="pulse-indicator"></span>
              MULTI-AGENT & HUMAN WORKFORCE
            </div>
            <h1 className="page-title">Team & Collaborations</h1>
            <p className="page-desc">
              Synchronize engineers and autonomous agent roles across unified workspaces and real-time sockets.
            </p>
          </div>

          <button className="primary-btn" onClick={copyShareLink}>
            {copiedLink ? <Check size={16} /> : <LinkIcon size={16} />}
            <span>{copiedLink ? 'Copied Invite Link' : 'Copy Team Invite Link'}</span>
          </button>
        </header>

        {/* Top 3 Metric Cards */}
        <div className="metrics-row">
          <div className="metric-card">
            <span className="metric-title">Active Collaborators</span>
            <div className="metric-num-row">
              <span className="metric-value">{members.length}</span>
              <span className="metric-pill online">{members.filter(m => m.status === 'online').length} active now</span>
            </div>
            <p className="metric-sub">Distributed across 4 global node clusters</p>
          </div>

          <div className="metric-card">
            <span className="metric-title">Autonomous Agents</span>
            <div className="metric-num-row">
              <span className="metric-value">6</span>
              <span className="metric-pill ai">AI Copilots</span>
            </div>
            <p className="metric-sub">Auto-standardizing incoming pull requests</p>
          </div>

          <div className="metric-card">
            <span className="metric-title">Collaboration Sockets</span>
            <div className="metric-num-row">
              <span className="metric-value">99.98%</span>
              <span className="metric-pill ping">14ms latency</span>
            </div>
            <p className="metric-sub">Real-time state synchronization via WebSockets</p>
          </div>
        </div>

        {/* 2-Column Split: Invite Form + Members Directory, and Live Feed */}
        <div className="collab-content-grid">
          {/* Left Column: Invite + Members */}
          <div className="collab-main-col">
            {/* Quick Invite Form Card */}
            <div className="content-card invite-card">
              <div className="card-header-clean">
                <div className="icon-badge"><UserPlus size={16} /></div>
                <div>
                  <h3 className="card-headline">Invite a Collaborator</h3>
                  <p className="card-subline">They will receive immediate access to assigned modular pipelines.</p>
                </div>
              </div>

              <form onSubmit={handleInvite} className="invite-form">
                <div className="input-group">
                  <div className="input-with-icon">
                    <Mail size={15} className="field-icon" />
                    <input 
                      type="email" 
                      placeholder="colleague@domain.com" 
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required 
                      className="clean-input"
                    />
                  </div>

                  <select 
                    value={selectedRole} 
                    onChange={(e: any) => setSelectedRole(e.target.value)}
                    className="clean-select"
                  >
                    <option value="Frontend Lead">Frontend Lead</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="AI Systems">AI Systems</option>
                    <option value="Architect">Architect</option>
                  </select>

                  <button type="submit" className="submit-invite-btn">
                    <span>Send Invite</span>
                  </button>
                </div>

                {invited && (
                  <div className="success-toast">
                    <CheckCircle2 size={16} />
                    <span>Invite transmitted successfully! Direct token generated.</span>
                  </div>
                )}
              </form>
            </div>

            {/* Member Directory */}
            <div className="content-card">
              <div className="directory-header">
                <div>
                  <h3 className="card-headline">Active Members ({filteredMembers.length})</h3>
                  <p className="card-subline">View roles, module ownership, and real-time statuses.</p>
                </div>

                <div className="mini-search">
                  <Search size={14} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search people..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="members-list">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="member-row">
                    <div className="member-left">
                      <div className="avatar-wrapper">
                        <div className="member-avatar">{member.avatar}</div>
                        <span className={`status-dot ${member.status}`}></span>
                      </div>
                      <div className="member-info">
                        <span className="member-name">{member.name}</span>
                        <span className="member-email">{member.email}</span>
                      </div>
                    </div>

                    <div className="member-center">
                      <span className="role-tag">{member.role}</span>
                      <span className="project-tag">{member.activeProject}</span>
                    </div>

                    <div className="member-right">
                      <span className="joined-text">{member.joinedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Feed & Socket Health */}
          <div className="collab-side-col">
            <div className="content-card">
              <div className="card-header-clean">
                <div className="icon-badge gold"><Activity size={16} /></div>
                <div>
                  <h3 className="card-headline">Live Team Activity</h3>
                  <p className="card-subline">Real-time sync of code events.</p>
                </div>
              </div>

              <div className="activity-timeline">
                {RECENT_ACTIVITIES.map((act) => (
                  <div key={act.id} className="timeline-item">
                    <div className="timeline-avatar">{act.avatar}</div>
                    <div className="timeline-content">
                      <p className="timeline-text">
                        <strong>{act.user}</strong> {act.action} <span className="highlight">{act.target}</span>
                      </p>
                      <span className="timeline-time">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="content-card banner-card">
              <Sparkles size={20} className="gold-sparkle" />
              <h4 className="banner-title">Need Real-Time Pair Programming?</h4>
              <p className="banner-desc">
                Enable Monaco-based multiplayer sockets on any project module with full cursor broadcast.
              </p>
              <button className="gold-outline-btn">Configure Multi-Cursor</button>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .collab-layout {
          min-height: 100vh;
          background: #FAFAF8;
          color: #111;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
        }

        .collab-main {
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

        .primary-btn:hover {
          background: #222;
          transform: translateY(-1px);
        }

        /* Metrics Row */
        .metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 32px 0;
        }

        .metric-card {
          background: #FFFFFF;
          border: 1px solid #EBE8E2;
          border-radius: 16px;
          padding: 22px 24px;
        }

        .metric-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #888;
          display: block;
          margin-bottom: 10px;
        }

        .metric-num-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 800;
          color: #111;
          letter-spacing: -0.03em;
        }

        .metric-pill {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 20px;
        }

        .metric-pill.online { background: rgba(34, 197, 94, 0.12); color: #16a34a; }
        .metric-pill.ai { background: rgba(201, 164, 95, 0.15); color: #A37F38; }
        .metric-pill.ping { background: rgba(59, 130, 246, 0.1); color: #2563eb; }

        .metric-sub {
          font-size: 0.78125rem;
          color: #777;
          margin: 0;
        }

        /* 2-Column Grid */
        .collab-content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .collab-main-col, .collab-side-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .content-card {
          background: #FFFFFF;
          border: 1px solid #EBE8E2;
          border-radius: 16px;
          padding: 24px;
        }

        .card-header-clean {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .icon-badge {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #F3F1EC;
          color: #111;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-badge.gold {
          background: rgba(201, 164, 95, 0.12);
          color: #C9A45F;
        }

        .card-headline {
          font-size: 1.0625rem;
          font-weight: 700;
          margin: 0 0 3px 0;
          color: #111;
        }

        .card-subline {
          font-size: 0.8125rem;
          color: #777;
          margin: 0;
        }

        .invite-form .input-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .input-with-icon {
          position: relative;
          flex: 2;
          min-width: 220px;
        }

        .field-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .clean-input {
          width: 100%;
          padding: 11px 14px 11px 36px;
          border-radius: 10px;
          border: 1px solid #E2DED6;
          background: #FAF8F5;
          font-size: 0.875rem;
          box-sizing: border-box;
          outline: none;
        }

        .clean-input:focus {
          border-color: #C9A45F;
          background: #fff;
        }

        .clean-select {
          flex: 1;
          min-width: 140px;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1px solid #E2DED6;
          background: #FAF8F5;
          font-size: 0.875rem;
          font-weight: 500;
          outline: none;
          color: #333;
          cursor: pointer;
        }

        .submit-invite-btn {
          background: #111;
          color: #fff;
          border: none;
          padding: 11px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-invite-btn:hover { background: #222; }

        .success-toast {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          font-size: 0.8125rem;
          font-weight: 500;
        }

        /* Directory Table */
        .directory-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .mini-search {
          position: relative;
          width: 200px;
        }

        .mini-search .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .mini-search input {
          width: 100%;
          padding: 7px 10px 7px 30px;
          border-radius: 8px;
          border: 1px solid #E2DED6;
          font-size: 0.78125rem;
          outline: none;
          background: #FAF9F6;
          box-sizing: border-box;
        }

        .members-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .member-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-radius: 12px;
          background: #FAF9F7;
          border: 1px solid #EFECE6;
          transition: all 0.2s;
        }

        .member-row:hover {
          background: #F5F3EF;
          border-color: #E2DDD4;
        }

        .member-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 240px;
        }

        .avatar-wrapper {
          position: relative;
        }

        .member-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #111;
          color: #F7E7CE;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          position: absolute;
          bottom: 0;
          right: 0;
          border: 2px solid #FAF9F7;
        }

        .status-dot.online { background: #22c55e; }
        .status-dot.busy { background: #eab308; }
        .status-dot.offline { background: #9ca3af; }

        .member-info {
          display: flex;
          flex-direction: column;
        }

        .member-name {
          font-weight: 700;
          font-size: 0.875rem;
          color: #111;
        }

        .member-email {
          font-size: 0.75rem;
          color: #777;
        }

        .member-center {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .role-tag {
          font-size: 0.75rem;
          font-weight: 600;
          color: #555;
          background: #EAE6DF;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .project-tag {
          font-size: 0.75rem;
          color: #A37F38;
          background: rgba(201, 164, 95, 0.12);
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
        }

        .member-right {
          font-size: 0.75rem;
          color: #999;
        }

        /* Activity Timeline */
        .activity-timeline {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .timeline-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .timeline-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #EAE6DF;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .timeline-content {
          flex: 1;
        }

        .timeline-text {
          font-size: 0.8125rem;
          color: #444;
          margin: 0 0 3px 0;
          line-height: 1.4;
        }

        .timeline-text strong {
          color: #111;
        }

        .timeline-text .highlight {
          color: #A37F38;
          font-weight: 600;
        }

        .timeline-time {
          font-size: 0.6875rem;
          color: #999;
        }

        .banner-card {
          background: linear-gradient(135deg, #161513, #24211D);
          color: #FAF8F5;
          border: 1px solid #38332A;
        }

        .gold-sparkle {
          color: #C9A45F;
          margin-bottom: 12px;
        }

        .banner-title {
          font-size: 1.0625rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #fff;
        }

        .banner-desc {
          font-size: 0.8125rem;
          color: #BBB4AA;
          line-height: 1.5;
          margin: 0 0 16px 0;
        }

        .gold-outline-btn {
          background: transparent;
          color: #C9A45F;
          border: 1px solid rgba(201, 164, 95, 0.4);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .gold-outline-btn:hover {
          background: rgba(201, 164, 95, 0.12);
          border-color: #C9A45F;
        }

        @media (max-width: 900px) {
          .collab-content-grid { grid-template-columns: 1fr; }
          .metrics-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
