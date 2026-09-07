"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { NotificationBell } from "@/components/NotificationBell";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Globe2,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
  Sun,
  Moon,
  Home,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderKanban, label: "Projects", href: "#projects" },
  { icon: Users, label: "Collaborations", href: "#collab" },
  { icon: Globe2, label: "World", href: "#globe" },
  { icon: BarChart3, label: "Analytics", href: "#analytics" },
  { icon: Settings, label: "Settings", href: "#settings" },
];

interface SidebarProps {
  onExpandChange?: (expanded: boolean) => void;
}

export function Sidebar({ onExpandChange }: SidebarProps = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      {/* ── TOP NAVBAR ── */}
      <header className="topnav">
        <div className="topnav-inner">
          {/* Left: Brand */}
          <div className="topnav-left">
            <Link href="/dashboard" className="topnav-brand">
              <div className="topnav-logo-icon">
                <Zap size={16} />
              </div>
              <span className="topnav-logo-text">WiiBuild</span>
            </Link>

            {/* Nav links — desktop only */}
            <nav className="topnav-links">
              {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
                const active = href === "/dashboard" ? pathname === href : false;
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`topnav-link ${active ? 'topnav-link--active' : ''}`}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="topnav-right">
            <button
              className="topnav-icon-btn"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            <NotificationBell />

            {/* Profile */}
            <div className="topnav-profile">
              <div className="topnav-avatar">A</div>
              <div className="topnav-profile-info">
                <span className="topnav-profile-name">Aadarsh</span>
                <span className="topnav-profile-role">Developer</span>
              </div>
            </div>

            <button
              className="topnav-icon-btn topnav-logout"
              title="Logout"
              onClick={handleLogout}
            >
              <LogOut size={16} />
            </button>

            {/* Mobile hamburger */}
            <button
              className="topnav-hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="topnav-mobile-menu">
            {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
              const active = href === "/dashboard" ? pathname === href : false;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`topnav-mobile-link ${active ? 'topnav-link--active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <style>{`
        /* ═══════════════════════════════════════════
           TOP NAVBAR
           ═══════════════════════════════════════════ */
        .topnav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 200;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(12px);
          transition: background 0.35s ease;
        }

        .topnav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          padding: 0 28px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ── Left side ── */
        .topnav-left {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .topnav-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
        }

        .topnav-logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }

        .topnav-logo-text {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-white);
          letter-spacing: -0.02em;
        }

        /* ── Nav Links ── */
        .topnav-links {
          display: none;
          align-items: center;
          gap: 4px;
        }

        @media (min-width: 768px) {
          .topnav-links { display: flex; }
          .topnav-hamburger { display: none !important; }
        }

        .topnav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .topnav-link:hover {
          background: var(--surface-2);
          color: var(--text-white);
        }

        .topnav-link--active {
          background: var(--accent-muted);
          color: var(--accent);
          font-weight: 600;
        }

        .topnav-link--active:hover {
          background: var(--accent-muted);
          color: var(--accent);
        }

        /* ── Right side ── */
        .topnav-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .topnav-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .topnav-icon-btn:hover {
          background: var(--surface-2);
          border-color: var(--border-hover);
          color: var(--text-white);
        }

        .topnav-logout:hover {
          background: rgba(212, 106, 106, 0.08);
          border-color: rgba(212, 106, 106, 0.2);
          color: var(--error);
        }

        /* ── Profile ── */
        .topnav-profile {
          display: none;
          align-items: center;
          gap: 9px;
          padding: 4px 12px 4px 4px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s ease;
          margin-left: 4px;
        }

        @media (min-width: 768px) {
          .topnav-profile { display: flex; }
        }

        .topnav-profile:hover {
          background: var(--surface-2);
        }

        .topnav-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent-light));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }

        .topnav-profile-info {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .topnav-profile-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-white);
          line-height: 1.2;
        }

        .topnav-profile-role {
          font-size: 0.625rem;
          color: var(--text-muted);
          line-height: 1.2;
        }

        /* ── Mobile hamburger ── */
        .topnav-hamburger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .topnav-hamburger:hover {
          background: var(--surface-2);
        }

        /* ── Mobile menu ── */
        .topnav-mobile-menu {
          display: flex;
          flex-direction: column;
          padding: 8px 16px 16px;
          border-top: 1px solid var(--border);
          gap: 2px;
          animation: fadeDown 0.2s ease;
        }

        @media (min-width: 768px) {
          .topnav-mobile-menu { display: none; }
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .topnav-mobile-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .topnav-mobile-link:hover {
          background: var(--surface-2);
          color: var(--text-white);
        }
      `}</style>
    </>
  );
}
