from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class VTVendorResult(BaseModel):
    vendor_name: str
    category: str  # malicious, suspicious, clean, undetected, timeout
    result: Optional[str] = None  # e.g., "Phishing.Heur", "Trojan.Agent", "Clean"
    engine_version: Optional[str] = "2026.9"

class VTScanRequest(BaseModel):
    query: str  # URL, Domain, IP, or SHA-256/MD5 Hash
    query_type: str = "auto"  # "auto", "url", "domain", "ip", "hash"

class VTScanResponse(BaseModel):
    target: str
    target_type: str
    scan_id: str
    scan_date: str
    status: str = "completed"
    positives: int
    total_vendors: int
    detection_ratio: str  # e.g. "54/72"
    reputation_score: int  # -100 to +100
    threat_severity: str  # CRITICAL, HIGH, MEDIUM, LOW, CLEAN
    categories: List[str] = []
    community_votes: Dict[str, int] = {"harmless": 2, "malicious": 84}
    vendor_results: List[VTVendorResult] = []
    suggested_action: str
