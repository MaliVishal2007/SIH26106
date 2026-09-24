from typing import List, Dict, Any

def generate_ai_explanation(
    credential_score: float,
    financial_score: float,
    urgency_score: float,
    impersonation_score: float,
    intents: List[str],
    highlighted_tokens: List[Dict[str, Any]],
    sender_domain: str
) -> str:
    """Generate an Explainable AI (XAI) natural language explanation for SOC analysts."""
    reasons = []

    if credential_score >= 0.70:
        reasons.append("high-confidence credential harvesting patterns requesting user credentials, password reset, or re-authentication under a deceptive pretext")
    elif credential_score >= 0.40:
        reasons.append("covert account authentication cues prompting the recipient to click external identity portals")

    if financial_score >= 0.70:
        reasons.append("unauthorized financial transaction or wire transfer redirection attempt targeting accounts payable/payroll (Business Email Compromise)")
    elif financial_score >= 0.40:
        reasons.append("unverified invoice or billing references demanding transactional review")

    if urgency_score >= 0.75:
        reasons.append("aggressive psychological pressure utilizing artificial deadlines (e.g. 'immediate action required', 'account will be terminated within 24 hours') designed to bypass critical human scrutiny")
    elif urgency_score >= 0.40:
        reasons.append("elevated urgency language demanding expedited attention")

    if impersonation_score >= 0.70:
        reasons.append(f"executive or trusted institutional brand impersonation claiming official authority while originating from an unverified external infrastructure ({sender_domain})")

    if not reasons:
        return "The AI NLP classification model evaluated the content semantics, tone, and lexical structure. No malicious intent, manipulative urgency, or credential phishing vectors were detected. The content aligns with legitimate corporate correspondence."

    lead = "The Hugging Face RoBERTa-Security transformer neural model detected "
    body = "; ".join(reasons)
    tail = ". Key trigger tokens such as " + ", ".join([f"'{t['token']}' (weight: {t['score']:.2f})" for t in highlighted_tokens[:4]]) + " exhibit extreme predictive activation for phishing campaigns."
    
    return f"{lead}{body}{tail}"
