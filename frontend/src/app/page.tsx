'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Users, Bot, Upload, GitMerge, CheckCircle, Palette, Cog, ShieldCheck, Database, Link as LinkIcon, Plus, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';
import { GlobeLive } from '@/components/ui/cobe-globe-live';

import { LiveIndicators } from '@/components/ui/live-indicators';

const testimonials = [
  {
    text: "WiiBuild Platform transformed how our team works. Three devs, three different AI tools, one seamless product. The merge engine is magic.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Briana Patton",
    role: "Engineering Lead",
  },
  {
    text: "We shipped a complete SaaS in 3 days. I used Antigravity for frontend, my partner used ChatGPT for backend. Zero merge conflicts.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Bilal Ahmed",
    role: "Full-Stack Developer",
  },
  {
    text: "The standardization engine saved us weeks. Every module follows the same structure automatically — no manual cleanup.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Saman Malik",
    role: "DevOps Engineer",
  },
  {
    text: "As a non-technical founder, I can now coordinate my dev team effectively. I see every module's status in real-time.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "CEO & Founder",
  },
  {
    text: "The auto-testing after merge gives us instant confidence. Every build is verified before we even look at it.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "QA Lead",
  },
  {
    text: "Invite links make onboarding freelancers instant. They claim a module, upload code, and the platform handles the rest.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Project Manager",
  },
  {
    text: "I built the auth module with Claude while my teammate used Trae for the database. WiiBuild stitched it together perfectly.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Backend Developer",
  },
  {
    text: "The best part? Each person works in their preferred AI tool. No forcing everyone onto one platform.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Tech Lead",
  },
  {
    text: "We replaced our entire CI/CD pipeline with WiiBuild's merge + test engine. Simpler, faster, and developer-friendly.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "Platform Engineer",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const BENEFITS = [
  { title: 'Modular Architecture', desc: 'Five independent modules — frontend, backend, auth, database & integrations. Each built separately, merged automatically.' },
  { title: 'Use Any AI Tool', desc: 'Build with Antigravity, ChatGPT, Claude, Trae or any AI tool. Each team member uses what they prefer — no lock-in.' },
  { title: 'Automated Merge Engine', desc: 'All modules are merged with API wiring, auth-database bridges, and consistent structure — automatically.' },
  { title: 'Built-in Testing', desc: 'Every merge triggers automated build checks, catching errors and logging results for every contributor.' },
];

export default function HomePage() {
  const [openBenefit, setOpenBenefit] = useState<number | null>(null);

  return (
    <div className="landing-root">

      {/* ============ HERO — Refined Redesign ============ */}
      <section className="hero-section">
        <div className="hero-center-angled">
          <div className="hero-globe-container">
            <GlobeLive />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hero-inner"
          >
            <div className="hero-badge animate-fade-in">
              <Zap size={12} fill="currentColor" />
              <span>NEXT-GEN AI COLLABORATION</span>
            </div>
            <h1 className="hero-title">WIIBUILD</h1>
            <p className="hero-subtitle">
              COLLABORATIVE AI DEVELOPMENT PLATFORM
            </p>
            <div className="hero-actions">
              <Link href="/login" className="hero-btn-primary">
                Start Building <ArrowRight size={16} />
              </Link>
              <Link href="#how-it-works" className="hero-btn-secondary">
                Learn More
              </Link>
            </div>
            <div style={{ marginTop: '56px', opacity: 0.8 }}>
              <LiveIndicators />
            </div>
          </motion.div>
        </div>

        {/* Orbital Decorations */}
        <div className="hero-orbital-left">
          <div className="hero-orbital-dot"></div>
        </div>
        <div className="hero-orbital-right">
          <div className="hero-orbital-dot"></div>
        </div>



        <div className="hero-left-panel">
          <div className="hero-feature-icon">
            <Users size={20} color="#C9A96A" />
          </div>
          <h3 className="hero-feature-title">Build Together</h3>
          <p className="hero-feature-desc">
            Collaborate with your team<br />
            in real-time, from idea to<br />
            deployment.
          </p>
        </div>

        <div className="hero-right-panel">
          <div className="hero-feature-icon">
            <Layers size={20} color="#C9A96A" />
          </div>
          <h3 className="hero-feature-title">Build Faster</h3>
          <p className="hero-feature-desc">
            Leverage AI to turn ideas<br />
            into powerful applications<br />
            in minutes.
          </p>
        </div>

        <div className="hero-bottom-left">
          <span className="hero-bottom-small">MORE PEOPLE</span><br />
          <strong className="hero-bottom-large">BETTER SOFTWARE</strong>
          <div className="hero-bottom-underline"></div>
        </div>

        <div className="hero-bottom-right">
          <div className="hero-cursive-block">
            <span className="hero-cursive-text">Ideas</span><br />
            <span className="hero-cursive-text" style={{ marginLeft: '12px' }}>Build a Brighter</span><br />
            <span className="hero-cursive-text" style={{ marginLeft: '24px' }}>Tomorrow</span>
            <div className="hero-cursive-underline"></div>
          </div>
        </div>
      </section>

      {/* ============ STATEMENT — White Section ============ */}
      <section className="statement-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="statement-inner"
        >
          <h2 className="statement-title">
            BUILD PROJECTS<br />
            <span className="statement-accent">TOGETHER</span> — WITH AI
          </h2>
          <div className="statement-desc">
            <p>
              Each team member contributes a module using their favorite AI tool.
              The platform standardizes, merges, and tests everything into one working application.
            </p>
            <Link href="/login" className="statement-cta">
              View Services <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ============ HOW IT WORKS — Black Section ============ */}
      <section id="how-it-works" className="steps-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="steps-header"
        >
          <h2 className="section-title-large">
            How It<br />Works
          </h2>
        </motion.div>

        <div className="steps-grid">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="step-card"
            >
              <div className="step-card-top">
                <div className="step-icon">{step.icon}</div>
                <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ MODULE TYPES — White Section ============ */}
      <section className="modules-section">
        <div className="modules-inner">
          <h3 className="modules-title">Five independent modules, one unified project</h3>
          <div className="modules-list">
            {MODULES.map((mod) => (
              <div key={mod.name} className="module-pill">
                <span className="module-icon">{mod.icon}</span>
                {mod.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY WIIBUILD — White Section ============ */}
      <section className="benefits-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="benefits-inner"
        >
          <div className="benefits-header">
            <h2 className="section-title-large" style={{ color: '#1a1a1a' }}>
              Why<br />WiiBuild
            </h2>
            <p className="benefits-sub">
              The benefits of<br />building with WiiBuild
            </p>
          </div>

          <div className="benefits-list">
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className={`benefit-item ${openBenefit === i ? 'benefit-open' : ''}`}
                onClick={() => setOpenBenefit(openBenefit === i ? null : i)}
              >
                <div className="benefit-header">
                  <span className="benefit-title">{b.title}</span>
                  <Plus size={18} className={`benefit-toggle ${openBenefit === i ? 'benefit-toggle-open' : ''}`} />
                </div>
                {openBenefit === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="benefit-desc"
                  >
                    {b.desc}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============ TESTIMONIALS — Black Section ============ */}
      <section className="testimonials-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', maxWidth: '540px', margin: '0 auto 48px' }}
          >
            <h2 className="section-title-large" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              What our<br />users say
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '12px', fontSize: '0.9375rem' }}>
              Teams around the world build faster with WiiBuild
            </p>
          </motion.div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          maxHeight: '740px',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
        }}>
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} duration={19} className="" />
          <TestimonialsColumn testimonials={thirdColumn} duration={17} className="" />
        </div>
      </section>

      {/* ============ CTA — White Section ============ */}
      <section className="cta-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          style={{ textAlign: 'center' }}
        >
          <h2 className="section-title-large" style={{ color: '#1a1a1a', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Start<br />Building
          </h2>
          <p style={{ color: '#6b6660', fontSize: '0.9375rem', marginTop: '12px', marginBottom: '32px' }}>
            No credit card required. Start with the demo to explore.
          </p>
          <Link href="/login" className="hero-btn-primary" style={{ background: '#1a1a1a', color: '#fff' }}>
            Get Started Free <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ============ FOOTER — Black ============ */}
      <footer className="footer-section">
        <div className="footer-inner">
          <div className="footer-left">
            <div className="footer-brand">WIIBUILD</div>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <span className="footer-col-title">Find us</span>
              <a href="#">GitHub</a>
              <a href="#">Twitter</a>
              <a href="#">Discord</a>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Hub</span>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/login">Sign In</Link>
              <a href="#how-it-works">How It Works</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ============ STYLES ============ */}
      <style>{`
        .landing-root {
          background: #ffffff;
          min-height: 100vh;
        }

        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap');

        /* ── HERO ── */
        .hero-section {
          background: #F7F7F5;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .hero-center-angled {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background: #0B0B0B;
          clip-path: polygon(16.5% 0, 83.5% 0, 71% 100%, 29% 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .hero-inner {
          text-align: center;
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 0 40px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(20, 18, 15, 0.4);
          color: #C9A96A;
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 24px;
          border: 1px solid rgba(201, 169, 106, 0.25);
          box-shadow: 0 0 15px rgba(201, 169, 106, 0.05);
        }

        .hero-title {
          font-size: clamp(4rem, 11vw, 11rem);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.05em;
          line-height: 0.85;
          margin-bottom: 16px;
          font-family: 'Inter', sans-serif;
        }

        .hero-subtitle {
          font-size: 0.8125rem;
          font-weight: 400;
          color: #888888;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 40px;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: #C9A96A;
          color: #000;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.875rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .hero-btn-primary:hover {
          background: #d9b878;
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: transparent;
          color: #aaaaaa;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          font-weight: 500;
          font-size: 0.875rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .hero-btn-secondary:hover {
          background: rgba(255,255,255,0.02);
          color: #cccccc;
        }

        /* Orbital Decorations */
        .hero-orbital-left {
          position: absolute;
          top: 50%;
          left: -25vw;
          width: 44vw;
          height: 68vh;
          transform: translateY(-50%);
          border-right: 1px solid rgba(0,0,0,0.12);
          border-radius: 50%;
          z-index: 1;
        }
        .hero-orbital-left .hero-orbital-dot {
          position: absolute;
          top: 42%;
          right: -2px;
          transform: translateY(-50%);
          width: 9px;
          height: 9px;
          background: #C9A96A;
          border-radius: 50%;
        }

        .hero-orbital-right {
          position: absolute;
          top: 50%;
          right: -25vw;
          width: 44vw;
          height: 68vh;
          transform: translateY(-50%);
          border-left: 1px solid rgba(0,0,0,0.12);
          border-radius: 50%;
          z-index: 1;
        }
        .hero-orbital-right .hero-orbital-dot {
          position: absolute;
          top: 42%;
          left: -2px;
          transform: translateY(-50%);
          width: 9px;
          height: 9px;
          background: #C9A96A;
          border-radius: 50%;
        }

        /* Top Left */
        .hero-top-left {
          position: absolute;
          top: 40px;
          left: 48px;
          z-index: 2;
        }
        .hero-logo-text {
          font-size: 1.125rem;
          font-weight: 900;
          color: #111;
          letter-spacing: -0.04em;
        }

        /* Top Right */
        .hero-top-right {
          position: absolute;
          top: 32px;
          right: 48px;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .hero-nav-link {
          font-size: 0.8125rem;
          font-weight: 500;
          color: #444;
          text-decoration: none;
        }
        .hero-nav-btn {
          font-size: 0.8125rem;
          font-weight: 600;
          background: #D1B06F;
          color: #111;
          padding: 8px 20px;
          border-radius: 4px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .hero-nav-btn:hover {
          background: #e0be7a;
        }

        /* Panels */
        .hero-left-panel {
          position: absolute;
          left: 4vw;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          max-width: 220px;
        }
        .hero-right-panel {
          position: absolute;
          right: 4vw;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          max-width: 220px;
          text-align: right;
        }
        .hero-feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #FCFAf6;
          border: 1px solid #EFEBD9;
          margin-bottom: 16px;
        }
        .hero-feature-title {
          font-size: 1rem;
          font-weight: 600;
          color: #222;
          margin-bottom: 8px;
        }
        .hero-feature-desc {
          font-size: 0.8125rem;
          color: #666;
          line-height: 1.6;
        }

        /* Bottom texts */
        .hero-bottom-left {
          position: absolute;
          bottom: 40px;
          left: 48px;
          z-index: 2;
          line-height: 1.4;
        }
        .hero-bottom-small {
          font-size: 0.6875rem;
          color: #888;
          font-weight: 500;
          letter-spacing: 0.15em;
        }
        .hero-bottom-large {
          font-size: 0.8125rem;
          color: #444;
          letter-spacing: 0.1em;
          font-weight: 600;
        }
        .hero-bottom-underline {
          height: 2px;
          width: 32px;
          background: #C9A96A;
          margin-top: 6px;
        }

        .hero-bottom-right {
          position: absolute;
          bottom: 40px;
          right: 48px;
          z-index: 2;
          line-height: 1.1;
          text-align: right;
        }
        .hero-cursive-block {
          display: inline-block;
          text-align: left;
        }
        .hero-cursive-text {
          font-family: 'Caveat', cursive;
          font-size: 2.2rem;
          color: #999;
          display: inline-block;
        }
        .hero-cursive-underline {
          height: 1px;
          width: 40px;
          background: #C9A96A;
          margin-top: 8px;
          margin-left: 24px;
        }

        @media (max-width: 1024px) {
          .hero-center-angled {
            clip-path: none;
            background: #0B0B0B;
          }
          .hero-left-panel, .hero-right-panel, .hero-bottom-left, .hero-bottom-right, .hero-top-left, .hero-top-right, .hero-orbital-left, .hero-orbital-right {
            display: none !important;
          }
        }

        .hero-globe-container {
          position: absolute;
          width: 800px;
          height: 800px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -40%);
          opacity: 0.45;
          pointer-events: none;
          mask-image: radial-gradient(circle at center, black 0%, transparent 70%);
          -webkit-mask-image: radial-gradient(circle at center, black 0%, transparent 70%);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201, 169, 110, 0.1);
          color: #C9A96E;
          padding: 6px 16px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 24px;
          border: 1px solid rgba(201, 169, 110, 0.2);
        }

        .hero-inner {
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: clamp(4rem, 12vw, 10rem);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.04em;
          line-height: 0.9;
          margin-bottom: 20px;
          font-family: 'Inter', sans-serif;
        }

        .hero-subtitle {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 48px;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: #C9A96E;
          color: #0f0f0f;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.875rem;
          text-decoration: none;
          transition: all 0.25s ease;
          letter-spacing: -0.01em;
        }

        .hero-btn-primary:hover {
          background: #D4B87A;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(201, 169, 110, 0.3);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: transparent;
          color: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.875rem;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .hero-btn-secondary:hover {
          color: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* ── STATEMENT ── */
        .statement-section {
          background: #ffffff;
          padding: 120px 24px;
        }

        .statement-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 60px;
          align-items: end;
        }

        @media (max-width: 768px) {
          .statement-inner {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        .statement-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          color: #1a1a1a;
          letter-spacing: -0.04em;
          line-height: 1.0;
        }

        .statement-accent {
          color: #C9A96E;
        }

        .statement-desc {
          max-width: 360px;
        }

        .statement-desc p {
          font-size: 0.875rem;
          color: #6b6660;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .statement-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #1a1a1a;
          text-decoration: none;
          padding: 10px 20px;
          border: 1px solid #1a1a1a;
          border-radius: 4px;
          transition: all 0.25s ease;
          letter-spacing: 0.02em;
        }

        .statement-cta:hover {
          background: #1a1a1a;
          color: #ffffff;
        }

        /* ── STEPS ── */
        .steps-section {
          background: #0f0f0f;
          padding: 100px 24px;
        }

        .steps-header {
          max-width: 1100px;
          margin: 0 auto 56px;
          text-align: center;
        }

        .section-title-large {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.04em;
          line-height: 1.0;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1px;
          max-width: 1100px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          overflow: hidden;
        }

        .step-card {
          padding: 32px 28px;
          background: #0f0f0f;
          transition: background 0.3s ease;
        }

        .step-card:hover {
          background: #151515;
        }

        .step-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .step-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A96E;
        }

        .step-number {
          font-size: 0.6875rem;
          color: rgba(255, 255, 255, 0.25);
          font-weight: 600;
          letter-spacing: 0.05em;
          font-variant-numeric: tabular-nums;
        }

        .step-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .step-desc {
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.65;
        }

        /* ── MODULES ── */
        .modules-section {
          background: #ffffff;
          padding: 80px 24px;
        }

        .modules-inner {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }

        .modules-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 28px;
        }

        .modules-list {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .module-pill {
          padding: 10px 20px;
          border-radius: 6px;
          background: #f7f5f2;
          border: 1px solid #e8e4de;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #2d2a26;
          transition: all 0.2s ease;
        }

        .module-pill:hover {
          border-color: #C9A96E;
          background: rgba(184, 151, 63, 0.04);
        }

        .module-icon {
          color: #C9A96E;
        }

        /* ── BENEFITS ── */
        .benefits-section {
          background: #ffffff;
          padding: 100px 24px 120px;
          border-top: 1px solid #e8e4de;
        }

        .benefits-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .benefits-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 56px;
          gap: 24px;
          flex-wrap: wrap;
        }

        .benefits-sub {
          font-size: 0.875rem;
          color: #6b6660;
          line-height: 1.6;
        }

        .benefits-list {
          border-top: 1px solid #e8e4de;
        }

        .benefit-item {
          border-bottom: 1px solid #e8e4de;
          padding: 24px 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .benefit-item:hover {
          padding-left: 8px;
        }

        .benefit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .benefit-title {
          font-size: 0.9375rem;
          font-weight: 500;
          color: #1a1a1a;
        }

        .benefit-toggle {
          color: #a8a29e;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .benefit-toggle-open {
          transform: rotate(45deg);
          color: #C9A96E;
        }

        .benefit-desc {
          font-size: 0.8125rem;
          color: #6b6660;
          line-height: 1.7;
          margin-top: 12px;
          max-width: 600px;
          overflow: hidden;
        }

        /* ── TESTIMONIALS ── */
        .testimonials-section {
          background: #0f0f0f;
          padding: 100px 0;
          overflow: hidden;
        }

        /* ── CTA ── */
        .cta-section {
          background: #ffffff;
          padding: 120px 24px;
        }

        /* ── FOOTER ── */
        .footer-section {
          background: #0f0f0f;
          padding: 60px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 40px;
        }

        .footer-brand {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.04em;
        }

        .footer-links {
          display: flex;
          gap: 60px;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-col-title {
          font-size: 0.6875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.35);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }

        .footer-col a {
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-col a:hover {
          color: #C9A96E;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 640px) {
          .hero-title {
            font-size: clamp(3rem, 15vw, 5rem);
          }
          .footer-links {
            gap: 32px;
          }
        }
      `}</style>
    </div>
  );
}

