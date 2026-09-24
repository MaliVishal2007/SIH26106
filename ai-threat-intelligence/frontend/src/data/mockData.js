export const MOCK_SCENARIOS = [
  {
    id: "scenario_m365_phish",
    name: "🚨 Microsoft 365 Credential Harvester",
    badge: "CRITICAL THREAT",
    badgeColor: "red",
    description: "Urgent sign-in verification phishing email with typosquatted domain, failing SPF/DKIM, and credential-harvesting link.",
    sender: "Microsoft Security Team <admin-verify@micros0ft-account-support.top>",
    subject: "ACTION REQUIRED: Unusual Sign-in Activity Detected on Your Account",
    originating_ip: "185.220.101.5",
    headers: `Received: from mail.micros0ft-account-support.top (185.220.101.5) by mx.enterprise-corp.com with SMTP id 9f1234;
    Tue, 22 Sep 2026 18:20:11 +0000
Received-SPF: Softfail (protection.outlook.com: domain of transition micros0ft-account-support.top discourages use of 185.220.101.5)
Authentication-Results: spf=softfail (sender IP is 185.220.101.5) smtp.mailfrom=micros0ft-account-support.top; dkim=fail (signature did not verify); dmarc=fail (p=reject)
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=micros0ft-account-support.top; s=sec2026; bh=invalidhash...; b=tampered...
From: "Microsoft Security Team" <admin-verify@micros0ft-account-support.top>
To: <cfo@enterprise-corp.com>
Subject: ACTION REQUIRED: Unusual Sign-in Activity Detected on Your Account
Date: Tue, 22 Sep 2026 18:20:00 +0000
Message-ID: <202609221820.mssec991@micros0ft-account-support.top>`,
    body: `Dear Valued User,

We detected an unauthorized sign-in attempt to your Microsoft 365 enterprise account from an unrecognized IP address (Moscow, Russian Federation).

For your protection, your access will be suspended within 24 hours unless you re-authenticate and confirm your identity immediately.

Click here to verify your credentials:
https://secure-micros0ft-portal.top/auth/verify-login?session=98214fa89b

Failure to complete verification will result in immediate mailbox termination and loss of all cached corporate files.

Sincerely,
Microsoft Cloud Security Response Team`
  },
  {
    id: "scenario_bec_wire",
    name: "💼 Executive Wire Fraud (BEC)",
    badge: "HIGH THREAT",
    badgeColor: "orange",
    description: "CEO impersonation requesting an urgent confidential wire transfer to a vendor account without prior notice.",
    sender: "David Sterling (CEO) <ceo.office@executive-desk-cloud.live>",
    subject: "Confidential: Urgent Vendor Payment Wire Before 5 PM EST",
    originating_ip: "45.142.122.88",
    headers: `Received: from mail.executive-desk-cloud.live (45.142.122.88) by mx.enterprise-corp.com with ESMTP id bec774;
    Tue, 22 Sep 2026 17:45:00 +0000
Received-SPF: Fail (mail.executive-desk-cloud.live: domain does not authorize 45.142.122.88)
Authentication-Results: spf=fail; dkim=none; dmarc=fail
From: "David Sterling" <ceo.office@executive-desk-cloud.live>
Reply-To: <ceo.private.advisory@proton.me>
To: <payroll@enterprise-corp.com>, <accounts-payable@enterprise-corp.com>
Subject: Confidential: Urgent Vendor Payment Wire Before 5 PM EST
Date: Tue, 22 Sep 2026 17:45:00 +0000`,
    body: `Are you at your desk?

We are in the final stages of closing an urgent confidential acquisition with our international logistics supplier. 

I need you to process an immediate ACH/wire transfer of $148,500 to the updated vendor account. Due to ongoing NDA agreements, please do not discuss this with anyone in the office.

Send me a confirmation once you are ready so I can furnish the updated bank routing numbers and swift code. Treat this with maximum priority.

David Sterling
Chief Executive Officer`
  },
  {
    id: "scenario_macro_invoice",
    name: "📎 Malicious Macro Invoice (.XLSM)",
    badge: "HIGH THREAT",
    badgeColor: "orange",
    description: "Fake overdue billing notice carrying weaponized Excel macro payload designed to drop Cobalt Strike beacon.",
    sender: "FastBill Accounts <billing@globalinvoices-delivery.icu>",
    subject: "OVERDUE NOTICE: Remittance Invoice #INV-2026-9041 Attached",
    originating_ip: "194.26.29.112",
    headers: `Received: from smtp.globalinvoices-delivery.icu (194.26.29.112) by mx.enterprise-corp.com with SMTP id inv998;
    Tue, 22 Sep 2026 16:15:22 +0000
Received-SPF: Fail (ip 194.26.29.112 not permitted)
DKIM-Signature: none
From: "FastBill Billing Department" <billing@globalinvoices-delivery.icu>
To: <finance@enterprise-corp.com>
Subject: OVERDUE NOTICE: Remittance Invoice #INV-2026-9041 Attached
Content-Type: multipart/mixed; boundary="====BOUNDARY===="
Date: Tue, 22 Sep 2026 16:15:22 +0000`,
    body: `ATTENTION: ACCOUNTS PAYABLE

Your company has an outstanding balance of $32,490.00 that is now 45 days past due. Late penalty fees will be applied starting tomorrow morning.

Please review the attached spreadsheet for itemized line items and banking remittance instructions:
Attached File: Invoice_Statement_Overdue_9041.xlsm (Size: 184 KB, Macro-Enabled)

Enable macros upon opening to view signed electronic purchase order.

Global Logistics Remittance LLC`
  },
  {
    id: "scenario_legit_newsletter",
    name: "✅ Legitimate Corporate Security Bulletin",
    badge: "VERIFIED SAFE",
    badgeColor: "green",
    description: "Authentic internal communication with passing SPF, DKIM, and DMARC alignment and zero phishing markers.",
    sender: "Cybersecurity Operations <soc-alerts@enterprise-corp.com>",
    subject: "Enterprise Security Digest: Q3 Best Practices & Phishing Awareness",
    originating_ip: "142.250.190.46",
    headers: `Received: from mail-relay.enterprise-corp.com (142.250.190.46) by mx.enterprise-corp.com with ESMTPS id corp881;
    Tue, 22 Sep 2026 14:00:10 +0000
Received-SPF: Pass (protection.outlook.com: domain of enterprise-corp.com designates 142.250.190.46 as permitted sender)
Authentication-Results: spf=pass; dkim=pass (signature verified); dmarc=pass (p=reject)
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=enterprise-corp.com; s=corp2026; bh=validhash994=; b=validSignature...
From: "Cybersecurity Operations" <soc-alerts@enterprise-corp.com>
To: <all-employees@enterprise-corp.com>
Subject: Enterprise Security Digest: Q3 Best Practices & Phishing Awareness
Date: Tue, 22 Sep 2026 14:00:00 +0000`,
    body: `Team,

As part of Cybersecurity Awareness Month, our Security Operations Center is highlighting key security practices for the third quarter:

1. Always inspect sender email headers before clicking external links.
2. Confirm banking changes via secondary out-of-band phone verification.
3. Report suspicious emails using the 'Report Threat' button in Outlook.

You can review our internal security documentation at:
https://intranet.enterprise-corp.com/security/guidelines

Stay vigilant,
Enterprise Security Team`
  }
];

