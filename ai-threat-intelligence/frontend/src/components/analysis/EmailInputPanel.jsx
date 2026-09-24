import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Send, Sparkles, AlertCircle } from 'lucide-react';
import { MOCK_SCENARIOS } from '../../data/mockData';

export default function EmailInputPanel({ onAnalyze, isLoading }) {
  const [activeMode, setActiveMode] = useState('scenarios'); // 'scenarios', 'paste', 'upload'
  const [rawText, setRawText] = useState('');
  const [selectedScenario, setSelectedScenario] = useState(MOCK_SCENARIOS[0]);
  const fileInputRef = useRef(null);

  const handleRunAnalysis = () => {
    if (activeMode === 'scenarios' && selectedScenario) {
      onAnalyze({
        raw_email: `${selectedScenario.headers}\n\n${selectedScenario.body}`,
        sender: selectedScenario.sender,
        subject: selectedScenario.subject
      });
    } else if (activeMode === 'paste') {
      if (!rawText.trim()) return;
      onAnalyze({ raw_email: rawText });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setRawText(content);
      setActiveMode('paste');
      onAnalyze({ raw_email: content });
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-[#0a1226]/90 border border-cyan-500/20 rounded-xl p-5 shadow-xl relative overflow-hidden">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Inbound Email Ingestion</h3>
            <p className="text-xs text-slate-400 font-mono">Submit email for 7-stage forensic pipeline</p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveMode('scenarios')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeMode === 'scenarios'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SIEM Scenarios
          </button>
          <button
            onClick={() => setActiveMode('paste')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeMode === 'paste'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Raw Content
          </button>
          <button
            onClick={() => {
              setActiveMode('upload');
              fileInputRef.current?.click();
            }}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeMode === 'upload'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload .EML / .TXT
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".eml,.txt,.msg,.log"
            className="hidden"
          />
        </div>
      </div>

      {/* Mode 1: Pre-Configured SIEM Scenarios */}
      {activeMode === 'scenarios' && (
        <div className="pt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MOCK_SCENARIOS.map((sc) => {
              const isSelected = selectedScenario?.id === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/30 shadow-cyan-glow'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-100">{sc.name}</span>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                      sc.badgeColor === 'red' ? 'bg-red-500/15 text-red-400 border-red-500/30' :
                      sc.badgeColor === 'orange' ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' :
                      'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {sc.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{sc.description}</p>
                  <div className="text-[10px] font-mono text-cyan-300/80 bg-slate-950/60 p-1.5 rounded border border-slate-800 truncate">
                    From: {sc.sender}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Paste Raw Content */}
      {activeMode === 'paste' && (
        <div className="pt-4 space-y-2">
          <label className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>RFC822 MIME Headers & Email Message Body</span>
            <span className="text-cyan-400/80">Plain Text / RFC 822 format</span>
          </label>
          <textarea
            rows={6}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`From: "HR Verification" <verify@payrol1-update.top>\nTo: employee@corp.com\nSubject: Urgent: Verify Direct Deposit Credentials\n\nPlease log in immediately to confirm your banking information at https://login-bank-portal.top`}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
          />
        </div>
      )}

      {/* Mode 3: Upload Drag & Drop Area */}
      {activeMode === 'upload' && (
        <div className="pt-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 rounded-xl p-8 text-center cursor-pointer bg-slate-950/40 hover:bg-cyan-950/10 transition-all"
          >
            <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto mb-2 animate-bounce" />
            <h4 className="text-sm font-semibold text-slate-200">Click to upload or drag & drop email file</h4>
            <p className="text-xs text-slate-400 mt-1 font-mono">Supports standard .eml, .msg, .txt exported raw email archives</p>
          </div>
        </div>
      )}

      {/* Run Pipeline Button */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Executes Full 7-Step Forensic Pipeline (SPF, DKIM, AI NLP, Neo4j, VirusTotal)</span>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isLoading}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
            isLoading
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-glow cursor-pointer'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>RUNNING FORENSIC PIPELINE...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>EXECUTE THREAT ANALYSIS</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
