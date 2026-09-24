from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api.routes.analyze import router as analyze_router
from app.api.routes.threat_intel import router as threat_intel_router
from app.api.routes.virustotal import router as vt_router
from app.api.routes.geolocation import router as geo_router
from app.api.routes.graph import router as graph_router
from app.api.routes.audit import router as audit_router

app = FastAPI(
    title="AI Threat Intelligence Platform API",
    description="AI-Powered Email Threat Detection, GeoLocation and Forensic Intelligence Platform (SIH 2026)",
    version="2.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes under /api
app.include_router(analyze_router, prefix="/api")
app.include_router(threat_intel_router, prefix="/api")
app.include_router(vt_router, prefix="/api")
app.include_router(geo_router, prefix="/api")
app.include_router(graph_router, prefix="/api")
app.include_router(audit_router, prefix="/api")

@app.get("/")
def root():
    return {
        "status": "ONLINE",
        "service": "AI Threat Intelligence API",
        "version": "2.0.0",
        "sih_stage": "Page 3 Forensic Pipeline Implemented",
        "endpoints": [
            "/api/analyze/email",
            "/api/analyze/scenarios",
            "/api/threat-intel/dashboard",
            "/api/threat-intel/timeline",
            "/api/virustotal/scan",
            "/api/geolocation/lookup",
            "/api/geolocation/threat-origins",
            "/api/graph/investigation",
            "/api/audit/logs"
        ]
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "services": {
            "email_parser": "operational",
            "auth_verifier": "operational (SPF/DKIM/DMARC)",
            "ai_engine": "operational (RoBERTa + PyTorch)",
            "knowledge_graph": "operational (Neo4j Engine)",
            "database": "operational (PostgreSQL / SQLite Storage)",
            "virustotal": "operational (Multi-Vendor Client)",
            "geolocation": "operational (GeoLite2 / IPinfo)"
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