export const MOCK_DASHBOARD_STATS = {
  total_emails_analyzed: 14280,
  safe_emails: 11840,
  suspicious_emails: 1590,
  malicious_emails: 850,
  avg_threat_score: 28.4,
  active_critical_alerts: 14,
  threat_ratio_distribution: { safe: 82, suspicious: 11, malicious: 7 },
  attack_vectors: {
    "Credential Harvesting": 45,
    "Business Email Compromise (BEC)": 28,
    "Malicious Attachments / Ransomware": 16,
    "Domain Spoofing": 11
  },
  hourly_trends: [
    { time: "00:00", total: 420, threats: 24 },
    { time: "04:00", total: 310, threats: 18 },
    { time: "08:00", total: 1120, threats: 95 },
    { time: "12:00", total: 1840, threats: 142 },
    { time: "16:00", total: 1650, threats: 128 },
    { time: "20:00", total: 890, threats: 56 }
  ],
  recent_alerts: [
    {
      id: "ALT-9041",
      severity: "CRITICAL",
      type: "Spear Phishing / O365 Harvester",
      sender: "admin-verify@microsoft-support-ticket.top",
      target: "cfo@enterprise-corp.com",
      score: 96,
      timestamp: "1 min ago",
      action: "Quarantine & Firewall Block"
    },
    {
      id: "ALT-9042",
      severity: "CRITICAL",
      type: "BEC Wire Transfer Redirection",
      sender: "ceo.office@corp-executive-desk.live",
      target: "payroll@enterprise-corp.com",
      score: 93,
      timestamp: "4 mins ago",
      action: "Immediate Recall Alert"
    },
    {
      id: "ALT-9043",
      severity: "HIGH",
      type: "Malicious Macro in Invoice.xlsm",
      sender: "billing-dept@fastinvoice-cloud.icu",
      target: "accounts@enterprise-corp.com",
      score: 87,
      timestamp: "12 mins ago",
      action: "Sandbox Isolation"
    },
    {
      id: "ALT-9044",
      severity: "MEDIUM",
      type: "SPF Alignment Mismatch",
      sender: "newsletter@marketing-blast.club",
      target: "all-staff@enterprise-corp.com",
      score: 58,
      timestamp: "28 mins ago",
      action: "Policy Tag Applied"
    }
  ],
  recent_investigations: [
    { case_id: "CASE-2026-0922", subject: "URGENT: Review Your M365 Sign-in Credentials", sender: "sec-alert@micros0ft-login.top", score: 96, risk: "CRITICAL", status: "MITIGATED", time: "Just now" },
    { case_id: "CASE-2026-0921", subject: "OVERDUE INVOICE #88921 - Action Required", sender: "accounting@supplier-portal-direct.com", score: 88, risk: "HIGH", status: "INVESTIGATING", time: "22 mins ago" },
    { case_id: "CASE-2026-0920", subject: "Confidential Request from CEO", sender: "ceo.private@fastmail.com", score: 91, risk: "CRITICAL", status: "BLOCKED", time: "1 hour ago" },
    { case_id: "CASE-2026-0919", subject: "Weekly Infrastructure Engineering Digest", sender: "digest@github-updates.internal", score: 8, risk: "SAFE", status: "DELIVERED", time: "3 hours ago" }
  ]
};

