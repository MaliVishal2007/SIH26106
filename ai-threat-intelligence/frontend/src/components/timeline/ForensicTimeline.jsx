import React from 'react';
import { History, Clock, CheckCircle2, AlertTriangle, ShieldAlert, Cpu, Globe, KeyRound } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';

export default function ForensicTimeline({ events = [] }) {
  const defaultEvents = [
    { id: "TL-01", stage: "Ingestion", title: "Inbound SMTP Packet Ingestion", description: "Perimeter Mail Gateway accepted connection from remote relay (185.220.101.5)", timestamp: "2026-09-22 18:20:11.102 UTC", status: "INFO", latency_ms: 12, icon: Globe },
    { id: "TL-02", stage: "Dissection", title: "RFC822 Parsing & Hyperlink Extraction", description: "MIME parser dissected envelope, payload, and isolated 1 credential URL (https://secure-micros0ft-portal.top)", timestamp: "2026-09-22 18:20:11.185 UTC", status: "INFO", latency_ms: 83, icon: Clock },
    { id: "TL-03", stage: "Authentication", title: "SPF Softfail & DKIM Signature Failure", description: "Originating IP 185.220.101.5 not authorized by SPF; DKIM RSA-SHA256 signature mismatch detected", timestamp: "2026-09-22 18:20:11.240 UTC", status: "DANGER", latency_ms: 55, icon: KeyRound },
    { id: "TL-04", stage: "Domain WHOIS", title: "Domain Age Anomaly Identified (4 Days)", description: "Registered under Namecheap Inc on 2026-09-18 with brand mimicry targeting 'Microsoft'", timestamp: "2026-09-22 18:20:11.450 UTC", status: "WARNING", latency_ms: 210, icon: Globe },
    { id: "TL-05", stage: "AI Inference", title: "RoBERTa-Security Credential Alarm (94.2%)", description: "Neural NLP transformer classified high-urgency credential harvesting intent designed to capture passwords", timestamp: "2026-09-22 18:20:11.890 UTC", status: "DANGER", latency_ms: 440, icon: Cpu },
    { id: "TL-06", stage: "Threat Feeds", title: "VirusTotal IoC Multi-Vendor Alert (58/72)", description: "Extracted phishing link flagged by CrowdStrike Falcon, Kaspersky, SentinelOne, and Microsoft Defender", timestamp: "2026-09-22 18:20:12.310 UTC", status: "DANGER", latency_ms: 420, icon: ShieldAlert },
    { id: "TL-07", stage: "Graph Attribution", title: "Neo4j Knowledge Graph Attributed to FIN7", description: "Relational cluster linked domain infrastructure to known FIN7 / Carbanak spear phishing campaign", timestamp: "2026-09-22 18:20:12.600 UTC", status: "DANGER", latency_ms: 290, icon: ShieldAlert },
    { id: "TL-08", stage: "SOC Playbook", title: "Automated Incident Mitigation Executed", description: "Quarantined email in Microsoft 365, blocked 185.220.101.5 on perimeter firewall, and sinkholed domain", timestamp: "2026-09-22 18:20:12.980 UTC", status: "SUCCESS", latency_ms: 380, icon: CheckCircle2 }
  ];

  const items = events && events.length > 0 ? events : defaultEvents;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">Chronological Forensic Attack Timeline</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              MICROSECOND TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Detailed chronological execution sequence across SMTP ingestion, protocol verification, AI inference, and automated containment.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Total Lifecycle: </span>
            <span className="text-cyan-400 font-bold">1,878 ms</span>
          </div>
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Events Recorded: </span>
            <span className="text-emerald-400 font-bold">{items.length} Milestones</span>
          </div>
        </div>
      </div>

      {/* Chronological Timeline Container */}
      <div className="p-6 rounded-xl bg-[#0a1226]/80 border border-slate-800 relative">
        {/* Vertical glowing spine */}
        <div className="absolute left-10 top-8 bottom-8 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500 opacity-30 hidden md:block" />

        <div className="space-y-6">
          {items.map((ev, idx) => {
            const isDanger = ev.status === 'DANGER';
            const isWarning = ev.status === 'WARNING';
            const isSuccess = ev.status === 'SUCCESS';

            let iconBg = 'bg-slate-900 border-slate-700 text-slate-300';
            let cardBorder = 'border-slate-800 bg-slate-950/70';

            if (isDanger) {
              iconBg = 'bg-red-950 border-red-500 text-red-400 shadow-red-glow/20';
              cardBorder = 'border-red-500/40 bg-red-950/15 shadow-red-glow/10';
            } else if (isWarning) {
              iconBg = 'bg-amber-950 border-amber-500 text-amber-400';
              cardBorder = 'border-amber-500/40 bg-amber-950/15';
            } else if (isSuccess) {
              iconBg = 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-green-glow/20';
              cardBorder = 'border-emerald-500/30 bg-emerald-950/15';
            }

            return (
              <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center gap-4 group">
                {/* Milestone Node */}
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${iconBg}`}>
                  <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                </div>

                {/* Event Card */}
                <div className={`flex-1 p-4 rounded-xl border transition-all ${cardBorder}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        [{ev.stage}]
                      </span>
                      <h4 className="text-xs font-bold text-slate-100">
                        {ev.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {ev.timestamp}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        +{ev.latency_ms} ms
                      </span>
                      <CyberBadge level={ev.status} text={ev.status} size="xs" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {ev.description}
                  </p>

                  {ev.metadata && Object.keys(ev.metadata).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-850">
                      {Object.entries(ev.metadata).map(([k, v], mIdx) => (
                        <span key={mIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-slate-400">
                          {k}: <strong className="text-slate-200">{String(v)}</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
