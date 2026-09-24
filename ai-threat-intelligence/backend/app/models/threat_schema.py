from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class TimelineEvent(BaseModel):
    id: str
    stage: str
    title: str
    description: str
    timestamp: str
    status: str  # SUCCESS, WARNING, DANGER, INFO
    latency_ms: int
    metadata: Dict[str, Any] = {}

class AuditLogEntry(BaseModel):
    id: str
    case_id: str
    timestamp: str
    action: str
    analyst: str
    verdict: str
    threat_score: int
    sha256_hash: str
    status: str
    notes: Optional[str] = None

class DashboardStats(BaseModel):
    total_emails_analyzed: int
    safe_emails: int
    suspicious_emails: int
    malicious_emails: int
    avg_threat_score: float
    active_critical_alerts: int
    threat_ratio_distribution: Dict[str, int]
    attack_vectors: Dict[str, int]
    hourly_trends: List[Dict[str, Any]]
    recent_alerts: List[Dict[str, Any]]
    recent_investigations: List[Dict[str, Any]]