export const MOCK_GRAPH_DATA = {
  case_id: "CASE-2026-0922",
  nodes: [
    { id: "email-101", label: "Phish: M365 Credential Harvester", type: "email", risk_level: "CRITICAL", threat_score: 96, properties: { subject: "Unusual Sign-in Activity Detected", date: "2026-09-22 18:20 UTC" } },
    { id: "sender-101", label: "admin-verify@micros0ft-account-support.top", type: "sender", risk_level: "CRITICAL", threat_score: 95, properties: { reputation: 8, first_seen: "2026-09-18" } },
    { id: "domain-101", label: "micros0ft-account-support.top", type: "domain", risk_level: "CRITICAL", threat_score: 98, properties: { age_days: 4, registrar: "Namecheap Inc", typosquat: "Microsoft" } },
    { id: "ip-101", label: "185.220.101.5", type: "ip", risk_level: "CRITICAL", threat_score: 98, properties: { country: "Germany", asn: "AS200651", is_tor: true } },
    { id: "url-101", label: "https://secure-micros0ft-portal.top/auth/verify-login", type: "url", risk_level: "CRITICAL", threat_score: 95, properties: { vt_positives: 58, target: "Microsoft 365" } },
    { id: "att-101", label: "Security_Notice.pdf.exe", type: "attachment", risk_level: "HIGH", threat_score: 92, properties: { sha256: "4b7f8c2e9124...f012", type: "PE32 Executable" } },
    { id: "camp-101", label: "Operation SilentHarvest (FIN7)", type: "campaign", risk_level: "CRITICAL", threat_score: 99, properties: { actor: "FIN7 / Carbanak", target: "Enterprise SaaS" } },
    { id: "loc-101", label: "Frankfurt, Germany (Tor Node)", type: "location", risk_level: "MEDIUM", threat_score: 65, properties: { lat: 50.1109, lon: 8.6821 } }
  ],
  edges: [
    { id: "e1", source: "email-101", target: "sender-101", relationship: "SENT_BY", label: "Sent By" },
    { id: "e2", source: "sender-101", target: "domain-101", relationship: "REGISTERED_TO", label: "Domain Link" },
    { id: "e3", source: "domain-101", target: "ip-101", relationship: "RESOLVES_TO", label: "DNS A-Record" },
    { id: "e4", source: "email-101", target: "url-101", relationship: "CONTAINS_URL", label: "Contains Link" },
    { id: "e5", source: "email-101", target: "att-101", relationship: "ATTACHED_FILE", label: "Attachment" },
    { id: "e6", source: "url-101", target: "domain-101", relationship: "HOSTED_ON", label: "Host Domain" },
    { id: "e7", source: "ip-101", target: "loc-101", relationship: "LOCATED_IN", label: "Geo Origin" },
    { id: "e8", source: "domain-101", target: "camp-101", relationship: "ATTRIBUTED_TO", label: "Campaign Cluster" }
  ]
};

