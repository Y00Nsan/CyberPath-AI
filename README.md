# CyberPath AI

**An AI-assisted cybersecurity career exploration and job preparation platform.**

[Live Demo](https://cyber-path-ai.vercel.app/) · [API Documentation](https://cyberpath-ai-idlk.onrender.com/docs)

CyberPath AI brings together resume analysis, cybersecurity job discovery, skill-gap assessment, tailored application materials, mock interview practice, and application tracking in a single workflow. It is a portfolio project demonstrating full-stack application development and deployment.

## Overview

Cybersecurity job seekers often switch between separate tools to evaluate their resumes, find relevant openings, prepare for interviews, and track applications. CyberPath AI explores a more connected workflow:

**Upload resume → Analyze skills → Discover jobs → Evaluate fit → Prepare applications → Practice interviews → Track progress**

## Features

| Feature | Description |
| --- | --- |
| Resume analysis | Upload a PDF resume and analyze cybersecurity-related experience and skills. |
| Job discovery | Search for relevant openings through the Adzuna job API. |
| Job-fit and skill-gap analysis | Compare candidate skills with role requirements and surface areas for development. |
| Career planning | Generate role-oriented learning recommendations, roadmaps, and preparation plans. |
| Resume tailoring | Prepare role-specific resume content and generate PDF output. |
| Mock interviews | Practice role- and resume-informed questions with evaluation and feedback. |
| Application Tracker | Save job opportunities, update application statuses, and manage notes and deadlines. |
| Application analytics | View application progress and related career insights. |

Some features rely on the project's local, rule-based/domain-specific intelligence components rather than a hosted large language model. Results should be treated as career-planning assistance, not definitive hiring assessments.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript |
| Backend | Python, FastAPI |
| Data access | SQLAlchemy |
| Default database | SQLite |
| External jobs data | Adzuna API |
| Deployment | Vercel (frontend), Render (backend) |

## Architecture

```text
Browser
   |
   v
Next.js frontend (Vercel)
   |
   | HTTPS API requests
   v
FastAPI backend (Render)
   |-- Resume and career analysis
   |-- Job discovery --------> Adzuna API
   |-- Interview and preparation workflows
   |-- Application tracking
   |-- SQLAlchemy -----------> SQLite (default)
```

## Running Locally

### Prerequisites

- Python 3.11+ (use a version compatible with the backend dependencies)
- Node.js and npm (use a version supported by the project's Next.js release)
- Adzuna developer credentials for live job searches

### Backend

From the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

```powershell
# Windows PowerShell
.venv\Scripts\Activate.ps1
```

```bash
# macOS / Linux
source .venv/bin/activate
```

Install dependencies and start the API:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API documentation is available at `http://localhost:8000/docs`.

### Frontend

Open another terminal from the repository root:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Configuration

The backend reads environment variables, including from `backend/.env` during local development.

```env
# backend/.env — examples only; replace with your own values
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
DATABASE_URL=sqlite:///./cyberpath.db
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

For the deployed frontend, add `https://cyber-path-ai.vercel.app` to the backend's `CORS_ORIGINS` setting. Configure secrets through Render environment variables, not in source control.

**Never commit real API keys, `.env` files, uploaded resumes, or personal application records.**

## Deployment

- **Frontend:** [cyber-path-ai.vercel.app](https://cyber-path-ai.vercel.app/)
- **Backend API:** [cyberpath-ai-idlk.onrender.com](https://cyberpath-ai-idlk.onrender.com/)
- **Interactive API docs:** [FastAPI Swagger UI](https://cyberpath-ai-idlk.onrender.com/docs)

The frontend uses `NEXT_PUBLIC_API_URL` to point to the deployed FastAPI service. The backend requires Adzuna credentials for live job search.

## Demo and Data Limitations

This repository is intended primarily as a **portfolio demonstration**, not a production-ready multi-user service.

- SQLite is the default storage option. On hosting platforms with ephemeral filesystems, application records may be lost after redeployment or instance replacement.
- User-specific authentication and access controls should be implemented and tested before storing real applicants' private information in a public multi-user deployment.
- Do not upload sensitive resumes or use real personal application records for public demonstrations until privacy controls have been verified.
- External job results depend on Adzuna API availability and credentials.
- Resume scoring and interview feedback are assistive outputs, not guarantees of hiring outcomes.

## Future Improvements

- User authentication and per-user data isolation
- Durable managed database and migration workflow
- File upload validation, retention policies, and privacy safeguards
- Automated backend and frontend tests
- Monitoring, error reporting, and API rate limiting

## Project Purpose

CyberPath AI was developed to demonstrate end-to-end product engineering: integrating a modern web frontend, a Python API, career-analysis logic, external job data, persistence, and cloud deployment into one cohesive cybersecurity-focused application.

---

**Built as a cybersecurity software engineering portfolio project.**
