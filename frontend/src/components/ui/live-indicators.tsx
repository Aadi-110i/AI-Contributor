"use client"

import { useEffect, useState } from "react"

const LOCATIONS = ["sf", "london", "tokyo", "paris"]

export function LiveIndicators() {
  const [liveViewers, setLiveViewers] = useState(2847)

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((v) => Math.max(100, v + Math.floor(Math.random() * 21) - 8))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '24px' }}>
      {/* Demo label */}
      <p style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "0.65rem",
        fontWeight: 500,
        letterSpacing: "0.08em",
        color: "rgba(201, 169, 106, 0.5)",
        marginBottom: "10px",
      }}>
        This is demo data
      </p>

      {/* Live Badges */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
      }}>
        {LOCATIONS.map((id, i) => (
          <div
            key={id}
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
              animation: "live-pulse 1.5s ease-in-out infinite",
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.625rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "#C9A96A",
            }}>LIVE</span>
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.6875rem",
              color: "#888888",
              paddingLeft: "6px",
            }}>
              {Math.floor(liveViewers * (0.3 + 0.7 * Math.pow(0.6, i))).toLocaleString()} active
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

