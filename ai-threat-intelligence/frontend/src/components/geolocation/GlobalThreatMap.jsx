import React, { useState, useEffect, useRef } from 'react';
import { Globe, MapPin, ShieldAlert, Radio, Zap, Activity, AlertTriangle, Eye } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';

/* ─── Equirectangular projection ───────────────────────────────────────────── */
function project(lat, lon, W = 1000, H = 500) {
  const x = ((lon + 180) / 360) * W;
  const y = ((90 - lat) / 180) * H;
  return { x: Math.max(8, Math.min(W - 8, x)), y: Math.max(8, Math.min(H - 8, y)) };
}

/* ─── TARGET (India defence gateway) ──────────────────────────────────────── */
const TARGET = { lat: 20.5937, lon: 78.9629, label: 'IN-SOC Gateway' };

/* ─── Quadratic bezier control point (bows the arc upward) ─────────────────  */
function arcPath(src, dst, W = 1000, H = 500) {
  const s = project(src.lat, src.lon, W, H);
  const d = project(dst.lat, dst.lon, W, H);
  const mx = (s.x + d.x) / 2;
  const my = (s.y + d.y) / 2 - Math.hypot(d.x - s.x, d.y - s.y) * 0.35;
  return { path: `M${s.x},${s.y} Q${mx},${my} ${d.x},${d.y}`, sx: s.x, sy: s.y, dx: d.x, dy: d.y };
}

/* ─── Threat-score → colour ─────────────────────────────────────────────────  */
function scoreColor(score) {
  if (score >= 90) return { fill: '#ef4444', stroke: '#fca5a5', glow: 'rgba(239,68,68,0.6)' };
  if (score >= 80) return { fill: '#f97316', stroke: '#fdba74', glow: 'rgba(249,115,22,0.5)' };
  if (score >= 70) return { fill: '#eab308', stroke: '#fde047', glow: 'rgba(234,179,8,0.5)' };
  return           { fill: '#22c55e', stroke: '#86efac', glow: 'rgba(34,197,94,0.4)' };
}

