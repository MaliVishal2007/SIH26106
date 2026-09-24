from fastapi import APIRouter
from ...models.virustotal_schema import VTScanRequest, VTScanResponse
from ...threat_intelligence.virustotal_client import scan_target

router = APIRouter(prefix="/virustotal", tags=["VirusTotal Scanner"])

@router.post("/scan", response_model=VTScanResponse)
def scan_ioc(payload: VTScanRequest):
    """Scan URL, Domain, IP address, or File Hash across 72 antivirus engines."""
    return scan_target(target=payload.query, query_type=payload.query_type)
