# CyberPath AI

CyberPath AI is a cybersecurity-focused career agent that connects job search, skill-gap analysis, learning, portfolio evidence, application readiness, follow-up, interview preparation, and outcome analysis in one workflow.

## Core workflow

Resume/Profile → Job Market → Skill Gap → Learning → 90-Day Plan → Weekly Sprint → Career Evidence → Portfolio Builder → Portfolio Audit → Application Readiness → Application → Follow-up → Interview → Outcome Intelligence

## Stack

- Frontend: Next.js / React / TypeScript
- Backend: FastAPI / Python
- AI: OpenAI API
- Job Search: Adzuna API
- Database: PostgreSQL
- Resume parsing: pypdf

## Project structure

```text
cyberpath-ai/
├── backend/
│   ├── app/
│   │   └── main.py
│   └── .env
└── frontend/
    └── src/app/
        ├── page.tsx
        └── globals.css
```

## Environment variables

Create `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/cyberpath
```

Never commit `.env` or API keys to GitHub.

## Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn python-dotenv python-multipart pypdf openai httpx sqlalchemy psycopg2-binary psycopg[binary]
uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`.

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

## Database

Create a PostgreSQL database named `cyberpath` and set `DATABASE_URL` in `backend/.env`.

The application uses SQLAlchemy and creates required tables through the application's database initialization.

## Security notes

- Keep `backend/.env` out of source control.
- Do not place API keys in frontend code.
- Do not commit uploaded resumes or private application data.
- Use environment variables for production secrets.
- Replace local development credentials before deployment.

## Final QA

Backend syntax check:

```bash
python -m py_compile backend/app/main.py
```

The final Step 42 build was checked for Python syntax, route preservation, core career workflow sections, and accidental hard-coded secrets.

## GitHub checklist

Before pushing:

- [ ] Confirm `.env` is ignored
- [ ] Remove real API keys from any tracked files
- [ ] Remove private resumes/test data
- [ ] Run backend syntax check
- [ ] Run frontend production build
- [ ] Test database connection
- [ ] Test job search with real credentials
- [ ] Test resume upload
- [ ] Test application tracker

## Production deployment

For a production deployment, configure environment variables and a hosted PostgreSQL database, then deploy the FastAPI backend and Next.js frontend separately or behind the same domain. Do not use local development secrets in production.
