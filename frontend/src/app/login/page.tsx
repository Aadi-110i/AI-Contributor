'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check if Supabase is using placeholder config
  const isSupabasePlaceholder =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSupabasePlaceholder) {
        if (!email.trim() || !password.trim()) throw new Error('Enter both email and password.');
        if (isSignUp && !username.trim()) throw new Error('Enter a username.');
        if (password.length < 6) throw new Error('Password must be 6+ characters.');

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

  return (
    <div className="auth-root">

      {/* Background White Glow */}
      <div className="auth-glow"></div>

      {/* Side Typography Decorations */}
      <div className="auth-side-decor top-left">
        <div className="vertical-line"></div>
        <span className="decor-num">01</span>
        <div className="horizontal-line-gold"></div>
        <div className="decor-text-block">
          SMART<br />PEOPLE<br />BUILD<br />TOGETHER
        </div>
      </div>

      <div className="auth-side-decor bottom-left">
        <div className="horizontal-line-gold-thick"></div>
        <div className="decor-text-block inline">
          A NEW WAY<br />TO BUILD SOFTWARE
        </div>
      </div>

      <div className="auth-side-decor top-right">
        <div className="decor-text-block inline align-right">
          TURN<br />IDEAS<br />INTO<br />REALITY
        </div>
        <div className="horizontal-line-gray"></div>
      </div>

      <div className="auth-side-decor bottom-right">
        <div className="vertical-line"></div>
        <span className="decor-num">02</span>
        <div className="horizontal-line-gold"></div>
        <div className="decor-text-block inline align-right">
          FASTER<br />IDEAS<br />BRIGHTER<br />FUTURE
        </div>
      </div>

      {/* Main Content Area */}
      <main className="auth-main">

        {/* Header (Inside Glow) */}
        <header className="auth-header">
          <span className="auth-subtitle">BUILD • COLLABORATE • SHIP</span>
          <h1 className="auth-title">WIIBUILD</h1>
          <span className="auth-subtitle">IDEAS MEET EXECUTION</span>
        </header>

        {/* Auth Card */}
        <div className="auth-card">

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${!isSignUp ? 'active' : ''}`}
              onClick={() => { setIsSignUp(false); setError(''); }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${isSignUp ? 'active' : ''}`}
              onClick={() => { setIsSignUp(true); setError(''); }}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="auth-form"
            >
              {error && <div className="auth-error">{error}</div>}

              {isSignUp && (
                <div className="input-group">
                  <label>Username</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={16} />
                    <input
                      type="text"
                      placeholder="you"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="input-group">
                <label>Email address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={16} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {!isSignUp && (
                <div className="auth-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>
              )}

              <button type="submit" className="auth-primary-btn" disabled={loading}>
                {loading ? <span className="loader" /> : (
                  <>
                    {isSignUp ? 'Sign Up' : 'Sign In'} <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="auth-divider">
                <span>OR CONTINUE WITH</span>
              </div>

              <div className="social-logins">
                <button type="button" className="social-btn" onClick={() => alert('Social login not configured')}>
                  {/* Simple GitHub SVG */}
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  GitHub
                </button>
                <button type="button" className="social-btn" onClick={() => alert('Social login not configured')}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>
                  Google
                </button>
                <button type="button" className="social-btn" onClick={() => alert('Social login not configured')}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  Microsoft
                </button>
              </div>

              <div className="auth-footer-link">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
                  {isSignUp ? 'Sign In' : 'Create one'}
                </button>
              </div>
            </motion.form>
          </AnimatePresence>
        </div>

        <div className="auth-bottom-signature">
          <div className="connector-line-bottom-end"></div>
          <span>POWERED BY A BRIGHTER TOMORROW</span>
        </div>

      </main>

      <style jsx>{`
        .auth-root {
          height: 100vh;
          width: 100vw;
          background: #0B0B0B;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          color: white;
          font-family: 'Inter', sans-serif;
          align-items: center;
        }

        /* The Massive White Glow */
        .auth-glow {
          position: absolute;
          top: -45vw;
          left: 50%;
          transform: translateX(-50%);
          width: 85vw;
          height: 65vw;
          background: #ffffff;
          border-radius: 50%;
          z-index: 1;
          pointer-events: none;
          box-shadow: 0 0 60px rgba(209, 176, 111, 0.35), 0 0 120px rgba(209, 176, 111, 0.15);
        }

        @media (max-width: 768px) {
          .auth-glow {
            width: 150vw;
            height: 45vh;
            top: -15vh;
          }
        }

        /* Edge Decorations */
        .auth-side-decor {
          position: absolute;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .top-left { top: 12vh; left: 5vw; }
        .bottom-left { bottom: 10vh; left: 5vw; }
        .top-right { top: 12vh; right: 5vw; align-items: flex-end; }
        .bottom-right { bottom: 10vh; right: 5vw; align-items: flex-end; }

        .vertical-line {
          width: 1px;
          height: 60px;
          background: rgba(255,255,255,0.2);
        }
        .horizontal-line-gold {
          height: 1px;
          width: 20px;
          background: #D1B06F;
        }
        .horizontal-line-gold-thick {
          height: 2px;
          width: 32px;
          background: #D1B06F;
        }
        .horizontal-line-gray {
          height: 1px;
          width: 20px;
          background: rgba(255,255,255,0.2);
        }
        .decor-num {
          font-size: 0.875rem;
          color: #fff;
          font-weight: 400;
          letter-spacing: 0.1em;
        }
        .decor-text-block {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.25em;
          line-height: 1.8;
          text-transform: uppercase;
          margin-top: 8px;
        }
        .decor-text-block.inline {
          line-height: 1.5;
        }
        .decor-text-block.align-right {
          text-align: right;
        }

        @media (max-width: 1024px) {
          .auth-side-decor { display: none; }
        }

        /* Main Content Layer */
        .auth-main {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: 100%;
          justify-content: center;
          padding-top: 3vh;
        }

        .auth-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .auth-subtitle {
          font-size: 0.65rem;
          font-weight: 600;
          color: rgba(0,0,0,0.5);
          letter-spacing: 0.5em;
          transform: scaleX(1.1);
        }

        .auth-title {
          font-size: clamp(3.5rem, 9vw, 5.5rem);
          font-weight: 900;
          color: #000;
          letter-spacing: 0.02em;
          transform: scaleX(1.1);
          line-height: 1;
          margin: 0;
        }

        /* Card */
        .auth-card {
          width: 100%;
          max-width: 420px;
          background: rgba(18, 18, 18, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 24px 32px 32px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        }

        .auth-tabs {
          display: flex;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          margin-bottom: 32px;
        }

        .auth-tab {
          flex: 1;
          background: transparent;
          border: none;
          padding: 12px 0;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          position: relative;
          transition: color 0.3s ease;
        }

        .auth-tab.active {
          color: #fff;
        }

        .auth-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 1px;
          background: #D1B06F;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
          font-weight: 500;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: rgba(255,255,255,0.4);
        }

        .input-wrapper input {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 12px 14px 12px 40px;
          font-size: 0.875rem;
          color: white;
          outline: none;
          transition: all 0.2s ease;
        }

        .input-wrapper input:focus {
          border-color: rgba(209, 176, 111, 0.5);
          background: rgba(0,0,0,0.5);
        }

        .input-wrapper input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .auth-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
        }

        .remember-me input {
          accent-color: #D1B06F;
          width: 14px;
          height: 14px;
        }

        .forgot-password {
          color: #D1B06F;
          text-decoration: underline;
          text-decoration-color: transparent;
          transition: text-decoration-color 0.2s;
        }

        .forgot-password:hover {
          text-decoration-color: #D1B06F;
        }

        .auth-primary-btn {
          margin-top: 8px;
          background: #D1B06F;
          color: #0B0B0B;
          border: none;
          border-radius: 8px;
          padding: 14px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .auth-primary-btn:hover {
          background: #E6CD8F;
          transform: translateY(-1px);
        }

        .auth-primary-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: rgba(255,255,255,0.3);
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          margin: 16px 0;
        }
        
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        
        .auth-divider::before { margin-right: 12px; }
        .auth-divider::after { margin-left: 12px; }

        .social-logins {
          display: flex;
          gap: 12px;
        }

        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 10px 0;
          font-size: 0.75rem;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }

        .social-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .auth-footer-link {
          text-align: center;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          margin-top: 16px;
        }

        .auth-footer-link button {
          background: transparent;
          border: none;
          color: #D1B06F;
          text-decoration: underline;
          text-decoration-color: transparent;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
          transition: text-decoration-color 0.2s;
        }

        .auth-footer-link button:hover {
          text-decoration-color: #D1B06F;
        }

        .auth-error {
          background: rgba(220, 38, 38, 0.1);
          color: #ef4444;
          padding: 12px;
          border-radius: 6px;
          font-size: 0.8125rem;
          text-align: center;
          border: 1px solid rgba(220, 38, 38, 0.2);
        }

        .auth-bottom-signature {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 16px;
        }

        .connector-line-bottom-end {
          width: 1px;
          height: 25px;
          background: rgba(255,255,255,0.15);
          margin-bottom: 16px;
        }

        .auth-bottom-signature span {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.3em;
        }

        .loader {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(0,0,0,0.1);
          border-bottom-color: #000;
          border-radius: 50%;
          display: inline-block;
          animation: rotation 1s linear infinite;
        }

        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
