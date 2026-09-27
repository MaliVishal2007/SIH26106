from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class GeoLocationInfo(BaseModel):
    ip: str
    country: str
    country_code: str
    city: str
    region: Optional[str] = None
    latitude: float
    longitude: float
    timezone: Optional[str] = None
    isp: str
    organization: Optional[str] = None
    asn: str
    is_vpn: bool = False
    is_proxy: bool = False
    is_tor_exit_node: bool = False
    is_datacenter: bool = False
    abuse_confidence_score: int  # 0 to 100
    threat_reputation: str  # CRITICAL, HIGH, MEDIUM, LOW, CLEAN
    open_ports: List[int] = []
    registered_threat_actor: Optional[str] = None

class ThreatOriginPoint(BaseModel):
    id: str
    ip: str
    country: str
    country_code: str
    city: str
    latitude: float
    longitude: float
    threat_type: str
    threat_score: int
    attack_count: int
    last_detected: str

class IPIntelligenceResponse(BaseModel):
    ip_info: GeoLocationInfo
    associated_domains: List[str] = []
    associated_emails: List[str] = []
    detected_campaigns: List[str] = []
    reverse_dns: Optional[str] = None
    historical_threat_score: int
