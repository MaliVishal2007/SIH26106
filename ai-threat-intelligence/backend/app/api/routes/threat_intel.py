from fastapi import APIRouter
from ...models.threat_schema import DashboardStats, TimelineEvent
from ...database.postgres_db import get_dashboard_metrics

router = APIRouter(prefix="/threat-intel", tags=["Threat Intelligence"])

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_data():
    """Retrieve SOC dashboard KPI metrics, alert tickers, and threat vector breakdown."""
    return get_dashboard_metrics()

@router.get("/timeline")
def get_forensic_timeline():
    """Return chronological forensic timeline sequence for recent threat investigations."""
    return [
        TimelineEvent(
            id="TL-01",
            stage="Ingestion",
            title="Inbound SMTP Session Initiated",
            description="Perimeter Mail Gateway accepted connection from remote relay (185.220.101.5)",
            timestamp="2026-09-22 18:20:11.102 UTC",
            status="INFO",
            latency_ms=12,
            metadata={"protocol": "ESMTPS", "ciphers": "TLSv1.3 AES_256_GCM"}
        ),
        TimelineEvent(
            id="TL-02",
            stage="Authentication",
            title="SPF and DKIM Validation Failed",
            description="SPF evaluation returned Softfail; DKIM signature body hash verification mismatch",
            timestamp="2026-09-22 18:20:11.240 UTC",
            status="DANGER",
            latency_ms=138,
            metadata={"spf": "Softfail", "dkim": "Fail", "dmarc": "p=reject"}
        ),
        TimelineEvent(
            id="TL-03",
            stage="DNS & WHOIS",
            title="Domain Age Anomaly Identified",
            description="Domain 'micros0ft-account-support.top' detected as 4 days old via Namecheap registrar",
            timestamp="2026-09-22 18:20:11.450 UTC",
            status="WARNING",
            latency_ms=210,
            metadata={"age_days": 4, "typosquat": "Microsoft"}
        ),
        TimelineEvent(
            id="TL-04",
            stage="AI Inference",
            title="Neural NLP Credential Intent Flagged",
            description="RoBERTa-Security model calculated 94.2% credential harvesting confidence with coercive urgency",
            timestamp="2026-09-22 18:20:11.890 UTC",
            status="DANGER",
            latency_ms=440,
            metadata={"intent": "CREDENTIAL_HARVESTING", "model": "Hugging Face RoBERTa"}
        ),
        TimelineEvent(
            id="TL-05",
            stage="Threat Intel",
            title="VirusTotal IoC Multi-Vendor Match",
            description="Extracted login URL flagged malicious by 58 of 72 security vendors",
            timestamp="2026-09-22 18:20:12.310 UTC",
            status="DANGER",
            latency_ms=420,
            metadata={"positives": 58, "total": 72}
        ),
        TimelineEvent(
            id="TL-06",
            stage="Knowledge Graph",
            title="Neo4j Campaign Cluster Linked",
            description="Infrastructure graph linked domain and IP to known FIN7 / Carbanak spear phishing cluster",
            timestamp="2026-09-22 18:20:12.600 UTC",
            status="DANGER",
            latency_ms=290,
            metadata={"campaign": "Operation SilentHarvest"}
        ),
        TimelineEvent(
            id="TL-07",
            stage="SOC Remediation",
            title="Automated Containment Playbook Triggered",
            description="Message quarantined in Microsoft 365, originating IP blocked on firewall, and DNS sinkholed",
            timestamp="2026-09-22 18:20:12.980 UTC",
            status="SUCCESS",
            latency_ms=380,
            metadata={"playbook": "SECOP-AUTOPLAY-01", "actions": 3}
        )
    ]
