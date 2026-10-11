'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, FolderOpen, Users2, Cpu, Layers, Activity, Rocket, Search, Bell, ChevronDown, LogOut, ArrowLeft } from 'lucide-react';

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <nav className="dash-nav">
      {/* Left: Back + Logo */}
      <div className="dash-nav-left">
        <Link href="/" className="nav-back-home" title="Back to Home">
          <ArrowLeft size={14} />
          <span>Home</span>
        </Link>
        <div className="dash-left-divider"></div>
        <Link href="/dashboard" className="dash-logo">
          WIIBUILD
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="dash-nav-center">
        <NavLink href="/dashboard" icon={<Home size={14} />} label="Home" active={pathname === '/dashboard'} />
        <NavLink href="/dashboard/projects" icon={<FolderOpen size={14} />} label="Projects" active={pathname === '/dashboard/projects'} />
        <NavLink href="/dashboard/collaborations" icon={<Users2 size={14} />} label="Collaborations" active={pathname === '/dashboard/collaborations'} />
        <NavLink href="/dashboard/ai-tools" icon={<Cpu size={14} />} label="AI Tools" active={pathname === '/dashboard/ai-tools'} />
        <NavLink href="/dashboard/modules" icon={<Layers size={14} />} label="Modules" active={pathname === '/dashboard/modules'} />
        <NavLink href="/dashboard/analytics" icon={<Activity size={14} />} label="Analytics" active={pathname === '/dashboard/analytics'} />
        <NavLink href="/dashboard/deployments" icon={<Rocket size={14} />} label="Deployments" active={pathname === '/dashboard/deployments'} />
      </div>

      {/* Right: Controls */}
      <div className="dash-nav-right">
        <button className="nav-icon-btn" aria-label="Search"><Search size={16} /></button>
        <div className="nav-divider"></div>
        <button className="nav-icon-btn" aria-label="Notifications"><Bell size={16} /></button>

        <div className="nav-user-profile">
          <div className="nav-avatar">A</div>
          <div className="nav-user-info">
            <span className="nav-user-name">Aadarsh</span>
            <span className="nav-user-role">Developer</span>
          </div>
          <ChevronDown size={14} className="nav-chevron" />
        </div>


        <button className="nav-icon-btn nav-logout" onClick={handleLogout} aria-label="Sign out" title="Sign out">
          <LogOut size={16} />
        </button>
      </div>

      <style jsx>{`
        .dash-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 72px;
          background: #0B0B0B;
          padding: 0 40px;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .dash-nav-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 220px;
        }

        .dash-left-divider {
          width: 1px;
          height: 18px;
          background: rgba(255,255,255,0.12);
          flex-shrink: 0;
        }

        .dash-logo {
          color: #fff;
          font-weight: 900;
          font-size: 1.125rem;
          text-decoration: none;
          letter-spacing: 0.02em;
        }

        .dash-nav-center {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dash-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 160px;
          justify-content: flex-end;
        }

        .nav-icon-btn {
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          padding: 4px;
          border-radius: 6px;
        }

        .nav-icon-btn:hover {
          color: #fff;
        }

        .nav-logout:hover {
          color: #ef4444;
        }

        .nav-divider {
          width: 1px;
          height: 20px;
          background: rgba(255,255,255,0.1);
        }

        .nav-user-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .nav-user-profile:hover {
          background: rgba(255,255,255,0.05);
        }

        .nav-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #FDF9F1;
          color: #C9A45F;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .nav-user-info {
          display: flex;
          flex-direction: column;
        }

        .nav-user-name {
          color: #fff;
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.2;
        }

        .nav-user-role {
          color: #888;
          font-size: 0.6875rem;
          font-weight: 500;
        }

        .nav-chevron {
          color: #555;
        }

        .nav-back-home {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: #888;
          font-size: 0.8125rem;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          transition: all 0.2s ease;
        }

        .nav-back-home:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.05);
        }
      `}</style>
    </nav>
  );
}

function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link href={href} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
      textDecoration: 'none',
      padding: '7px 11px',
      borderRadius: '8px',
      position: 'relative',
      transition: 'all 0.2s',
      color: active ? '#D0AD6D' : '#999',
      background: active ? 'rgba(201, 164, 95, 0.08)' : 'transparent',
      fontSize: '0.8125rem',
      fontWeight: 500,
    }}>
      {icon}
      {label}
      {active && (
        <span style={{
          position: 'absolute',
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: '#C9A45F',
        }} />
      )}
    </Link>
  );
}
