import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, Bug, CheckCircle2, XCircle, AlertTriangle, Layers, Activity } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';
import { scanVirusTotal } from '../../services/api';

export default function VirusTotalScanner() {
  const [queryInput, setQueryInput] = useState('https://secure-micros0ft-portal.top/auth/verify-login');
  const [queryType, setQueryType] = useState('auto');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (e) => {
    e?.preventDefault();
    if (!queryInput.trim()) return;
    setLoading(true);
    try {
      const res = await scanVirusTotal(queryInput.trim(), queryType);
      setScanResult(res);
    } finally {
      setLoading(false);
    }
  };

  const isMalicious = scanResult && scanResult.positives > 0;

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bug className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">VirusTotal Multi-Engine Intelligence Scanner</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              72 SECURITY VENDORS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Direct IoC scanner for URLs, Domains, IPs, and SHA-256 File Hashes with multi-engine security vendor verdict.
          </p>
        </div>

        {scanResult && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
              <span className="text-slate-400">Detection Ratio: </span>
              <span className={isMalicious ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                {scanResult.detection_ratio}
              </span>
            </div>
            <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
              <span className="text-slate-400">Reputation: </span>
              <span className={scanResult.reputation_score < 0 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                {scanResult.reputation_score}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Search Form */}
      <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800 space-y-3">
        <form onSubmit={handleScan} className="flex flex-wrap gap-2">
          <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="auto">Auto-Detect</option>
            <option value="url">URL</option>
            <option value="domain">Domain</option>
            <option value="ip">IP Address</option>
            <option value="hash">File Hash (SHA-256)</option>
          </select>

          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Enter URL, Domain, IP, or SHA-256 Hash to scan..."
            className="flex-1 min-w-[280px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono text-xs font-bold transition-all shadow-cyan-glow cursor-pointer"
          >
            {loading ? "SCANNING VENDORS..." : "SCAN ARTIFACT"}
          </button>
        </form>

        {/* Preset quick test buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-400 pt-1">
          <span>Quick Samples:</span>
          <button 
            type="button" 
            onClick={() => { setQueryInput('https://secure-micros0ft-portal.top/auth/login'); setQueryType('url'); }} 
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300"
          >
            M365 Phishing URL
          </button>
          <button 
            type="button" 
            onClick={() => { setQueryInput('185.220.101.5'); setQueryType('ip'); }} 
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300"
          >
            Tor Node IP
          </button>
          <button 
            type="button" 
            onClick={() => { setQueryInput('4b7f8c2e9124a91bf01290384759283746182948291048572918374928174928'); setQueryType('hash'); }} 
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300"
          >
            Macro Hash
          </button>
          <button 
            type="button" 
            onClick={() => { setQueryInput('microsoft.com'); setQueryType('domain'); }} 
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300"
          >
            Clean Microsoft Domain
          </button>
        </div>
      </div>

      {/* Results View */}
      {scanResult && (
        <div className="space-y-4">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              isMalicious ? 'bg-red-950/20 border-red-500/40' : 'bg-emerald-950/20 border-emerald-500/40'
            }`}>
              <span className="text-slate-400 text-[10px] uppercase">Vendor Detections</span>
              <div className="text-2xl font-bold font-mono my-1" style={{ color: isMalicious ? '#ef4444' : '#10b981' }}>
                {scanResult.detection_ratio}
              </div>
              <span className="text-[10px] text-slate-400">Security Engines Flagged</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-400 text-[10px] uppercase">Severity Level</span>
              <div className="my-1">
                <CyberBadge level={scanResult.threat_severity} text={scanResult.threat_severity} size="sm" />
              </div>
              <span className="text-[10px] text-slate-400">Threat Matrix Rating</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-400 text-[10px] uppercase">Community Consensus</span>
              <div className="flex items-center gap-3 my-1">
                <span className="text-emerald-400 font-bold">+{scanResult.community_votes?.harmless || 0} Clean</span>
                <span className="text-red-400 font-bold">-{scanResult.community_votes?.malicious || 0} Malicious</span>
              </div>
              <span className="text-[10px] text-slate-400">Crowdsourced Votes</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-400 text-[10px] uppercase">Scan ID & Status</span>
              <div className="text-cyan-300 font-bold my-1 truncate">{scanResult.scan_id}</div>
              <span className="text-[10px] text-emerald-400 uppercase">{scanResult.status}</span>
            </div>
          </div>

          {/* Action recommendation */}
          <div className={`p-3.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
            isMalicious ? 'bg-red-950/30 border-red-500/40 text-red-300' : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Recommended Action: <strong>{scanResult.suggested_action}</strong></span>
            </div>
          </div>

          {/* Security Vendors Breakdown Grid */}
          <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3">
              Leading Antivirus & Threat Intelligence Vendor Verdicts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {scanResult.vendor_results && scanResult.vendor_results.map((v, idx) => {
                const isThreat = v.category === 'malicious';
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                      isThreat 
                        ? 'bg-red-950/25 border-red-500/40' 
                        : 'bg-slate-950/60 border-slate-850'
                    }`}
                  >
                    <div className="truncate">
                      <div className="text-slate-200 font-semibold truncate">{v.vendor_name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">{v.result}</div>
                    </div>
                    <div className="shrink-0">
                      {isThreat ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                          MALICIOUS
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          CLEAN
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
