'use client';

import { GlowCard } from "@/components/ui/spotlight-card";
import { ArrowLeft, Rocket, Shield, Brain } from "lucide-react";
import Link from "next/link";

export default function GlowDemoPage() {
    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
            <div style={{ marginBottom: '48px', textAlign: 'center' }}>
                <Link
                    href="/dashboard"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem',
                        marginBottom: '16px',
                        textDecoration: 'none'
                    }}
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-white)', letterSpacing: '-0.04em' }}>
                    Spotlight <span style={{ color: 'var(--accent-light)' }}>Glow Cards</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>
                    Interactive mouse-following glow effects for the premium AI experience.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                maxWidth: '1000px',
                margin: '0 auto'
            }}>
                {/* Blue Glow */}
                <GlowCard glowColor="blue" className="p-8">
                    <div style={{ pointerEvents: 'none' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#60a5fa',
                            marginBottom: '24px'
                        }}>
                            <Brain size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '12px' }}>Intelligent Agents</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                            Experience the depth of our AI integration with reactive spotlight effects that guide your focus.
                        </p>
                    </div>
                </GlowCard>

                {/* Red/Crimson Glow */}
                <GlowCard glowColor="red" className="p-8">
                    <div style={{ pointerEvents: 'none' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'var(--accent-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-light)',
                            marginBottom: '24px'
                        }}>
                            <Rocket size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '12px' }}>Crimson Performance</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                            The signature crimson glow highlights the active status of your most critical project modules.
                        </p>
                    </div>
                </GlowCard>

                {/* Purple/Amethyst Glow */}
                <GlowCard glowColor="purple" className="p-8">
                    <div style={{ pointerEvents: 'none' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(168, 85, 247, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#a855f7',
                            marginBottom: '24px'
                        }}>
                            <Shield size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '12px' }}>Secure Merging</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                            Visual confirmation that your modules are standardized and protected during the merge process.
                        </p>
                    </div>
                </GlowCard>
            </div>

            <div style={{ marginTop: '64px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    * Move your mouse over the cards to see the spotlight effect in action.
                </p>
            </div>
        </div>
    );
}
