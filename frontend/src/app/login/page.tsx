'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Mail, Lock, User, ArrowRight, Layers, Users, Bot,
  GitMerge, Upload, CheckCircle, Shield, Zap, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlobeLive } from '@/components/ui/cobe-globe-live';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if Supabase is using placeholder config (not properly set up)
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

  const handleDemoLogin = (role: string) => {
    const demoUser = {
      id: `demo-${role.toLowerCase()}`,
      email: `${role.toLowerCase()}@aicollab.dev`,
      user_metadata: { username: `Demo${role}` },
    };
    localStorage.setItem('auth_token', `demo-token-${role.toLowerCase()}`);
    localStorage.setItem('user', JSON.stringify(demoUser));
    router.push('/dashboard');
  };

  return (
    <div className="login-root">
      {/* Background Globe — same as landing page */}
      <div className="login-globe-container">
        <GlobeLive />
      </div>

      {/* Back Button */}
      <Link href="/" className="login-back-btn">
        <ChevronLeft size={16} /> Back to Home
      </Link>

      <main className="login-container">
        <div className="login-content">
          
          {/* Brand Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="login-brand-header"
          >
            <div className="login-badge">
              <Shield size={12} fill="currentColor" />
              <span>Secure Access</span>
            </div>
            <h1 className="login-title">WIIBUILD</h1>
            <p className="login-subtitle">
              {isSignUp ? 'Create your collaborative space' : 'Welcome back to the platform'}
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="login-card-outer"
          >
            <div className="login-card">
              <AnimatePresence mode="wait">
                <motion.form 
                  key={isSignUp ? 'signup' : 'signin'}
                  initial={{ opacity: 0, x: isSignUp ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isSignUp ? -10 : 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit} 
                  className="login-form"
                >
                  {error && <div className="login-error-toast">{error}</div>}

                  {isSignUp && (
                    <div className="login-input-group">
                      <label>Username</label>
                      <div className="login-input-field">
                        <User className="input-icon" size={18} />
                        <input 
                          type="text" 
                          placeholder="Your unique handle" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="login-input-group">
                    <label>Email Address</label>
                    <div className="login-input-field">
                      <Mail className="input-icon" size={18} />
                      <input 
                        type="email" 
                        placeholder="name@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="login-input-group">
                    <label>Password</label>
                    <div className="login-input-field">
                      <Lock className="input-icon" size={18} />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button type="submit" className="login-primary-btn" disabled={loading}>
                    {loading ? <span className="loader" /> : (
                      <>
                        {isSignUp ? 'Create Account' : 'Sign In'}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </motion.form>
              </AnimatePresence>

              <div className="login-card-footer">
                <p>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
                    {isSignUp ? 'Sign In' : 'Register Here'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Demo Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="login-demo-section"
          >
            <div className="demo-divider">
              <span>OR CONTINUE WITH DEMO</span>
            </div>
            <div className="demo-chips">
              <button onClick={() => handleDemoLogin('Admin')} className="demo-chip">
                <Shield size={14} /> Admin
              </button>
              <button onClick={() => handleDemoLogin('Lead')} className="demo-chip">
                <Users size={14} /> Team Lead
              </button>
              <button onClick={() => handleDemoLogin('Developer')} className="demo-chip">
                <Zap size={14} /> Developer
              </button>
            </div>
          </motion.div>

        </div>
      </main>

      <style jsx>{`
        .login-root {
          min-height: 100vh;
          background: #0f0f0f;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          color: white;
          font-family: 'Inter', sans-serif;
        }

        .login-globe-container {
          position: absolute;
          width: 900px;
          height: 900px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -40%);
          opacity: 0.35;
          pointer-events: none;
          mask-image: radial-gradient(circle at center, black 0%, transparent 75%);
          -webkit-mask-image: radial-gradient(circle at center, black 0%, transparent 75%);
        }

        .login-back-btn {
          position: absolute;
          top: 32px;
          left: 32px;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.4);
          text-decoration: none;
          font-size: 0.8125rem;
          font-weight: 500;
          transition: color 0.2s;
        }

        .login-back-btn:hover {
          color: #C9A96E;
        }

        .login-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          position: relative;
          z-index: 10;
        }

        .login-content {
          width: 100%;
          max-width: 440px;
          text-align: center;
        }

        /* --- Header --- */
        .login-brand-header {
          margin-bottom: 40px;
        }

        .login-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201, 169, 110, 0.1);
          color: #C9A96E;
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
          border: 1px solid rgba(201, 169, 110, 0.15);
        }

        .login-title {
          font-size: clamp(2.5rem, 8vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.9;
          margin-bottom: 12px;
        }

        .login-subtitle {
          font-size: 0.9375rem;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 400;
        }

        /* --- Card --- */
        .login-card-outer {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
          padding: 1px;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          margin-bottom: 32px;
        }

        .login-card {
          background: #151515;
          border-radius: 19px;
          padding: 32px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-error-toast {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          font-size: 0.8125rem;
          padding: 12px;
          border-radius: 8px;
          text-align: left;
        }

        .login-input-group {
          text-align: left;
        }

        .login-input-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .login-input-field {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: rgba(255, 255, 255, 0.2);
        }

        .login-input-field input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 12px 16px 12px 42px;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }

        .login-input-field input:focus {
          border-color: #C9A96E;
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 4px rgba(201, 169, 110, 0.1);
        }

        .login-primary-btn {
          margin-top: 8px;
          background: #C9A96E;
          color: #0f0f0f;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-primary-btn:hover {
          background: #D4B87A;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(201, 169, 110, 0.3);
        }

        .login-primary-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-card-footer {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .login-card-footer p {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .login-card-footer button {
          background: none;
          border: none;
          color: #C9A96E;
          font-weight: 600;
          margin-left: 6px;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* --- Demo Section --- */
        .demo-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .demo-divider::before,
        .demo-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .demo-divider span {
          font-size: 0.625rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.1em;
        }

        .demo-chips {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .demo-chip {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          padding: 8px 16px;
          border-radius: 99px;
          font-size: 0.8125rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .demo-chip:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
          color: white;
          transform: translateY(-1px);
        }

        .loader {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .login-title { font-size: 3rem; }
          .login-card { padding: 24px; }
          .demo-chips { flex-direction: column; }
          .demo-chip { justify-content: center; }
        }
      `}</style>
    </div>
  );
}
