from fastapi import APIRouter, Query
from typing import List
from ...models.geo_schema import GeoLocationInfo, ThreatOriginPoint
from ...geolocation.geolite_service import lookup_ip_intelligence, get_global_threat_origins

router = APIRouter(prefix="/geolocation", tags=["Geolocation & IP Intelligence"])

@router.get("/lookup", response_model=GeoLocationInfo)
def lookup_ip(ip: str = Query(..., description="IPv4 or IPv6 address")):
    """Perform GeoLite2 / IPinfo geolocation, ASN lookup, and threat rating."""
    return lookup_ip_intelligence(ip)

@router.get("/threat-origins", response_model=List[ThreatOriginPoint])
def get_threat_origins():
    """Retrieve active geographic threat hotspots for map visualization."""
    return get_global_threat_origins()
