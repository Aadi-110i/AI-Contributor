"use client";

import { Marquee } from "@/components/ui/marquee";
import { Users, MessageCircle } from "lucide-react";

const teamMembers = [
  {
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Bilal Ahmed",
    role: "Frontend Developer",
    status: "online",
  },
  {
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Sana Sheikh",
    role: "Backend Engineer",
    status: "online",
  },
  {
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    name: "Alex Rivera",
    role: "Full-Stack Developer",
    status: "away",
  },
  {
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Zainab Hussain",
    role: "DevOps Engineer",
    status: "online",
  },
  {
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Omar Raza",
    role: "AI/ML Engineer",
    status: "offline",
  },
  {
    image: "https://randomuser.me/api/portraits/women/17.jpg",
    name: "Aliza Khan",
    role: "UI/UX Designer",
    status: "online",
  },
  {
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    name: "Hassan Ali",
    role: "Database Architect",
    status: "away",
  },
  {
    image: "https://randomuser.me/api/portraits/women/90.jpg",
    name: "Briana Patton",
    role: "QA Lead",
    status: "online",
  },
];

const statusColors: Record<string, string> = {
  online: "var(--success)",
  away: "var(--warning)",
  offline: "var(--text-muted)",
};

export default function TeamSection() {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "22px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(109, 184, 122, 0.1)",
            color: "var(--success)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Users size={18} />
        </div>
        <div>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--text-white)",
            }}
          >
            Team Members
          </h2>
          <p
            style={{
              fontSize: "0.6875rem",
              color: "var(--text-muted)",
              marginTop: "1px",
            }}
          >
            Collaborators across your projects
          </p>
        </div>
        <span
          className="badge badge-success"
          style={{ marginLeft: "auto" }}
        >
          <span className="badge-dot" />
          {teamMembers.filter((m) => m.status === "online").length} online
        </span>
      </div>

      {/* Marquee */}
      <div style={{ position: "relative" }}>
        {/* Fade edges — using bg variable for theme awareness */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "80px",
            height: "100%",
            background:
              "linear-gradient(to right, var(--surface), transparent)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "80px",
            height: "100%",
            background:
              "linear-gradient(to left, var(--surface), transparent)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        <Marquee
          className="[--duration:30s] [--gap:14px]"
          pauseOnHover
        >
          {teamMembers.map((member) => (
            <div
              key={member.name}
              style={{
                width: "200px",
                flexShrink: 0,
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-hover)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "var(--card-shadow-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Avatar with status */}
              <div style={{ position: "relative" }}>
                <img
                  src={member.image}
                  alt={member.name}
                  width={56}
                  height={56}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--border)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: statusColors[member.status],
                    border: "2px solid var(--surface-2)",
                  }}
                />
              </div>

              {/* Name & Role */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: "var(--text-white)",
                    lineHeight: 1.3,
                  }}
                >
                  {member.name}
                </p>
                <p
                  style={{
                    fontSize: "0.6875rem",
                    color: "var(--text-muted)",
                    marginTop: "2px",
                  }}
                >
                  {member.role}
                </p>
              </div>

              {/* Connect button */}
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent-muted)";
                  e.currentTarget.style.borderColor = "rgba(201, 169, 110, 0.3)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <MessageCircle size={12} />
                Connect
              </button>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
