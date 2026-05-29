'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, LayoutDashboard, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Project } from '@/lib/api';

export default function ProjectCard({ project }: { project: Project }) {
    const [isHovered, setIsHovered] = useState(false);
    const modules = project.modules || [];
    const completed = modules.filter((m) => ['merged', 'standardized', 'uploaded'].includes(m.status)).length;
    const progress = modules.length > 0 ? (completed / modules.length) * 100 : 0;

    const statusConfig: Record<string, { label: string; color: string; bgTint: string; borderTint: string; icon: React.ReactNode }> = {
        active: {
            label: 'Active',
            color: 'var(--accent)',
            bgTint: 'var(--accent-muted)',
            borderTint: 'rgba(201, 169, 110, 0.25)',
            icon: <LayoutDashboard size={18} />,
        },
        merged: {
            label: 'Merged',
            color: 'var(--success)',
            bgTint: 'rgba(109, 184, 122, 0.1)',
            borderTint: 'rgba(109, 184, 122, 0.25)',
            icon: <CheckCircle2 size={18} />,
        },
        error: {
            label: 'Error',
            color: 'var(--error)',
            bgTint: 'rgba(212, 106, 106, 0.1)',
            borderTint: 'rgba(212, 106, 106, 0.25)',
            icon: <AlertCircle size={18} />,
        },
    };
    const status = statusConfig[project.status] || statusConfig.active;

    return (
        <Link href={`/project/${project.id}`} style={{ textDecoration: 'none' }} className="block h-full">
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius)',
                    padding: '20px',
                    height: '100%',
                    background: 'var(--surface)',
                    border: `1px solid ${isHovered ? 'var(--border-hover)' : 'var(--border)'}`,
                    boxShadow: isHovered
                        ? 'var(--card-shadow-hover)'
                        : 'var(--card-shadow)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                }}
            >
                {/* Icon container */}
                <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: status.bgTint,
                    color: status.color,
                    border: `1px solid ${status.borderTint}`,
                    transition: 'transform 0.3s ease',
                    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                }}>
                    {status.icon}
                </div>

                {/* Text content */}
                <div>
                    <h3 style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        lineHeight: 1.25,
                        color: 'var(--text-white)',
                        marginBottom: '4px',
                    }}>
                        {project.name}
                    </h3>
                    {project.description && (
                        <p style={{
                            fontSize: '0.75rem',
                            marginTop: '4px',
                            lineHeight: 1.625,
                            color: 'var(--text-secondary)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}>
                            {project.description}
                        </p>
                    )}
                </div>

                {/* Progress bar and Collaborators */}
                <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'flex-end' }}>
                        <div>
                            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Modules</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 700 }}>{completed}/{modules.length}</span>
                        </div>
                        
                        {/* Joined Members Avatars */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {(() => {
                                const assignedProfiles = modules
                                    .map(m => m.profiles)
                                    .filter((p): p is NonNullable<typeof p> => !!p);
                                
                                const uniqueProfiles = Array.from(new Map(assignedProfiles.map(p => [p.id, p])).values());
                                
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                                        {uniqueProfiles.slice(0, 3).map((profile, i) => (
                                            <div 
                                                key={profile.id}
                                                style={{ 
                                                    width: '20px', 
                                                    height: '20px', 
                                                    borderRadius: '50%', 
                                                    border: '1.5px solid var(--surface)',
                                                    marginLeft: i === 0 ? 0 : '-6px',
                                                    overflow: 'hidden',
                                                    background: 'var(--surface-2)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.5rem',
                                                    color: 'var(--text-white)',
                                                    zIndex: 10 - i
                                                }}
                                                title={profile.username}
                                            >
                                                {profile.avatar_url ? (
                                                    <img src={profile.avatar_url} alt={profile.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    profile.username.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                        ))}
                                        {uniqueProfiles.length > 3 && (
                                            <div style={{ 
                                                width: '20px', 
                                                height: '20px', 
                                                borderRadius: '50%', 
                                                background: 'var(--surface-3)', 
                                                border: '1.5px solid var(--surface)',
                                                marginLeft: '-6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.55rem',
                                                color: 'var(--text-muted)',
                                                fontWeight: 600,
                                                zIndex: 0
                                            }}>
                                                +{uniqueProfiles.length - 3}
                                            </div>
                                        )}
                                        {uniqueProfiles.length === 0 && (
                                            <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No joiners</span>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                    
                    <div style={{ height: '3px', background: 'var(--surface-3)', borderRadius: '2px', overflow: 'hidden', marginBottom: '10px' }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'var(--accent)',
                            borderRadius: '2px',
                            transition: 'width 0.4s ease',
                        }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: isHovered ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: {project.id.slice(0, 8)}...</span>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border)',
                    marginTop: '4px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: status.color,
                            background: status.bgTint,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            border: `1px solid ${status.borderTint}`,
                        }}>
                            {status.label}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                            {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                    <ArrowUpRight
                        size={14}
                        style={{
                            color: isHovered ? 'var(--accent)' : 'var(--text-muted)',
                            transition: 'all 0.3s ease',
                            transform: isHovered ? 'translate(1px, -1px)' : 'translate(0, 0)',
                        }}
                    />
                </div>
            </div>
        </Link>
    );
}
