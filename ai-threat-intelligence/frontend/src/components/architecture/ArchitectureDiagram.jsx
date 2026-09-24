import React from 'react';
import { Cpu, ArrowDown, Database, Server, Globe2, ShieldAlert, Layers, Terminal, Sparkles } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';

export default function ArchitectureDiagram() {
  const layers = [
    {
      step: "Layer 1: Modern Presentation Tier",
      title: "React.js + Tailwind CSS",
      icon: Layers,
      color: "from-cyan-500/20 to-blue-500/10",
      borderColor: "border-cyan-400/40",
      tag: "FRONTEND TIER",
      features: [
        "Dark Modern SOC / SIEM Layout with Cyber Accents",
        "Interactive 7-Step Pipeline Stepper (Page 3)",
        "Canvas & SVG Neo4j Force-Directed Knowledge Graph Visualizer",
        "Geospatial Threat Map with Vector Landmasses & Attack Arcs",
        "Real-Time Threat Score Gauges, Radar Animations & Dossier Exporter"
      ]
    },
    {
      step: "Layer 2: Enterprise API & Forensic Ingestion",
      title: "Python FastAPI / Uvicorn Service Engine",
      icon: Server,
      color: "from-blue-600/20 to-indigo-600/10",
      borderColor: "border-blue-400/40",
      tag: "REST API & ORCHESTRATION",
      features: [
        "RFC 822 / MIME Email Stream Dissection & Tokenization",
        "SPF, DKIM, and DMARC Verification & Alignment Engine",
        "Domain Age, WHOIS, and Typosquatting Lexical Detector",
        "Multi-Factor Bayesian Risk Scoring Engine (0 to 100)",
        "Automated SOC Mitigation Playbooks (M365, Firewall, DNS Sinkhole)"
      ]
    },
    {
      step: "Layer 3: Neural AI / ML Classification",
      title: "Hugging Face Transformers + PyTorch",
      icon: Cpu,
      color: "from-purple-600/20 to-pink-600/10",
      borderColor: "border-purple-400/40",
      tag: "AI / ML INFERENCE",
      features: [
        "Fine-Tuned RoBERTa-Security Neural Language Architecture",
        "Multi-Label Classification: Credential Harvesting & Financial BEC",
        "Social Engineering Detection: Coercive Urgency & Impersonation",
        "Explainable AI (XAI) Salience Token Attribution Weights",
        "Natural Language Forensic Rationale Generation for SOC Analysts"
      ]
    },
    {
      step: "Layer 4: Relational & Graph Intelligence Data Stores",
      title: "PostgreSQL + Neo4j Graph Database",
      icon: Database,
      color: "from-emerald-600/20 to-teal-600/10",
      borderColor: "border-emerald-400/40",
      tag: "DATA PERSISTENCE & TOPOLOGY",
      features: [
        "PostgreSQL / SQLite: Tamper-Evident SHA-256 Audit Log & Case Storage",
        "Neo4j: Knowledge Graph Linking Email → Sender → Domain → IP → URL → Campaign",
        "Cypher Query Traversal for APT Actor Attribution (FIN7, Lazarus, TA505)",
        "Zero-Config In-Memory Fallback Engine for Immediate Turnkey Demos"
      ]
    },
    {
      step: "Layer 5: External Threat Feeds & Geolocation",
      title: "GeoLite2 + IPinfo API + VirusTotal (72 AV Engines)",
      icon: Globe2,
      color: "from-amber-600/20 to-orange-600/10",
      borderColor: "border-amber-400/40",
      tag: "EXTERNAL INTELLIGENCE",
      features: [
        "MaxMind GeoLite2 & IPinfo: City, Country, ISP, ASN & Tor Exit Node Detection",
        "VirusTotal v3 API: Multi-Vendor IoC Scanning for URLs, IPs, and Hashes",
        "Reputation Scoring & Community Consensus Tracking",
        "Hybrid API Support: Live HTTP Requests with Built-In High-Fidelity Simulation"
      ]
    },
    {
      step: "Layer 6: Tactical SOC Defense Deliverable",
      title: "Threat Intelligence & Forensic SOC Dashboard",
      icon: ShieldAlert,
      color: "from-red-600/20 to-rose-600/10",
      borderColor: "border-red-400/40",
      tag: "SOC OPERATIONAL OUTCOME",
      features: [
        "Comprehensive Incident Case Dossier with Cryptographic Proof",
        "Printable & Downloadable Forensic PDF/JSON Reports",
        "One-Click Automated Containment Execution across Enterprise Gateways",
        "Full SIH 2026 Problem Statement Compliance"
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">Technical Architecture (Smart India Hackathon 2026)</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              PAGE 3 SPECIFICATION
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            System architectural flow mapping from ingestion frontend down through PyTorch AI models, databases, and external threat sensors.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-3 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold">
            6 Enterprise Tiers
          </span>
        </div>
      </div>

      {/* Vertical Staged Diagram */}
      <div className="max-w-4xl mx-auto space-y-3 py-2">
        {layers.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <React.Fragment key={idx}>
              <div className={`p-5 rounded-xl border bg-gradient-to-r ${layer.color} ${layer.borderColor} backdrop-blur-md shadow-xl transition-all hover:scale-[1.01]`}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/20 flex items-center justify-center text-cyan-300 shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                        {layer.step}
                      </div>
                      <h3 className="text-base font-bold text-slate-100">
                        {layer.title}
                      </h3>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold tracking-wider bg-black/40 text-cyan-300 border border-cyan-500/30">
                    {layer.tag}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
                  {layer.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-slate-300">
                      <span className="text-cyan-400 font-bold shrink-0">▸</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting arrow between tiers */}
              {idx < layers.length - 1 && (
                <div className="flex justify-center my-1">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-cyan-glow">
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
