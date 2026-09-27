# 🛡️ Cybersecurity Intelligence Platform

A professional, full-stack **Security Operations Center (SOC) and Cybersecurity Intelligence Platform** built with modern web technologies.

The platform provides a unified interface for security monitoring, threat intelligence, IP/domain analysis, email-security analysis, reputation checks, graph-based relationships, and AI-assisted cybersecurity analysis.

---

## 🚀 Technology Stack

### Frontend

* **React**
* **Tailwind CSS**
* React Router
* Modern responsive dashboard UI

### Backend

* **Python**
* **FastAPI**
* Uvicorn

### Databases

* **PostgreSQL** — structured application data
* **Neo4j** — threat relationships and graph intelligence

### AI / Machine Learning

* **PyTorch**
* **Hugging Face Transformers**
* AI-assisted threat analysis
* Future support for local and hosted ML models

### Security Intelligence

* **VirusTotal API**
* **GeoLite2**
* **IPinfo**
* SPF analysis
* DKIM analysis
* DMARC analysis
* IP/domain reputation analysis

---

# ✨ Main Features

## 📊 SOC Dashboard

The dashboard provides a centralized security overview including:

* Security alerts
* Threat level
* Suspicious IP addresses
* Malicious domains
* Recent investigations
* Threat statistics
* Geographic threat distribution

The interface is designed to resemble a professional SOC environment rather than a basic demonstration dashboard.

---

## 🌐 IP Intelligence

Analyze IP addresses and display information such as:

* IP address
* Country
* City
* ISP
* ASN
* Organization
* Latitude/longitude
* Reputation
* Threat score
* Abuse information
* Related indicators

The system can use:

* GeoLite2
* IPinfo
* VirusTotal

when API/database credentials are configured.

---

## 🔎 Domain Intelligence

Domain analysis can include:

* Domain reputation
* DNS information
* WHOIS-related information
* Associated IP addresses
* Threat indicators
* Malware associations
* Suspicious activity
* Related domains

---

# 📧 Email Security Analysis

The platform supports analysis of email authentication mechanisms.

## SPF

The system analyzes:

* SPF record
* SPF policy
* Authorized senders

---

## DKIM

DKIM analysis includes:

* DKIM selector
* Public key
* Signature configuration
* Key availability
* Validation status

---

## DMARC

DMARC analysis includes:

* DMARC policy
* Alignment
* Reporting configuration

---

# 🦠 VirusTotal Integration

The platform can integrate with VirusTotal for threat intelligence.

Supported analysis can include:

* IP reputation
* Domain reputation
* URL reputation
* File hash reputation
* Malware detections
* Security vendors
* Detection statistics

### API Configuration

Create an environment file:

```env
VIRUSTOTAL_API_KEY=your_api_key
```

If the API key is not configured, the application automatically falls back to mock data.

---

# 🌍 GeoIP Intelligence

The platform supports geographic threat intelligence using:

### GeoLite2

Possible information:

* Country
* Region
* City
* Latitude
* Longitude
* ASN

### IPinfo

Possible information:

* IP
* Country
* Region
* City
* Organization
* ASN
* Postal information
* Timezone

Environment configuration:

```env
IPINFO_TOKEN=your_token
```

---

# 🧠 AI Threat Analysis

The backend is designed to support AI-assisted cybersecurity analysis using:

* PyTorch
* Hugging Face Transformers
* Local models
* Custom threat-classification models

Potential AI capabilities include:

* Alert classification
* Threat scoring
* IOC analysis
* Suspicious behavior detection
* Threat correlation
* Natural-language security investigation

The architecture allows the AI layer to be replaced or extended without rewriting the entire application.

---

# 🕸️ Neo4j Threat Graph

Neo4j is used for relationship-based threat intelligence.

Example relationships:

```text
IP
 ↓
DOMAIN
 ↓
URL
 ↓
HASH
 ↓
MALWARE
 ↓
THREAT ACTOR
```

This allows investigators to identify relationships between different indicators.

---

# 🗄️ PostgreSQL

PostgreSQL stores structured application information such as:

* Users
* Alerts
* Investigations
* Security events
* IP intelligence
* Domain intelligence
* Email analysis
* Threat indicators
* Audit information

Example configuration:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/soc_platform
```

---

# 📁 Project Structure

```text
SIH26106/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── data/   
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   |    ├── favicon.svg/
│   |    └── icons.svg/
│   |
|   ├── index.html
|   ├── package-lock.json
|   ├── package.json
|   ├── postcss.config.js
|   ├── tailwind.config.js
|   └── vite.config.js
|
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   ├── api/routes/
│   │   ├── database/
│   │   ├── geolocation/
│   │   ├── models/
│   │   ├── services/
│   │   └── threat_intelligence/
│   │ 
│   ├── _pycache_/ 
│   ├── requirements.txt
│   └── main.py
│
├── README.md
└── .gitignore
```

---

# ⚙️ Requirements

Install the following software before running the project.

### Required

* Node.js
* npm
* Python 3.11+
* PostgreSQL
* Neo4j

---

# 🐍 Backend Installation

Open another terminal:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

### Linux/macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

# Create virtual environment (already initialized)
```
.\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation (Swagger UI):
``` 
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Installation

Open a terminal inside the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---
