import React from 'react';
import { AlertCircle, ShieldAlert, ArrowUpRight, Flame } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';

export default function RecentAlerts({ alerts = [], onInspectAlert }) {
  return (
    <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Live Threat Alert Stream
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Streaming
          </span>
        </div>

        <div className="space-y-2">
          {alerts && alerts.slice(0, 4).map((alt) => (
            <div
              key={alt.id}
              onClick={() => onInspectAlert && onInspectAlert(alt)}
              className="p-3 rounded-lg bg-slate-950/70 border border-slate-850 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between gap-3 group"
            >
              <div className="truncate">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {alt.type}
                  </span>
                  <CyberBadge level={alt.severity} text={alt.severity} size="xs" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  From: {alt.sender}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Target: <span className="text-slate-300">{alt.target}</span> • {alt.timestamp}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-mono font-bold text-red-400">
                  {alt.score}/100
                </div>
                <span className="text-[9px] font-mono text-cyan-400/80 group-hover:underline flex items-center gap-0.5 justify-end">
                  Inspect <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-850 text-center">
        <span className="text-[10px] font-mono text-slate-400">
          Showing 4 of 14 Active High-Priority Incidents
        </span>
      </div>
    </div>
  );
}
