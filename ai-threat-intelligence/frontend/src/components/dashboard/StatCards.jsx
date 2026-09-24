import React from 'react';
import { Mail, ShieldCheck, AlertTriangle, ShieldAlert, Activity, Flame } from 'lucide-react';

export default function StatCards({ stats }) {
  const cards = [
    {
      title: "Total Emails Analyzed",
      value: (stats?.total_emails_analyzed || 14280).toLocaleString(),
      change: "+1,240 today",
      icon: Mail,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgGlow: "from-blue-500/10 to-transparent"
    },
    {
      title: "Safe Emails",
      value: (stats?.safe_emails || 11840).toLocaleString(),
      change: "82.9% Clean Ratio",
      icon: ShieldCheck,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      bgGlow: "from-emerald-500/10 to-transparent"
    },
    {
      title: "Suspicious Emails",
      value: (stats?.suspicious_emails || 1590).toLocaleString(),
      change: "Requires SOC Triage",
      icon: AlertTriangle,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgGlow: "from-amber-500/10 to-transparent"
    },
    {
      title: "Malicious Blocked",
      value: (stats?.malicious_emails || 850).toLocaleString(),
      change: "100% Mitigated",
      icon: ShieldAlert,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgGlow: "from-red-500/10 to-transparent"
    },
    {
      title: "Average Threat Score",
      value: `${stats?.avg_threat_score || 28.4}`,
      change: "Low-Risk Baseline",
      icon: Activity,
      color: "text-cyan-400",
      borderColor: "border-cyan-500/30",
      bgGlow: "from-cyan-500/10 to-transparent"
    },
    {
      title: "Critical Alerts",
      value: `${stats?.active_critical_alerts || 14}`,
      change: "Active Escalations",
      icon: Flame,
      color: "text-orange-400",
      borderColor: "border-orange-500/30",
      bgGlow: "from-orange-500/10 to-transparent"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`p-4 rounded-xl bg-[#0a1226]/80 border ${c.borderColor} bg-gradient-to-b ${c.bgGlow} relative overflow-hidden flex flex-col justify-between shadow-lg group hover:scale-[1.02] transition-transform`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider truncate">
                  {c.title}
                </span>
                <Icon className={`w-4 h-4 ${c.color} shrink-0`} />
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-slate-100">
                {c.value}
              </div>
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-400 truncate">
              {c.change}
            </div>
          </div>
        );
      })}
    </div>
  );
}
