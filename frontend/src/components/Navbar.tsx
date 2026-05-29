'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { NotificationBell } from './NotificationBell';

export default function Navbar() {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('auth_token'));
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const isHome = pathname === '/';

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            background: scrolled || !isHome
                ? 'rgba(15, 15, 15, 0.85)'
                : 'transparent',
            backdropFilter: scrolled || !isHome ? 'blur(12px) saturate(140%)' : 'none',
            WebkitBackdropFilter: scrolled || !isHome ? 'blur(12px) saturate(140%)' : 'none',
            borderBottom: scrolled || !isHome
                ? '1px solid rgba(255, 255, 255, 0.06)'
                : '1px solid transparent',
            transition: 'all 0.3s ease',
        }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                    fontSize: '1rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '-0.03em',
                }}>
                    WIIBUILD
                </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

                {isLoggedIn ? (
                    <>
                        <Link
                            href="/dashboard"
                            style={{
                                textDecoration: 'none',
                                color: pathname === '/dashboard' ? '#ffffff' : 'rgba(255,255,255,0.5)',
                                fontWeight: 500,
                                fontSize: '0.8125rem',
                                padding: '6px 14px',
                                borderRadius: '6px',
                                transition: 'color 0.2s',
                            }}
                        >
                            Dashboard
                        </Link>
                        <NotificationBell />
                        <button
                            onClick={handleLogout}
                            style={{
                                marginLeft: '10px',
                                padding: '8px 18px',
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                background: 'transparent',
                                color: 'rgba(255,255,255,0.6)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            style={{
                                textDecoration: 'none',
                                color: 'rgba(255,255,255,0.5)',
                                fontWeight: 500,
                                fontSize: '0.8125rem',
                                padding: '6px 14px',
                                transition: 'color 0.2s',
                            }}
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/login"
                            style={{
                                textDecoration: 'none',
                                padding: '8px 18px',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                background: '#C9A96E',
                                color: '#0f0f0f',
                                borderRadius: '6px',
                                transition: 'all 0.2s',
                            }}
                        >
                            Get Started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
