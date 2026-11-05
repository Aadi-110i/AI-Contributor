"use client"

interface DemoMetric {
  id: string
  tag: string
  label: string
}

const DEMO_METRICS: DemoMetric[] = [
  { id: "projects", tag: "DEMO", label: "24 Active Projects" },
  { id: "modules", tag: "DEMO", label: "118 Staged Modules" },
  { id: "contributors", tag: "DEMO", label: "82 Collaborators" },
  { id: "builds", tag: "DEMO", label: "99.8% Merge Rate" },
]

export function LiveIndicators() {
  return (
    <>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        marginTop: '16px',
      }}>
        {DEMO_METRICS.map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{
              width: 5, height: 5,
              background: "#C9A96A",
              borderRadius: "50%",
              boxShadow: "0 0 5px #C9A96A",
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.625rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "#C9A96A",
            }}>{m.tag}</span>
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.6875rem",
              color: "#999999",
              paddingLeft: "6px",
            }}>
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

