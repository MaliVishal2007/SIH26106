import React from 'react';
import { KeyRound, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';

export default function Step2AuthCheckView({ data }) {
  if (!data) return null;

  const authCards = [
    {
      name: "SPF (Sender Policy Framework)",
      abbr: "SPF",
      status: data.spf_status,
      details: data.spf_details,
      technical: [
        { label: "Client IP Evaluated", value: data.spf_ip || "185.220.101.5" },
        { label: "Target Domain", value: data.spf_domain || "unknown.com" }
      ],
      description: "Verifies whether the originating mail server's IP address is explicitly authorized by the sender domain's DNS TXT record."
    },
    {
      name: "DKIM (DomainKeys Identified Mail)",
      abbr: "DKIM",
      status: data.dkim_status,
      details: data.dkim_details,
      technical: [
        { label: "Key Selector", value: data.dkim_selector || "none" },
        { label: "Signing Domain", value: data.dkim_domain || "none" }
      ],
      description: "Validates the digital cryptographic RSA/Ed25519 signature embedded in the email header to prove the content was not altered."
    },
    {
      name: "DMARC (Domain-based Authentication)",
      abbr: "DMARC",
      status: data.dmarc_status,
      details: data.dmarc_details,
      technical: [
        { label: "Enforced Policy", value: data.dmarc_policy ? `p=${data.dmarc_policy}` : "p=none" },
        { label: "Alignment Mode", value: "Strict Identifier Alignment" }
      ],
      description: "Enforces domain alignment between the 'From' header and SPF/DKIM verification results with automated drop/quarantine policies."
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <KeyRound className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Step 2: Authentication Check</h3>
            <CyberBadge 
              level={data.overall_auth_verdict} 
              text={`OVERALL: ${data.overall_auth_verdict}`} 
              size="sm" 
            />
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Cryptographic validation of SPF, DKIM, and DMARC headers against authoritative DNS records.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">SOC Alignment: </span>
          <span className={data.overall_auth_verdict === 'PASS' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
            {data.overall_auth_verdict === 'PASS' ? 'TRUSTED SENDER IDENTITY' : 'SPOOFED / UNVERIFIED IDENTITY'}
          </span>
        </div>
      </div>

      {/* 3 Protocol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {authCards.map((card, idx) => {
          const isPass = card.status === 'PASS';
          const isWarning = card.status === 'SOFTFAIL' || card.status === 'WARNING';

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                isPass
                  ? 'bg-emerald-950/15 border-emerald-500/30'
                  : isWarning
                  ? 'bg-amber-950/15 border-amber-500/30'
                  : 'bg-red-950/20 border-red-500/40 shadow-red-glow/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-200">{card.name}</span>
                  <CyberBadge level={card.status} text={card.status} size="xs" />
                </div>

                <p className="text-[11px] text-slate-400 mb-3">{card.description}</p>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono mb-3">
                  <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    {isPass ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span>Diagnostic Result:</span>
                  </div>
                  <div className={`text-[11px] leading-relaxed ${isPass ? 'text-emerald-300/90' : 'text-red-300/90'}`}>
                    {card.details}
                  </div>
                </div>
              </div>

              {/* Technical details table */}
              <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono space-y-1">
                {card.technical.map((t, tIdx) => (
                  <div key={tIdx} className="flex items-center justify-between text-slate-400">
                    <span>{t.label}:</span>
                    <span className="text-slate-200 font-semibold truncate max-w-[140px]">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
