'use client';

import React, { useState } from "react";
import { Bell, CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import { useNotifications } from "@/lib/notifications-context";
import { motion, AnimatePresence } from "motion/react";

export function NotificationBell() {
    const { unreadCount, notifications, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleMarkRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        markAllAsRead();
    };

    const getIcon = (message: string) => {
        if (message.includes('error') || message.includes('Error') || message.includes('failed'))
            return <AlertTriangle size={15} />;
        if (message.includes('Merge') || message.includes('info') || message.includes('joined'))
            return <Info size={15} />;
        return <CheckCircle size={15} />;
    };

    const getIconColor = (message: string) => {
        if (message.includes('error') || message.includes('Error') || message.includes('failed'))
            return 'var(--error)';
        if (message.includes('Merge') || message.includes('info') || message.includes('joined'))
            return 'var(--info)';
        return 'var(--success)';
    };

    const getIconBg = (message: string) => {
        if (message.includes('error') || message.includes('Error') || message.includes('failed'))
            return 'rgba(212, 106, 106, 0.1)';
        if (message.includes('Merge') || message.includes('info') || message.includes('joined'))
            return 'rgba(106, 155, 212, 0.1)';
        return 'rgba(109, 184, 122, 0.1)';
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Bell Button */}
            <button
                onClick={handleClick}
                aria-label="Notifications"
                style={{
                    position: 'relative',
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: isOpen ? 'var(--surface-2)' : 'transparent',
                    color: isOpen ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface-2)';
                    e.currentTarget.style.borderColor = 'var(--border-hover)';
                    e.currentTarget.style.color = 'var(--text-white)';
                }}
                onMouseLeave={(e) => {
                    if (!isOpen) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                }}
            >
                <Bell size={18} />

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        minWidth: '18px',
                        height: '18px',
                        borderRadius: '9px',
                        background: 'var(--accent)',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 5px',
                        border: '2px solid var(--bg)',
                        lineHeight: 1,
                        animation: 'fade-up 0.3s ease forwards',
                    }}>
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                position: 'absolute',
                                right: 0,
                                marginTop: '8px',
                                width: '360px',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                boxShadow: '0 12px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)',
                                zIndex: 100,
                                overflow: 'hidden',
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px 20px',
                                borderBottom: '1px solid var(--border)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <h3 style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: 'var(--text-white)',
                                        letterSpacing: '-0.01em',
                                    }}>
                                        Notifications
                                    </h3>
                                    {unreadCount > 0 && (
                                        <span style={{
                                            fontSize: '0.625rem',
                                            fontWeight: 700,
                                            color: 'var(--accent)',
                                            background: 'var(--accent-muted)',
                                            padding: '2px 8px',
                                            borderRadius: '6px',
                                            letterSpacing: '0.02em',
                                        }}>
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkRead}
                                            style={{
                                                fontSize: '0.6875rem',
                                                fontWeight: 600,
                                                color: 'var(--accent)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                transition: 'all 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'var(--accent-muted)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'none';
                                            }}
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--text-white)';
                                            e.currentTarget.style.background = 'var(--surface-2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-muted)';
                                            e.currentTarget.style.background = 'none';
                                        }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Notification List */}
                            <div style={{
                                maxHeight: '340px',
                                overflowY: 'auto',
                            }}>
                                {notifications.length > 0 ? (
                                    notifications.map((n, i) => (
                                        <div
                                            key={n.id}
                                            style={{
                                                padding: '14px 20px',
                                                borderBottom: i < notifications.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s ease',
                                                position: 'relative',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'var(--surface-2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            {/* Unread indicator */}
                                            {!n.read && (
                                                <span style={{
                                                    position: 'absolute',
                                                    left: '8px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: '5px',
                                                    height: '5px',
                                                    borderRadius: '50%',
                                                    background: 'var(--accent)',
                                                }} />
                                            )}

                                            <div style={{
                                                display: 'flex',
                                                gap: '12px',
                                                alignItems: 'flex-start',
                                            }}>
                                                {/* Icon */}
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '9px',
                                                    background: getIconBg(n.message),
                                                    color: getIconColor(n.message),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    marginTop: '1px',
                                                }}>
                                                    {getIcon(n.message)}
                                                </div>

                                                {/* Content */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{
                                                        fontSize: '0.8125rem',
                                                        color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)',
                                                        lineHeight: 1.45,
                                                        fontWeight: n.read ? 400 : 500,
                                                        margin: 0,
                                                    }}>
                                                        {n.message}
                                                    </p>
                                                    <span style={{
                                                        fontSize: '0.6875rem',
                                                        color: 'var(--text-muted)',
                                                        marginTop: '4px',
                                                        display: 'block',
                                                        fontWeight: 500,
                                                    }}>
                                                        {n.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{
                                        padding: '48px 24px',
                                        textAlign: 'center',
                                    }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '14px',
                                            background: 'var(--surface-2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 14px',
                                            color: 'var(--text-muted)',
                                        }}>
                                            <Bell size={22} />
                                        </div>
                                        <p style={{
                                            fontSize: '0.8125rem',
                                            fontWeight: 600,
                                            color: 'var(--text-secondary)',
                                            marginBottom: '4px',
                                        }}>
                                            All caught up!
                                        </p>
                                        <p style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                        }}>
                                            No new notifications to show
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div style={{
                                    padding: '12px 20px',
                                    borderTop: '1px solid var(--border)',
                                    textAlign: 'center',
                                }}>
                                    <button
                                        style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: 'var(--text-muted)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'color 0.2s ease',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--accent)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-muted)';
                                        }}
                                    >
                                        View all activity →
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
