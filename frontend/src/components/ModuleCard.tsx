'use client';

import React from 'react';
import type { Module } from '@/lib/api';
import { Upload, Palette, Cog, ShieldCheck, Database, Link as LinkIcon } from 'lucide-react';

const MODULE_META: Record<string, { icon: React.ReactNode; color: string }> = {
    frontend: { icon: <Palette size={18} />, color: '#ef4444' },
    backend: { icon: <Cog size={18} />, color: '#3b82f6' },
    authentication: { icon: <ShieldCheck size={18} />, color: '#eab308' },
    database: { icon: <Database size={18} />, color: '#8b5cf6' },
    integrations: { icon: <LinkIcon size={18} />, color: '#22c55e' },
};

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
    unassigned: { label: 'Unassigned', cls: 'badge-neutral' },
    in_progress: { label: 'In Progress', cls: 'badge-warning' },
    uploaded: { label: 'Uploaded', cls: 'badge-active' },
    standardized: { label: 'Ready', cls: 'badge-accent' },
    merged: { label: 'Merged', cls: 'badge-success' },
    error: { label: 'Error', cls: 'badge-error' },
};

interface Props {
    module: Module;
    onAssign?: () => void;
    onUpload?: () => void;
    isCurrentUser?: boolean;
}

export default function ModuleCard({ module, onAssign, onUpload, isCurrentUser }: Props) {
    const meta = MODULE_META[module.type] || MODULE_META.integrations;
    const status = STATUS_CFG[module.status] || STATUS_CFG.unassigned;

    return (
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: `${meta.color}12`, border: `1px solid ${meta.color}25`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem',
                    }}>
                        {meta.icon}
                    </div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-white)', textTransform: 'capitalize' }}>
                        {module.type}
                    </h4>
                </div>
                <span className={`badge ${status.cls}`}>
                    <span className="badge-dot" />
                    {status.label}
                </span>
            </div>

            {/* Assigned user */}
            <div style={{
                padding: '8px 12px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
            }}>
                {module.profiles ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '26px', height: '26px', borderRadius: '50%',
                            background: `${meta.color}20`, border: `1px solid ${meta.color}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.65rem', fontWeight: 700, color: meta.color,
                        }}>
                            {module.profiles.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                            {module.profiles.username || 'Unknown'}
                        </span>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '0.775rem', color: 'var(--text-muted)', padding: '2px 0' }}>
                        No one assigned yet
                    </p>
                )}
            </div>

            {/* Actions */}
            {module.status === 'unassigned' && onAssign && (
                <button onClick={onAssign} className="btn-primary btn-sm" style={{ width: '100%' }}>
                    Claim Module
                </button>
            )}
            {isCurrentUser && ['in_progress', 'error'].includes(module.status) && onUpload && (
                <button onClick={onUpload} className="btn-primary btn-sm" style={{ width: '100%' }}>
                    <Upload size={13} /> Upload Code
                </button>
            )}
            {isCurrentUser && module.status === 'standardized' && (
                <div style={{ textAlign: 'center', fontSize: '0.775rem', color: 'var(--success)', fontWeight: 600, padding: '6px 0' }}>
                    ✓ Ready to merge
                </div>
            )}
        </div>
    );
}
