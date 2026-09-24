import React from 'react';
import { Activity, ShieldAlert, BarChart3, TrendingUp } from 'lucide-react';

export default function AttackTimelineCard({ stats }) {
  const vectors = stats?.attack_vectors || {
    "Credential Harvesting": 45,
    "Business Email Compromise (BEC)": 28,
    "Malicious Attachments / Ransomware": 16,
    "Domain Spoofing": 11
  };

  const hourly = stats?.hourly_trends || [
    { time: "00:00", total: 420, threats: 24 },
    { time: "04:00", total: 310, threats: 18 },
    { time: "08:00", total: 1120, threats: 95 },
    { time: "12:00", total: 1840, threats: 142 },
    { time: "16:00", total: 1650, threats: 128 },
    { time: "20:00", total: 890, threats: 56 }
  ];

  const colors = ["#ef4444", "#f97316", "#a855f7", "#00f0ff"];

  return (
    <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Threat Vectors & Hourly Telemetry
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Past 24 Hours</span>
      </div>

      {/* Vector Distribution Bars */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 block mb-1">
          Attack Category Distribution:
        </span>
        {Object.entries(vectors).map(([name, pct], idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">{name}</span>
              <span className="font-bold text-slate-100">{pct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  backgroundColor: colors[idx % colors.length]
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Hourly Mini Histogram */}
      <div className="pt-2 border-t border-slate-850">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
          <span>Inbound Ingestion vs Detected Threats</span>
          <span className="text-red-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Peak: 12:00 UTC
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2 items-end h-24 pt-2">
          {hourly.map((h, i) => {
            const threatHeight = Math.min(Math.round((h.threats / 160) * 100), 100);
            return (
              <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full bg-slate-900 rounded-t relative flex items-end h-full">
                  <div
                    className="w-full bg-gradient-to-t from-red-600 to-orange-500 rounded-t transition-all duration-500 relative group"
                    style={{ height: `${threatHeight}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black px-1.5 py-0.5 rounded text-[9px] font-mono text-white border border-slate-700 whitespace-nowrap z-20">
                      {h.threats} threats
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-400">{h.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
