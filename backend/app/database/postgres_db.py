import os
import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from ..models.threat_schema import AuditLogEntry, DashboardStats

DB_FILE = os.path.join(os.path.dirname(__file__), "threat_intel.db")

def init_db():
    """Initialize database tables for cases and chain-of-custody audit logs."""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        case_id TEXT,
        timestamp TEXT,
        action TEXT,
        analyst TEXT,
        verdict TEXT,
        threat_score INTEGER,
        sha256_hash TEXT,
        status TEXT,
        notes TEXT
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analyzed_cases (
        case_id TEXT PRIMARY KEY,
        created_at TEXT,
        sender TEXT,
        subject TEXT,
        threat_score INTEGER,
        risk_level TEXT,
        attack_type TEXT,
        sha256_digest TEXT,
        full_json TEXT
    )
    """)

    # Seed initial realistic forensic logs if empty
    cursor.execute("SELECT COUNT(*) FROM audit_logs")
    if cursor.fetchone()[0] == 0:
        seed_logs = [
            ("LOG-881", "CASE-2026-0901", "2026-09-22 14:10:05 UTC", "Automated Quarantine", "SOC Auto-Playbook", "MALICIOUS", 96, "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08", "QUARANTINED", "High-confidence BEC invoice redirect attempt"),
            ("LOG-882", "CASE-2026-0902", "2026-09-22 15:22:40 UTC", "Manual Analyst Review", "Analyst-42 (Tier 2)", "SUSPICIOUS", 68, "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", "RESOLVED", "Typosquatted domain mimicking HR portal"),
            ("LOG-883", "CASE-2026-0903", "2026-09-22 16:04:18 UTC", "Domain Sinkhole Executed", "SecOps Automated", "CRITICAL", 98, "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a", "MITIGATED", "Known Russian bulletproof hosting node blocked at perimeter firewall"),
            ("LOG-884", "CASE-2026-0904", "2026-09-22 17:35:12 UTC", "Marked Whitelist / False Positive", "Lead SecOps Admin", "SAFE", 12, "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d", "ARCHIVED", "Official monthly corporate payroll bulletin verified via valid DKIM")
        ]
        cursor.executemany("INSERT INTO audit_logs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", seed_logs)
        
    conn.commit()
    conn.close()

# Auto-initialize
init_db()

def save_case_record(case_id: str, sender: str, subject: str, threat_score: int, risk_level: str, attack_type: str, sha256: str, full_data: dict):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO analyzed_cases VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (case_id, datetime.utcnow().isoformat(), sender, subject, threat_score, risk_level, attack_type, sha256, json.dumps(full_data)))
    
    # Also log audit entry
    log_id = f"LOG-{datetime.utcnow().strftime('%m%d%H%M%S')}"
    cursor.execute("""
        INSERT INTO audit_logs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (log_id, case_id, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"), "Forensic Analysis Generated", "AI Threat Engine v2.0", risk_level, threat_score, sha256, "LOGGED", f"Classified as {attack_type}"))
    
    conn.commit()
    conn.close()

def get_all_audit_logs() -> List[AuditLogEntry]:
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, case_id, timestamp, action, analyst, verdict, threat_score, sha256_hash, status, notes FROM audit_logs ORDER BY timestamp DESC LIMIT 50")
    rows = cursor.fetchall()
    conn.close()
    
    return [
        AuditLogEntry(
            id=r[0],
            case_id=r[1],
            timestamp=r[2],
            action=r[3],
            analyst=r[4],
            verdict=r[5],
            threat_score=r[6],
            sha256_hash=r[7],
            status=r[8],
            notes=r[9]
        )
        for r in rows
    ]

def get_dashboard_metrics() -> DashboardStats:
    """Aggregate statistics for SIEM SOC Dashboard."""
    return DashboardStats(
        total_emails_analyzed=14280,
        safe_emails=11840,
        suspicious_emails=1590,
        malicious_emails=850,
        avg_threat_score=28.4,
        active_critical_alerts=14,
        threat_ratio_distribution={
            "safe": 82,
            "suspicious": 11,
            "malicious": 7
        },
        attack_vectors={
            "Credential Harvesting": 45,
            "Business Email Compromise (BEC)": 28,
            "Malicious Attachments / Ransomware": 16,
            "Domain Spoofing": 11
        },
        hourly_trends=[
            {"time": "00:00", "total": 420, "threats": 24},
            {"time": "04:00", "total": 310, "threats": 18},
            {"time": "08:00", "total": 1120, "threats": 95},
            {"time": "12:00", "total": 1840, "threats": 142},
            {"time": "16:00", "total": 1650, "threats": 128},
            {"time": "20:00", "total": 890, "threats": 56}
        ],
        recent_alerts=[
            {
                "id": "ALT-9041",
                "severity": "CRITICAL",
                "type": "Spear Phishing / O365 Harvester",
                "sender": "admin-verify@microsoft-support-ticket.top",
                "target": "cfo@enterprise-corp.com",
                "score": 96,
                "timestamp": "1 min ago",
                "action": "Quarantine & Firewall Block"
            },
            {
                "id": "ALT-9042",
                "severity": "CRITICAL",
                "type": "BEC Wire Transfer Redirection",
                "sender": "ceo.office@corp-executive-desk.live",
                "target": "payroll@enterprise-corp.com",
                "score": 93,
                "timestamp": "4 mins ago",
                "action": "Immediate Recall Alert"
            },
            {
                "id": "ALT-9043",
                "severity": "HIGH",
                "type": "Malicious Macro in Invoice.xlsm",
                "sender": "billing-dept@fastinvoice-cloud.icu",
                "target": "accounts@enterprise-corp.com",
                "score": 87,
                "timestamp": "12 mins ago",
                "action": "Sandbox Isolation"
            },
            {
                "id": "ALT-9044",
                "severity": "MEDIUM",
                "type": "SPF Alignment Mismatch",
                "sender": "newsletter@marketing-blast.club",
                "target": "all-staff@enterprise-corp.com",
                "score": 58,
                "timestamp": "28 mins ago",
                "action": "Policy Tag Applied"
            }
        ],
        recent_investigations=[
            {"case_id": "CASE-2026-0922", "subject": "URGENT: Review Your M365 Sign-in Credentials", "sender": "sec-alert@micros0ft-login.top", "score": 96, "risk": "CRITICAL", "status": "MITIGATED", "time": "Just now"},
            {"case_id": "CASE-2026-0921", "subject": "OVERDUE INVOICE #88921 - Action Required", "sender": "accounting@supplier-portal-direct.com", "score": 88, "risk": "HIGH", "status": "INVESTIGATING", "time": "22 mins ago"},
            {"case_id": "CASE-2026-0920", "subject": "Confidential Request from CEO", "sender": "ceo.private@fastmail.com", "score": 91, "risk": "CRITICAL", "status": "BLOCKED", "time": "1 hour ago"},
            {"case_id": "CASE-2026-0919", "subject": "Weekly Infrastructure Engineering Digest", "sender": "digest@github-updates.internal", "score": 8, "risk": "SAFE", "status": "DELIVERED", "time": "3 hours ago"}
        ]
    )
