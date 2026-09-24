import React from 'react';
import StatCards from '../components/dashboard/StatCards';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import AttackTimelineCard from '../components/dashboard/AttackTimelineCard';
import RecentInvestigations from '../components/dashboard/RecentInvestigations';
import ThreatScoreGauge from '../components/common/ThreatScoreGauge';
import { ShieldAlert, ArrowRight, Zap, Globe, Sparkles } from 'lucide-react';

export default function DashboardPage({ stats, onNavigateToAnalysis, onSelectCase }) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-slate-900 border border-cyan-500/25 shadow-xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-POWERED DEFENSE ARCHITECTURE • SIH 2026</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2">
            AI Threat Intelligence & Forensic Operations Center
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Autonomous email threat detection, GeoLocation origin tracing, and Neo4j relational forensic intelligence strictly implementing Page 3 of the Smart India Hackathon 2026 Technical Approach.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={onNavigateToAnalysis}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono text-xs font-bold transition-all shadow-cyan-glow cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>ANALYZE INBOUND EMAIL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-cyan-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 6 Key KPI Metric Cards */}
      <StatCards stats={stats} />

      {/* Main Grid: Alerts Stream & Vector Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAlerts 
          alerts={stats?.recent_alerts} 
          onInspectAlert={() => onNavigateToAnalysis && onNavigateToAnalysis()} 
        />
        <AttackTimelineCard stats={stats} />
      </div>

      {/* Recent Investigations Table */}
      <RecentInvestigations 
        investigations={stats?.recent_investigations} 
        onSelectCase={onSelectCase} 
      />
    </div>
  );
}
