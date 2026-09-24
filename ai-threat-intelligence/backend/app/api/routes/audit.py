from fastapi import APIRouter
from typing import List
from ...models.threat_schema import AuditLogEntry
from ...database.postgres_db import get_all_audit_logs

router = APIRouter(prefix="/audit", tags=["Chain of Custody & Audit Logs"])

@router.get("/logs", response_model=List[AuditLogEntry])
def list_audit_logs():
    """Retrieve tamper-evident chain-of-custody audit logs with SHA-256 integrity verification."""
    return get_all_audit_logs()
