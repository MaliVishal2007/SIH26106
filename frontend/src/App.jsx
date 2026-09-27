import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopHeader from './components/layout/TopHeader';
import DashboardPage from './pages/DashboardPage';
import EmailAnalysisPage from './pages/EmailAnalysisPage';
import InvestigationGraphPage from './pages/InvestigationGraphPage';
import GeoLocationPage from './pages/GeoLocationPage';
import VirusTotalPage from './pages/VirusTotalPage';
import ForensicTimelinePage from './pages/ForensicTimelinePage';
import AuditLogPage from './pages/AuditLogPage';
import ForensicReportModal from './components/common/ForensicReportModal';

import { 
  analyzeEmail, 
  fetchDashboardStats, 
  fetchTimeline, 
  fetchInvestigationGraph, 
  fetchThreatOrigins, 
  fetchAuditLogs 
} from './services/api';
import { MOCK_SCENARIOS, MOCK_DASHBOARD_STATS, MOCK_GRAPH_DATA, MOCK_THREAT_ORIGINS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [stats, setStats] = useState(MOCK_DASHBOARD_STATS);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [graphData, setGraphData] = useState(MOCK_GRAPH_DATA);
  const [threatOrigins, setThreatOrigins] = useState(MOCK_THREAT_ORIGINS);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGlobalReportModal, setShowGlobalReportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [dashData, timeData, gData, originsData, logsData] = await Promise.all([
          fetchDashboardStats(),
          fetchTimeline(),
          fetchInvestigationGraph(),
          fetchThreatOrigins(),
          fetchAuditLogs()
        ]);
        if (dashData) setStats(dashData);
        if (timeData) setTimelineEvents(timeData);
        if (gData) setGraphData(gData);
        if (originsData) setThreatOrigins(originsData);
        if (logsData) setAuditLogs(logsData);
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };
    loadInitialData();

    // Run first sample analysis immediately so user lands on a fully populated 7-step pipeline!
    handleRunAnalysis({
      raw_email: `${MOCK_SCENARIOS[0].headers}\n\n${MOCK_SCENARIOS[0].body}`,
      sender: MOCK_SCENARIOS[0].sender,
      subject: MOCK_SCENARIOS[0].subject
    });
  }, []);

  const handleRunAnalysis = async (payload) => {
    setIsLoading(true);
    showToast("Executing 7-step forensic pipeline (SPF, DKIM, AI NLP, Neo4j)...");
    try {
      const res = await analyzeEmail(payload);
      setAnalysisResult(res);
      showToast(`Analysis Complete: Threat Score ${res.step6_risk.threat_score}/100 (${res.step6_risk.risk_level})`);
      
      // Update graph data if mini graph nodes provided
      if (res.step5_forensics?.mini_graph_nodes?.length > 0) {
        setGraphData({
          case_id: res.case_id,
          nodes: res.step5_forensics.mini_graph_nodes,
          edges: res.step5_forensics.mini_graph_links
        });
      }
    } catch (e) {
      console.error(e);
      showToast("Forensic pipeline finished with local analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectScenario = (scenario) => {
    setActiveTab('analysis');
    handleRunAnalysis({
      raw_email: `${scenario.headers}\n\n${scenario.body}`,
      sender: scenario.sender,
      subject: scenario.subject
    });
  };

  return (
    <div className="flex min-h-screen bg-[#050913] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0a1226]/95 border border-cyan-400 text-cyan-300 px-4 py-2.5 rounded-xl shadow-cyan-glow flex items-center gap-2 text-xs font-mono animate-bounce backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <TopHeader
          onSelectScenario={handleSelectScenario}
          currentThreatLevel={analysisResult?.step6_risk?.risk_level || "HIGH"}
          onRefresh={() => {
            showToast("Syncing with live threat intelligence feeds...");
            fetchDashboardStats().then(s => s && setStats(s));
          }}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardPage
              stats={stats}
              onNavigateToAnalysis={() => setActiveTab('analysis')}
              onSelectCase={(c) => {
                setActiveTab('analysis');
                handleRunAnalysis({ subject: c.subject, sender: c.sender });
              }}
            />
          )}

          {activeTab === 'analysis' && (
            <EmailAnalysisPage
              analysisResult={analysisResult}
              onAnalyze={handleRunAnalysis}
              isLoading={isLoading}
              onOpenFullGraph={() => setActiveTab('graph')}
            />
          )}

          {activeTab === 'graph' && (
            <InvestigationGraphPage graphData={graphData} />
          )}

          {activeTab === 'geolocation' && (
            <GeoLocationPage origins={threatOrigins} />
          )}

          {activeTab === 'virustotal' && (
            <VirusTotalPage />
          )}

          {activeTab === 'timeline' && (
            <ForensicTimelinePage events={timelineEvents} />
          )}

          {activeTab === 'audit' && (
            <AuditLogPage
              auditLogs={auditLogs}
              onExportReport={() => setShowGlobalReportModal(true)}
            />
          )}
        </main>
      </div>

      {/* Global Forensic Dossier Modal */}
      <ForensicReportModal
        isOpen={showGlobalReportModal}
        onClose={() => setShowGlobalReportModal(false)}
        analysisResult={analysisResult}
      />
    </div>
  );
}