/* ─── Compact world-map path data (simplified continents) ───────────────────  */
/* Each path is tuned to the 1000×500 equirectangular viewport */
const LAND_PATHS = [
  /* North America */
  "M 130,52 L 165,48 L 210,55 L 250,70 L 285,80 L 308,95 L 315,118 L 308,140 L 290,162 L 270,182 L 255,205 L 252,225 L 240,238 L 225,240 L 200,235 L 185,245 L 170,255 L 162,265 L 155,248 L 145,232 L 155,215 L 162,198 L 158,180 L 145,165 L 135,148 L 128,128 L 120,108 L 118,88 Z",
  /* Greenland */
  "M 235,18 L 268,12 L 295,18 L 308,32 L 305,48 L 290,52 L 265,48 L 242,38 Z",
  /* Central America + Mexico */
  "M 165,260 L 178,268 L 190,278 L 202,285 L 208,278 L 215,268 L 222,260 L 228,250 L 235,242 L 240,238 L 225,240 L 200,235 L 185,245 Z",
  /* South America */
  "M 218,290 L 240,285 L 262,288 L 278,298 L 290,315 L 295,338 L 290,362 L 280,388 L 265,410 L 250,428 L 238,440 L 228,430 L 220,410 L 215,385 L 208,358 L 205,330 L 205,308 Z",
  /* UK+Ireland (tiny) */
  "M 448,90 L 458,88 L 462,95 L 458,102 L 448,100 Z",
  /* Europe */
  "M 462,75 L 498,68 L 535,65 L 565,70 L 590,75 L 605,85 L 608,98 L 598,112 L 578,120 L 560,125 L 540,128 L 518,132 L 498,130 L 480,125 L 465,118 L 458,108 L 455,98 Z",
  /* Scandinavia */
  "M 490,42 L 512,32 L 535,28 L 552,35 L 558,50 L 548,65 L 528,70 L 508,68 L 490,58 Z",
  /* Africa */
  "M 462,168 L 490,162 L 520,162 L 545,168 L 562,185 L 568,210 L 568,238 L 560,268 L 548,295 L 530,318 L 512,338 L 496,348 L 480,345 L 465,330 L 452,308 L 442,280 L 438,252 L 438,225 L 442,198 L 450,178 Z",
  /* Madagascar */
  "M 560,305 L 568,298 L 575,308 L 572,328 L 562,332 L 555,318 Z",
  /* Middle East / Arabian Peninsula */
  "M 570,125 L 600,120 L 625,128 L 638,148 L 635,168 L 618,178 L 595,175 L 575,165 L 565,148 Z",
  /* Russia + Central Asia */
  "M 565,38 L 620,28 L 680,22 L 740,25 L 792,32 L 835,40 L 858,55 L 855,72 L 828,85 L 795,92 L 758,95 L 718,98 L 678,100 L 642,105 L 608,108 L 580,110 L 560,105 L 548,90 L 548,68 Z",
  /* India subcontinent */
  "M 622,148 L 648,145 L 668,152 L 678,168 L 678,188 L 668,208 L 652,225 L 638,232 L 625,225 L 615,208 L 612,188 L 615,168 Z",
  /* SE Asia / Indochina */
  "M 688,155 L 715,148 L 735,155 L 742,172 L 738,188 L 722,195 L 702,192 L 688,178 Z",
  /* China + East Asia */
  "M 668,88 L 718,82 L 758,85 L 790,92 L 810,105 L 815,122 L 808,138 L 788,148 L 762,155 L 735,155 L 712,150 L 688,145 L 670,135 L 658,118 L 655,102 Z",
  /* Japan */
  "M 822,100 L 835,95 L 845,102 L 842,115 L 830,118 L 820,112 Z",
  /* Indonesia */
  "M 718,225 L 738,220 L 758,222 L 775,228 L 778,238 L 758,242 L 738,240 L 718,235 Z",
  /* Australia */
  "M 762,308 L 800,302 L 838,305 L 858,318 L 865,338 L 858,360 L 840,375 L 812,382 L 782,378 L 760,362 L 748,342 L 748,322 Z",
  /* New Zealand */
  "M 878,368 L 888,360 L 895,372 L 890,385 L 878,382 Z",
];

/* ─── Animated dotted arc (dashed stroke-dashoffset trick) ──────────────────  */
function AnimatedArc({ threat, idx }) {
  const { path } = arcPath(threat, TARGET);
  const col = scoreColor(threat.threat_score);
  const dur = 2.8 + (idx % 5) * 0.5;

  return (
    <g>
      {/* Ghost arc */}
      <path d={path} fill="none" stroke={col.fill} strokeWidth="1" opacity="0.18" />
      {/* Animated dashed arc */}
      <path
        d={path}
        fill="none"
        stroke={col.fill}
        strokeWidth="1.5"
        strokeDasharray="8 6"
        opacity="0.7"
        style={{
          strokeDashoffset: 200,
          animation: `dash-flow ${dur}s linear infinite`,
        }}
      />
    </g>
  );
}

/* ─── Threat pin on the map ─────────────────────────────────────────────────  */
function ThreatPin({ threat, isSelected, onClick }) {
  const pos = project(threat.latitude, threat.longitude);
  const col = scoreColor(threat.threat_score);
  const r = threat.threat_score >= 90 ? 7 : threat.threat_score >= 80 ? 6 : 5;

  return (
    <g
      transform={`translate(${pos.x},${pos.y})`}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      {/* Pulse rings */}
      <circle r={r + 10} fill="none" stroke={col.fill} strokeWidth="1" opacity="0.3">
        <animate attributeName="r" from={r + 4} to={r + 18} dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle r={r + 6} fill="none" stroke={col.fill} strokeWidth="1" opacity="0.2">
        <animate attributeName="r" from={r + 2} to={r + 12} dur="2s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.4" to="0" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      {/* Core dot */}
      <circle
        r={r}
        fill={col.fill}
        stroke={isSelected ? '#ffffff' : col.stroke}
        strokeWidth={isSelected ? 2 : 1}
        filter={`drop-shadow(0 0 6px ${col.glow})`}
      />
      <circle r={r * 0.4} fill="white" opacity="0.8" />
    </g>
  );
}

