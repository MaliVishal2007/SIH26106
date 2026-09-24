from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # "email", "sender", "domain", "ip", "url", "attachment", "campaign", "location"
    risk_level: str = "MEDIUM"  # CRITICAL, HIGH, MEDIUM, LOW, SAFE
    threat_score: int = 50
    properties: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    relationship: str  # SENT_BY, RESOLVES_TO, HOSTED_AT, CONTAINS_URL, ATTACHED_FILE, ATTRIBUTED_TO, LOCATED_IN
    label: str
    properties: Dict[str, Any] = {}

class InvestigationGraphData(BaseModel):
    case_id: str
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    stats: Dict[str, int] = {}

class NodeDetailResponse(BaseModel):
    node_id: str
    type: str
    label: str
    threat_score: int
    risk_level: str
    first_seen: str
    last_seen: str
    tags: List[str]
    technical_details: Dict[str, Any]
    connected_iocs_count: int
    related_nodes: List[Dict[str, Any]]
