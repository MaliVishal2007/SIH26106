import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Network, 
  Globe2, 
  FileSearch, 
  History, 
  ScrollText, 
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'SOC Dashboard', icon: LayoutDashboard },
    { id: 'analysis', label: '7-Step Analysis', icon: ShieldAlert },
    { id: 'graph', label: ' Threat Network ', icon: Network },
    { id: 'geolocation', label: 'Geo Threat Map', icon: Globe2 },
    { id: 'virustotal', label: 'VirusTotal Scanner', icon: FileSearch },
    { id: 'timeline', label: 'Attack Timeline', icon: History },
    { id: 'audit', label: 'Chain of Custody', icon: ScrollText }
  ];

  return (
    <aside className="w-64 bg-[#070d1e] border-r border-cyan-500/15 flex flex-col justify-between select-none shrink-0 min-h-screen">
      <div>
        {/* Brand header */}
        <div className="p-5 border-b border-cyan-500/15 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-500/30 to-blue-600/40 border border-cyan-400/40 flex items-center justify-center shadow-cyan-glow">
              <ShieldAlert className="w-5 h-5 text-cyan-300" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-sm bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-400 bg-clip-text text-transparent">
                AI THREAT INTEL
              </span>
            </div>
            <div className="text-[10px] font-mono text-cyan-400/70 tracking-widest uppercase">
              SIH 2026 • DEFENSE SOC
            </div>
          </div>
        </div>

        {/* System status pill */}
        <div className="mx-4 my-3 p-2.5 rounded-md bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-mono text-[11px] text-cyan-200">PIPELINE ENGINE</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            ACTIVE
          </span>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5">
          <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            Forensic Intelligence
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400'
                  }`} />
                  <span className="font-sans font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider ${
                      item.highlight 
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-cyan-500/15 bg-black/20 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="font-mono text-[10px]">SOC SENSOR v2.0</span>
          <span className="font-mono text-[10px] text-emerald-400">ONLINE</span>
        </div>
        <div className="text-[11px] text-slate-400 leading-tight">
          Smart India Hackathon 2026
          <div className="text-[10px] text-cyan-400/70 mt-0.5 font-mono">
            Problem: Email Forensics & GeoIntel
          </div>
        </div>
      </div>
    </aside>
  );
}
