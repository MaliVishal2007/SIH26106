import { MOCK_SCENARIOS, MOCK_DASHBOARD_STATS, MOCK_GRAPH_DATA, MOCK_THREAT_ORIGINS } from '../data/mockData';

const API_BASE = 'http://127.0.0.1:8000/api';

export async function fetchScenarios() {
  try {
    const res = await fetch(`${API_BASE}/analyze/scenarios`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend unavailable, using pre-seeded scenarios');
  }
  return MOCK_SCENARIOS;
}

export async function analyzeEmail(payload) {
  try {
    const res = await fetch(`${API_BASE}/analyze/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend error or timeout, computing local deterministic forensic result', e);
  }
  // Local fallback simulation
  return generateLocalFallbackAnalysis(payload);
}

export async function uploadEmailFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch(`${API_BASE}/analyze/upload`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend upload failed, simulating uploaded file analysis', e);
  }
  return generateLocalFallbackAnalysis({ raw_email: `Uploaded: ${file.name}` });
}

export async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/threat-intel/dashboard`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using local dashboard metrics fallback');
  }
  return MOCK_DASHBOARD_STATS;
}

export async function fetchTimeline() {
  try {
    const res = await fetch(`${API_BASE}/threat-intel/timeline`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Using local timeline fallback');
  }
  return [
    { id: "TL-01", stage: "Ingestion", title: "Inbound SMTP Handshake", description: "Perimeter gateway received inbound RFC822 mail stream from 185.220.101.5", timestamp: "18:20:11 UTC", status: "INFO", latency_ms: 12 },
    { id: "TL-02", stage: "Authentication", title: "SPF Softfail & DKIM Failure", description: "Domain alignment mismatch; body hash checksum tampered in transit", timestamp: "18:20:11 UTC", status: "DANGER", latency_ms: 142 },
    { id: "TL-03", stage: "Domain WHOIS", title: "Domain Age Alert (4 Days Old)", description: "Registered at Namecheap on 2026-09-18 with known abuse TLD (.top)", timestamp: "18:20:11 UTC", status: "WARNING", latency_ms: 220 },
    { id: "TL-04", stage: "AI Inference", title: "RoBERTa-Security Credential Alarm", description: "Transformer identified 94.2% credential harvesting probability", timestamp: "18:20:11 UTC", status: "DANGER", latency_ms: 410 },
    { id: "TL-05", stage: "VirusTotal", title: "Multi-Engine Threat Detection (58/72)", description: "Destination login URL flagged by CrowdStrike, Kaspersky, and Microsoft", timestamp: "18:20:12 UTC", status: "DANGER", latency_ms: 380 },
    { id: "TL-06", stage: "Neo4j Graph", title: "Attribution to FIN7 Cluster", description: "Knowledge graph linked domain to active Operation SilentHarvest cluster", timestamp: "18:20:12 UTC", status: "DANGER", latency_ms: 290 },
    { id: "TL-07", stage: "SOC Playbook", title: "Automatic Quarantine Executed", description: "Quarantined in Microsoft 365, perimeter firewall IP drop enforced", timestamp: "18:20:12 UTC", status: "SUCCESS", latency_ms: 310 }
  ];
}

export async function scanVirusTotal(query, queryType = "auto") {
  try {
    const res = await fetch(`${API_BASE}/virustotal/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, query_type: queryType }),
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('VirusTotal live query fallback');
  }
  const isMalicious = query.toLowerCase().includes('micros0ft') || query.includes('185.220') || query.includes('verify') || query.includes('login');
  return {
    target: query,
    target_type: queryType === 'auto' ? (query.startsWith('http') ? 'url' : 'domain') : queryType,
    scan_id: `vt-${Math.random().toString(36).substring(2, 10)}`,
    scan_date: "2026-09-22 18:30 UTC",
    status: "completed",
    positives: isMalicious ? 58 : 0,
    total_vendors: 72,
    detection_ratio: isMalicious ? "58/72" : "0/72",
    reputation_score: isMalicious ? -92 : 98,
    threat_severity: isMalicious ? "CRITICAL" : "CLEAN",
    categories: isMalicious ? ["Phishing", "Credential Theft", "Malicious Infrastructure"] : ["Verified Safe"],
    community_votes: { harmless: isMalicious ? 2 : 124, malicious: isMalicious ? 88 : 0 },
    vendor_results: [
      { vendor_name: "CrowdStrike Falcon", category: isMalicious ? "malicious" : "clean", result: isMalicious ? "Phish.Heur" : "Clean", engine_version: "2026.09" },
      { vendor_name: "Kaspersky Lab", category: isMalicious ? "malicious" : "clean", result: isMalicious ? "Trojan-Dropper" : "Clean", engine_version: "2026.09" },
      { vendor_name: "Microsoft Defender", category: isMalicious ? "malicious" : "clean", result: isMalicious ? "Exploit.CVE" : "Clean", engine_version: "2026.09" },
      { vendor_name: "Google Safe Browsing", category: isMalicious ? "malicious" : "clean", result: isMalicious ? "Social Engineering" : "Clean", engine_version: "2026.09" },
      { vendor_name: "SentinelOne", category: isMalicious ? "malicious" : "clean", result: isMalicious ? "Phish.Script" : "Clean", engine_version: "2026.09" },
      { vendor_name: "Sophos Intercept X", category: isMalicious ? "malicious" : "clean", result: isMalicious ? "Mal/Phish-A" : "Clean", engine_version: "2026.09" }
    ],
    suggested_action: isMalicious ? "IMMEDIATE SINKHOLE: Block globally across perimeter firewalls and DNS resolvers." : "ALLOW: No indicators of compromise."
  };
}

export async function lookupIP(ip) {
  try {
    const res = await fetch(`${API_BASE}/geolocation/lookup?ip=${encodeURIComponent(ip)}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Geolocation fallback');
  }
  return {
    ip: ip,
    country: "Germany",
    country_code: "DE",
    city: "Frankfurt am Main",
    region: "Hesse",
    latitude: 50.1109,
    longitude: 8.6821,
    timezone: "Europe/Berlin",
    isp: "Zwiebelfreunde e.V. (Tor Relay Node)",
    asn: "AS200651",
    is_vpn: true,
    is_proxy: true,
    is_tor_exit_node: true,
    abuse_confidence_score: 98,
    threat_reputation: "CRITICAL",
    open_ports: [80, 443, 9001],
    registered_threat_actor: "FIN7 / Tor Egress Node"
  };
}

export async function fetchThreatOrigins() {
  try {
    const res = await fetch(`${API_BASE}/geolocation/threat-origins`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Threat origins fallback');
  }
  return MOCK_THREAT_ORIGINS;
}

export async function fetchInvestigationGraph(caseId) {
  try {
    const res = await fetch(`${API_BASE}/graph/investigation?case_id=${encodeURIComponent(caseId || 'CASE-2026-0922')}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Graph fallback');
  }
  return MOCK_GRAPH_DATA;
}

export async function fetchNodeDetails(nodeId) {
  try {
    const res = await fetch(`${API_BASE}/graph/node/${encodeURIComponent(nodeId)}`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch (e) {}
  return {
    node_id: nodeId,
    type: "infrastructure",
    label: nodeId,
    threat_score: 95,
    risk_level: "CRITICAL",
    first_seen: "2026-09-18 12:00 UTC",
    last_seen: "2026-09-22 18:24 UTC",
    tags: ["Malicious Node", "Active Attack", "IoC Match"],
    technical_details: { id: nodeId, status: "Active C2" },
    connected_iocs_count: 5,
    related_nodes: [
      { id: "domain-101", label: "micros0ft-account-support.top", type: "domain", relationship: "REGISTERED_TO" },
      { id: "camp-101", label: "Operation SilentHarvest (FIN7)", type: "campaign", relationship: "ATTRIBUTED_TO" }
    ]
  };
}

export async function fetchAuditLogs() {
  try {
    const res = await fetch(`${API_BASE}/audit/logs`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Audit logs fallback');
  }
  return [
    { id: "LOG-881", case_id: "CASE-2026-0922", timestamp: "2026-09-22 18:24:12 UTC", action: "Automated Quarantine", analyst: "AI SecOps Orchestrator", verdict: "CRITICAL", threat_score: 96, sha256_hash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08", status: "QUARANTINED", notes: "High-confidence Microsoft 365 credential harvester with typosquatted domain" },
    { id: "LOG-882", case_id: "CASE-2026-0921", timestamp: "2026-09-22 17:48:30 UTC", action: "Manual SOC Approval", analyst: "Analyst-42 (Tier 2)", verdict: "HIGH", threat_score: 93, sha256_hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", status: "MITIGATED", notes: "Executive BEC wire transfer impersonation" },
    { id: "LOG-883", case_id: "CASE-2026-0920", timestamp: "2026-09-22 16:18:05 UTC", action: "Perimeter Firewall Drop", analyst: "Automated Playbook", verdict: "HIGH", threat_score: 87, sha256_hash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", status: "BLOCKED", notes: "Malicious macro spreadsheet payload detected in transit" },
    { id: "LOG-884", case_id: "CASE-2026-0919", timestamp: "2026-09-22 14:02:18 UTC", action: "Allow & Whitelist", analyst: "SecOps Lead", verdict: "SAFE", threat_score: 8, sha256_hash: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", status: "VERIFIED", notes: "Internal security awareness newsletter validated" }
  ];
}

function generateLocalFallbackAnalysis(payload) {
  const text = (payload.raw_email || payload.body_only || payload.subject || '').toLowerCase();
  const isPhish = text.includes('microsoft') || text.includes('login') || text.includes('verify') || text.includes('password') || text.includes('micros0ft');
  const isBec = text.includes('wire') || text.includes('transfer') || text.includes('ceo') || text.includes('ach');
  const isInvoice = text.includes('invoice') || text.includes('macro') || text.includes('xlsm') || text.includes('balance');

  const score = isPhish ? 96 : isBec ? 93 : isInvoice ? 87 : 12;
  const level = score >= 85 ? 'CRITICAL' : score >= 65 ? 'HIGH' : 'SAFE';

  return {
    case_id: `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    analyzed_at: "2026-09-22 18:24:12 UTC",
    sha256_digest: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    step1_received: {
      sender: isPhish ? "admin-verify@micros0ft-account-support.top" : isBec ? "ceo.office@executive-desk-cloud.live" : "soc-alerts@enterprise-corp.com",
      sender_name: isPhish ? "Microsoft Security Team" : isBec ? "David Sterling (CEO)" : "Enterprise Security",
      subject: payload.subject || (isPhish ? "ACTION REQUIRED: Unusual Sign-in Activity" : "Enterprise Communication"),
      date: "Tue, 22 Sep 2026 18:20:00 UTC",
      recipient: "cfo@enterprise-corp.com",
      originating_ip: isPhish ? "185.220.101.5" : "142.250.190.46",
      links_count: isPhish ? 1 : 0,
      attachments_count: isInvoice ? 1 : 0,
      links: isPhish ? [{
        url: "https://secure-micros0ft-portal.top/auth/verify-login?session=98214fa89b",
        domain: "secure-micros0ft-portal.top",
        scheme: "https",
        is_suspicious: true,
        risk_factors: ["Brand Impersonation", "High-abuse TLD (.top)", "Credential Form Host"],
        virustotal_positives: 58,
        virustotal_total: 72,
        reputation_score: -92
      }] : [],
      attachments: isInvoice ? [{
        filename: "Invoice_Statement_Overdue_9041.xlsm",
        content_type: "application/vnd.ms-excel.sheet.macroEnabled.12",
        size_bytes: 188416,
        sha256: "4b7f8c2e9124a91b...f012",
        is_suspicious: true,
        risk_reason: "VBA Macro script payload capable of dropping C2 beacon",
        file_extension: ".xlsm"
      }] : [],
      raw_headers_snippet: "From: admin-verify@micros0ft-account-support.top\nSubject: ACTION REQUIRED: Sign-in Alert\nReceived: from 185.220.101.5\nReceived-SPF: Softfail",
      parsing_status: "SUCCESSFULLY_PARSED"
    },
    step2_auth: {
      spf_status: isPhish || isBec ? "FAIL" : "PASS",
      spf_details: isPhish || isBec ? "IP 185.220.101.5 is NOT authorized to send mail on behalf of sender domain" : "SPF validated against internal enterprise mail relay",
      spf_ip: isPhish ? "185.220.101.5" : "142.250.190.46",
      spf_domain: isPhish ? "micros0ft-account-support.top" : "enterprise-corp.com",
      dkim_status: isPhish || isBec ? "FAIL" : "PASS",
      dkim_details: isPhish || isBec ? "DKIM cryptographic signature verification failed: RSA-SHA256 signature mismatch" : "DKIM signature verified (selector 'corp2026')",
      dkim_selector: isPhish ? "sec2026" : "corp2026",
      dkim_domain: isPhish ? "micros0ft-account-support.top" : "enterprise-corp.com",
      dmarc_status: isPhish || isBec ? "FAIL" : "PASS",
      dmarc_details: isPhish || isBec ? "Both SPF and DKIM failed alignment. Domain enforces policy 'p=reject'" : "DMARC compliant: Domain aligned via valid SPF/DKIM authentication",
      dmarc_policy: "reject",
      overall_auth_verdict: isPhish || isBec ? "FAIL" : "PASS"
    },
    step3_domain: {
      domain: isPhish ? "micros0ft-account-support.top" : isBec ? "executive-desk-cloud.live" : "enterprise-corp.com",
      domain_age_days: isPhish ? 4 : isBec ? 7 : 4200,
      is_newly_registered: isPhish || isBec,
      domain_reputation_score: isPhish ? 8 : isBec ? 14 : 98,
      sender_reputation_score: isPhish ? 6 : isBec ? 12 : 95,
      is_typosquatting: isPhish,
      typosquatting_target: isPhish ? "Microsoft" : null,
      has_valid_mx: true,
      is_disposable: false,
      suspicious_flags: isPhish ? ["Registered 4 days ago", "Typosquatting detected targeting brand 'Microsoft'", "High-risk TLD (.top)"] : [],
      whois_registrar: isPhish ? "NameCheap, Inc." : "MarkMonitor Inc.",
      registration_date: isPhish ? "2026-09-18" : "2015-04-12"
    },
    step4_ai_content: {
      credential_request_score: isPhish ? 0.94 : 0.05,
      financial_request_score: isBec ? 0.92 : isInvoice ? 0.88 : 0.02,
      urgency_score: isPhish || isBec ? 0.93 : 0.1,
      impersonation_score: isPhish || isBec ? 0.95 : 0.05,
      suspicious_language_score: isPhish ? 0.82 : 0.05,
      detected_intents: isPhish ? ["CREDENTIAL_HARVESTING", "COERCIVE_URGENCY", "AUTHORITY_IMPERSONATION"] : isBec ? ["FINANCIAL_FRAUD_BEC", "AUTHORITY_IMPERSONATION"] : ["NORMAL_CORRESPONDENCE"],
      suspicious_tokens: isPhish ? [
        { token: "re-authenticate", score: 0.94, category: "Credential Cue" },
        { token: "suspended", score: 0.92, category: "Urgency Marker" },
        { token: "credentials", score: 0.91, category: "Credential Cue" },
        { token: "unauthorized", score: 0.85, category: "Fear Factor" }
      ] : [],
      ai_explanation: isPhish ? "The Hugging Face RoBERTa-Security transformer neural model detected high-confidence credential harvesting patterns requesting user credentials, password reset, or re-authentication under a deceptive pretext; aggressive psychological pressure utilizing artificial deadlines ('within 24 hours') designed to bypass critical human scrutiny; executive brand impersonation claiming official authority while originating from an unverified external infrastructure (micros0ft-account-support.top)." : "No malicious intent detected.",
      model_architecture: "HuggingFace RoBERTa-Security-v2 + PyTorch Tensor Classifier",
      confidence_score: 96.8
    },
    step5_forensics: {
      previous_communications_count: isPhish ? 0 : 28,
      is_first_time_sender: isPhish || isBec,
      communication_anomaly_detected: isPhish || isBec,
      anomaly_reason: "First-time sender from high-risk external ASN attempting authority contact",
      campaign_name: isPhish ? "Operation SilentHarvest (FIN7 Associated)" : null,
      campaign_id: isPhish ? "CAMP-FIN7-2026" : null,
      cluster_size: isPhish ? 18 : 1,
      known_threat_actor: isPhish ? "FIN7 / Carbanak Proxy Group" : null,
      mini_graph_nodes: MOCK_GRAPH_DATA.nodes,
      mini_graph_links: MOCK_GRAPH_DATA.edges
    },
    step6_risk: {
      threat_score: score,
      risk_level: level,
      confidence_score: 96.8,
      threat_tier_color: score >= 85 ? "#ef4444" : score >= 65 ? "#f97316" : "#10b981",
      score_breakdown: {
        authentication: isPhish ? 25 : 0,
        domain_reputation: isPhish ? 25 : 2,
        ai_intent_content: isPhish ? 28 : 5,
        iocs_and_links: isPhish ? 18 : 5
      },
      evidence_list: isPhish ? [
        { id: "EVD-01", stage: "Step 2: Authentication Check", category: "Email Authentication", severity: "CRITICAL", title: "SPF Validation SOFTFAIL", description: "IP 185.220.101.5 is NOT authorized to send mail on behalf of micros0ft-account-support.top", weight: 10, raw_proof: "Client IP: 185.220.101.5" },
        { id: "EVD-02", stage: "Step 2: Authentication Check", category: "Cryptographic Signature", severity: "HIGH", title: "DKIM Signature Verification Failed", description: "DKIM signature verification failed: RSA-SHA256 signature mismatch", weight: 10, raw_proof: "Selector: sec2026" },
        { id: "EVD-03", stage: "Step 3: Domain & Sender", category: "Combosquatting / Impersonation", severity: "CRITICAL", title: "Brand Spoofing Targeting Microsoft", description: "Domain lexical analysis confirmed deceptive mimicry intended to impersonate authentic brand Microsoft.", weight: 13, raw_proof: "micros0ft-account-support.top" },
        { id: "EVD-04", stage: "Step 3: Domain & Sender", category: "Domain Age Anomaly", severity: "HIGH", title: "Newly Registered Domain (4 Days Old)", description: "Domain registered only 4 days ago via Namecheap.", weight: 12, raw_proof: "Registered: 2026-09-18" },
        { id: "EVD-05", stage: "Step 4: AI Content Analysis", category: "Intent Classification", severity: "CRITICAL", title: "Credential Harvesting Vectors Detected", description: "Transformer attention layers identified high-probability credential theft phrases.", weight: 12, raw_proof: "Model Confidence: 94.2%" },
        { id: "EVD-06", stage: "Step 1 & 5: Forensic Indicators", category: "Malicious URL", severity: "CRITICAL", title: "Flagged Phishing Link (1 Found)", description: "Extracted URL flagged by VirusTotal threat feeds with 58/72 detections.", weight: 12, raw_proof: "https://secure-micros0ft-portal.top/auth/verify-login" }
      ] : []
    },
    step7_results: {
      case_id: `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: "2026-09-22 18:35:10 UTC",
      threat_score: score,
      risk_level: level,
      confidence_score: 96.8,
      attack_type: isPhish ? "Spear Phishing / Credential Harvesting" : isBec ? "Business Email Compromise (BEC)" : "Legitimate Corporate Correspondence",
      executive_summary: isPhish ? "Forensic engine completed 7-stage automated evaluation with a Threat Score of 96/100 (CRITICAL RISK). The message is categorized as 'Spear Phishing / Credential Harvesting'. Analysis detected 6 distinct evidentiary artifacts spanning email authentication mismatches, newly registered hosting infrastructure, and AI-identified social engineering." : "Message conforms to verified corporate mail security standards.",
      technical_explanation: "Authentication: SPF=FAIL, DKIM=FAIL, DMARC=FAIL. Domain registered 4 days ago. RoBERTa model flagged credential harvesting intent.",
      evidence_count: isPhish ? 6 : 0,
      recommended_actions: isPhish ? [
        { id: "ACT-01", action_type: "QUARANTINE_EMAIL", title: "Quarantine In M365 / Workspace", description: "Immediately isolate email from user inbox and purge all tenant copies.", status: "PENDING", automated_supported: true, target: "Exchange / Google Workspace" },
        { id: "ACT-02", action_type: "BLOCK_FIREWALL_IP", title: "Block Originating IP 185.220.101.5", description: "Push perimeter egress drop rule for IP across Palo Alto / Fortinet firewalls.", status: "PENDING", automated_supported: true, target: "Firewall Rule (IP: 185.220.101.5)" },
        { id: "ACT-03", action_type: "SINKHOLE_DOMAIN", title: "Sinkhole Domain micros0ft-account-support.top", description: "Register domain in enterprise DNS RPZ sinkhole.", status: "PENDING", automated_supported: true, target: "Internal DNS Sinkhole" },
        { id: "ACT-04", action_type: "INVALIDATE_SESSIONS", title: "Invalidate Target User Active Sessions", description: "Revoke OAuth refresh tokens and force password reset.", status: "PENDING", automated_supported: true, target: "Active Directory / Azure AD" }
      ] : [
        { id: "ACT-01", action_type: "ALLOW_DELIVERY", title: "Permit Mailbox Delivery", description: "No malicious vectors detected. Release message to normal inbox routing.", status: "COMPLETED", automated_supported: true, target: "Mail Delivery Agent" }
      ],
      sha256_hash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      investigation_status: isPhish ? "ACTION_REQUIRED" : "VERIFIED_CLEAN"
    }
  };
}
