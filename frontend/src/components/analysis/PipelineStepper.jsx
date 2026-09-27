import React from 'react';
import { 
  Mail, 
  KeyRound, 
  Globe, 
  BrainCircuit, 
  Network, 
  Gauge, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle 
} from 'lucide-react';

export default function PipelineStepper({ activeStep, setActiveStep, analysisResult }) {
  const steps = [
    { number: 1, title: 'Email Received', subtitle: 'RFC822 & MIME Tokenization', icon: Mail },
    { number: 2, title: 'Authentication Check', subtitle: 'SPF, DKIM, DMARC Verification', icon: KeyRound },
    { number: 3, title: 'Domain & Sender', subtitle: 'Age, WHOIS & Typosquatting', icon: Globe },
    { number: 4, title: 'AI Content Analysis', subtitle: 'Transformers + PyTorch NLP', icon: BrainCircuit },
    { number: 5, title: 'Forensic & Graph', subtitle: 'Behavioral & Neo4j Cluster', icon: Network },
    { number: 6, title: 'Evidence & Risk', subtitle: 'Multi-Factor Threat Engine', icon: Gauge },
    { number: 7, title: 'Results & SOC Action', subtitle: 'Classification & Remediation', icon: ShieldCheck }
  ];

  const getStepStatus = (stepNum) => {
    if (!analysisResult) return 'neutral';
    if (stepNum === 2) {
      const v = analysisResult.step2_auth?.overall_auth_verdict;
      if (v === 'FAIL') return 'danger';
      if (v === 'WARNING') return 'warning';
      return 'success';
    }
    if (stepNum === 3) {
      return (analysisResult.step3_domain?.is_typosquatting || analysisResult.step3_domain?.is_newly_registered) ? 'danger' : 'success';
    }
    if (stepNum === 4) {
      return (analysisResult.step4_ai_content?.credential_request_score >= 0.6 || analysisResult.step4_ai_content?.financial_request_score >= 0.6) ? 'danger' : 'success';
    }
    if (stepNum === 6 || stepNum === 7) {
      const s = analysisResult.step6_risk?.threat_score || 0;
      if (s >= 85) return 'danger';
      if (s >= 65) return 'warning';
      return 'success';
    }
    return 'success';
  };

  return (
    <div className="w-full bg-[#0a1226]/80 backdrop-blur-md border border-cyan-500/20 rounded-xl p-3 shadow-lg">
      <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2 px-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Technical Pipeline Architecture (SIH 2026 - Page 3)
        </span>
        <span className="text-[11px] text-slate-400">Step {activeStep} of 7</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((st) => {
          const Icon = st.icon;
          const isActive = activeStep === st.number;
          const status = getStepStatus(st.number);

          let borderStatus = "border-slate-800 hover:border-cyan-500/30";
          let badgeColor = "bg-slate-800 text-slate-400";
          
          if (isActive) {
            borderStatus = "border-cyan-400 bg-cyan-950/40 shadow-cyan-glow";
            badgeColor = "bg-cyan-500 text-black font-bold";
          } else if (status === 'danger') {
            borderStatus = "border-red-500/40 bg-red-950/20";
            badgeColor = "bg-red-500/20 text-red-400 border border-red-500/40";
          } else if (status === 'warning') {
            borderStatus = "border-amber-500/40 bg-amber-950/20";
            badgeColor = "bg-amber-500/20 text-amber-400 border border-amber-500/40";
          } else if (status === 'success') {
            borderStatus = "border-emerald-500/30 bg-emerald-950/20";
            badgeColor = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40";
          }

          return (
            <button
              key={st.number}
              onClick={() => setActiveStep(st.number)}
              className={`p-2.5 rounded-lg border text-left transition-all relative group flex flex-col justify-between ${borderStatus}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${badgeColor}`}>
                    {st.number}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-200">
                  {st.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">
                  {st.subtitle}
                </div>
              </div>

              {/* Status indicator pip */}
              <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono">
                <span className="text-slate-400 uppercase">Stage {st.number}</span>
                {status === 'danger' && <span className="text-red-400 flex items-center gap-0.5">ALERT</span>}
                {status === 'warning' && <span className="text-amber-400 flex items-center gap-0.5">WARN</span>}
                {status === 'success' && <span className="text-emerald-400 flex items-center gap-0.5">OK</span>}
                {status === 'neutral' && <span className="text-slate-400">IDLE</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
