'use client';

import { useState } from 'react';
import { Copy, Check, Link2, X } from 'lucide-react';

interface Props {
    inviteLink: string | null;
    onGenerate: () => Promise<void>;
    onClose: () => void;
}

export default function InviteModal({ inviteLink, onGenerate, onClose }: Props) {
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => { setGenerating(true); await onGenerate(); setGenerating(false); };
    const handleCopy = () => {
        if (inviteLink) { navigator.clipboard.writeText(inviteLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    };

    return (
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
        }}>
            <div onClick={(e) => e.stopPropagation()} className="card animate-fade-up" style={{ padding: '28px', width: '100%', maxWidth: '440px', position: 'relative' }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                }}>
                    <X size={18} />
                </button>

                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '4px' }}>
                    Invite Collaborators
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '20px' }}>
                    Share this link with your team to join the project.
                </p>

                {inviteLink ? (
                    <div>
                        <div style={{
                            background: 'var(--bg)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)', padding: '12px 14px',
                            fontSize: '0.775rem', color: 'var(--text-secondary)',
                            wordBreak: 'break-all', marginBottom: '12px',
                            fontFamily: "'JetBrains Mono', monospace",
                        }}>
                            {inviteLink}
                        </div>
                        <button onClick={handleCopy} className="btn-primary" style={{ width: '100%' }}>
                            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
                        </button>
                    </div>
                ) : (
                    <button onClick={handleGenerate} className="btn-primary" disabled={generating} style={{ width: '100%', opacity: generating ? 0.6 : 1 }}>
                        {generating ? 'Generating...' : <><Link2 size={14} /> Generate Invite Link</>}
                    </button>
                )}
            </div>
        </div>
    );
}
