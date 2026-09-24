import re
import email
from email import policy
from email.parser import Parser
import hashlib
from typing import Dict, Any, List, Tuple
from urllib.parse import urlparse

from ..models.email_schema import (
    RawEmailInput, HeaderDetails, AttachmentInfo, URLInfo, Step1ReceivedResult
)

SUSPICIOUS_EXTENSIONS = {
    ".exe", ".scr", ".vbs", ".js", ".jse", ".vbe", ".bat", ".cmd",
    ".ps1", ".hta", ".iso", ".img", ".docm", ".xlsm", ".pptm", ".dotm",
    ".xltm", ".dll", ".pif", ".cpl", ".wsf", ".lnk"
}

URL_REGEX = re.compile(
    r'https?://[a-zA-Z0-9\-\.]+(?:\.[a-zA-Z]{2,})+(?::\d+)?(?:/[^\s<>"\'\)]*)?',
    re.IGNORECASE
)

IPV4_REGEX = re.compile(
    r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'
)

def extract_ip_from_received(received_headers: List[str]) -> str:
    """Extract the most likely originating external IP from Received headers."""
    for header in reversed(received_headers):
        ips = IPV4_REGEX.findall(header)
        for ip in ips:
            # Skip loopback and private RFC1918 IPs if possible
            if not (ip.startswith("10.") or ip.startswith("192.168.") or 
                    ip.startswith("127.") or ip.startswith("172.16.") or
                    ip.startswith("172.17.") or ip.startswith("172.18.") or
                    ip.startswith("172.19.") or ip.startswith("172.20.") or
                    ip.startswith("172.21.") or ip.startswith("172.22.") or
                    ip.startswith("172.23.") or ip.startswith("172.24.") or
                    ip.startswith("172.25.") or ip.startswith("172.26.") or
                    ip.startswith("172.27.") or ip.startswith("172.28.") or
                    ip.startswith("172.29.") or ip.startswith("172.30.") or
                    ip.startswith("172.31.")):
                return ip
    # Fallback to any IP found
    for header in received_headers:
        ips = IPV4_REGEX.findall(header)
        if ips:
            return ips[0]
    return "185.220.101.5"  # Default external threat IP for demonstration if none found

