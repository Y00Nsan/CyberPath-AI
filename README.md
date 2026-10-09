# CyberPath AI

**AI-Powered Cybersecurity Career Intelligence Platform**

CyberPath AI is a full-stack web application designed to help students and early-career professionals discover cybersecurity opportunities, evaluate their qualifications, improve their resumes, and prepare for job interviews.

The platform connects resume analysis, cybersecurity job discovery, explainable job matching, application tracking, and AI-assisted interview preparation into one workflow.

## Key Features

### 1. Resume Analysis
- Upload a PDF resume.
- Extract professional experience, education, technical skills, and certifications.
- Generate a structured candidate profile for career preparation.

### 2. Cybersecurity Job Discovery
- Search cybersecurity-related job opportunities.
- Filter results by job type and company.
- Review job descriptions and available application information.
- Access original job postings.

### 3. Job Fit & Cybersecurity Intelligence
- Compare candidate qualifications with job requirements.
- Identify strong, partial, and missing skills.
- Normalize cybersecurity terminology and skill aliases.
- Generate explainable job-fit and cybersecurity relevance scores.
- Use cybersecurity-specific skill knowledge and NICE-aligned category labels.

### 4. AI Resume Tailoring
- Select a job to prepare for.
- Generate a job-focused version of the candidate's resume.
- Review a PDF with highlighted changes and explanatory comments.
- Preserve existing experience rather than inventing qualifications.

### 5. AI Mock Interviews
- Practice 10 questions for a selected job:
  - 5 job-specific questions.
  - 5 resume-specific questions.
- Submit answers and receive evaluation feedback.
- Review suggested answer improvements.
- Navigate between interview questions.

### 6. Application Tracking
- Save job opportunities.
- Organize applications.
- Return to original job postings.
- Connect job discovery with application preparation.

## Cybersecurity Intelligence Engine

CyberPath AI includes a deterministic cybersecurity intelligence layer implemented in Python.

Its capabilities include:

- Cybersecurity skill extraction.
- Terminology and alias normalization.
- Candidate-to-job skill comparison.
- Strong, partial, and missing skill classification.
- Explainable job-fit scoring.
- Cybersecurity relevance scoring.
- NICE-aligned category labels.
- Bounded aggregate learning signals.

The intelligence engine uses domain-specific rules and structured knowledge. It is not presented as a replacement for a general-purpose large language model.

### Intelligence API Endpoints

```http
POST /intelligence/test
POST /intelligence/feedback
GET /intelligence/insights
```

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript, CSS |
| Backend | FastAPI, Python |
| AI Integration | OpenAI-compatible API integration |
| Job Search | Adzuna API |
| Database | SQLAlchemy, PostgreSQL |
| Resume Processing | PDF parsing and ReportLab |
| Cybersecurity Intelligence | Custom Python intelligence engine |
| Version Control | Git, GitHub |

## Project Structure

```text
CyberPath-AI/
├── backend/
│   ├── app/
│   │   ├── intelligence/
│   │   │   ├── __init__.py
│   │   │   ├── adaptive_engine.py
│   │   │   ├── knowledge_base.py
│   │   │   ├── local_engine.py
│   │   │   ├── scoring_engine.py
│   │   │   └── skill_engine.py
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── package.json
│   └── Dockerfile
├── README.md
├── DEPLOYMENT.md
└── LICENSE
```

## Getting Started

### Prerequisites

- Python 3.12
- Node.js
- PostgreSQL, if using the configured PostgreSQL database
- Required API credentials

### 1. Clone the Repository

```bash
git clone https://github.com/Y00Nsan/CyberPath-AI.git
cd CyberPath-AI
```

### 2. Backend Setup

On Windows:

```cmd
cd backend
py -3.12 -m venv venv312
venv312\Scripts\activate
pip install -r requirements.txt
```

Configure `backend/.env` with the environment variables required by your deployment.

Example:

```env
OPENAI_API_KEY=your_api_key
ADZUNA_APP_ID=your_app_id
ADZUNA_APP_KEY=your_app_key
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
```

Never commit API credentials or `.env` files.

Start the backend:

```cmd
uvicorn app.main:app --reload
```

Backend API: http://127.0.0.1:8000

### 3. Frontend Setup

Open a second terminal:

```cmd
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```cmd
npm run dev
```

Frontend: http://localhost:3000

## Testing

Frontend production build:

```cmd
cd frontend
npm run build
```

Backend syntax check:

```cmd
python -m py_compile backend/app/main.py
```

These checks do not replace end-to-end testing of live APIs, database connections, and resume-processing workflows.

## Security & Privacy

- API credentials are intended to remain on the backend.
- Environment files and local databases should not be committed.
- Resume data may contain sensitive personal information and should be handled carefully.
- AI-generated resume recommendations should be reviewed before use.
- The intelligence engine is designed to use aggregate skill signals rather than retain raw resume text for adaptive statistics.

## Deployment

The project is being prepared for public deployment using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Managed PostgreSQL

A public demo URL will be added after deployment and production verification.

## Development Status

**Current phase:** GitHub release and deployment preparation.

The frontend has passed a Next.js production build. Public deployment and full production end-to-end verification remain pending.

## Future Improvements

- Expand cybersecurity skill and role coverage.
- Improve job-specific resume recommendations.
- Add more robust interview answer evaluation.
- Strengthen production monitoring and automated testing.
- Improve application tracking and career outcome analytics.

## License

See [LICENSE](LICENSE) for license details.
