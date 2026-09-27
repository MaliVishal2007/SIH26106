import React from 'react';
import { Search, ExternalLink, ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';

export default function RecentInvestigations({ investigations = [], onSelectCase }) {
  return (
    <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400">
          Recent Forensic Case Investigations
        </h3>
        <span className="text-[10px] font-mono text-slate-400">PostgreSQL / Neo4j Synced</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
              <th className="pb-2">Case ID</th>
              <th className="pb-2">Subject Line</th>
              <th className="pb-2">Sender Address</th>
              <th className="pb-2">Risk</th>
              <th className="pb-2">Threat Score</th>
              <th className="pb-2">Status</th>
              <th className="pb-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {investigations && investigations.map((inv, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-2.5 text-cyan-400 font-bold">{inv.case_id}</td>
                <td className="py-2.5 text-slate-200 font-semibold max-w-[240px] truncate">
                  {inv.subject}
                </td>
                <td className="py-2.5 text-slate-400 max-w-[180px] truncate">
                  {inv.sender}
                </td>
                <td className="py-2.5">
                  <CyberBadge level={inv.risk} text={inv.risk} size="xs" />
                </td>
                <td className="py-2.5 text-slate-200 font-bold">
                  {inv.score}/100
                </td>
                <td className="py-2.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${
                    inv.status === 'MITIGATED' || inv.status === 'BLOCKED' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                    inv.status === 'INVESTIGATING' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <button
                    onClick={() => onSelectCase && onSelectCase(inv)}
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
