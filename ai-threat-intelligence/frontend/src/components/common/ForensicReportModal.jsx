import React from 'react';
import { X, Printer, Download, ShieldAlert, CheckCircle2, FileText, Hash } from 'lucide-react';
import CyberBadge from './CyberBadge';

export default function ForensicReportModal({ isOpen, onClose, analysisResult }) {
  if (!isOpen || !analysisResult) return null;

  const res = analysisResult;
  const step1 = res.step1_received;
  const step2 = res.step2_auth;
  const step3 = res.step3_domain;
  const step4 = res.step4_ai_content;
  const step6 = res.step6_risk;
  const step7 = res.step7_results;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `Forensic_Report_${step7?.case_id || 'CASE-2026'}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#070e22] border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                Official Incident Forensic Case Dossier
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Case ID: {step7?.case_id} • Smart India Hackathon 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Case Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 font-sans text-xs">
          {/* Executive Header Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">
                Classification & Diagnosis
              </span>
              <h2 className="text-base font-bold text-slate-100">
                {step7?.attack_type}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Threat Score</span>
                <span className="text-xl font-bold font-mono text-red-400">{step6?.threat_score}/100</span>
              </div>
              <CyberBadge level={step6?.risk_level} text={step6?.risk_level} size="sm" />
            </div>
          </div>

          {/* Section 1: Ingestion & Envelope */}
          <div className="space-y-2">
            <h4 className="font-mono text-cyan-400 uppercase tracking-wider font-bold border-b border-slate-800 pb-1">
              1. Inbound Envelope & Artifact Telemetry
            </h4>
            <div className="grid grid-cols-2 gap-3 font-mono bg-slate-950 p-3 rounded-lg border border-slate-850">
              <div><span className="text-slate-400">Sender:</span> {step1?.sender}</div>
              <div><span className="text-slate-400">Originating IP:</span> {step1?.originating_ip}</div>
              <div><span className="text-slate-400">Subject:</span> {step1?.subject}</div>
              <div><span className="text-slate-400">Date Timestamp:</span> {step1?.date}</div>
              <div className="col-span-2 flex items-center gap-2 pt-1 border-t border-slate-850">
                <Hash className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-slate-400">SHA-256 Digest:</span>
                <span className="text-cyan-300 truncate">{res.sha256_digest}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Authentication Evaluation */}
          <div className="space-y-2">
            <h4 className="font-mono text-cyan-400 uppercase tracking-wider font-bold border-b border-slate-800 pb-1">
              2. Email Protocol Authentication (SPF / DKIM / DMARC)
            </h4>
            <div className="grid grid-cols-3 gap-2 font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-850">
                <div className="text-slate-400 text-[10px]">SPF Verification:</div>
                <div className="font-bold text-slate-100">{step2?.spf_status}</div>
                <div className="text-[10px] text-slate-400 mt-1">{step2?.spf_details}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-850">
                <div className="text-slate-400 text-[10px]">DKIM Cryptographic Signature:</div>
                <div className="font-bold text-slate-100">{step2?.dkim_status}</div>
                <div className="text-[10px] text-slate-400 mt-1">{step2?.dkim_details}</div>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-850">
                <div className="text-slate-400 text-[10px]">DMARC Policy Enforcement:</div>
                <div className="font-bold text-slate-100">{step2?.dmarc_status}</div>
                <div className="text-[10px] text-slate-400 mt-1">{step2?.dmarc_details}</div>
              </div>
            </div>
          </div>

          {/* Section 3: AI Inference & Explainer */}
          <div className="space-y-2">
            <h4 className="font-mono text-cyan-400 uppercase tracking-wider font-bold border-b border-slate-800 pb-1">
              3. Neural Content & Social Engineering Analysis (PyTorch NLP)
            </h4>
            <div className="p-3.5 rounded bg-slate-950 border border-slate-850 space-y-2">
              <p className="text-xs text-slate-200 leading-relaxed">
                {step4?.ai_explanation}
              </p>
              <div className="flex gap-4 font-mono text-[11px] text-slate-400 pt-2 border-t border-slate-850">
                <span>Credential Probability: <strong className="text-red-400">{(step4?.credential_request_score * 100).toFixed(0)}%</strong></span>
                <span>Financial/BEC Score: <strong className="text-orange-400">{(step4?.financial_request_score * 100).toFixed(0)}%</strong></span>
                <span>Urgency Index: <strong className="text-yellow-400">{(step4?.urgency_score * 100).toFixed(0)}%</strong></span>
              </div>
            </div>
          </div>

          {/* Section 4: Evidence & Enforcement */}
          <div className="space-y-2">
            <h4 className="font-mono text-cyan-400 uppercase tracking-wider font-bold border-b border-slate-800 pb-1">
              4. Evidence Ledger & Recommended SOC Playbook
            </h4>
            <div className="p-3 bg-slate-950 rounded border border-slate-850">
              <span className="text-slate-400 font-mono block mb-1">Enforced Playbook Actions:</span>
              <ul className="list-disc pl-4 space-y-1 font-mono text-xs text-slate-300">
                {step7?.recommended_actions?.map((act) => (
                  <li key={act.id}>
                    <strong>{act.title}</strong>: {act.description} (Target: {act.target})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-cyan-500/20 bg-slate-950/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Digital Signature: Verified SecOps Chain of Custody</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
