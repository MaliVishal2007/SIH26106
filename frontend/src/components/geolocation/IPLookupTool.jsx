import React, { useState } from 'react';
import { Search, Globe, ShieldAlert, ShieldCheck, Server, AlertTriangle } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';
import { lookupIP } from '../../services/api';

export default function IPLookupTool() {
  const [ipInput, setIpInput] = useState('185.220.101.5');
  const [ipData, setIpData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e) => {
    e?.preventDefault();
    if (!ipInput.trim()) return;
    setLoading(true);
    try {
      const data = await lookupIP(ipInput.trim());
      setIpData(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-xl bg-[#0a1226]/80 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-2">
            <Search className="w-4 h-4" />
            IP Address Intelligence Lookup (GeoLite2 & IPinfo Integration)
          </h3>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Query Autonomous System Numbers (ASN), ISP infrastructure, Tor exit relays, and abuse confidence.
          </p>
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleLookup} className="flex gap-2">
        <input
          type="text"
          value={ipInput}
          onChange={(e) => setIpInput(e.target.value)}
          placeholder="Enter IPv4 or IPv6 address (e.g. 185.220.101.5)..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition-all"
        >
          {loading ? "QUERYING..." : "QUERY GEOLITE2"}
        </button>
      </form>

      {/* Results Display */}
      {ipData && (
        <div className="pt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
            <span className="text-slate-400 block text-[10px]">Geographic Location:</span>
            <span className="text-slate-100 font-bold">{ipData.city}, {ipData.country}</span>
            <div className="text-[10px] text-slate-400 mt-1">Region: {ipData.region || "N/A"}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
            <span className="text-slate-400 block text-[10px]">ISP & ASN Provider:</span>
            <span className="text-cyan-300 font-bold">{ipData.asn}</span>
            <div className="text-[10px] text-slate-400 mt-1 truncate">{ipData.isp}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
            <span className="text-slate-400 block text-[10px]">GPS Coordinates:</span>
            <span className="text-slate-200 font-bold">{ipData.latitude}, {ipData.longitude}</span>
            <div className="text-[10px] text-slate-400 mt-1">Timezone: {ipData.timezone || "UTC"}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-850">
            <span className="text-slate-400 block text-[10px]">Threat Classification:</span>
            <div className="flex items-center gap-2 mt-1">
              <CyberBadge level={ipData.threat_reputation} text={ipData.threat_reputation} size="xs" />
              <span className="text-red-400 font-bold">{ipData.abuse_confidence_score}% Abuse</span>
            </div>
          </div>

          {/* Additional Flags */}
          <div className="col-span-full flex flex-wrap gap-2 pt-1">
            {ipData.is_tor_exit_node && (
              <span className="px-2 py-1 rounded bg-red-950/40 text-red-300 border border-red-500/40 text-[10px]">
                🚨 Confirmed Tor Exit Relay
              </span>
            )}
            {ipData.is_vpn && (
              <span className="px-2 py-1 rounded bg-orange-950/40 text-orange-300 border border-orange-500/40 text-[10px]">
                🔒 Commercial VPN Endpoint
              </span>
            )}
            {ipData.is_proxy && (
              <span className="px-2 py-1 rounded bg-amber-950/40 text-amber-300 border border-amber-500/40 text-[10px]">
                🌐 Open Proxy Node
              </span>
            )}
            {ipData.registered_threat_actor && (
              <span className="px-2 py-1 rounded bg-purple-950/40 text-purple-300 border border-purple-500/40 text-[10px]">
                💀 Linked Actor: {ipData.registered_threat_actor}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
