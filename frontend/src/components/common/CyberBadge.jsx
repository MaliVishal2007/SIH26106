import React from 'react';

export default function CyberBadge({ level = "INFO", text, size = "sm" }) {
  const normalized = (level || "").toUpperCase();
  
  let styles = "bg-slate-800 text-slate-300 border-slate-700";
  
  if (normalized === "CRITICAL" || normalized === "DANGER" || normalized === "FAIL" || normalized === "MALICIOUS") {
    styles = "bg-red-500/15 text-red-400 border-red-500/40 shadow-red-glow/20";
  } else if (normalized === "HIGH" || normalized === "QUARANTINE") {
    styles = "bg-orange-500/15 text-orange-400 border-orange-500/40 shadow-orange-500/10";
  } else if (normalized === "MEDIUM" || normalized === "WARNING" || normalized === "SOFTFAIL" || normalized === "SUSPICIOUS") {
    styles = "bg-amber-500/15 text-amber-300 border-amber-500/40";
  } else if (normalized === "LOW" || normalized === "NEUTRAL") {
    styles = "bg-cyan-500/15 text-cyan-300 border-cyan-500/40";
  } else if (normalized === "SAFE" || normalized === "PASS" || normalized === "SUCCESS" || normalized === "CLEAN") {
    styles = "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-green-glow/20";
  }

  const sizeClasses = size === "xs" 
    ? "px-1.5 py-0.5 text-[10px]" 
    : size === "lg" 
    ? "px-3 py-1 text-sm font-semibold" 
    : "px-2.5 py-0.5 text-xs";

  return (
    <span className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider font-semibold rounded border ${sizeClasses} ${styles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {text || level}
    </span>
  );
}
