import React, { useState, useEffect } from 'react';
import { ShieldAlert, Bell, Search, Terminal, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { MOCK_SCENARIOS } from '../../data/mockData';

export default function TopHeader({ onSelectScenario, currentThreatLevel = "HIGH", onRefresh }) {
  const [timeStr, setTimeStr] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#070d1e]/90 backdrop-blur-md border-b border-cyan-500/15 px-6 flex items-center justify-between z-20 sticky top-0">
      {/* Left: Search & Threat Readiness Level */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400 text-xs font-mono">
          <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
          <span className="font-bold tracking-wider">DEFCON 2</span>
          <span className="text-[10px] text-red-300/80">• ELEVATED THREAT LEVEL</span>
        </div>

        {/* Global Search */}
        <div className="relative w-80 hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search IoC, sender, domain, IP, or hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all font-mono"
          />
        </div>
      </div>

      {/* Right: Quick Scenario Loader, Clock & Analyst Badge */}
      <div className="flex items-center gap-3">
        {/* Preset scenario dropdown */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/60 border border-cyan-500/20 rounded-lg p-1">
          <span className="text-[10px] font-mono text-cyan-300/80 px-2 uppercase tracking-wider flex items-center gap-1">
            <Terminal className="w-3 h-3 text-cyan-400" />
            Quick Demo:
          </span>
          {MOCK_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => onSelectScenario && onSelectScenario(sc)}
              className="px-2 py-1 text-[11px] rounded bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-colors border border-transparent hover:border-cyan-500/30 truncate max-w-[130px]"
              title={sc.name}
            >
              {sc.id === 'scenario_m365_phish' ? 'M365 Phish' :
               sc.id === 'scenario_bec_wire' ? 'BEC Wire' :
               sc.id === 'scenario_macro_invoice' ? 'Macro XLSM' : 'Legit Clean'}
            </button>
          ))}
        </div>

        {/* UTC Clock */}
        <div className="hidden sm:flex flex-col text-right font-mono text-[11px] text-slate-400 bg-slate-900/50 px-3 py-1 rounded border border-slate-800">
          <span className="text-cyan-300 font-semibold">{timeStr || '2026-09-22 18:24:00 UTC'}</span>
          <span className="text-[9px] text-slate-400 uppercase tracking-widest">SOC OPERATIONAL CLOCK</span>
        </div>

        {/* Notification bell */}
        <button 
          onClick={onRefresh}
          className="relative p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all"
          title="Refresh Telemetry"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Analyst Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-cyan-glow">
            SA
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-200">SecOps Analyst</div>
            <div className="text-[10px] font-mono text-cyan-400">SOC Tier-3 Investigator</div>
          </div>
        </div>
      </div>
    </header>
  );
}
