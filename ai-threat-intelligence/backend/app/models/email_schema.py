from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class RawEmailInput(BaseModel):
    raw_email: Optional[str] = Field(None, description="Raw RFC822 email content with headers")
    headers_only: Optional[str] = Field(None, description="Pasted email headers")
    body_only: Optional[str] = Field(None, description="Pasted email body")
    sender: Optional[str] = Field(None, description="Sender email address override")
    subject: Optional[str] = Field(None, description="Subject line override")
    scenario_id: Optional[str] = Field(None, description="Pre-loaded scenario ID")

class AttachmentInfo(BaseModel):
    filename: str
    content_type: str
    size_bytes: int
    sha256: str
    is_suspicious: bool
    risk_reason: Optional[str] = None
    file_extension: str

class URLInfo(BaseModel):
    url: str
    domain: str
    scheme: str
    is_suspicious: bool
    risk_factors: List[str] = []
    virustotal_positives: int = 0
    virustotal_total: int = 72
    reputation_score: int = 0

class HeaderDetails(BaseModel):
    message_id: Optional[str] = None
    date: Optional[str] = None
    from_address: str
    from_display_name: Optional[str] = None
    return_path: Optional[str] = None
    reply_to: Optional[str] = None
    to_address: List[str] = []
    subject: str
    originating_ip: Optional[str] = None
    x_mailer: Optional[str] = None
    hop_count: int = 0
    all_headers: Dict[str, str] = {}

class Step1ReceivedResult(BaseModel):
    sender: str
    sender_name: Optional[str] = None
    subject: str
    date: Optional[str] = None
    recipient: str
    originating_ip: Optional[str] = None
    links_count: int = 0
    attachments_count: int = 0
    links: List[URLInfo] = []
    attachments: List[AttachmentInfo] = []
    raw_headers_snippet: str = ""
    parsing_status: str = "COMPLETED"

class Step2AuthResult(BaseModel):
    spf_status: str  # PASS, FAIL, SOFTFAIL, NEUTRAL, NONE
    spf_details: str
    spf_ip: Optional[str] = None
    spf_domain: Optional[str] = None
    dkim_status: str  # PASS, FAIL, INVALID_SIGNATURE, ABSENT
    dkim_details: str
    dkim_selector: Optional[str] = None
    dkim_domain: Optional[str] = None
    dmarc_status: str  # PASS, FAIL, QUARANTINE, REJECT, NONE
    dmarc_details: str
    dmarc_policy: Optional[str] = None
    overall_auth_verdict: str  # PASS, WARNING, FAIL

class Step3DomainResult(BaseModel):
    domain: str
    domain_age_days: int
    is_newly_registered: bool
    domain_reputation_score: int  # 0 to 100 (100 = trusted)
    sender_reputation_score: int
    is_typosquatting: bool
    typosquatting_target: Optional[str] = None
    has_valid_mx: bool
    is_disposable: bool
    suspicious_flags: List[str] = []
    whois_registrar: Optional[str] = None
    registration_date: Optional[str] = None

class Step4AIContentResult(BaseModel):
    credential_request_score: float  # 0.0 - 1.0
    financial_request_score: float
    urgency_score: float
    impersonation_score: float
    suspicious_language_score: float
    detected_intents: List[str] = []
    suspicious_tokens: List[Dict[str, Any]] = []
    ai_explanation: str
    model_architecture: str = "HuggingFace RoBERTa-Security + PyTorch"
    confidence_score: float

class Step5ForensicGraphResult(BaseModel):
    previous_communications_count: int
    is_first_time_sender: bool
    communication_anomaly_detected: bool
    anomaly_reason: Optional[str] = None
    campaign_name: Optional[str] = None
    campaign_id: Optional[str] = None
    cluster_size: int
    known_threat_actor: Optional[str] = None
    mini_graph_nodes: List[Dict[str, Any]] = []
    mini_graph_links: List[Dict[str, Any]] = []

class EvidenceItem(BaseModel):
    id: str
    stage: str
    category: str
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW, INFO
    title: str
    description: str
    weight: int  # Points contributed to threat score
    raw_proof: Optional[str] = None

class Step6RiskEngineResult(BaseModel):
    threat_score: int  # 0 to 100
    risk_level: str  # CRITICAL, HIGH, MEDIUM, LOW, SAFE
    confidence_score: float  # Percentage, e.g. 96.4
    threat_tier_color: str
    score_breakdown: Dict[str, int]
    evidence_list: List[EvidenceItem] = []

class SOCAction(BaseModel):
    id: str
    action_type: str
    title: str
    description: str
    status: str = "PENDING"
    automated_supported: bool = True
    target: str

class Step7ResultsOutput(BaseModel):
    case_id: str
    timestamp: str
    threat_score: int
    risk_level: str
    confidence_score: float
    attack_type: str  # e.g., "Spear Phishing / Credential Harvesting", "Business Email Compromise (BEC)", etc.
    executive_summary: str
    technical_explanation: str
    evidence_count: int
    recommended_actions: List[SOCAction] = []
    sha256_hash: str
    investigation_status: str = "FLAGGED_FOR_SOC"

class FullEmailAnalysisResult(BaseModel):
    case_id: str
    analyzed_at: str
    sha256_digest: str
    step1_received: Step1ReceivedResult
    step2_auth: Step2AuthResult
    step3_domain: Step3DomainResult
    step4_ai_content: Step4AIContentResult
    step5_forensics: Step5ForensicGraphResult
    step6_risk: Step6RiskEngineResult
    step7_results: Step7ResultsOutput
