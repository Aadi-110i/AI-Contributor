"use client";

import React from "react";
import { Radar, IconContainer } from "@/components/ui/radar-effect";
import {
  Code2,
  Database,
  Shield,
  Palette,
  Server,
  GitBranch,
  Cpu,
} from "lucide-react";

export default function NearbyDevelopers() {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "12px",
          position: "relative",
          zIndex: 50,
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--accent-muted)",
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Cpu size={18} />
        </div>
        <div>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--text-white)",
            }}
          >
            Developer Radar
          </h2>
          <p
            style={{
              fontSize: "0.6875rem",
              color: "var(--text-muted)",
              marginTop: "1px",
            }}
          >
            Skills available in your region
          </p>
        </div>
      </div>

      {/* Radar visualization */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "24rem",
          overflow: "hidden",
        }}
      >
        {/* Row 1 — wide */}
        <div
          style={{
            width: "100%",
            maxWidth: "48rem",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconContainer
              text="Frontend Dev"
              delay={0.2}
              icon={<Palette className="h-8 w-8 text-slate-600" />}
            />
            <IconContainer
              text="Backend Dev"
              delay={0.4}
              icon={<Server className="h-8 w-8 text-slate-600" />}
            />
            <IconContainer
              text="UI/UX Design"
              delay={0.3}
              icon={<Code2 className="h-8 w-8 text-slate-600" />}
            />
          </div>
        </div>

        {/* Row 2 — medium */}
        <div
          style={{
            width: "100%",
            maxWidth: "28rem",
            margin: "16px auto 0",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconContainer
              text="Auth & Security"
              delay={0.5}
              icon={<Shield className="h-8 w-8 text-slate-600" />}
            />
            <IconContainer
              text="Database"
              delay={0.8}
              icon={<Database className="h-8 w-8 text-slate-600" />}
            />
          </div>
        </div>

        {/* Row 3 — wide */}
        <div
          style={{
            width: "100%",
            maxWidth: "48rem",
            margin: "16px auto 0",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconContainer
              text="DevOps"
              delay={0.6}
              icon={<GitBranch className="h-8 w-8 text-slate-600" />}
            />
            <IconContainer
              text="API Integration"
              delay={0.7}
              icon={<Cpu className="h-8 w-8 text-slate-600" />}
            />
          </div>
        </div>

        {/* Radar sweep */}
        <Radar className="absolute -bottom-12" />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            zIndex: 41,
            height: "1px",
            width: "100%",
            background:
              "linear-gradient(to right, transparent, var(--border-hover), transparent)",
          }}
        />
      </div>
    </div>
  );
}
