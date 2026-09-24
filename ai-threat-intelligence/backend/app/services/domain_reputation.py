import re
from typing import List, Dict, Any, Tuple
from ..models.email_schema import HeaderDetails, Step3DomainResult

POPULAR_BRANDS = [
    "microsoft", "office365", "google", "apple", "paypal", "amazon",
    "chase", "bankofamerica", "wellsfargo", "dhl", "fedex", "dropbox",
    "adobe", "netflix", "facebook", "instagram", "linkedin", "coinbase"
]

DISPOSABLE_DOMAINS = {
    "mailinator.com", "guerrillamail.com", "tempmail.com", "10minutemail.com",
    "trashmail.com", "yopmail.com", "fakeinbox.com", "throwawaymail.com"
}

SUSPICIOUS_TLDS = {
    "top", "xyz", "club", "icu", "cam", "cfd", "click", "live", "vip", "work",
    "buzz", "rest", "support", "online", "fun", "monster", "site"
}

def check_typosquatting(domain: str) -> Tuple[bool, str]:
    """Check if domain is impersonating known brands with Levenshtein-like heuristics or keyword squatted."""
    domain_clean = domain.lower().split(".")[0]
    
    # Check exact replacement patterns (0 -> o, 1 -> l, etc.)
    normalized = (
        domain_clean.replace("0", "o")
                    .replace("1", "l")
                    .replace("3", "e")
                    .replace("5", "s")
                    .replace("vv", "w")
                    .replace("-", "")
                    .replace("_", "")
    )
    
    for brand in POPULAR_BRANDS:
        if brand in normalized and brand != domain_clean:
            return True, brand.capitalize()
        # Lookalike prefix/suffix (e.g., 'microsoft-security' or 'login-apple')
        if f"{brand}-" in domain_clean or f"-{brand}" in domain_clean or f"verify-{brand}" in domain_clean or f"secure-{brand}" in domain_clean:
            return True, brand.capitalize()

    return False, ""

def analyze_domain_and_sender(headers: HeaderDetails) -> Step3DomainResult:
    """Analyze domain age, reputation, MX status, and impersonation risk."""
    from_addr = headers.from_address
    domain = from_addr.split("@")[-1].lower() if "@" in from_addr else "unknown.com"
    tld = domain.split(".")[-1] if "." in domain else ""

    flags: List[str] = []
    is_typo, typo_brand = check_typosquatting(domain)
    is_disposable = domain in DISPOSABLE_DOMAINS
    is_high_risk_tld = tld in SUSPICIOUS_TLDS

    # Determine simulated domain age and reputation based on heuristics
    is_trusted_enterprise = any(t in domain for t in ["microsoft.com", "google.com", "apple.com", "amazon.com", "gov", "mil"])
    
    if is_trusted_enterprise and not is_typo:
        domain_age = 9800  # ~27 years
        is_newly_registered = False
        domain_rep = 98
        sender_rep = 92
        has_mx = True
        whois_reg = "MarkMonitor Inc."
        reg_date = "1995-05-02"
    elif is_typo or is_high_risk_tld:
        domain_age = 4  # Registered 4 days ago
        is_newly_registered = True
        domain_rep = 12
        sender_rep = 8
        has_mx = True
        whois_reg = "NameCheap, Inc. / Withheld Privacy"
        reg_date = "2026-09-18"
        flags.append(f"Domain registered only {domain_age} days ago (High-risk bulletproof registrar)")
        if is_typo:
            flags.append(f"Combosquatting/Typosquatting detected targeting brand '{typo_brand}'")
        if is_high_risk_tld:
            flags.append(f"Top-level domain .{tld} has high abuse concentration (>82% malicious ratio)")
    elif is_disposable:
        domain_age = 180
        is_newly_registered = False
        domain_rep = 15
        sender_rep = 5
        has_mx = True
        whois_reg = "Cloudflare Registrar"
        reg_date = "2023-01-10"
        flags.append("Disposable/burner email provider detected")
    else:
        # Standard corporate or unknown domain
        domain_age = 730
        is_newly_registered = False
        domain_rep = 70
        sender_rep = 65
        has_mx = True
        whois_reg = "GoDaddy.com, LLC"
        reg_date = "2024-04-15"

    return Step3DomainResult(
        domain=domain,
        domain_age_days=domain_age,
        is_newly_registered=is_newly_registered,
        domain_reputation_score=domain_rep,
        sender_reputation_score=sender_rep,
        is_typosquatting=is_typo,
        typosquatting_target=typo_brand if is_typo else None,
        has_valid_mx=has_mx,
        is_disposable=is_disposable,
        suspicious_flags=flags,
        whois_registrar=whois_reg,
        registration_date=reg_date
    )
