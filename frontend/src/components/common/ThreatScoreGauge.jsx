import React from 'react';

export default function ThreatScoreGauge({ score = 0, size = 180, riskLevel = "MEDIUM", showDetails = true }) {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  let color = "#10b981"; // safe
  let glowColor = "rgba(16, 185, 129, 0.4)";
  let badgeText = "SAFE";

  if (score >= 85) {
    color = "#ef4444";
    glowColor = "rgba(239, 68, 68, 0.45)";
    badgeText = "CRITICAL";
  } else if (score >= 65) {
    color = "#f97316";
    glowColor = "rgba(249, 115, 22, 0.45)";
    badgeText = "HIGH RISK";
  } else if (score >= 45) {
    color = "#eab308";
    glowColor = "rgba(234, 179, 8, 0.4)";
    badgeText = "MEDIUM";
  } else if (score >= 25) {
    color = "#06b6d4";
    glowColor = "rgba(6, 182, 212, 0.35)";
    badgeText = "LOW RISK";
  }

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Glow backdrop */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-30 transition-all duration-700"
          style={{ background: color }}
        />

        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Track background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Dotted target ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - 12}
            stroke="rgba(0, 240, 255, 0.15)"
            strokeWidth="1"
            strokeDasharray="4 4"
            fill="transparent"
          />
          {/* Animated Gauge Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease',
              filter: `drop-shadow(0 0 8px ${glowColor})`
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold font-mono tracking-tight" style={{ color }}>
            {score}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
            Threat Index
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-2 text-center">
          <span
            className="inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold tracking-wider uppercase border"
            style={{
              color: color,
              borderColor: `${color}60`,
              backgroundColor: `${color}15`
            }}
          >
            {riskLevel || badgeText}
          </span>
        </div>
      )}
    </div>
  );
}