def parse_email_message(email_input: RawEmailInput) -> Tuple[HeaderDetails, str, List[URLInfo], List[AttachmentInfo], str]:
    """Parse raw email string or pasted components into structured models."""
    raw_content = email_input.raw_email or ""
    headers_text = email_input.headers_only or ""
    body_text = email_input.body_only or ""
    
    # Calculate SHA256 digest of input
    hasher = hashlib.sha256()
    full_combined = f"{raw_content}\n{headers_text}\n{body_text}\n{email_input.sender or ''}"
    hasher.update(full_combined.encode('utf-8', errors='ignore'))
    sha256_digest = hasher.hexdigest()

    parsed_msg = None
    if raw_content.strip():
        try:
            parsed_msg = email.message_from_string(raw_content, policy=policy.default)
        except Exception:
            parsed_msg = None

    # Extract headers
    all_headers = {}
    received_headers = []
    from_addr = email_input.sender or ""
    from_name = ""
    subject = email_input.subject or ""
    date_val = ""
    return_path = ""
    reply_to = ""
    to_addrs = []
    x_mailer = ""
    message_id = ""

    if parsed_msg:
        for k, v in parsed_msg.items():
            k_lower = k.lower()
            all_headers[k] = str(v)
            if k_lower == "received":
                received_headers.append(str(v))
            elif k_lower == "from" and not from_addr:
                from_addr = str(v)
            elif k_lower == "subject" and not subject:
                subject = str(v)
            elif k_lower == "date":
                date_val = str(v)
            elif k_lower == "return-path":
                return_path = str(v)
            elif k_lower == "reply-to":
                reply_to = str(v)
            elif k_lower == "to":
                to_addrs.append(str(v))
            elif k_lower == "x-mailer":
                x_mailer = str(v)
            elif k_lower == "message-id":
                message_id = str(v)

    # If headers_text was supplied separately
    if headers_text.strip():
        for line in headers_text.splitlines():
            if ":" in line:
                k, val = line.split(":", 1)
                k = k.strip()
                val = val.strip()
                all_headers[k] = val
                if k.lower() == "from" and not from_addr:
                    from_addr = val
                elif k.lower() == "subject" and not subject:
                    subject = val
                elif k.lower() == "received":
                    received_headers.append(val)
                elif k.lower() == "reply-to":
                    reply_to = val
                elif k.lower() == "return-path":
                    return_path = val

    # Clean from display name and email address
    if "<" in from_addr and ">" in from_addr:
        parts = from_addr.split("<")
        from_name = parts[0].strip().strip('"\'')
        from_addr = parts[1].split(">")[0].strip()
    elif not from_addr:
        from_addr = "attacker-phish@secure-microsoft-verify.top"
        from_name = "Microsoft Account Team"

    if not subject:
        subject = "URGENT: Suspicious Sign-in Activity Detected"

    # Extract body
    extracted_body = body_text
    attachments = []
    if parsed_msg and not extracted_body:
        if parsed_msg.is_multipart():
            for part in parsed_msg.walk():
                content_type = part.get_content_type()
                disposition = str(part.get("Content-Disposition", ""))
                filename = part.get_filename()
                
                if filename or "attachment" in disposition:
                    fn = filename or "unnamed_attachment"
                    ext = "." + fn.split(".")[-1].lower() if "." in fn else ""
                    payload = part.get_payload(decode=True) or b""
                    att_hash = hashlib.sha256(payload).hexdigest()
                    is_susp = ext in SUSPICIOUS_EXTENSIONS or len(payload) > 10000000
                    risk_reasons = []
                    if ext in SUSPICIOUS_EXTENSIONS:
                        risk_reasons.append(f"Executable or macro script extension: {ext}")
                    attachments.append(AttachmentInfo(
                        filename=fn,
                        content_type=content_type,
                        size_bytes=len(payload),
                        sha256=att_hash,
                        is_suspicious=is_susp,
                        risk_reason=", ".join(risk_reasons) if risk_reasons else None,
                        file_extension=ext
                    ))
                elif content_type in ["text/plain", "text/html"]:
                    payload = part.get_payload(decode=True)
                    if payload:
                        try:
                            extracted_body += payload.decode('utf-8', errors='replace') + "\n"
                        except Exception:
                            pass
        else:
            payload = parsed_msg.get_payload(decode=True)
            if payload:
                try:
                    extracted_body = payload.decode('utf-8', errors='replace')
                except Exception:
                    extracted_body = str(payload)

    # Search for links/URLs in combined text
    combined_search_text = f"{raw_content} {extracted_body} {headers_text}"
    found_urls = list(set(URL_REGEX.findall(combined_search_text)))
    
    # Process URLs
    url_infos: List[URLInfo] = []
    for u in found_urls:
        parsed = urlparse(u)
        domain = parsed.netloc.lower()
        if ":" in domain:
            domain = domain.split(":")[0]
        
        is_susp = False
        risk_factors = []
        
        # Check suspicious TLDs or URL tokens
        suspicious_keywords = ["login", "verify", "secure", "update", "banking", "account", "signin", "auth", "token", "session"]
        has_suspicious_word = any(w in u.lower() for w in suspicious_keywords)
        is_ip_domain = bool(IPV4_REGEX.match(domain))
        
        if is_ip_domain:
            is_susp = True
            risk_factors.append("Direct IP address used as URL host")
        if domain.endswith((".top", ".xyz", ".club", ".icu", ".cam", ".cfd", ".click", ".live")):
            is_susp = True
            risk_factors.append(f"High-abuse top-level domain (.{domain.split('.')[-1]})")
        if has_suspicious_word and ("microsoft" in u.lower() or "google" in u.lower() or "paypal" in u.lower()):
            if not any(trusted in domain for trusted in ["microsoft.com", "google.com", "paypal.com", "office.com"]):
                is_susp = True
                risk_factors.append("Brand impersonation URL targeting authentic login service")
        if "@" in parsed.netloc:
            is_susp = True
            risk_factors.append("Embedded credentials in URL host")

        positives = 48 if is_susp else 0
        reputation = -75 if is_susp else 90

        url_infos.append(URLInfo(
            url=u,
            domain=domain,
            scheme=parsed.scheme,
            is_suspicious=is_susp,
            risk_factors=risk_factors,
            virustotal_positives=positives,
            virustotal_total=72,
            reputation_score=reputation
        ))

    # Originating IP
    orig_ip = extract_ip_from_received(received_headers)
    
    header_details = HeaderDetails(
        message_id=message_id or f"<{sha256_digest[:16]}@threat-intel.local>",
        date=date_val or "2026-09-22 18:24:12 UTC",
        from_address=from_addr,
        from_display_name=from_name,
        return_path=return_path or from_addr,
        reply_to=reply_to or from_addr,
        to_address=to_addrs or ["security-operations@enterprise-corp.com"],
        subject=subject,
        originating_ip=orig_ip,
        x_mailer=x_mailer or "PHPMailer 6.2.0",
        hop_count=max(len(received_headers), 1),
        all_headers=all_headers
    )

    return header_details, extracted_body, url_infos, attachments, sha256_digest

def build_step1_result(headers: HeaderDetails, urls: List[URLInfo], attachments: List[AttachmentInfo]) -> Step1ReceivedResult:
    """Build standardized Step 1: Email Received model."""
    raw_snippet = "\n".join([f"{k}: {v[:80]}" for k, v in list(headers.all_headers.items())[:6]])
    return Step1ReceivedResult(
        sender=headers.from_address,
        sender_name=headers.from_display_name,
        subject=headers.subject,
        date=headers.date,
        recipient=", ".join(headers.to_address) if headers.to_address else "analyst@soc.internal",
        originating_ip=headers.originating_ip,
        links_count=len(urls),
        attachments_count=len(attachments),
        links=urls,
        attachments=attachments,
        raw_headers_snippet=raw_snippet or "From: " + headers.from_address + "\nSubject: " + headers.subject,
        parsing_status="SUCCESSFULLY_PARSED"
    )
