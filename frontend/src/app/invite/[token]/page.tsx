'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowRight, Handshake } from 'lucide-react';

export default function InvitePage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [expired, setExpired] = useState(false);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const data = await api.invites.get(token);
                setProjectName(data.invite.projects?.name || 'Unknown Project');
                setProjectDesc(data.invite.projects?.description || '');
                setExpired(data.expired);
            } catch {
                setProjectName('Demo Project');
                setProjectDesc('A collaborative project built with WiiBuild Platform');
            } finally { setLoading(false); }
        })();
    }, [token]);

    const handleAccept = async () => {
        if (!localStorage.getItem('auth_token')) { router.push(`/login?redirect=/invite/${token}`); return; }
        setAccepting(true);
        try {
            const r = await api.invites.accept(token);
            router.push(`/project/${r.project.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed');
            router.push('/dashboard');
        }
    };

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '120px 24px' }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading invite...</p>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', paddingTop: '80px' }}>
            <div className="animate-fade-up" style={{ width: '100%', maxWidth: '420px' }}>
                <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
                    <Handshake size={32} style={{ color: 'var(--accent-light)', margin: '0 auto 14px', display: 'block' }} />
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-white)', marginBottom: '4px' }}>You&apos;re Invited</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '20px' }}>Someone wants you on their team</p>

                    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '18px', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-light)', marginBottom: '4px' }}>{projectName}</h2>
                        {projectDesc && <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', lineHeight: 1.5 }}>{projectDesc}</p>}
                    </div>

                    {expired ? (
                        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', padding: '12px', color: '#f87171', fontSize: '0.8125rem', marginBottom: '14px' }}>
                            This invite has expired.
                        </div>
                    ) : (
                        <>
                            {error && <div style={{ background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--radius-sm)', padding: '10px', color: '#f87171', fontSize: '0.8125rem', marginBottom: '12px' }}>{error}</div>}
                            <button onClick={handleAccept} className="btn-primary" disabled={accepting} style={{ width: '100%', opacity: accepting ? 0.6 : 1 }}>
                                {accepting ? 'Joining...' : <>Join Project <ArrowRight size={14} /></>}
                            </button>
                        </>
                    )}

                    <button onClick={() => router.push('/dashboard')} className="btn-secondary" style={{ width: '100%', marginTop: '10px' }}>
                        Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
