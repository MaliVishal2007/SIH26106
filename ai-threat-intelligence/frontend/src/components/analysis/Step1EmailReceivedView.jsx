import React from 'react';
import { Mail, Link2, Paperclip, Terminal, Globe, Server, Hash, ShieldAlert } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';

export default function Step1EmailReceivedView({ data, sha256Digest }) {
  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Step 1: Email Received & Dissected</h3>
            <CyberBadge level="SAFE" text={data.parsing_status} size="xs" />
          </div>
          <p className="text-xs text-slate-400 font-mono">
            RFC822 MIME parser extracted envelope headers, embedded URLs, attachments, and originating hop IP.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Links Found: </span>
            <span className="text-cyan-400 font-bold">{data.links_count}</span>
          </div>
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Attachments: </span>
            <span className="text-cyan-400 font-bold">{data.attachments_count}</span>
          </div>
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Origin IP: </span>
            <span className="text-cyan-400 font-bold">{data.originating_ip || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Dissected Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Message Envelope */}
        <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Server className="w-3.5 h-3.5" />
            Message Envelope Telemetry
          </h4>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="text-slate-400">From (Display & Address):</span>
              <div className="text-slate-200 bg-slate-950/80 p-2 rounded border border-slate-850 mt-1 break-all">
                {data.sender_name ? `"${data.sender_name}" <${data.sender}>` : data.sender}
              </div>
            </div>

            <div>
              <span className="text-slate-400">Subject:</span>
              <div className="text-slate-200 bg-slate-950/80 p-2 rounded border border-slate-850 mt-1 font-sans font-semibold">
                {data.subject}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400">Recipient (To):</span>
                <div className="text-slate-300 bg-slate-950/80 p-1.5 rounded border border-slate-850 mt-1 truncate">
                  {data.recipient}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Ingested At:</span>
                <div className="text-slate-300 bg-slate-950/80 p-1.5 rounded border border-slate-850 mt-1 truncate">
                  {data.date || '2026-09-22 18:24 UTC'}
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-400">Cryptographic Artifact Hash (SHA-256):</span>
              <div className="text-cyan-300/80 bg-slate-950/90 p-2 rounded border border-cyan-500/20 text-[11px] truncate flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{sha256Digest || "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Extracted URLs & Attachments */}
        <div className="space-y-4">
          {/* Extracted URLs */}
          <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2 mb-2">
              <Link2 className="w-3.5 h-3.5" />
              Extracted URLs & Hyperlinks ({data.links?.length || 0})
            </h4>

            {data.links && data.links.length > 0 ? (
              <div className="space-y-2">
                {data.links.map((link, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2.5 rounded-lg border text-xs font-mono ${
                      link.is_suspicious 
                        ? 'bg-red-950/20 border-red-500/30' 
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-200 font-bold truncate max-w-[280px]">
                        {link.url}
                      </span>
                      {link.is_suspicious ? (
                        <CyberBadge level="CRITICAL" text="FLAGGED MALICIOUS" size="xs" />
                      ) : (
                        <CyberBadge level="SAFE" text="CLEAN" size="xs" />
                      )}
                    </div>
                    {link.risk_factors && link.risk_factors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {link.risk_factors.map((rf, rIdx) => (
                          <span key={rIdx} className="px-1.5 py-0.5 rounded text-[10px] bg-red-900/40 text-red-300 border border-red-500/30">
                            {rf}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic font-mono p-3 bg-slate-950/50 rounded border border-slate-850">
                No external URLs detected in email body.
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2 mb-2">
              <Paperclip className="w-3.5 h-3.5" />
              Extracted Attachments ({data.attachments?.length || 0})
            </h4>

            {data.attachments && data.attachments.length > 0 ? (
              <div className="space-y-2">
                {data.attachments.map((att, idx) => (
                  <div key={idx} className={`p-2.5 rounded-lg border text-xs font-mono ${att.is_suspicious ? 'bg-red-950/20 border-red-500/30' : 'bg-slate-950/80 border-slate-800'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-100 font-bold">{att.filename}</span>
                      <CyberBadge level={att.is_suspicious ? "CRITICAL" : "SAFE"} text={att.is_suspicious ? "WEAPONIZED" : "BENIGN"} size="xs" />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Size: {(att.size_bytes / 1024).toFixed(1)} KB • Type: {att.content_type}
                    </div>
                    {att.risk_reason && (
                      <div className="text-[11px] text-red-400 mt-1 font-semibold">
                        ⚠ {att.risk_reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic font-mono p-3 bg-slate-950/50 rounded border border-slate-850">
                No attachments detected in this message.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
