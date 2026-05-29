"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import createGlobe from "cobe"

interface LiveMarker {
  id: string
  location: [number, number]
}

interface GlobeLiveProps {
  markers?: LiveMarker[]
  className?: string
  speed?: number
}

const defaultMarkers: LiveMarker[] = [
  { id: "sf", location: [37.78, -122.44] },
  { id: "london", location: [51.51, -0.13] },
  { id: "tokyo", location: [35.68, 139.65] },
  { id: "paris", location: [48.86, 2.35] },
  { id: "sydney", location: [-33.87, 151.21] },
  { id: "nyc", location: [40.71, -74.01] },
]

export function GlobeLive({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobeLiveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const [liveViewers, setLiveViewers] = useState(2847)

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((v) => Math.max(100, v + Math.floor(Math.random() * 21) - 8))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.5,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.3, 0.3, 0.3],
        markerColor: [0.79, 0.66, 0.43],
        glowColor: [0.15, 0.15, 0.15],
        markerElevation: 0.01,
        markers: markers.map((m) => ({ location: m.location, size: 0.03 })),
        opacity: 0.85,
        scale: 1,
        offset: [0, 0],
      })

      let phi = 0
      function animate() {
        if (!isPausedRef.current) phi += speed
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        })
        animationId = requestAnimationFrame(animate)
      }
      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId!) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, speed])

  return (
    <div className={`${className}`} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        aspectRatio: '1 / 1',
        margin: '0 auto',
      }}>
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          style={{
            width: "100%",
            height: "100%",
            cursor: "grab",
            opacity: 0,
            transition: "opacity 1.2s ease",
            borderRadius: "50%",
            touchAction: "none",
          }}
        />
      </div>

      {/* Live activity indicators */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        marginTop: '16px',
      }}>
        {markers.slice(0, 4).map((m, i) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "6px 12px",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{
              width: 6, height: 6,
              background: "var(--accent)",
              borderRadius: "50%",
              boxShadow: "0 0 6px var(--accent)",
              animation: "live-pulse 1.5s ease-in-out infinite",
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "monospace",
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "var(--accent)",
              textTransform: "uppercase" as const,
            }}>LIVE</span>
            <span style={{
              fontFamily: "inherit",
              fontSize: "0.6875rem",
              color: "var(--text-secondary)",
              paddingLeft: "0.4rem",
              borderLeft: "1px solid var(--border)",
            }}>
              {Math.floor(liveViewers * (0.3 + 0.7 * Math.pow(0.6, i))).toLocaleString()} active
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