export const MOCK_THREAT_ORIGINS = [
  { id: "TH-01", ip: "185.220.101.5", country: "Germany", country_code: "DE", city: "Frankfurt", latitude: 50.1109, longitude: 8.6821, threat_type: "Tor Exit / Credential Relay", threat_score: 98, attack_count: 1420, last_detected: "2 mins ago" },
  { id: "TH-02", ip: "45.142.122.88", country: "Netherlands", country_code: "NL", city: "Amsterdam", latitude: 52.3676, longitude: 4.9041, threat_type: "FIN7 C2 Infrastructure", threat_score: 94, attack_count: 982, last_detected: "5 mins ago" },
  { id: "TH-03", ip: "194.26.29.112", country: "Russia", country_code: "RU", city: "Moscow", latitude: 55.7558, longitude: 37.6173, threat_type: "Cobalt Strike Team Server", threat_score: 91, attack_count: 640, last_detected: "12 mins ago" },
  { id: "TH-04", ip: "198.54.117.200", country: "United States", country_code: "US", city: "Los Angeles", latitude: 34.0522, longitude: -118.2437, threat_type: "Namecheap Phishing Dropper", threat_score: 85, attack_count: 1890, last_detected: "1 min ago" },
  { id: "TH-05", ip: "103.145.13.44", country: "Vietnam", country_code: "VN", city: "Hanoi", latitude: 21.0285, longitude: 105.8542, threat_type: "Credential Harvesting Proxy", threat_score: 78, attack_count: 430, last_detected: "24 mins ago" },
  { id: "TH-06", ip: "179.43.155.10", country: "Switzerland", country_code: "CH", city: "Zurich", latitude: 47.3769, longitude: 8.5417, threat_type: "DarkComet RAT Controller", threat_score: 89, attack_count: 712, last_detected: "18 mins ago" },
  { id: "TH-07", ip: "41.203.24.18", country: "Nigeria", country_code: "NG", city: "Lagos", latitude: 6.5244, longitude: 3.3792, threat_type: "BEC Executive Impersonator", threat_score: 82, attack_count: 1150, last_detected: "8 mins ago" },
  { id: "TH-08", ip: "114.119.144.12", country: "Singapore", country_code: "SG", city: "Singapore", latitude: 1.3521, longitude: 103.8198, threat_type: "Malicious Office Dropper", threat_score: 76, attack_count: 320, last_detected: "45 mins ago" }
];
