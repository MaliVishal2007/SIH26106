import React from 'react';
import { BrainCircuit, Cpu, Sparkles, AlertCircle, Quote, Tag } from 'lucide-react';
import CyberBadge from '../common/CyberBadge';

export default function Step4AIContentView({ data }) {
  if (!data) return null;

  const intents = [
    { label: "Credential Harvesting", score: data.credential_request_score, color: "#ef4444" },
    { label: "Financial / BEC Fraud", score: data.financial_request_score, color: "#f97316" },
    { label: "Coercive Urgency & Panic", score: data.urgency_score, color: "#eab308" },
    { label: "Authority Impersonation", score: data.impersonation_score, color: "#a855f7" },
    { label: "Suspicious Language & Phrasing", score: data.suspicious_language_score, color: "#00f0ff" }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100">Step 4: AI Content & Intent Analysis</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
              {data.model_architecture}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Fine-tuned Transformer neural attention layers detecting multi-vector social engineering mechanics.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Model Confidence: </span>
            <span className="text-cyan-400 font-bold">{data.confidence_score}%</span>
          </div>
          <div className="bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
            <span className="text-slate-400">Intents Flagged: </span>
            <span className="text-red-400 font-bold">{data.detected_intents?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Intent Probability Gauges */}
        <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800 space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5" />
            Neural Intent Classification Breakdown
          </h4>

          <div className="space-y-3 pt-1">
            {intents.map((item, idx) => {
              const pct = Math.round(item.score * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-bold" style={{ color: item.color }}>{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: item.color,
                        boxShadow: pct > 50 ? `0 0 8px ${item.color}60` : 'none'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Salience tokens tags */}
          {data.suspicious_tokens && data.suspicious_tokens.length > 0 && (
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400 block mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                Explainable Token Salience (Transformer Attention Weights):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.suspicious_tokens.map((tok, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-950/40 text-red-300 border border-red-500/30 flex items-center gap-1"
                  >
                    <span>{tok.token}</span>
                    <span className="text-[9px] text-red-400 opacity-70">({(tok.score * 100).toFixed(0)}%)</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Explainable AI (XAI) Natural Language Rationale */}
        <div className="p-4 rounded-xl bg-[#0a1226]/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-purple-400 flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Explainable AI (XAI) Rationale Output
            </h4>

            <div className="p-3.5 rounded-lg bg-purple-950/15 border border-purple-500/30 relative">
              <Quote className="w-6 h-6 text-purple-500/20 absolute top-2 right-2" />
              <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
                {data.ai_explanation}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="text-slate-300 font-semibold mb-1">Inference Architecture Parameters:</div>
            <div>• Base Backbone: Hugging Face RoBERTa-large-sec</div>
            <div>• Fine-Tuning: 420,000 Verified Threat Samples (APWG & PhishTank)</div>
            <div>• Hardware Acceleration: PyTorch CUDA / TensorRT Engine</div>
          </div>
        </div>
      </div>
    </div>
  );
}
