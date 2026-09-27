from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, List
from ...models.email_schema import RawEmailInput, FullEmailAnalysisResult
from ...services.threat_engine import run_full_forensic_pipeline

router = APIRouter(prefix="/analyze", tags=["Email Analysis"])

PRESET_SCENARIOS = [
    {
        "id": "scenario_m365_phish",
        "name": "🚨 Microsoft 365 Credential Harvester",
        "description": "Urgent sign-in verification phishing email with typosquatted domain, failing SPF/DKIM, and credential-harvesting link.",
        "sender": "Microsoft Security Team <admin-verify@micros0ft-account-support.top>",
        "subject": "ACTION REQUIRED: Unusual Sign-in Activity Detected on Your Account",
        "originating_ip": "185.220.101.5",
        "headers": """Received: from mail.micros0ft-account-support.top (185.220.101.5) by mx.enterprise-corp.com with SMTP id 9f1234;
    Tue, 22 Sep 2026 18:20:11 +0000
Received-SPF: Softfail (protection.outlook.com: domain of transition micros0ft-account-support.top discourages use of 185.220.101.5)
Authentication-Results: spf=softfail (sender IP is 185.220.101.5) smtp.mailfrom=micros0ft-account-support.top; dkim=fail (signature did not verify); dmarc=fail (p=reject)
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=micros0ft-account-support.top; s=sec2026; bh=invalidhash...; b=tampered...
From: "Microsoft Security Team" <admin-verify@micros0ft-account-support.top>
To: <cfo@enterprise-corp.com>
Subject: ACTION REQUIRED: Unusual Sign-in Activity Detected on Your Account
Date: Tue, 22 Sep 2026 18:20:00 +0000
Message-ID: <202609221820.mssec991@micros0ft-account-support.top>""",
        "body": """Dear Valued User,

We detected an unauthorized sign-in attempt to your Microsoft 365 enterprise account from an unrecognized IP address (Moscow, Russian Federation).

For your protection, your access will be suspended within 24 hours unless you re-authenticate and confirm your identity immediately.

Click here to verify your credentials:
https://secure-micros0ft-portal.top/auth/verify-login?session=98214fa89b

Failure to complete verification will result in immediate mailbox termination and loss of all cached corporate files.

Sincerely,
Microsoft Cloud Security Response Team"""
    },
    {
        "id": "scenario_bec_wire",
        "name": "💼 Executive Wire Fraud (BEC)",
        "description": "CEO impersonation requesting an urgent confidential wire transfer to a vendor account without prior notice.",
        "sender": "David Sterling (CEO) <ceo.office@executive-desk-cloud.live>",
        "subject": "Confidential: Urgent Vendor Payment Wire Before 5 PM EST",
        "originating_ip": "45.142.122.88",
        "headers": """Received: from mail.executive-desk-cloud.live (45.142.122.88) by mx.enterprise-corp.com with ESMTP id bec774;
    Tue, 22 Sep 2026 17:45:00 +0000
Received-SPF: Fail (mail.executive-desk-cloud.live: domain does not authorize 45.142.122.88)
Authentication-Results: spf=fail; dkim=none; dmarc=fail
From: "David Sterling" <ceo.office@executive-desk-cloud.live>
Reply-To: <ceo.private.advisory@proton.me>
To: <payroll@enterprise-corp.com>, <accounts-payable@enterprise-corp.com>
Subject: Confidential: Urgent Vendor Payment Wire Before 5 PM EST
Date: Tue, 22 Sep 2026 17:45:00 +0000""",
        "body": """Are you at your desk?

We are in the final stages of closing an urgent confidential acquisition with our international logistics supplier. 

I need you to process an immediate ACH/wire transfer of $148,500 to the updated vendor account. Due to ongoing NDA agreements, please do not discuss this with anyone in the office.

Send me a confirmation once you are ready so I can furnish the updated bank routing numbers and swift code. Treat this with maximum priority.

David Sterling
Chief Executive Officer"""
    },
    {
        "id": "scenario_macro_invoice",
        "name": "📎 Malicious Macro Invoice (.XLSM)",
        "description": "Fake overdue billing notice carrying weaponized Excel macro payload designed to drop Cobalt Strike beacon.",
        "sender": "FastBill Accounts <billing@globalinvoices-delivery.icu>",
        "subject": "OVERDUE NOTICE: Remittance Invoice #INV-2026-9041 Attached",
        "originating_ip": "194.26.29.112",
        "headers": """Received: from smtp.globalinvoices-delivery.icu (194.26.29.112) by mx.enterprise-corp.com with SMTP id inv998;
    Tue, 22 Sep 2026 16:15:22 +0000
Received-SPF: Fail (ip 194.26.29.112 not permitted)
DKIM-Signature: none
From: "FastBill Billing Department" <billing@globalinvoices-delivery.icu>
To: <finance@enterprise-corp.com>
Subject: OVERDUE NOTICE: Remittance Invoice #INV-2026-9041 Attached
Content-Type: multipart/mixed; boundary="====BOUNDARY===="
Date: Tue, 22 Sep 2026 16:15:22 +0000""",
        "body": """ATTENTION: ACCOUNTS PAYABLE

Your company has an outstanding balance of $32,490.00 that is now 45 days past due. Late penalty fees will be applied starting tomorrow morning.

Please review the attached spreadsheet for itemized line items and banking remittance instructions:
Attached File: Invoice_Statement_Overdue_9041.xlsm (Size: 184 KB, Macro-Enabled)

Enable macros upon opening to view signed electronic purchase order.

Global Logistics Remittance LLC"""
    },
    {
        "id": "scenario_legit_newsletter",
        "name": "✅ Legitimate Corporate Security Bulletin",
        "description": "Authentic internal communication with passing SPF, DKIM, and DMARC alignment and zero phishing markers.",
        "sender": "Cybersecurity Operations <soc-alerts@enterprise-corp.com>",
        "subject": "Enterprise Security Digest: Q3 Best Practices & Phishing Awareness",
        "originating_ip": "142.250.190.46",
        "headers": """Received: from mail-relay.enterprise-corp.com (142.250.190.46) by mx.enterprise-corp.com with ESMTPS id corp881;
    Tue, 22 Sep 2026 14:00:10 +0000
Received-SPF: Pass (protection.outlook.com: domain of enterprise-corp.com designates 142.250.190.46 as permitted sender)
Authentication-Results: spf=pass; dkim=pass (signature verified); dmarc=pass (p=reject)
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=enterprise-corp.com; s=corp2026; bh=validhash994=; b=validSignature...
From: "Cybersecurity Operations" <soc-alerts@enterprise-corp.com>
To: <all-employees@enterprise-corp.com>
Subject: Enterprise Security Digest: Q3 Best Practices & Phishing Awareness
Date: Tue, 22 Sep 2026 14:00:00 +0000""",
        "body": """Team,

As part of Cybersecurity Awareness Month, our Security Operations Center is highlighting key security practices for the third quarter:

1. Always inspect sender email headers before clicking external links.
2. Confirm banking changes via secondary out-of-band phone verification.
3. Report suspicious emails using the 'Report Threat' button in Outlook.

You can review our internal security documentation at:
https://intranet.enterprise-corp.com/security/guidelines

Stay vigilant,
Enterprise Security Team"""
    }
]

@router.get("/scenarios")
def get_scenarios():
    """Return realistic pre-configured threat scenarios for instant demonstration."""
    return PRESET_SCENARIOS

@router.post("/email", response_model=FullEmailAnalysisResult)
def analyze_email(payload: RawEmailInput):
    """Run full 7-step email forensic pipeline on raw content or headers."""
    return run_full_forensic_pipeline(payload)

@router.post("/upload", response_model=FullEmailAnalysisResult)
async def upload_email_file(file: UploadFile = File(...)):
    """Upload an .eml or raw email file for complete forensic analysis."""
    try:
        contents = await file.read()
        raw_text = contents.decode('utf-8', errors='ignore')
        payload = RawEmailInput(raw_email=raw_text)
        return run_full_forensic_pipeline(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse uploaded email: {str(e)}")