const STEPS = [
  { icon: <Layers size={18} />, title: 'Create a Project', desc: 'Define your project and it auto-generates five modules: frontend, backend, auth, database, and integrations.' },
  { icon: <Users size={18} />, title: 'Invite Your Team', desc: 'Share an invite link. Each member joins and claims the module they want to build.' },
  { icon: <Bot size={18} />, title: 'Use Any AI Tool', desc: 'Build with Antigravity, ChatGPT, Claude, Trae, or any AI — each person uses what they prefer.' },
  { icon: <Upload size={18} />, title: 'Upload Code', desc: 'Upload your module as a ZIP. The standardization engine enforces consistent folder structure and naming.' },
  { icon: <GitMerge size={18} />, title: 'Auto Merge', desc: 'All modules are merged, APIs are wired, and auth-database bridges are generated automatically.' },
  { icon: <CheckCircle size={18} />, title: 'Build & Test', desc: 'Automated build checks run on the merged project, catching errors and logging results for every contributor.' },
];

const MODULES = [
  { icon: <Palette size={18} />, name: 'Frontend' },
  { icon: <Cog size={18} />, name: 'Backend' },
  { icon: <ShieldCheck size={18} />, name: 'Auth' },
  { icon: <Database size={18} />, name: 'Database' },
  { icon: <LinkIcon size={18} />, name: 'Integrations' },
];
