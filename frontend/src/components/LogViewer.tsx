'use client';

export default function LogViewer({ logs }: { logs: string }) {
    if (!logs) return null;

    const getColor = (line: string) => {
        if (line.startsWith('✅')) return '#4ade80';
        if (line.startsWith('❌')) return '#f87171';
        if (line.startsWith('⚠️')) return '#facc15';
        if (line.startsWith('🔗') || line.startsWith('📦') || line.startsWith('📋') || line.startsWith('🔨')) return '#60a5fa';
        if (line.startsWith('===')) return 'var(--accent-light)';
        if (line.startsWith('⏭️')) return 'var(--text-muted)';
        return 'var(--text-secondary)';
    };

    return (
        <div className="terminal">
            <div className="terminal-header">
                <div className="terminal-dot" style={{ background: '#ef4444' }} />
                <div className="terminal-dot" style={{ background: '#eab308' }} />
                <div className="terminal-dot" style={{ background: '#22c55e' }} />
            </div>
            {logs.split('\n').map((line, i) => (
                <div key={i} style={{ color: getColor(line) }}>{line || '\u00A0'}</div>
            ))}
        </div>
    );
}
