import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  Lock, 
  Ban, 
  Globe, 
  RotateCcw, 
  Check, 
  FileText, 
  AlertOctagon, 
  Share2 
} from 'lucide-react';
import CyberBadge from '../common/CyberBadge';

export default function Step7SOCResultsView({ data, onExportReport }) {
  if (!data) return null;

  const { case_id, threat_score, risk_level, confidence_score, attack_type, executive_summary, technical_explanation, recommended_actions, sha256_hash } = data;

  const [actionsState, setActionsState] = useState(
    (recommended_actions || []).reduce((acc, act) => {
      acc[act.id] = act.status || 'PENDING';
      return acc;
    }, {})
  );

  const handleExecuteAction = (actionId) => {
    setActionsState(prev => ({
      ...prev,
      [actionId]: 'EXECUTED'
    }));
  };

  const isCritical = risk_level === 'CRITICAL' || threat_score >= 85;

  return (
    <div className="space-y-4">
      {/* Top Banner with Threat Verdict */}
      <div className={`p-5 rounded-xl border ${
        isCritical 
          ? 'bg-red-950/30 border-red-500/40 shadow-red-glow/20' 
          : threat_score >= 50
          ? 'bg-amber-950/20 border-amber-500/40'
          : 'bg-emerald-950/20 border-emerald-500/40 shadow-green-glow/20'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isCritical ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {isCritical ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  Step 7: Final Forensic Diagnosis
                </span>
                <CyberBadge level={risk_level} text={risk_level} size="xs" />
              </div>
              <h2 className="text-lg font-bold text-slate-100 mt-0.5">
                {attack_type}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExportReport}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold transition-all shadow-cyan-glow"
            >
              <Download className="w-4 h-4" />
              <span>Export Forensic Case Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Executive Summary & Technical Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Executive Summary */}
        <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800 space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            Executive Security Briefing
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {executive_summary}
          </p>
          <div className="pt-2 text-[11px] font-mono text-slate-400">
            Case Identifier: <span className="text-cyan-300 font-bold">{case_id}</span>
          </div>
        </div>

        {/* Technical Explanation */}
        <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800 space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <AlertOctagon className="w-3.5 h-3.5" />
            Technical Forensic Justification
          </h4>
          <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap bg-slate-950 p-3 rounded border border-slate-850 leading-relaxed">
            {technical_explanation}
          </pre>
        </div>
      </div>

      {/* Automated SOC Remediation Playbook */}
      <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            Recommended SOC Automated Mitigation Playbook
          </h4>
          <span className="text-[10px] font-mono text-slate-400">
            Interactive Enforcement API Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommended_actions && recommended_actions.map((act) => {
            const isExecuted = actionsState[act.id] === 'EXECUTED';
            return (
              <div
                key={act.id}
                className={`p-3.5 rounded-lg border flex flex-col justify-between transition-all ${
                  isExecuted
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                    : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200">{act.title}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      isExecuted 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}>
                      {isExecuted ? 'ENFORCED' : 'PENDING'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                    {act.description}
                  </p>
                  <div className="text-[10px] font-mono text-cyan-300/70 mb-3 truncate">
                    Target: {act.target}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-850 flex justify-end">
                  <button
                    onClick={() => handleExecuteAction(act.id)}
                    disabled={isExecuted}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                      isExecuted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-sm cursor-pointer'
                    }`}
                  >
                    {isExecuted ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>ACTION APPLIED</span>
                      </>
                    ) : (
                      <>
                        <Ban className="w-3.5 h-3.5" />
                        <span>EXECUTE REMEDIATION</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
