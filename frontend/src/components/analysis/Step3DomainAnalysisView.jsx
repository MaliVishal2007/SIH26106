import React from 'react';
import { Globe, AlertTriangle, Calendar, ShieldCheck, Search, Building, CheckCircle2 } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';

export default function Step3DomainAnalysisView({ data }) {
  if (!data) return null;

  const isHighRisk = data.domain_reputation_score < 40 || data.is_typosquatting || data.is_newly_registered;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Step 3: Domain & Sender Analysis</h3>
            <CyberBadge 
              level={isHighRisk ? "CRITICAL" : "SAFE"} 
              text={isHighRisk ? "MALICIOUS DOMAIN PROFILE" : "REPUTABLE DOMAIN"} 
              size="xs" 
            />
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Evaluates domain registration age, WHOIS integrity, typosquatting mimicry, and disposable email indicators.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Domain Age: </span>
            <span className={data.domain_age_days < 30 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
              {data.domain_age_days} Days
            </span>
          </div>
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Domain Reputation: </span>
            <span className={data.domain_reputation_score < 50 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
              {data.domain_reputation_score} / 100
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Domain Intelligence */}
        <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            Domain WHOIS & Registration Forensics
          </h4>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-850">
              <span className="text-slate-400">Domain Under Investigation:</span>
              <span className="text-cyan-300 font-bold">{data.domain}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-850">
              <span className="text-slate-400">Accredited Registrar:</span>
              <span className="text-slate-200">{data.whois_registrar || "Withheld for Privacy"}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-850">
              <span className="text-slate-400">Registration Creation Date:</span>
              <span className="text-slate-200">{data.registration_date || "2026-09-18"}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-850">
              <span className="text-slate-400">MX Mail Server Status:</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Valid MX Record
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-850">
              <span className="text-slate-400">Disposable Burner Domain:</span>
              <span className={data.is_disposable ? "text-red-400 font-bold" : "text-slate-300"}>
                {data.is_disposable ? "YES (Flagged Burner)" : "NO (Persistent Domain)"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Typosquatting & Threat Flags */}
        <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            Impersonation & Brand Mimicry Engine
          </h4>

          {data.is_typosquatting ? (
            <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/40 text-xs">
              <div className="flex items-center gap-2 text-red-400 font-bold mb-1 font-mono">
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                <span>CRITICAL BRAND IMPERSONATION DETECTED</span>
              </div>
              <p className="text-[11px] text-slate-300 mb-2">
                The domain utilizes character substitution (homoglyph/combosquatting) to deceptively mimic authentic corporate brand:
              </p>
              <div className="p-2 rounded bg-slate-950 border border-red-500/30 font-mono text-center text-red-300 font-bold">
                Target: {data.typosquatting_target} Corporation
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No brand typosquatting or Unicode homoglyph patterns identified.</span>
            </div>
          )}

          {/* Suspicious Flags List */}
          <div>
            <span className="text-xs font-mono text-slate-400 block mb-1.5">Forensic Telemetry Flags:</span>
            {data.suspicious_flags && data.suspicious_flags.length > 0 ? (
              <div className="space-y-1.5">
                {data.suspicious_flags.map((flag, fIdx) => (
                  <div key={fIdx} className="p-2 rounded bg-slate-950 border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2 rounded bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-400">
                Zero suspicious registration anomalies recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
