import React from 'react';
import { Info, ShieldAlert, KeyRound, Globe, Server, Hash, Layers, CheckCircle2 } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';

export default function NodeDetailDrawer({ selectedNode, onClose }) {
  if (!selectedNode) {
    return (
      <div className="h-[600px] p-5 rounded-xl bg-[#0a1226]/80 border border-slate-800 flex flex-col items-center justify-center text-center">
        <Layers className="w-10 h-10 text-slate-400 mb-3" />
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">Entity Inspection</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
          Select any node in the Neo4j graph canvas to inspect technical attributes, DNS records, and threat actor correlations.
        </p>
      </div>
    );
  }

  const { id, label, type, risk_level, threat_score, properties } = selectedNode;

  return (
    <div className="h-[600px] p-4 rounded-xl bg-[#0a1226]/90 border border-cyan-500/30 flex flex-col justify-between overflow-y-auto">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-300 uppercase font-bold tracking-wider">
              {type} Entity Details
            </span>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-white text-xs font-mono px-2 py-0.5 rounded bg-slate-800">
              ✕
            </button>
          )}
        </div>

        {/* Node Title & Risk Badge */}
        <div>
          <h3 className="text-sm font-bold text-slate-100 break-all">{label}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <CyberBadge level={risk_level} text={risk_level} size="xs" />
            <span className="text-xs font-mono text-red-400 font-bold">
              Score: {threat_score}/100
            </span>
          </div>
        </div>

        {/* Technical Properties */}
        <div className="space-y-2 pt-2 text-xs font-mono">
          <div className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
            Telemetry Attributes:
          </div>

          <div className="p-2 rounded bg-slate-950 border border-slate-850">
            <span className="text-slate-400 block text-[10px]">Node Unique Identifier:</span>
            <span className="text-cyan-300 font-bold">{id}</span>
          </div>

          {properties && Object.entries(properties).map(([k, v], idx) => (
            <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-850">
              <span className="text-slate-400 block text-[10px] capitalize">{k.replace('_', ' ')}:</span>
              <span className="text-slate-200 break-all">{String(v)}</span>
            </div>
          ))}

          <div className="p-2 rounded bg-slate-950 border border-slate-850">
            <span className="text-slate-400 block text-[10px]">First Observed:</span>
            <span className="text-slate-300">2026-09-18 12:00:00 UTC</span>
          </div>

          <div className="p-2 rounded bg-slate-950 border border-slate-850">
            <span className="text-slate-400 block text-[10px]">Last Active Signature:</span>
            <span className="text-slate-300">2026-09-22 18:24:12 UTC</span>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <button
          onClick={() => alert(`Pivot search initiated for node ${label}`)}
          className="w-full py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all text-center block"
        >
          Pivot Query (Cypher MATCH)
        </button>
      </div>
    </div>
  );
}
