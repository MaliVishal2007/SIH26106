import React, { useState } from 'react';
import { Network, History, ShieldAlert, Users, Layers, ExternalLink, Info } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';

export default function Step5ForensicGraphView({ data, onOpenFullGraph }) {
  if (!data) return null;

  const [selectedNode, setSelectedNode] = useState(null);
  const nodes = data.mini_graph_nodes || [];
  const links = data.mini_graph_links || [];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Network className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Step 5: Forensic & Behavioral Analysis</h3>
            <CyberBadge 
              level={data.communication_anomaly_detected ? "CRITICAL" : "SAFE"} 
              text={data.communication_anomaly_detected ? "ANOMALY IDENTIFIED" : "NORMAL BASELINE"} 
              size="xs" 
            />
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Neo4j graph intelligence tracing relationships across Senders, Domains, IPs, URLs, Attachments, and Threat Actor Campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Previous Emails: </span>
            <span className="text-cyan-400 font-bold">{data.previous_communications_count}</span>
          </div>
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Cluster Size: </span>
            <span className="text-red-400 font-bold">{data.cluster_size} Nodes</span>
          </div>
        </div>
      </div>

      {/* Behavioral Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono">
          <span className="text-slate-400 block mb-1">Historical Relationship:</span>
          <span className={data.is_first_time_sender ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
            {data.is_first_time_sender ? "⚠️ FIRST-TIME EXTERNAL SENDER" : "✅ KNOWN COMMUNICATOR"}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono">
          <span className="text-slate-400 block mb-1">Campaign Linkage:</span>
          <span className="text-cyan-300 font-bold truncate block">
            {data.campaign_name || "Unassociated Campaign"}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono">
          <span className="text-slate-400 block mb-1">Attributed Threat Actor:</span>
          <span className="text-purple-400 font-bold truncate block">
            {data.known_threat_actor || "Unknown / Low Vol"}
          </span>
        </div>
      </div>

      {/* Neo4j Style Interactive Graph Visualizer Card */}
      <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800 relative">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5" />
            Neo4j Relationship Subgraph (Email → Sender → Domain → IP → URL → Campaign)
          </h4>
          {onOpenFullGraph && (
            <button
              onClick={onOpenFullGraph}
              className="px-2.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <span>Explore Dedicated Graph</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Graph Canvas / SVG Nodes */}
        <div className="w-full h-80 bg-slate-950/90 rounded-lg border border-slate-850 relative overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* SVG Connection Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Draw sample connecting lines between key hubs */}
            <line x1="20%" y1="50%" x2="40%" y2="25%" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="2" strokeDasharray="4 2" />
            <line x1="40%" y1="25%" x2="60%" y2="25%" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="2" />
            <line x1="60%" y1="25%" x2="80%" y2="50%" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
            <line x1="20%" y1="50%" x2="40%" y2="75%" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="2" />
            <line x1="40%" y1="75%" x2="60%" y2="75%" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="2" />
            <line x1="60%" y1="75%" x2="80%" y2="50%" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
          </svg>

          {/* Render Interactive Node Pins */}
          <div className="relative w-full h-full flex flex-wrap items-center justify-around z-10">
            {/* Node 1: Email */}
            <div 
              onClick={() => setSelectedNode({ label: "Analyzed Email", type: "email", details: "Inbound message with weaponized indicators" })}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-900/60 border-2 border-blue-400 flex items-center justify-center shadow-blue-glow group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold font-mono text-blue-200">EML</span>
              </div>
              <span className="text-[10px] font-mono text-slate-300 mt-1">Email Object</span>
            </div>

            {/* Node 2: Sender */}
            <div 
              onClick={() => setSelectedNode({ label: "Sender Identity", type: "sender", details: "Unverified external mail address" })}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-cyan-900/60 border-2 border-cyan-400 flex items-center justify-center shadow-cyan-glow group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold font-mono text-cyan-200">SND</span>
              </div>
              <span className="text-[10px] font-mono text-slate-300 mt-1">Sender</span>
            </div>

            {/* Node 3: Domain */}
            <div 
              onClick={() => setSelectedNode({ label: "Domain Infrastructure", type: "domain", details: "Newly minted combosquatted domain" })}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-red-900/60 border-2 border-red-500 flex items-center justify-center shadow-red-glow group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold font-mono text-red-200">DOM</span>
              </div>
              <span className="text-[10px] font-mono text-slate-300 mt-1">Domain</span>
            </div>

            {/* Node 4: IP Address */}
            <div 
              onClick={() => setSelectedNode({ label: "Originating IP", type: "ip", details: "Tor exit relay / bulletproof server" })}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-orange-900/60 border-2 border-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold font-mono text-orange-200">IP</span>
              </div>
              <span className="text-[10px] font-mono text-slate-300 mt-1">IP Relay</span>
            </div>

            {/* Node 5: Campaign */}
            <div 
              onClick={() => setSelectedNode({ label: "Attributed Campaign", type: "campaign", details: "Operation SilentHarvest (FIN7 Cluster)" })}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-purple-900/60 border-2 border-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold font-mono text-purple-200">APT</span>
              </div>
              <span className="text-[10px] font-mono text-slate-300 mt-1">Campaign</span>
            </div>
          </div>

          {/* Node inspect drawer */}
          {selectedNode && (
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-900/95 border border-cyan-500/40 rounded-lg z-20 flex items-center justify-between text-xs font-mono backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-100 font-bold">{selectedNode.label}:</span>
                <span className="text-slate-300">{selectedNode.details}</span>
              </div>
              <button 
                onClick={() => setSelectedNode(null)} 
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
              >
                ✕ Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
