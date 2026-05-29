import GradientMenu from '@/components/ui/gradient-menu';

export default function DemoPage() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: '#000',
                backgroundImage: `
          url("https://images.unsplash.com/photo-1432251407527-504a6b4174a2?w=1920&q=80"),
          radial-gradient(ellipse at 30% 20%, rgba(102, 224, 245, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)
        `,
                backgroundSize: 'cover, 100% 100%, 100% 100%',
                backgroundPosition: 'center',
                backgroundBlendMode: 'overlay, normal, normal',
                position: 'relative',
            }}
        >
            {/* Dark overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '48px',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <h1
                        style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            color: '#fafafa',
                            letterSpacing: '-0.03em',
                            marginBottom: '8px',
                        }}
                    >
                        Liquid Glass Dock
                    </h1>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9375rem' }}>
                        Hover over the icons below
                    </p>
                </div>

                <GradientMenu />

                <p
                    style={{
                        color: '#52525b',
                        fontSize: '0.75rem',
                        letterSpacing: '0.04em',
                    }}
                >
                    GRADIENT MENU + LIQUID GLASS
                </p>
            </div>
        </div>
    );
}
