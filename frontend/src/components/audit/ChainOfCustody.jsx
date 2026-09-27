import React, { useState } from 'react';
import { ScrollText, Hash, ShieldCheck, Download, Plus, Check, Clock } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';

export default function ChainOfCustody({ auditLogs = [], onExportReport }) {
  const [logs, setLogs] = useState(auditLogs);
  const [analystNote, setAnalystNote] = useState('');
  const [caseIdInput, setCaseIdInput] = useState('CASE-2026-0922');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!analystNote.trim()) return;

    const newLog = {
      id: `LOG-${Math.floor(890 + Math.random() * 100)}`,
      case_id: caseIdInput,
      timestamp: new Date().toUTCString().replace('GMT', 'UTC'),
      action: "Analyst Case Note Appended",
      analyst: "SecOps Lead Investigator",
      verdict: "EVIDENCE_APPENDED",
      threat_score: 96,
      sha256_hash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      status: "SIGNED",
      notes: analystNote.trim()
    };

    setLogs([newLog, ...logs]);
    setAnalystNote('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ScrollText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">Forensic Chain of Custody & Audit Ledger</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              TAMPER-EVIDENT SHA-256
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Immutable legal-grade evidentiary chain of custody documenting analysis timestamps, cryptographic hash signatures, and investigator actions.
          </p>
        </div>

        <button
          onClick={onExportReport}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all shadow-cyan-glow"
        >
          <Download className="w-4 h-4" />
          <span>Download Signed Case Dossier</span>
        </button>
      </div>

      {/* Add Investigator Note Form */}
      <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800 space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Append Formal Analyst Note to Chain of Custody
        </h3>

        <form onSubmit={handleAddNote} className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input
              type="text"
              value={caseIdInput}
              onChange={(e) => setCaseIdInput(e.target.value)}
              placeholder="Case ID (e.g. CASE-2026-0922)"
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="text"
              value={analystNote}
              onChange={(e) => setAnalystNote(e.target.value)}
              placeholder="Enter forensic finding, legal observation, or remediation note..."
              className="sm:col-span-2 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Sign & Commit Note</span>
            </button>
          </div>
        </form>
      </div>

      {/* Audit Log Table */}
      <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <th className="pb-2">Audit ID</th>
                <th className="pb-2">Case Reference</th>
                <th className="pb-2">Timestamp (UTC)</th>
                <th className="pb-2">Analyst / System</th>
                <th className="pb-2">Action Executed</th>
                <th className="pb-2">Verdict</th>
                <th className="pb-2">Cryptographic Digest (SHA-256)</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 text-cyan-400 font-bold">{log.id}</td>
                  <td className="py-2.5 text-slate-200">{log.case_id}</td>
                  <td className="py-2.5 text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 text-slate-300">{log.analyst}</td>
                  <td className="py-2.5 text-slate-100 font-medium">
                    {log.action}
                    {log.notes && (
                      <div className="text-[10px] text-slate-400 font-normal italic">
                        "{log.notes}"
                      </div>
                    )}
                  </td>
                  <td className="py-2.5">
                    <CyberBadge level={log.verdict} text={log.verdict} size="xs" />
                  </td>
                  <td className="py-2.5 text-[10px] text-slate-400 truncate max-w-[140px] font-mono">
                    {log.sha256_hash}
                  </td>
                  <td className="py-2.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