/* ─── TARGET pin (India) ────────────────────────────────────────────────────  */
function TargetPin() {
  const pos = project(TARGET.lat, TARGET.lon);
  return (
    <g transform={`translate(${pos.x},${pos.y})`}>
      {/* Shield rings */}
      {[18, 28, 38].map((r, i) => (
        <circle key={r} r={r} fill="none" stroke="#22d3ee" strokeWidth="1" opacity={0.15 + i * 0.05} />
      ))}
      {/* Rotating outer ring */}
      <circle r={14} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.8">
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Core */}
      <circle r={7} fill="#0e7490" stroke="#22d3ee" strokeWidth="2" />
      <circle r={3} fill="#22d3ee" />
      {/* Label */}
      <text x="0" y="-18" textAnchor="middle" fill="#67e8f9" fontSize="9" fontFamily="monospace" fontWeight="bold">
        INDIA-SOC
      </text>
    </g>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────────  */
export default function GlobalThreatMap({ origins = [], onSelectOrigin }) {
  const [selected, setSelected] = useState(origins[0] || null);
  const [liveFeed, setLiveFeed] = useState([]);
  const [arcVisible, setArcVisible] = useState(true);
  const feedRef = useRef(null);

  /* Generate live attack feed ticks */
  useEffect(() => {
    const types = ['Spear Phish', 'C2 Beacon', 'Credential Relay', 'BEC Vector', 'RAT Ping', 'Tor Egress'];
    const countries = origins.map(o => o.country);
    const buildEntry = () => ({
      id: Date.now() + Math.random(),
      time: new Date().toISOString().slice(11, 19) + ' UTC',
      country: countries[Math.floor(Math.random() * countries.length)] || 'Unknown',
      type: types[Math.floor(Math.random() * types.length)],
      score: Math.floor(70 + Math.random() * 29),
    });
    setLiveFeed([buildEntry(), buildEntry(), buildEntry(), buildEntry(), buildEntry()]);
    const iv = setInterval(() => {
      setLiveFeed(prev => [buildEntry(), ...prev].slice(0, 8));
    }, 3200);
    return () => clearInterval(iv);
  }, [origins]);

  const handleSelect = (t) => {
    setSelected(t);
    onSelectOrigin && onSelectOrigin(t);
  };

  const totalAttacks = origins.reduce((s, o) => s + o.attack_count, 0);
  const criticalCount = origins.filter(o => o.threat_score >= 90).length;

  return (
    <div className="space-y-4">
      {/* ── inject keyframe animation ─────────────────────────────────── */}
      <style>{`
        @keyframes dash-flow {
          from { stroke-dashoffset: 200; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Header bar ───────────────────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">Global Cyber Threat Intelligence Map</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              GeoLite2 + IPinfo
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
              <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Real-time geospatial visualization — active threat origins mapped to India SOC defence gateway
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Hotspots: </span><span className="text-red-400 font-bold">{origins.length}</span>
          </div>
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Attacks: </span><span className="text-orange-400 font-bold">{totalAttacks.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Critical: </span><span className="text-red-400 font-bold">{criticalCount}</span>
          </div>
          <button
            onClick={() => setArcVisible(v => !v)}
            className="px-3 py-1.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-all"
          >
            {arcVisible ? 'Hide Arcs' : 'Show Arcs'}
          </button>
        </div>
      </div>

      {/* ── Main grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

        {/* ── World Map (3 cols) ──────────────────────────────────────── */}
        <div className="xl:col-span-3 relative rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl"
             style={{ background: 'radial-gradient(ellipse at 50% 40%, #040f1e 0%, #020810 100%)' }}>

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
               style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.15) 1px, transparent 1px)', backgroundSize: '80px 50px' }} />

          {/* Radar sweep overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 600, height: 600,
              marginLeft: -300, marginTop: -300,
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0,240,255,0.12) 30deg, transparent 60deg)',
              borderRadius: '50%',
              animation: 'radarSpin 8s linear infinite',
            }} />
          </div>

          {/* SVG World Map */}
          <svg
            viewBox="0 0 1000 500"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: 520, display: 'block' }}
          >
            <defs>
              {/* Ocean gradient */}
              <radialGradient id="oceanGrad" cx="50%" cy="45%" r="65%">
                <stop offset="0%" stopColor="#0a1a2e" />
                <stop offset="100%" stopColor="#020810" />
              </radialGradient>
              {/* Glow filter for pins */}
              <filter id="pinGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Country highlight filter */}
              <filter id="landGlow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
              </filter>
            </defs>

            {/* Ocean */}
            <rect width="1000" height="500" fill="url(#oceanGrad)" />

            {/* Latitude / longitude grid lines */}
            <g stroke="rgba(0,240,255,0.06)" strokeWidth="0.5">
              {[-60, -30, 0, 30, 60].map(lat => {
                const y = project(lat, 0).y;
                return <line key={lat} x1="0" y1={y} x2="1000" y2={y} />;
              })}
              {[-150,-120,-90,-60,-30,0,30,60,90,120,150].map(lon => {
                const x = project(0, lon).x;
                return <line key={lon} x1={x} y1="0" x2={x} y2="500" />;
              })}
            </g>

            {/* Equator highlight */}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(0,240,255,0.12)" strokeWidth="1" strokeDasharray="6 4" />

            {/* Land masses */}
            <g fill="#0d2340" stroke="rgba(0,240,255,0.22)" strokeWidth="0.8">
              {LAND_PATHS.map((d, i) => <path key={i} d={d} />)}
            </g>

            {/* Attack arcs */}
            {arcVisible && origins.map((t, i) => (
              <AnimatedArc key={t.id} threat={t} idx={i} />
            ))}

            {/* Target: India SOC */}
            <TargetPin />

            {/* Threat origin pins */}
            <g filter="url(#pinGlow)">
              {origins.map((t) => (
                <ThreatPin
                  key={t.id}
                  threat={t}
                  isSelected={selected?.id === t.id}
                  onClick={() => handleSelect(t)}
                />
              ))}
            </g>

            {/* Country labels for origin countries */}
            {origins.map((t) => {
              const pos = project(t.latitude, t.longitude);
              return (
                <text
                  key={`lbl-${t.id}`}
                  x={pos.x}
                  y={pos.y - 13}
                  textAnchor="middle"
                  fill="rgba(248,113,113,0.85)"
                  fontSize="8"
                  fontFamily="monospace"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {t.city}
                </text>
              );
            })}

            {/* Legend */}
            <g transform="translate(16,460)">
              {[
                { col: '#ef4444', label: 'Critical (≥90)' },
                { col: '#f97316', label: 'High (80-89)' },
                { col: '#eab308', label: 'Medium (70-79)' },
              ].map((l, i) => (
                <g key={l.label} transform={`translate(${i * 105},0)`}>
                  <circle r="5" cx="5" cy="5" fill={l.col} />
                  <text x="14" y="9" fill="rgba(148,163,184,0.9)" fontSize="9" fontFamily="monospace">{l.label}</text>
                </g>
              ))}
            </g>
          </svg>

          {/* Live label bottom-left */}
          <div className="absolute bottom-4 left-4 bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-2 backdrop-blur-sm">
            <Radio className="w-3 h-3 text-red-400 animate-pulse" />
            <span>Target: <strong className="text-cyan-300">India Enterprise SOC</strong></span>
          </div>

          {/* Click hint */}
          <div className="absolute top-3 right-3 bg-slate-950/70 px-2 py-1 rounded text-[10px] font-mono text-slate-400 backdrop-blur-sm border border-slate-800">
            <Eye className="w-3 h-3 inline mr-1" />Click pin to inspect
          </div>
        </div>

        {/* ── Right panel ──────────────────────────────────────────────── */}
        <div className="xl:col-span-1 flex flex-col gap-3">

          {/* Selected threat dossier */}
          <div className="flex-1 p-4 rounded-xl bg-[#0a1226]/90 border border-slate-700 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Origin Dossier
              </span>
              {selected && <CyberBadge level="CRITICAL" text={`SCORE: ${selected.threat_score}`} size="xs" />}
            </div>

            {selected ? (
              <div className="space-y-2 text-xs font-mono flex-1">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 mb-0.5">Location</div>
                  <div className="text-slate-100 font-bold">{selected.city}, {selected.country}</div>
                  <div className="text-slate-500 text-[10px]">{selected.country_code} · {selected.latitude.toFixed(4)}, {selected.longitude.toFixed(4)}</div>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 mb-0.5">Threat Vector</div>
                  <div className="text-red-400 font-bold leading-snug">{selected.threat_type}</div>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 mb-0.5">IP Address</div>
                  <div className="text-cyan-300 font-bold">{selected.ip}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Probes</div>
                    <div className="text-orange-400 font-bold">{selected.attack_count.toLocaleString()}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Last Seen</div>
                    <div className="text-slate-200">{selected.last_detected}</div>
                  </div>
                </div>

                {/* Threat score bar */}
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="flex justify-between text-[10px] mb-1.5">
                    <span className="text-slate-400">Threat Score</span>
                    <span className="text-red-400 font-bold">{selected.threat_score}/100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${selected.threat_score}%`,
                        background: `linear-gradient(90deg, #f97316, #ef4444)`,
                        boxShadow: '0 0 8px rgba(239,68,68,0.6)',
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-500 font-mono text-center px-2">
                Click any pulsing threat pin on the world map to inspect forensic telemetry.
              </div>
            )}

            <button
              onClick={() => alert(`🔒 Firewall block rule pushed for ${selected?.ip} (${selected?.country})`)}
              disabled={!selected}
              className="mt-3 w-full py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-mono font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShieldAlert className="w-3.5 h-3.5 inline mr-1" />
              Push Firewall Block Rule
            </button>
          </div>

          {/* Live attack feed */}
          <div className="p-3 rounded-xl bg-[#0a1226]/90 border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Live Attack Feed
            </div>
            <div ref={feedRef} className="space-y-1 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
              {liveFeed.map((e) => (
                <div key={e.id}
                  className="flex items-start gap-2 text-[10px] font-mono py-1 px-2 rounded bg-slate-900/60 border border-slate-800/60 animate-fade-in">
                  <Zap className="w-3 h-3 text-yellow-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-slate-300 truncate">{e.type}</span>
                      <span className="text-red-400 font-bold shrink-0">{e.score}</span>
                    </div>
                    <div className="text-slate-500">{e.country} · {e.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom stats strip ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {origins.slice(0, 4).map((o) => {
          const col = scoreColor(o.threat_score);
          return (
            <div
              key={o.id}
              onClick={() => handleSelect(o)}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase">{o.country_code}</span>
                <span className="text-[10px] font-bold font-mono" style={{ color: col.fill }}>
                  {o.threat_score}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-200 font-bold truncate">{o.city}</div>
              <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{o.threat_type}</div>
              <div className="mt-2 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${o.threat_score}%`, background: col.fill }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
