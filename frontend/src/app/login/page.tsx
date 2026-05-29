'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Mail, Lock, User, ArrowRight, Layers, Users, Bot,
  GitMerge, Upload, CheckCircle, Shield, Zap,
} from 'lucide-react';
import { GlowCard } from '@/components/ui/spotlight-card';

const FEATURES = [
  {
    icon: <Layers size={20} />,
    title: 'Modular Architecture',
    desc: 'Five independent modules — frontend, backend, auth, database & integrations.',
    color: '#C9A96E',
  },
  {
    icon: <Users size={20} />,
    title: 'Team Collaboration',
    desc: 'Invite members via link. Each person claims and builds their own module.',
    color: '#3b82f6',
  },
  {
    icon: <Bot size={20} />,
    title: 'Any AI Tool',
    desc: 'Use Antigravity, ChatGPT, Claude, or any AI tool you prefer.',
    color: '#22c55e',
  },
  {
    icon: <GitMerge size={20} />,
    title: 'Smart Merging',
    desc: 'Auto-merge all modules with API wiring and bridge generation.',
    color: '#a855f7',
  },
  {
    icon: <Upload size={20} />,
    title: 'ZIP Upload',
    desc: 'Upload modules as ZIP. Standardization engine enforces clean structure.',
    color: '#f59e0b',
  },
  {
    icon: <CheckCircle size={20} />,
    title: 'Auto Testing',
    desc: 'Automated build checks catch errors and log results for every contributor.',
    color: '#06b6d4',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFeatureMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);

  // Check if Supabase is using placeholder config (not properly set up)
  const isSupabasePlaceholder =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // When Supabase isn't configured, use demo/local auth
      if (isSupabasePlaceholder) {
        // Validate fields
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter both email and password.');
        }
        if (isSignUp && !username.trim()) {
          throw new Error('Please enter a username.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }

        // Create a local demo session
        const localUser = {
          id: `local-${Date.now()}`,
          email: email.trim(),
          user_metadata: { username: isSignUp ? username.trim() : email.split('@')[0] },
        };
        localStorage.setItem('auth_token', `local-token-${Date.now()}`);
        localStorage.setItem('user', JSON.stringify(localUser));
        router.push('/dashboard');
        return;
      }

      // Real Supabase auth flow
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email, password,
          options: { data: { username } },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          localStorage.setItem('auth_token', data.session.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          router.push('/dashboard');
        } else {
          setError('Check your email for a confirmation link.');
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        localStorage.setItem('auth_token', data.session.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: string) => {
    const demoUser = {
      id: `demo-${role.toLowerCase()}`,
      email: `${role.toLowerCase()}@aicollab.dev`,
      user_metadata: { username: `Demo${role}` },
    };
    localStorage.setItem('auth_token', 'demo-token');
    localStorage.setItem('user', JSON.stringify(demoUser));
    router.push('/dashboard');
  };

  return (
    <div className="login-page">
      {/* ===== LEFT PANEL — Branding & Features ===== */}
      <div className="login-left">
        <div className="login-left-inner">
          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          <h1 className="login-brand-title">WiiBuild Platform</h1>
          <p className="login-brand-subtitle">Collaborative Development Platform</p>
          <p className="login-brand-tagline">
            Build projects together with AI — each member contributes a module using their favorite tool.
          </p>

          {/* Feature Grid */}
          <div className="login-features-grid">
            {FEATURES.map((f) => (
              <GlowCard
                key={f.title}
                customSize={true}
                glowColor="gold"
                borderWidth={2}
                style={{ borderRadius: '12px' }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 18px',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: f.color,
                    background: `${f.color}15`,
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="login-feature-title">{f.title}</h3>
                    <p className="login-feature-desc">{f.desc}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>

      {/* ===== RIGHT PANEL — Auth Form ===== */}
      <div className="login-right">
        <div className="login-right-inner">
          {/* Header */}
          <div className="login-form-header">
            <h2 className="login-form-title">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="login-form-subtitle">
              {isSignUp
                ? 'Set up your account to start building'
                : 'Sign in to your account to continue'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp && (
              <div className="login-field">
                <label className="login-label">Username</label>
                <div className="login-input-wrap">
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#52525b', pointerEvents: 'none' }} />
                  <input
                    id="login-username"
                    className="login-input"
                    placeholder="yourname"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="login-field">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrap">
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#52525b', pointerEvents: 'none' }} />
                <input
                  id="login-email"
                  className="login-input"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <div className="login-input-wrap">
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#52525b', pointerEvents: 'none' }} />
                <input
                  id="login-password"
                  className="login-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <p className="login-toggle-text">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              id="login-toggle"
              className="login-toggle-btn"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            >
              {isSignUp ? 'Sign In' : 'Register here'}
            </button>
          </p>

          {/* Divider */}
          <div className="login-divider">
            <span className="login-divider-line" />
            <span className="login-divider-line" />
          </div>

          {/* Quick Demo Login */}
          <div className="login-demo-section">
            <p className="login-demo-label">Quick Demo Login</p>
            <div className="login-demo-buttons">
              <button
                id="demo-admin"
                className="login-demo-btn"
                onClick={() => handleDemoLogin('Admin')}
              >
                <Shield size={14} />
                Admin
              </button>
              <button
                id="demo-lead"
                className="login-demo-btn"
                onClick={() => handleDemoLogin('Lead')}
              >
                <Users size={14} />
                Team Lead
              </button>
              <button
                id="demo-dev"
                className="login-demo-btn"
                onClick={() => handleDemoLogin('Developer')}
              >
                <Zap size={14} />
                Developer
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ===== PAGE LAYOUT ===== */
        .login-page {
          display: flex;
          min-height: 100vh;
          background: var(--bg);
        }

        /* ===== LEFT PANEL ===== */
        .login-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background: var(--bg-subtle);
          border-right: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          top: -40%;
          left: -20%;
          width: 80%;
          height: 80%;
          background: radial-gradient(circle, rgba(201, 169, 110, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-left::after {
          content: '';
          position: absolute;
          bottom: -30%;
          right: -10%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-left-inner {
          position: relative;
          z-index: 1;
          max-width: 520px;
          width: 100%;
        }

        /* Logo */
        .login-logo {
          margin-bottom: 24px;
          display: flex;
          justify-content: center;
        }

        .login-logo-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #C9A96E 0%, #B8973F 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 24px rgba(201, 169, 110, 0.25), 0 0 0 1px rgba(201, 169, 110, 0.3);
        }

        /* Brand text */
        .login-brand-title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-white);
          letter-spacing: -0.03em;
          margin-bottom: 4px;
        }

        .login-brand-subtitle {
          text-align: center;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--accent);
          letter-spacing: 0.02em;
          margin-bottom: 12px;
        }

        .login-brand-tagline {
          text-align: center;
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 36px;
          max-width: 380px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Feature Grid */
        .login-features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .login-feature-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .login-feature-title {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-white);
          margin-bottom: 3px;
        }

        .login-feature-desc {
          font-size: 0.6875rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* ===== RIGHT PANEL ===== */
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background: var(--bg);
          position: relative;
        }

        .login-right-inner {
          width: 100%;
          max-width: 380px;
        }

        /* Form Header */
        .login-form-header {
          margin-bottom: 28px;
        }

        .login-form-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-white);
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }

        .login-form-subtitle {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        /* Error */
        .login-error {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          color: #f87171;
          font-size: 0.8125rem;
          line-height: 1.5;
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .login-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .login-input-wrap {
          position: relative;
        }

        .login-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #52525b;
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 13px 16px 13px 42px;
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .login-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-muted);
        }

        .login-input::placeholder {
          color: var(--text-muted);
        }

        /* Submit Button */
        .login-submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          background: linear-gradient(135deg, #C9A96E 0%, #B8973F 100%);
          color: white;
          font-size: 0.9375rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
          letter-spacing: -0.01em;
          position: relative;
          overflow: hidden;
        }

        .login-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .login-submit-btn:hover::before {
          opacity: 1;
        }

        .login-submit-btn:hover {
          box-shadow: 0 8px 24px rgba(201, 169, 110, 0.3), 0 0 0 1px rgba(201, 169, 110, 0.4);
          transform: translateY(-1px);
        }

        .login-submit-btn:active {
          transform: translateY(0) scale(0.99);
        }

        .login-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Spinner */
        .login-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* Toggle */
        .login-toggle-text {
          text-align: center;
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin-top: 20px;
        }

        .login-toggle-btn {
          background: none;
          border: none;
          color: var(--text-white);
          cursor: pointer;
          font-weight: 700;
          font-size: 0.8125rem;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s;
        }

        .login-toggle-btn:hover {
          color: var(--accent);
        }

        /* Divider */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 0;
          margin: 28px 0 20px;
        }

        .login-divider-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* Demo Section */
        .login-demo-section {
          text-align: center;
        }

        .login-demo-label {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #52525b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 14px;
        }

        .login-demo-buttons {
          display: flex;
          gap: 10px;
        }

        .login-demo-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 11px 12px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .login-demo-btn:hover {
          background: var(--surface-2);
          border-color: var(--border-hover);
          color: var(--text-white);
          transform: translateY(-1px);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 900px) {
          .login-page {
            flex-direction: column;
          }

          .login-left {
            border-right: none;
            border-bottom: 1px solid var(--border);
            padding: 40px 24px 32px;
          }

          .login-left-inner {
            max-width: 460px;
          }

          .login-features-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .login-feature-card {
            padding: 12px;
          }

          .login-right {
            padding: 32px 24px 48px;
          }

          .login-right-inner {
            max-width: 400px;
          }
        }

        @media (max-width: 480px) {
          .login-demo-buttons {
            flex-direction: column;
          }

          .login-features-grid {
            display: none;
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
