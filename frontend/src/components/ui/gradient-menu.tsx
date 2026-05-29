'use client';

import React, { useState } from 'react';
import {
    Home,
    Search,
    FolderKanban,
    Users,
    Settings,
    Bell,
    MessageSquare,
    Sparkles,
} from 'lucide-react';
import GlassEffect from './liquid-glass';

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    gradient: string;
    href?: string;
}

const MENU_ITEMS: MenuItem[] = [
    {
        icon: <Home size={22} />,
        label: 'Home',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
        href: '/',
    },
    {
        icon: <FolderKanban size={22} />,
        label: 'Projects',
        gradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
        href: '/dashboard',
    },
    {
        icon: <Users size={22} />,
        label: 'Team',
        gradient: 'linear-gradient(135deg, #eab308 0%, #22c55e 100%)',
    },
    {
        icon: <Sparkles size={22} />,
        label: 'AI Tools',
        gradient: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)',
    },
    {
        icon: <MessageSquare size={22} />,
        label: 'Chat',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    },
    {
        icon: <Bell size={22} />,
        label: 'Alerts',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    },
    {
        icon: <Search size={22} />,
        label: 'Search',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
    },
    {
        icon: <Settings size={22} />,
        label: 'Settings',
        gradient: 'linear-gradient(135deg, #d946ef 0%, #ef4444 100%)',
    },
];

export default function GradientMenu() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <GlassEffect className="rounded-3xl">
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '10px 14px',
                }}
            >
                {MENU_ITEMS.map((item, index) => {
                    const isHovered = hoveredIndex === index;
                    const isNeighbor =
                        hoveredIndex !== null &&
                        Math.abs(hoveredIndex - index) === 1;
                    const isNearby =
                        hoveredIndex !== null &&
                        Math.abs(hoveredIndex - index) === 2;

                    let scale = 1;
                    let translateY = 0;
                    if (isHovered) {
                        scale = 1.35;
                        translateY = -12;
                    } else if (isNeighbor) {
                        scale = 1.15;
                        translateY = -6;
                    } else if (isNearby) {
                        scale = 1.05;
                        translateY = -2;
                    }

                    return (
                        <div
                            key={item.label}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            {/* Tooltip label */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 'calc(100% + 10px)',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    whiteSpace: 'nowrap',
                                    fontSize: '0.6875rem',
                                    fontWeight: 600,
                                    color: 'white',
                                    background: 'rgba(0, 0, 0, 0.75)',
                                    backdropFilter: 'blur(8px)',
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    opacity: isHovered ? 1 : 0,
                                    pointerEvents: 'none',
                                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    transitionDelay: isHovered ? '0.15s' : '0s',
                                    letterSpacing: '0.02em',
                                }}
                            >
                                {item.label}
                                {/* Tooltip arrow */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '-4px',
                                        left: '50%',
                                        transform: 'translateX(-50%) rotate(45deg)',
                                        width: '8px',
                                        height: '8px',
                                        background: 'rgba(0, 0, 0, 0.75)',
                                    }}
                                />
                            </div>

                            {/* Icon button */}
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isHovered ? 'white' : 'rgba(255, 255, 255, 0.55)',
                                    background: isHovered ? item.gradient : 'transparent',
                                    backgroundSize: isHovered ? '200% 200%' : '100% 100%',
                                    animation: isHovered ? 'moveBackground 3s linear infinite' : 'none',
                                    transform: `scale(${scale}) translateY(${translateY}px)`,
                                    transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    boxShadow: isHovered
                                        ? '0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.1)'
                                        : 'none',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Shine overlay */}
                                {isHovered && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background:
                                                'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
                                            borderRadius: '14px',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                )}
                                <div style={{ position: 'relative', zIndex: 1 }}>{item.icon}</div>
                            </div>

                            {/* Active dot indicator */}
                            <div
                                style={{
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    marginTop: '6px',
                                    background: isHovered ? 'white' : 'transparent',
                                    transition: 'all 0.3s ease',
                                    boxShadow: isHovered ? '0 0 6px rgba(255,255,255,0.5)' : 'none',
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </GlassEffect>
    );
}
