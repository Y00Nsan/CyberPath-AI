# CyberPath AI — Step 43

CyberPath AI is a cybersecurity-focused career intelligence platform that connects resume analysis, cybersecurity job intelligence, skill-gap analysis, learning, portfolio evidence, application readiness, interview preparation, and career outcomes.

## Step 43 changes

Step 43 is built directly from the Step 42 release. The existing career workflow and API routes are preserved.

### 1\. Cybersecurity Intelligence Engine foundation

A deterministic, cybersecurity-specific intelligence layer was added under:

```text
backend/app/intelligence/
├── \_\_init\_\_.py
├── knowledge\_base.py
├── skill\_engine.py
├── scoring\_engine.py
└── adaptive\_engine.py
```

The engine currently provides:

* cybersecurity skill extraction
* aliases and terminology normalization
* candidate skill vs. job skill comparison
* strong / partial / missing skill classification
* cybersecurity relevance scoring
* explainable job-fit scoring
* NICE-aligned category labels
* bounded aggregate learning signals

The adaptive layer intentionally stores **aggregate skill statistics rather than raw resumes or job descriptions**, preventing unbounded memory growth.

New endpoints:

```text
POST /intelligence/test
POST /intelligence/feedback
GET  /intelligence/insights
```

This is a foundation, not a claim that a deterministic rules engine is equivalent to a general-purpose LLM. It is designed specifically for cybersecurity career intelligence and can be expanded with more skills, relationships, evidence rules, and outcome signals.

### 2\. UI redesign

The existing Step 42 UI was retained functionally but reorganized visually around a simpler Command Center:

```text
Resume
   ↓
Cybersecurity Profile
   ↓
Job Market
   ↓
Skill / Cyber Relevance
   ↓
Learning + Proof
   ↓
Applications
   ↓
Interviews
   ↓
Career Outcomes
```

The Command Center now includes:

* animated cybersecurity hero
* immediate quick actions
* Fit / Cybersecurity / Career Value visual bars
* Saved → Applied → Interview → Offer funnel
* Cybersecurity Intelligence Engine card
* stronger visual hierarchy
* responsive/mobile behavior
* hover and ambient animations
* existing detailed tools remain available below the main dashboard

## Existing Step 42 workflow preserved

Resume/Profile → Job Market → Skill Gap → Learning → 90-Day Plan → Weekly Sprint → Career Evidence → Portfolio Builder → Portfolio Audit → Application Readiness → Application Pipeline → Follow-up → Interview → Outcome Intelligence

## Stack

* Frontend: Next.js / React / TypeScript
* Backend: FastAPI / Python
* Existing AI layer: OpenAI API
* Existing job search layer: Adzuna API
* Existing database layer: SQLAlchemy / PostgreSQL
* Resume parsing: pypdf
* New cybersecurity intelligence layer: Python + built-in SQLite aggregate statistics

Step 43 does **not** remove the existing OpenAI/Adzuna/PostgreSQL implementation yet. The Intelligence Engine is intentionally introduced as a safe foundation before a later controlled migration.

## Project structure

```text
cyberpath-ai/
├── backend/
│   └── app/
│       ├── main.py
│       └── intelligence/
│           ├── \_\_init\_\_.py
│           ├── knowledge\_base.py
│           ├── skill\_engine.py
│           ├── scoring\_engine.py
│           └── adaptive\_engine.py
└── frontend/
    └── src/app/
        ├── page.tsx
        └── globals.css
```

## Environment variables

The existing Step 42 backend still expects the server-side environment variables configured in `backend/.env`:

```env
OPENAI\_API\_KEY=your\_openai\_api\_key
ADZUNA\_APP\_ID=your\_adzuna\_app\_id
ADZUNA\_APP\_KEY=your\_adzuna\_app\_key
DATABASE\_URL=postgresql://postgres:YOUR\_PASSWORD@localhost:5432/cyberpath
```

Never commit `.env` or API keys to GitHub.

## Backend

```bash
cd backend
venv\\Scripts\\activate
uvicorn app.main:app --reload
```

Backend: `http://127.0.0.1:8000`

## Frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:3000`

## Intelligence Engine quick test

```bash
curl -X POST http://127.0.0.1:8000/intelligence/test ^
  -H "Content-Type: application/json" ^
  -d "{\\"candidate\_text\\":\\"AWS IAM Python Wireshark OSINT MITRE ATT\&CK\\",\\"job\_text\\":\\"AWS IAM SIEM Python Wireshark incident response MITRE ATT\&CK\\"}"
```

## QA

Backend syntax:

```bash
python -m py\_compile backend/app/main.py
```

The Step 43 release was checked to preserve the original Step 42 route set and add the three Intelligence Engine routes.

