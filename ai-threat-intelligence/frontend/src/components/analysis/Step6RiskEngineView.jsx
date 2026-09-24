import React from 'react';
import { Gauge, ShieldAlert, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import ThreatScoreGauge from '../common/ThreatScoreGauge';
import CyberBadge from '../common/CyberBadge';

export default function Step6RiskEngineView({ data }) {
  if (!data) return null;

  const { threat_score, risk_level, confidence_score, score_breakdown, evidence_list } = data;

  const scoreItems = [
    { label: "Authentication Check (SPF/DKIM)", value: score_breakdown?.authentication || 0, max: 25, color: "#ef4444" },
    { label: "Domain & Sender Reputation", value: score_breakdown?.domain_reputation || 0, max: 25, color: "#f97316" },
    { label: "AI Content & Intent NLP", value: score_breakdown?.ai_intent_content || 0, max: 30, color: "#a855f7" },
    { label: "Threat Feeds & IoC Matching", value: score_breakdown?.iocs_and_links || 0, max: 20, color: "#00f0ff" }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Step 6: Evidence & Risk Engine</h3>
            <CyberBadge level={risk_level} text={`${risk_level} SEVERITY`} size="xs" />
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Multi-source Bayesian evidence aggregation combining email protocol failures, domain anomalies, transformer scores, and IoC feeds.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Total Threat Score: </span>
            <span className="text-red-400 font-bold">{threat_score} / 100</span>
          </div>
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Model Confidence: </span>
            <span className="text-cyan-400 font-bold">{confidence_score}%</span>
          </div>
        </div>
      </div>

      {/* Score Overview & Weighting Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Big Circular Threat Score Gauge */}
        <div className="p-5 rounded-xl bg-[#0a1226]/90 border border-slate-800 flex flex-col items-center justify-center text-center">
          <ThreatScoreGauge score={threat_score} riskLevel={risk_level} size={200} />
          <div className="mt-3 text-xs text-slate-400 font-mono">
            Aggregate Composite Risk Index
          </div>
        </div>

        {/* Right: 4 Component Weight Breakdown */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0a1226]/90 border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3">
              Multi-Factor Evidence Contribution Matrix
            </h4>

            <div className="space-y-3">
              {scoreItems.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-bold" style={{ color: item.color }}>
                      {item.value} / {item.max} pts
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(item.value / item.max) * 100}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Algorithm: Weighted Deterministic Bayesian Fusion</span>
            <span className="text-cyan-400 font-bold">Sum: {threat_score} / 100</span>
          </div>
        </div>
      </div>

      {/* Itemized Evidence Table */}
      <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            Itemized Forensic Evidence Ledger ({evidence_list?.length || 0} Findings)
          </h4>
          <span className="text-[10px] font-mono text-slate-400">Chain-of-Custody Verified</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                <th className="pb-2">Evidence ID</th>
                <th className="pb-2">Stage & Category</th>
                <th className="pb-2">Finding Title</th>
                <th className="pb-2">Severity</th>
                <th className="pb-2">Score Impact</th>
                <th className="pb-2">Raw Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {evidence_list && evidence_list.length > 0 ? (
                evidence_list.map((ev, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 text-cyan-400 font-bold">{ev.id}</td>
                    <td className="py-2.5 text-slate-300">
                      <div className="text-slate-200">{ev.category}</div>
                      <div className="text-[10px] text-slate-400">{ev.stage}</div>
                    </td>
                    <td className="py-2.5 text-slate-200 font-semibold max-w-[240px]">
                      {ev.title}
                      <div className="text-[10px] text-slate-400 font-normal truncate">{ev.description}</div>
                    </td>
                    <td className="py-2.5">
                      <CyberBadge level={ev.severity} text={ev.severity} size="xs" />
                    </td>
                    <td className="py-2.5 text-red-400 font-bold">+{ev.weight} pts</td>
                    <td className="py-2.5 text-slate-400 text-[10px] max-w-[200px] truncate">
                      {ev.raw_proof || "Telemetry verified"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-slate-400 italic">
                    No threat evidence items recorded. Message conforms to verified safe profiles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
