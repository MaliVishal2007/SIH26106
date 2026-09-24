import React, { useState } from 'react';
import EmailInputPanel from '../components/analysis/EmailInputPanel';
import PipelineStepper from '../components/analysis/PipelineStepper';
import Step1EmailReceivedView from '../components/analysis/Step1EmailReceivedView';
import Step2AuthCheckView from '../components/analysis/Step2AuthCheckView';
import Step3DomainAnalysisView from '../components/analysis/Step3DomainAnalysisView';
import Step4AIContentView from '../components/analysis/Step4AIContentView';
import Step5ForensicGraphView from '../components/analysis/Step5ForensicGraphView';
import Step6RiskEngineView from '../components/analysis/Step6RiskEngineView';
import Step7SOCResultsView from '../components/analysis/Step7SOCResultsView';
import ForensicReportModal from '../components/common/ForensicReportModal';
import { ArrowLeft, ArrowRight, FileCheck, Layers } from 'lucide-react';

export default function EmailAnalysisPage({ 
  analysisResult, 
  onAnalyze, 
  isLoading, 
  onOpenFullGraph 
}) {
  const [activeStep, setActiveStep] = useState(1);
  const [showReportModal, setShowReportModal] = useState(false);

  const res = analysisResult;

  const handleNextStep = () => {
    setActiveStep(prev => Math.min(prev + 1, 7));
  };

  const handlePrevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="space-y-6">
      {/* Email Submission / Scenario Loader Input */}
      <EmailInputPanel onAnalyze={onAnalyze} isLoading={isLoading} />

      {/* Stepper Navigation (Page 3 of SIH PPT) */}
      <PipelineStepper 
        activeStep={activeStep} 
        setActiveStep={setActiveStep} 
        analysisResult={res} 
      />

      {/* Step View Card Container */}
      <div className="min-h-[450px]">
        {res ? (
          <div>
            {activeStep === 1 && (
              <Step1EmailReceivedView 
                data={res.step1_received} 
                sha256Digest={res.sha256_digest} 
              />
            )}
            {activeStep === 2 && (
              <Step2AuthCheckView data={res.step2_auth} />
            )}
            {activeStep === 3 && (
              <Step3DomainAnalysisView data={res.step3_domain} />
            )}
            {activeStep === 4 && (
              <Step4AIContentView data={res.step4_ai_content} />
            )}
            {activeStep === 5 && (
              <Step5ForensicGraphView 
                data={res.step5_forensics} 
                onOpenFullGraph={onOpenFullGraph} 
              />
            )}
            {activeStep === 6 && (
              <Step6RiskEngineView data={res.step6_risk} />
            )}
            {activeStep === 7 && (
              <Step7SOCResultsView 
                data={res.step7_results} 
                onExportReport={() => setShowReportModal(true)} 
              />
            )}

            {/* Step Navigation Footer Controls */}
            <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <button
                onClick={handlePrevStep}
                disabled={activeStep === 1}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeStep === 1
                    ? 'text-slate-400 cursor-not-allowed border border-transparent'
                    : 'text-slate-300 hover:text-white bg-slate-900 border border-slate-700 hover:border-cyan-500/40 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>PREVIOUS STAGE ({Math.max(activeStep - 1, 1)})</span>
              </button>

              <div className="text-xs font-mono text-cyan-400 font-semibold">
                STAGE {activeStep} OF 7 COMPLETED
              </div>

              <button
                onClick={handleNextStep}
                disabled={activeStep === 7}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeStep === 7
                    ? 'text-slate-400 cursor-not-allowed border border-transparent'
                    : 'text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 border border-cyan-500/40 hover:bg-cyan-900/40 cursor-pointer'
                }`}
              >
                <span>NEXT STAGE ({Math.min(activeStep + 1, 7)})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col items-center justify-center">
            <Layers className="w-12 h-12 text-cyan-400/40 mb-3 animate-pulse" />
            <h3 className="text-base font-bold text-slate-200">No Email Currently Loaded</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md font-mono">
              Click "Execute Threat Analysis" above or select one of the pre-configured SIEM scenarios to trigger the 7-step forensic pipeline.
            </p>
          </div>
        )}
      </div>

      {/* Forensic Report Modal */}
      <ForensicReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        analysisResult={res}
      />
    </div>
  );
}
