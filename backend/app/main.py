import json
import os
from datetime import datetime
from typing import Optional

from pydantic import BaseModel

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pypdf import PdfReader
from sqlalchemy import Column, DateTime, Float, Integer, String, Text, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# =========================================================
# ENV
# =========================================================

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

if not OPENAI_API_KEY:
    print("WARNING: OPENAI_API_KEY is not configured.")

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="CyberPath AI",
    description="AI-powered cybersecurity career and job intelligence platform",
    version="0.31.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# DATABASE
# =========================================================

Base = declarative_base()

if DATABASE_URL:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )
else:
    engine = None
    SessionLocal = None


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    job_title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    url = Column(Text, nullable=True)

    fit_score = Column(Float, nullable=True)
    cybersecurity_relevance = Column(Float, nullable=True)
    career_value = Column(Float, nullable=True)

    status = Column(String(50), default="Saved", nullable=False)
    priority = Column(String(50), default="Medium", nullable=False)

    deadline = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    target_role = Column(String(255), nullable=True)
    job_title = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    overall_score = Column(Float, nullable=True)
    technical_score = Column(Float, nullable=True)
    cybersecurity_score = Column(Float, nullable=True)
    communication_score = Column(Float, nullable=True)
    structure_score = Column(Float, nullable=True)
    question_count = Column(Integer, default=0, nullable=False)
    scores_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ApplicationPackage(Base):
    __tablename__ = "application_packages"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    url = Column(Text, nullable=True)
    target_role = Column(String(255), nullable=True)
    fit_score = Column(Float, nullable=True)
    status = Column(String(50), default="Saved", nullable=False)
    priority = Column(String(50), default="Medium", nullable=False)
    version = Column(Integer, default=1, nullable=False)
    package_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)


class ApplicationPackagePayload(BaseModel):
    job: dict
    target_role: str = ""
    package: dict


if engine:
    Base.metadata.create_all(bind=engine)


# =========================================================
# HELPERS
# =========================================================

def require_client():
    if client is None:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not configured.",
        )
    return client


def safe_json_load(text: str):
    try:
        return json.loads(text)
    except Exception:
        return {
            "error": "AI returned invalid JSON.",
            "raw_response": text,
        }


def clean_text(value, max_length=5000):
    if value is None:
        return ""

    return str(value)[:max_length]


# =========================================================
# ROOT
# =========================================================

@app.get("/")
async def root():
    return {
        "name": "CyberPath AI",
        "version": "0.28.0",
        "status": "running",
        "features": [
            "resume-analysis",
            "job-search",
            "job-intelligence",
            "skill-gap-analysis",
            "learning-recommendations",
            "career-roadmap",
            "resume-tailoring",
            "application-tracking",
            "career-dashboard",
            "nice-skill-mapping",
            "career-intelligence",
            "mock-interview",
            "interview-performance-history",
            "application-decision-engine",
            "deadline-intelligence",
            "application-tracker",
            "application-package-storage",
            "application-package-versioning",
            "personalized-90-day-plan",
            "career-sprint",
            "career-evidence",
            "portfolio-builder",
            "portfolio-quality-audit",
            "application-readiness-gate",
            "application-follow-up-copilot",
            "career-outcome-intelligence",
            "final-career-command-center",
        ],
    }


# =========================================================
# RESUME UPLOAD
# =========================================================

@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected.",
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF resume.",
        )

    try:
        content = await file.read()

        temp_path = f"/tmp/{file.filename}"

        with open(temp_path, "wb") as f:
            f.write(content)

        reader = PdfReader(temp_path)

        pages = []

        for page in reader.pages:
            text = page.extract_text() or ""
            pages.append(text)

        resume_text = "\n".join(pages).strip()

        if not resume_text:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from the PDF.",
            )

        return {
            "filename": file.filename,
            "pages": len(reader.pages),
            "text": resume_text,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume extraction failed: {str(e)}",
        )


# =========================================================
# RESUME ANALYSIS
# =========================================================

@app.post("/analyze-resume")
async def analyze_resume(resume_text: str = Form(...)):
    ai = require_client()

    resume_text = clean_text(resume_text, 15000)

    prompt = f"""
You are a cybersecurity career analyst.

Analyze this candidate resume specifically for cybersecurity careers.

Resume:
{resume_text}

Return ONLY valid JSON.

Structure:

{{
    "summary": "",
    "candidate_level": "",
    "target_roles": [],
    "technical_skills": [],
    "cybersecurity_skills": [],
    "cloud_skills": [],
    "programming_skills": [],
    "tools": [],
    "certifications": [],
    "education": [],
    "experience": [],
    "projects": [],
    "strengths": [],
    "weaknesses": [],
    "missing_cybersecurity_skills": [],
    "recommended_roles": [],
    "overall_cybersecurity_readiness": 0
}}

Rules:

- Do not invent experience.
- Only use information present in the resume.
- Focus on cybersecurity, cloud security, security engineering, SOC, CTI, and related roles.
- Be realistic for a college student.
- overall_cybersecurity_readiness must be 0-100.
- Return valid JSON only.
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=1800,
        )

        return safe_json_load(response.output_text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume analysis failed: {str(e)}",
        )


# =========================================================
# TARGET ROLE
# =========================================================

@app.post("/target-role")
async def target_role(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
):
    ai = require_client()

    prompt = f"""
You are a cybersecurity career strategist.

Candidate Profile:
{resume_profile}

Target Role:
{target_role}

Analyze whether this target role makes sense.

Return ONLY JSON:

{{
    "target_role": "",
    "fit_score": 0,
    "why_it_fits": [],
    "required_skills": [],
    "candidate_strengths": [],
    "candidate_gaps": [],
    "recommended_next_step": ""
}}

Do not invent experience.
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=1800,
        )

        return safe_json_load(response.output_text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Target role analysis failed: {str(e)}",
        )


# =========================================================
# ADZUNA
# =========================================================

async def search_adzuna(
    query: str,
    location: str = "",
    results_per_page: int = 10,
):
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        raise HTTPException(
            status_code=500,
            detail="Adzuna API credentials are not configured.",
        )

    country = "us"

    url = (
        f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
    )

    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": results_per_page,
        "what": query,
        "content-type": "application/json",
    }

    if location:
        params["where"] = location

    async with httpx.AsyncClient(timeout=30) as http:
        response = await http.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=f"Adzuna request failed: {response.status_code}",
        )

    data = response.json()

    return data.get("results", [])


def normalize_job(job):
    company = job.get("company") or {}
    location = job.get("location") or {}

    return {
        "id": job.get("id"),
        "title": job.get("title", ""),
        "company": company.get("display_name", ""),
        "location": location.get("display_name", ""),
        "description": clean_text(job.get("description", ""), 5000),
        "url": job.get("redirect_url", ""),
        "created": job.get("created", ""),
        "salary_min": job.get("salary_min"),
        "salary_max": job.get("salary_max"),
        "contract_type": job.get("contract_type"),
        "category": (job.get("category") or {}).get("label", ""),
    }


# =========================================================
# SEARCH JOBS
# =========================================================

@app.post("/search-jobs")
async def search_jobs(
    target_role: str = Form(...),
    location: str = Form(""),
):
    queries = [
        target_role,
        f"{target_role} cybersecurity",
        f"{target_role} security",
        f"{target_role} SOC",
    ]

    all_jobs = []

    for query in queries:
        try:
            jobs = await search_adzuna(
                query=query,
                location=location,
                results_per_page=15,
            )

            all_jobs.extend(
                normalize_job(job)
                for job in jobs
            )

        except Exception as e:
            print(f"Job search failed for {query}: {e}")

    unique_jobs = {}

    for job in all_jobs:
        key = (
            job.get("id")
            or (
                job.get("title", "").lower(),
                job.get("company", "").lower(),
            )
        )

        unique_jobs[str(key)] = job

    jobs = list(unique_jobs.values())[:25]

    return {
        "count": len(jobs),
        "jobs": jobs,
    }


# =========================================================
# SEARCH + AI ANALYSIS
# =========================================================

@app.post("/search-and-analyze-jobs")
async def search_and_analyze_jobs(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    location: str = Form(""),
    min_fit_score: float = Form(0),
    min_cybersecurity_relevance: float = Form(0),
    max_jobs: int = Form(20),
):
    ai = require_client()

    queries = [
        target_role,
        f"{target_role} cybersecurity",
        f"{target_role} security",
    ]

    all_jobs = []

    for query in queries:
        try:
            jobs = await search_adzuna(
                query=query,
                location=location,
                results_per_page=10,
            )

            all_jobs.extend(
                normalize_job(job)
                for job in jobs
            )

        except Exception as e:
            print(f"Search error: {e}")

    unique_jobs = {}

    for job in all_jobs:
        title = " ".join(str(job.get("title", "")).lower().split())
        company = " ".join(str(job.get("company", "")).lower().split())
        url = str(job.get("url", "")).split("?")[0].rstrip("/").lower()

        # Prefer stable external IDs, then normalized URL, then title/company.
        key = (
            f"id:{job.get('id')}" if job.get("id") else
            f"url:{url}" if url else
            f"job:{title}|{company}"
        )

        unique_jobs[key] = job

    def cybersecurity_priority(job):
        text = " ".join([
            str(job.get("title", "")),
            str(job.get("category", "")),
            str(job.get("description", "")),
        ]).lower()

        security_terms = [
            "cybersecurity", "cyber security", "security",
            "soc", "siem", "incident response", "threat intelligence",
            "information security", "cloud security", "application security",
            "detection", "vulnerability", "penetration testing", "iam",
        ]

        return sum(1 for term in security_terms if term in text)

    # Give clearly security-focused postings a better chance to enter the
    # AI analysis set, while still keeping the target-role search broad.
    candidate_jobs = sorted(
        unique_jobs.values(),
        key=cybersecurity_priority,
        reverse=True,
    )

    max_jobs = max(1, min(int(max_jobs or 20), 20))
    jobs = candidate_jobs[:max_jobs]

    if not jobs:
        return {
            "count": 0,
            "jobs": [],
            "aggregate": {},
        }

    compact_jobs = []

    for index, job in enumerate(jobs):
        compact_jobs.append(
            {
                "index": index,
                "title": job["title"],
                "company": job["company"],
                "location": job["location"],
                "description": job["description"],
                "url": job["url"],
            }
        )

    prompt = f"""
You are an expert cybersecurity recruiting analyst.

Candidate:
{resume_profile}

Target Role:
{target_role}

Jobs:
{json.dumps(compact_jobs, ensure_ascii=False)}

Analyze EVERY job.

Return ONLY valid JSON with this structure:

{{
    "jobs": [
        {{
            "index": 0,
            "fit_score": 0,

            "score_breakdown": {{
                "technical_skills": 0,
                "cybersecurity_skills": 0,
                "cloud_skills": 0,
                "experience": 0,
                "career_relevance": 0
            }},

            "cybersecurity_relevance": 0,
            "summary": "",

            "why_this_job": [],
            "why_not_this_job": [],

            "strong_matches": [],
            "partial_matches": [],
            "missing_skills": [],

            "skill_gap_priority": [
                {{
                    "skill": "",
                    "priority": 1,
                    "importance": "High",
                    "reason": "",
                    "recommended_action": ""
                }}
            ],

            "recommended_next_skill": {{
                "skill": "",
                "reason": "",
                "career_impact": ""
            }},

            "application_priority": "High",
            "application_priority_reason": "",

            "career_value": 0,
            "career_value_reason": "",

            "experience_match": ""
        }}
    ]
}}

Scoring:

fit_score:
0-100

cybersecurity_relevance:
0-100

career_value:
0-100

Application priority:
High / Medium / Low

Rules:

- Do not invent candidate experience.
- Separate missing skills from existing skills.
- Cybersecurity relevance should be high when the role directly involves security.
- Career value should consider whether the role helps the candidate move toward cybersecurity.
- A software/cloud/IT role can still have high career value if it builds cybersecurity-relevant skills.
- Prioritize actual job requirements.
- Return valid JSON only.
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=6000,
        )

        analysis = safe_json_load(response.output_text)

        if "jobs" not in analysis:
            analysis["jobs"] = []

        analyzed_jobs = []

        for index, job in enumerate(jobs):
            result = next(
                (
                    item
                    for item in analysis["jobs"]
                    if item.get("index") == index
                ),
                {},
            )

            merged = {
                **job,
                **result,
            }

            analyzed_jobs.append(merged)

        analyzed_jobs.sort(
            key=lambda x: (
                x.get("cybersecurity_relevance", 0),
                x.get("fit_score", 0),
                x.get("career_value", 0),
            ),
            reverse=True,
        )

        # Step 30 filters: keep only jobs that meet the user's minimums.
        # max_jobs is capped at 20 above, so this never expands the result set.
        filtered_jobs = [
            job
            for job in analyzed_jobs
            if float(job.get("fit_score", 0) or 0) >= float(min_fit_score or 0)
            and float(job.get("cybersecurity_relevance", 0) or 0) >= float(min_cybersecurity_relevance or 0)
        ]

        # After filtering, rank the strongest cybersecurity opportunities first.
        analyzed_jobs = filtered_jobs[:max_jobs]

        # -------------------------------------------------
        # Aggregate intelligence
        # -------------------------------------------------

        skill_counts = {}

        for job in analyzed_jobs:
            for skill in job.get("missing_skills", []):
                normalized = str(skill).strip()

                if normalized:
                    skill_counts[normalized] = (
                        skill_counts.get(normalized, 0) + 1
                    )

        repeated_skills = sorted(
            [
                {
                    "skill": skill,
                    "job_count": count,
                    "importance": (
                        "High"
                        if count >= 4
                        else "Medium"
                        if count >= 2
                        else "Low"
                    ),
                }
                for skill, count in skill_counts.items()
            ],
            key=lambda x: (
                x["job_count"],
                x["importance"],
            ),
            reverse=True,
        )

        top_fit = (
            analyzed_jobs[0]
            if analyzed_jobs
            else None
        )

        cybersecurity_jobs = sorted(
            analyzed_jobs,
            key=lambda x: x.get(
                "cybersecurity_relevance",
                0,
            ),
            reverse=True,
        )

        top_cyber_job = (
            cybersecurity_jobs[0]
            if cybersecurity_jobs
            else None
        )

        return {
            "count": len(analyzed_jobs),
            "jobs": analyzed_jobs,
            "aggregate": {
                "average_fit_score": round(
                    sum(
                        x.get("fit_score", 0)
                        for x in analyzed_jobs
                    ) / len(analyzed_jobs),
                    1,
                )
                if analyzed_jobs
                else 0,

                "average_cybersecurity_relevance": round(
                    sum(
                        x.get(
                            "cybersecurity_relevance",
                            0,
                        )
                        for x in analyzed_jobs
                    ) / len(analyzed_jobs),
                    1,
                )
                if analyzed_jobs
                else 0,

                "top_fit_job": {
                    "title": top_fit.get("title"),
                    "company": top_fit.get("company"),
                    "fit_score": top_fit.get(
                        "fit_score",
                        0,
                    ),
                }
                if top_fit
                else None,

                "top_cybersecurity_job": {
                    "title": top_cyber_job.get("title"),
                    "company": top_cyber_job.get("company"),
                    "cybersecurity_relevance":
                        top_cyber_job.get(
                            "cybersecurity_relevance",
                            0,
                        ),
                }
                if top_cyber_job
                else None,

                "repeated_missing_skills":
                    repeated_skills[:15],
            },
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Job intelligence failed: {str(e)}",
        )


# =========================================================
# INDIVIDUAL JOB ANALYSIS
# =========================================================

@app.post("/analyze-job")
async def analyze_job(
    resume_profile: str = Form(...),
    job_title: str = Form(...),
    company: str = Form(...),
    job_description: str = Form(...),
):
    ai = require_client()

    prompt = f"""
You are a cybersecurity job analyst.

Candidate:
{resume_profile}

Job:
{job_title}
Company:
{company}

Description:
{clean_text(job_description, 10000)}

Return ONLY JSON:

{{
    "fit_score": 0,
    "cybersecurity_relevance": 0,

    "strong_matches": [],
    "partial_matches": [],
    "missing_skills": [],

    "required_skills": [],
    "nice_to_have_skills": [],

    "why_this_job": [],
    "why_not_this_job": [],

    "skill_gap_priority": [
        {{
            "skill": "",
            "priority": 1,
            "importance": "High",
            "reason": "",
            "recommended_action": ""
        }}
    ],

    "recommended_next_skill": {{
        "skill": "",
        "reason": "",
        "career_impact": ""
    }},

    "application_priority": "",
    "application_priority_reason": "",

    "career_value": 0,
    "career_value_reason": "",

    "summary": ""
}}

Do not invent experience.
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=1800,
        )

        return safe_json_load(response.output_text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Job analysis failed: {str(e)}",
        )


# =========================================================
# SKILL GAP
# =========================================================

@app.post("/skill-gap")
async def skill_gap(
    resume_profile: str = Form(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
):
    ai = require_client()

    prompt = f"""
You are a cybersecurity skills-gap analyst.

Candidate:
{resume_profile}

Target Job:
{job_title}

Job Description:
{clean_text(job_description, 10000)}

Return ONLY JSON:

{{
    "overall_gap_score": 0,

    "strong_matches": [],

    "skill_gaps": [
        {{
            "skill": "",
            "importance": "High",
            "current_level": "",
            "required_level": "",
            "reason": "",
            "action": ""
        }}
    ],

    "top_priority": "",

    "recommended_order": [],

    "summary": ""
}}

Do not invent candidate experience.
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=3000,
        )

        return safe_json_load(response.output_text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Skill gap analysis failed: {str(e)}",
        )


# =========================================================
# LEARNING RECOMMENDATIONS
# =========================================================

@app.post("/learning-recommendations")
async def learning_recommendations(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    missing_skills: str = Form(...),
):
    ai = require_client()

    prompt = f"""
You are a cybersecurity learning and career advisor.

Candidate Profile:
{resume_profile}

Target Role:
{target_role}

Missing Skills:
{missing_skills}

Create a practical learning roadmap.

Return ONLY valid JSON:

{{
    "next_best_skill": {{
        "skill": "",
        "reason": "",
        "career_impact": ""
    }},

    "skill_roadmap": [
        {{
            "skill": "",
            "priority": 1,
            "difficulty": "Beginner",
            "why_it_matters": "",

            "youtube": [
                {{
                    "title": "",
                    "url": ""
                }}
            ],

            "free_courses": [
                {{
                    "title": "",
                    "provider": "",
                    "url": ""
                }}
            ],

            "official_docs": [
                {{
                    "title": "",
                    "url": ""
                }}
            ],

            "hands_on_labs": [
                {{
                    "name": "",
                    "url": ""
                }}
            ],

            "project": "",
            "estimated_time": ""
        }}
    ],

    "certifications": [
        {{
            "name": "",
            "priority": 1,
            "reason": "",
            "best_for": "",
            "difficulty": ""
        }}
    ],

    "learning_order": [],

    "career_strategy": ""
}}

Rules:

1. Focus on cybersecurity career development.
2. Prioritize skills that appear frequently in cybersecurity jobs.
3. Do not recommend unrelated skills.
4. Do not invent candidate experience.
5. Recommend certifications only when useful.
6. Prefer practical cybersecurity learning.
7. Include YouTube search URLs when needed.
8. Prefer official documentation.
9. Include TryHackMe or Hack The Box when appropriate.
10. Recommend projects useful for a cybersecurity resume.
11. Keep the roadmap realistic for a college student.
12. Rank by career impact.
13. First skill must be the highest-impact skill.
14. Do not recommend many certifications simultaneously.
15. Return valid JSON only.
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=5000,
        )

        return safe_json_load(response.output_text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Learning recommendation failed: {str(e)}",
        )


# =========================================================
# CAREER ROADMAP
# =========================================================

@app.post("/career-roadmap")
async def career_roadmap(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    jobs_data: str = Form(...),
):
    ai = require_client()

    prompt = f"""
You are a cybersecurity career strategist.

Candidate:
{resume_profile}

Target Role:
{target_role}

Analyzed Jobs:
{clean_text(jobs_data, 18000)}

Create a personalized cybersecurity career roadmap.

Return ONLY JSON:

{{
    "career_position": "",
    "current_strengths": [],
    "biggest_gaps": [],

    "next_30_days": [
        {{
            "goal": "",
            "actions": []
        }}
    ],

    "next_90_days": [
        {{
            "goal": "",
            "actions": []
        }}
    ],

    "next_6_months": [
        {{
            "goal": "",
            "actions": []
        }}
    ],

    "internship_strategy": "",
    "certification_strategy": "",
    "project_strategy": "",
    "job_application_strategy": "",

    "top_priority": "",
    "why": ""
}}

Rules:

- Focus on cybersecurity.
- Use the actual candidate profile.
- Use analyzed jobs to identify repeated requirements.
- Do not invent experience.
- Do not recommend unrealistic numbers of certifications.
- Prioritize employability.
- Prioritize repeated job requirements.
- Keep recommendations actionable.
- Return valid JSON only.
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=5000,
        )

        return safe_json_load(response.output_text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Career roadmap failed: {str(e)}",
        )


# =========================================================
# PERSONALIZED 90-DAY CAREER PLAN — STEP 32
# =========================================================

@app.post("/personalized-90-day-plan")
async def personalized_90_day_plan(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    jobs_data: str = Form(...),
    applications_data: str = Form(...),
):
    ai = require_client()

    prompt = f"""
You are a cybersecurity career strategist creating a personalized 90-day execution plan.

Candidate resume/profile:
{clean_text(resume_profile, 12000)}

Target role:
{clean_text(target_role, 2000)}

Current analyzed job market:
{clean_text(jobs_data, 18000)}

Application history:
{clean_text(applications_data, 10000)}

Create a practical, cybersecurity-focused 90-day plan based ONLY on the information provided.
The candidate is a college student preparing for cybersecurity internships/jobs.
Do not invent experience, certifications, projects, employers, interview results, or skills.
Use repeated requirements from the analyzed job market when possible.
Do not recommend many certifications at once. Prefer the smallest number of actions that materially improve employability.
The plan must be executable, measurable, and prioritized.

Return ONLY valid JSON with this exact structure:
{{
  "current_position": "",
  "target_role": "",
  "career_readiness": 0,
  "biggest_strength": "",
  "biggest_gap": "",
  "priority_skill": "",
  "how_to_learn": [
    {{"action": "", "resource_type": "", "resource": "", "time": ""}}
  ],
  "how_to_prove_it": [
    ""
  ],
  "cybersecurity_project": {{
    "name": "",
    "goal": "",
    "skills_proven": [],
    "deliverables": [],
    "estimated_time": ""
  }},
  "certification_strategy": {{
    "recommendation": "",
    "priority": "",
    "why_now": "",
    "what_not_to_do": ""
  }},
  "weekly_application_target": 0,
  "weekly_application_routine": [],
  "days_1_30": {{
    "theme": "",
    "goals": [],
    "weekly_actions": [
      {{"week": 1, "actions": []}},
      {{"week": 2, "actions": []}},
      {{"week": 3, "actions": []}},
      {{"week": 4, "actions": []}}
    ]
  }},
  "days_31_60": {{
    "theme": "",
    "goals": [],
    "weekly_actions": [
      {{"week": 5, "actions": []}},
      {{"week": 6, "actions": []}},
      {{"week": 7, "actions": []}},
      {{"week": 8, "actions": []}}
    ]
  }},
  "days_61_90": {{
    "theme": "",
    "goals": [],
    "weekly_actions": [
      {{"week": 9, "actions": []}},
      {{"week": 10, "actions": []}},
      {{"week": 11, "actions": []}},
      {{"week": 12, "actions": []}}
    ]
  }},
  "top_5_actions": [
    {{"rank": 1, "action": "", "why": "", "timeframe": ""}}
  ],
  "what_not_to_do_now": [],
  "success_metrics": [],
  "plan_summary": ""
}}

Rules:
- career_readiness must be an integer from 0 to 100.
- weekly_application_target must be a realistic integer; use 0 only if the candidate is clearly not ready to apply.
- Keep the plan focused on cybersecurity employability.
- Distinguish current evidence from future recommendations.
- If application history is empty, explicitly treat it as a baseline rather than inventing history.
- If a certification is already supported by the profile, do not recommend earning the same certification again.
- Include hands-on proof such as a project, lab, write-up, GitHub artifact, or documented analysis when appropriate.
- Return valid JSON only.
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=6500,
        )
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Personalized 90-day plan failed: {str(e)}",
        )



# =========================================================
# STEP 33 — AI CAREER SPRINT
# =========================================================

@app.post("/career-sprint")
async def career_sprint(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    jobs_data: str = Form(...),
    applications_data: str = Form(...),
    ninety_day_plan: str = Form(...),
    selected_week: int = Form(1),
):
    ai = require_client()
    week = max(1, min(int(selected_week), 12))
    prompt = f"""
You are an execution-focused cybersecurity career coach.

Candidate profile:
{clean_text(resume_profile, 10000)}

Target role:
{clean_text(target_role, 2000)}

Current job market:
{clean_text(jobs_data, 14000)}

Application history:
{clean_text(applications_data, 8000)}

Personalized 90-day plan:
{clean_text(ninety_day_plan, 14000)}

Create an actionable weekly sprint for WEEK {week} of the existing 12-week plan.
Keep the workload realistic for a college student. Focus on cybersecurity employability.
Do not invent skills, experience, certifications, projects, employers, or application results.
Use the 90-day plan as the source of direction. Do not replace it with unrelated goals.
Prefer 5-7 concrete actions with clear proof of completion.
If applications are behind target, include an application action. If a skill gap is the priority,
include hands-on practice and portfolio proof. Include interview preparation when relevant.

Return ONLY valid JSON in exactly this structure:
{{
  "week": {week},
  "sprint_theme": "",
  "weekly_goal": "",
  "focus_skill": "",
  "why_this_week_matters": "",
  "actions": [
    {{"id": "", "category": "Skill|Application|Project|Interview|Resume|Networking", "action": "", "estimated_time": "", "proof_of_completion": "", "priority": "High|Medium|Low"}}
  ],
  "application_target": 0,
  "application_strategy": "",
  "skill_practice": {{"topic": "", "practice": "", "proof": ""}},
  "project_milestone": {{"milestone": "", "deliverable": ""}},
  "interview_practice": {{"topic": "", "questions": []}},
  "end_of_week_check": [],
  "success_definition": "",
  "avoid_this_week": [],
  "coach_note": ""
}}
"""
    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=3000,
        )
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Career sprint failed: {str(e)}")

# =========================================================
# CAREER ADVICE
# =========================================================

@app.post("/career-advice")
async def career_advice(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
):
    ai = require_client()

    prompt = f"""
You are a cybersecurity career advisor.

Candidate:
{resume_profile}

Target role:
{target_role}

Give practical advice.

Return ONLY JSON:

{{
    "career_direction": "",
    "top_strengths": [],
    "top_gaps": [],
    "recommended_projects": [],
    "recommended_certifications": [],
    "recommended_tools": [],
    "job_search_strategy": "",
    "next_action": ""
}}
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=2500,
        )

        return safe_json_load(response.output_text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Career advice failed: {str(e)}",
        )


# =========================================================
# RESUME TAILORING
# =========================================================

@app.post("/tailor-resume")
async def tailor_resume(
    resume_text: str = Form(...),
    job_title: str = Form(...),
    company: str = Form(...),
    job_description: str = Form(...),
):
    ai = require_client()

    prompt = f"""
You are a professional cybersecurity resume editor.

Original Resume:
{clean_text(resume_text, 15000)}

Target Job:
{job_title}

Company:
{company}

Job Description:
{clean_text(job_description, 10000)}

Rewrite the resume to better match the job.

IMPORTANT:

- Never invent experience.
- Never invent projects.
- Never invent certifications.
- Never invent technologies.
- Never change factual dates.
- Only improve wording, ordering, and emphasis.
- Use cybersecurity-relevant terminology when supported by the original resume.

Return ONLY JSON:

{{
    "summary": "",
    "tailored_resume": "",
    "changes_made": [],
    "keywords_added": [],
    "keywords_not_added_because_missing": []
}}
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=4000,
        )

        return safe_json_load(response.output_text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume tailoring failed: {str(e)}",
        )


# =========================================================
# INTERVIEW PERFORMANCE HISTORY — STEP 24
# =========================================================

@app.post("/interview-history")
async def save_interview_history(
    target_role: str = Form(""),
    job_data: str = Form("{}"),
    scores: str = Form("[]"),
):
    if not SessionLocal:
        raise HTTPException(status_code=500, detail="Database is not configured.")

    try:
        job = json.loads(job_data or "{}")
    except Exception:
        job = {}

    try:
        score_items = json.loads(scores or "[]")
    except Exception:
        score_items = []

    if not isinstance(score_items, list) or not score_items:
        raise HTTPException(status_code=400, detail="Interview scores are required.")

    def avg(key):
        values = [float(x.get(key, 0) or 0) for x in score_items if isinstance(x, dict)]
        return round(sum(values) / len(values), 2) if values else 0

    overall = avg("overall")
    technical = avg("technical_accuracy")
    cybersecurity = avg("cybersecurity_reasoning")
    communication = avg("communication")
    structure = avg("structure")

    db = SessionLocal()
    try:
        session = InterviewSession(
            target_role=target_role,
            job_title=str(job.get("title", "")),
            company=str(job.get("company", "")),
            overall_score=overall,
            technical_score=technical,
            cybersecurity_score=cybersecurity,
            communication_score=communication,
            structure_score=structure,
            question_count=len(score_items),
            scores_json=json.dumps(score_items),
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return {"message": "Interview session saved.", "session_id": session.id, "overall_score": overall}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Could not save interview session: {str(e)}")
    finally:
        db.close()


@app.get("/interview-history")
async def get_interview_history(limit: int = 20):
    if not SessionLocal:
        return {"sessions": [], "analytics": {}}

    db = SessionLocal()
    try:
        rows = db.query(InterviewSession).order_by(InterviewSession.created_at.desc()).limit(max(1, min(limit, 100))).all()
        sessions = []
        for row in rows:
            sessions.append({
                "id": row.id,
                "target_role": row.target_role,
                "job_title": row.job_title,
                "company": row.company,
                "overall_score": row.overall_score or 0,
                "technical_score": row.technical_score or 0,
                "cybersecurity_score": row.cybersecurity_score or 0,
                "communication_score": row.communication_score or 0,
                "structure_score": row.structure_score or 0,
                "question_count": row.question_count,
                "created_at": row.created_at.isoformat() if row.created_at else None,
            })

        if not sessions:
            return {"sessions": [], "analytics": {"overall": 0, "technical": 0, "cybersecurity": 0, "communication": 0, "structure": 0, "trend": 0, "weakest_area": "—", "strongest_area": "—", "readiness": 0}}

        areas = {
            "Technical": [x["technical_score"] for x in sessions],
            "Cybersecurity": [x["cybersecurity_score"] for x in sessions],
            "Communication": [x["communication_score"] for x in sessions],
            "Structure": [x["structure_score"] for x in sessions],
        }
        avgs = {k: round(sum(v) / len(v), 2) for k, v in areas.items()}
        weakest = min(avgs, key=avgs.get)
        strongest = max(avgs, key=avgs.get)
        latest = sessions[0]["overall_score"]
        previous = sessions[1]["overall_score"] if len(sessions) > 1 else latest
        trend = round(latest - previous, 2)
        readiness = round((sum(avgs.values()) / len(avgs)) * 20, 1)

        return {
            "sessions": sessions,
            "analytics": {
                "overall": round(sum(x["overall_score"] for x in sessions) / len(sessions), 2),
                "technical": avgs["Technical"],
                "cybersecurity": avgs["Cybersecurity"],
                "communication": avgs["Communication"],
                "structure": avgs["Structure"],
                "trend": trend,
                "weakest_area": weakest,
                "strongest_area": strongest,
                "readiness": readiness,
            },
        }
    finally:
        db.close()


# =========================================================
# APPLICATION DECISION ENGINE — STEP 25
# =========================================================

@app.post("/application-decision-engine")
async def application_decision_engine(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    jobs_data: str = Form("[]"),
    selected_job: str = Form("{}"),
    career_intelligence: str = Form("{}"),
    nice_mapping: str = Form("{}"),
    learning_data: str = Form("{}"),
    interview_history: str = Form("{}"),
):
    ai = require_client()

    prompt = f"""
You are a cybersecurity career application decision engine.
Your job is to decide which cybersecurity opportunities the candidate should
apply to NOW, which should be pursued AFTER UPSKILLING, and which should be
DEPRIORITIZED.

Candidate Resume Profile:
{clean_text(resume_profile, 14000)}

Target Role:
{clean_text(target_role, 3000)}

Analyzed Job Market:
{clean_text(jobs_data, 26000)}

Selected Job:
{clean_text(selected_job, 7000)}

Career Intelligence:
{clean_text(career_intelligence, 10000)}

NICE-aligned Skill Mapping:
{clean_text(nice_mapping, 10000)}

Learning Recommendations:
{clean_text(learning_data, 8000)}

Interview Performance History:
{clean_text(interview_history, 7000)}

IMPORTANT:
- This is a career decision aid, not a guarantee of hiring outcomes.
- Never invent experience, certifications, projects, clearance, tools, or skills.
- Distinguish clearly between skills demonstrated by the resume and skills merely recommended.
- Prefer cybersecurity relevance, realistic student-level fit, career value, and skill-growth potential.
- A high fit score does not automatically mean APPLY NOW if the candidate has a critical missing requirement.
- A moderate fit can still be APPLY NOW when the missing skills are trainable and the role provides strong career value.
- Treat explicit hard requirements as more important than nice-to-have requirements.
- Use interview history only as evidence of interview readiness; do not treat it as job experience.
- Give practical recommendations for a college student.
- Use one of these decisions exactly: "APPLY NOW", "UPSKILL FIRST", "DEPRIORITIZE".
- application priority must be High, Medium, or Low.
- scores must be 0-100.

Return ONLY valid JSON using exactly this structure:
{{
  "decision_summary": "",
  "overall_strategy": "",
  "readiness": {{
    "career_fit": 0,
    "skill_readiness": 0,
    "interview_readiness": 0,
    "application_readiness": 0
  }},
  "selected_job_decision": {{
    "decision": "APPLY NOW",
    "priority": "High",
    "fit_score": 0,
    "confidence": "High",
    "reason": "",
    "strongest_match": "",
    "biggest_risk": "",
    "minimum_fix_before_applying": ""
  }},
  "job_decisions": [
    {{
      "index": 0,
      "job_title": "",
      "company": "",
      "decision": "APPLY NOW",
      "priority": "High",
      "score": 0,
      "reason": "",
      "key_strength": "",
      "key_gap": "",
      "next_action": ""
    }}
  ],
  "apply_now": [
    {{
      "job_title": "",
      "company": "",
      "why": "",
      "action": ""
    }}
  ],
  "upskill_first": [
    {{
      "job_title": "",
      "company": "",
      "skill_to_fix": "",
      "why": "",
      "action": ""
    }}
  ],
  "deprioritize": [
    {{
      "job_title": "",
      "company": "",
      "reason": ""
    }}
  ],
  "top_priority_actions": [
    {{
      "rank": 1,
      "action": "",
      "timeframe": "",
      "why": "",
      "expected_impact": ""
    }}
  ],
  "next_best_skill": {{
    "skill": "",
    "why": "",
    "how_to_prove_it": ""
  }},
  "application_strategy": {{
    "weekly_application_target": 0,
    "ideal_job_types": [],
    "avoid_for_now": [],
    "strategy": ""
  }}
}}
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=6500,
        )
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Application decision engine failed: {str(e)}",
        )

# =========================================================
# STEP 27 — APPLICATION PIPELINE
# =========================================================

@app.post("/application-pipeline")
async def application_pipeline(
    resume_profile: str = Form(...),
    resume_text: str = Form(""),
    target_role: str = Form(...),
    job_data: str = Form(...),
):
    ai = require_client()

    prompt = f"""
You are CyberPath AI's Application Pipeline Agent for cybersecurity jobs.

Build a complete, realistic application package for ONE selected job.
Use only evidence actually supported by the candidate profile/resume.

Candidate Profile:
{clean_text(resume_profile, 12000)}

Original Resume:
{clean_text(resume_text, 14000)}

Target Role:
{clean_text(target_role, 2000)}

Selected Job:
{clean_text(job_data, 18000)}

IMPORTANT:
- Never invent experience, projects, employers, certifications, dates,
  metrics, technologies, or accomplishments.
- Never claim the candidate has a skill merely because the job requires it.
- Resume edits may only improve wording, ordering, and emphasis.
- Cover letter claims must be supported by the resume/profile.
- Identify unsupported requirements separately.
- Keep the package realistic for a college student.
- Optimize for a cybersecurity internship or entry-level application.
- Return ONLY valid JSON.

Return exactly:
{{
  "application_decision": {{
    "recommendation": "Apply",
    "fit_score": 0,
    "reason": "",
    "apply_timing": "Now",
    "biggest_risk": "",
    "minimum_fix": ""
  }},
  "resume_package": {{
    "headline_focus": "",
    "summary": "",
    "skills_to_emphasize": [],
    "experience_bullets_to_emphasize": [],
    "project_bullets_to_emphasize": [],
    "resume_changes": [],
    "unsupported_keywords": []
  }},
  "cover_letter": {{
    "subject": "",
    "opening": "",
    "body": "",
    "closing": ""
  }},
  "interview_package": {{
    "top_technical_questions": [],
    "top_cybersecurity_questions": [],
    "top_behavioral_questions": [],
    "resume_questions": [],
    "must_prepare_topics": []
  }},
  "application_checklist": [
    {{"step": 1, "task": "", "status": "Ready", "reason": ""}}
  ],
  "tracker_setup": {{
    "recommended_status": "Saved",
    "recommended_priority": "High",
    "deadline_action": "",
    "follow_up_action": "",
    "notes": ""
  }},
  "next_actions": [],
  "application_summary": ""
}}
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=5000,
        )
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Application pipeline failed: {str(e)}",
        )


# =========================================================
# STEP 28 — APPLICATION PACKAGE STORAGE
# =========================================================

@app.post("/application-packages")
async def save_application_package(payload: ApplicationPackagePayload):
    if not SessionLocal:
        raise HTTPException(status_code=500, detail="Database is not configured.")

    job = payload.job or {}
    package = payload.package or {}
    job_title = str(job.get("title") or job.get("job_title") or "Untitled Job")
    company = str(job.get("company") or "")
    location = str(job.get("location") or "")
    url = str(job.get("url") or "")
    target_role = str(payload.target_role or "")
    decision = package.get("application_decision") or {}
    tracker = package.get("tracker_setup") or {}
    fit_score = float(decision.get("fit_score") or job.get("fit_score") or 0)
    status = str(tracker.get("recommended_status") or "Saved")
    priority = str(tracker.get("recommended_priority") or "Medium")

    db = SessionLocal()
    try:
        existing = None
        if url:
            existing = (
                db.query(ApplicationPackage)
                .filter(ApplicationPackage.url == url)
                .order_by(ApplicationPackage.updated_at.desc())
                .first()
            )
        if not existing:
            existing = (
                db.query(ApplicationPackage)
                .filter(
                    ApplicationPackage.job_title == job_title,
                    ApplicationPackage.company == company,
                )
                .order_by(ApplicationPackage.updated_at.desc())
                .first()
            )

        package_text = json.dumps(package, ensure_ascii=False)

        if existing:
            existing.job_title = job_title
            existing.company = company
            existing.location = location
            existing.url = url
            existing.target_role = target_role
            existing.fit_score = fit_score
            existing.status = status
            existing.priority = priority
            existing.version = (existing.version or 1) + 1
            existing.package_json = package_text
            existing.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(existing)
            saved = existing
            action = "updated"
        else:
            saved = ApplicationPackage(
                job_title=job_title,
                company=company,
                location=location,
                url=url,
                target_role=target_role,
                fit_score=fit_score,
                status=status,
                priority=priority,
                version=1,
                package_json=package_text,
            )
            db.add(saved)
            db.commit()
            db.refresh(saved)
            action = "created"

        # Keep the normal Application Tracker synchronized with the saved package.
        tracked = None
        if url:
            tracked = (
                db.query(Application)
                .filter(Application.url == url)
                .first()
            )
        if not tracked:
            tracked = (
                db.query(Application)
                .filter(
                    Application.job_title == job_title,
                    Application.company == company,
                )
                .first()
            )

        tracker_note = (
            f"Application Pipeline package v{saved.version} saved. "
            f"Package ID: {saved.id}."
        )
        if tracked:
            tracked.job_title = job_title
            tracked.company = company
            tracked.location = location
            tracked.url = url
            tracked.fit_score = fit_score
            tracked.priority = priority
            if not tracked.notes or "Application Pipeline package" not in tracked.notes:
                tracked.notes = tracker_note
            elif tracker_note not in tracked.notes:
                tracked.notes = tracked.notes + " " + tracker_note
            db.commit()
            db.refresh(tracked)
        else:
            tracked = Application(
                job_title=job_title,
                company=company,
                location=location,
                url=url,
                fit_score=fit_score,
                priority=priority,
                status=status,
                notes=tracker_note,
            )
            db.add(tracked)
            db.commit()
            db.refresh(tracked)

        return {
            "message": f"Application package {action}.",
            "package": {
                "id": saved.id,
                "job_title": saved.job_title,
                "company": saved.company,
                "location": saved.location,
                "url": saved.url,
                "target_role": saved.target_role,
                "fit_score": saved.fit_score or 0,
                "status": saved.status,
                "priority": saved.priority,
                "version": saved.version,
                "package": json.loads(saved.package_json),
                "created_at": saved.created_at.isoformat() if saved.created_at else None,
                "updated_at": saved.updated_at.isoformat() if saved.updated_at else None,
            },
        }
    finally:
        db.close()


@app.get("/application-packages")
async def get_application_packages():
    if not SessionLocal:
        raise HTTPException(status_code=500, detail="Database is not configured.")

    db = SessionLocal()
    try:
        packages = (
            db.query(ApplicationPackage)
            .order_by(ApplicationPackage.updated_at.desc())
            .all()
        )
        return [
            {
                "id": item.id,
                "job_title": item.job_title,
                "company": item.company,
                "location": item.location,
                "url": item.url,
                "target_role": item.target_role,
                "fit_score": item.fit_score or 0,
                "status": item.status,
                "priority": item.priority,
                "version": item.version or 1,
                "package": json.loads(item.package_json),
                "created_at": item.created_at.isoformat() if item.created_at else None,
                "updated_at": item.updated_at.isoformat() if item.updated_at else None,
            }
            for item in packages
        ]
    finally:
        db.close()


@app.get("/application-packages/{package_id}")
async def get_application_package(package_id: int):
    if not SessionLocal:
        raise HTTPException(status_code=500, detail="Database is not configured.")

    db = SessionLocal()
    try:
        item = db.query(ApplicationPackage).filter(ApplicationPackage.id == package_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Application package not found.")
        return {
            "id": item.id,
            "job_title": item.job_title,
            "company": item.company,
            "location": item.location,
            "url": item.url,
            "target_role": item.target_role,
            "fit_score": item.fit_score or 0,
            "status": item.status,
            "priority": item.priority,
            "version": item.version or 1,
            "package": json.loads(item.package_json),
            "created_at": item.created_at.isoformat() if item.created_at else None,
            "updated_at": item.updated_at.isoformat() if item.updated_at else None,
        }
    finally:
        db.close()


# =========================================================
# APPLICATIONS
# =========================================================

@app.post("/applications")
async def create_application(
    job_title: str = Form(...),
    company: str = Form(""),
    location: str = Form(""),
    url: str = Form(""),
    fit_score: float = Form(0),
    cybersecurity_relevance: float = Form(0),
    career_value: float = Form(0),
    priority: str = Form("Medium"),
    deadline: str = Form(""),
    notes: str = Form(""),
):
    if not SessionLocal:
        raise HTTPException(
            status_code=500,
            detail="Database is not configured.",
        )

    db = SessionLocal()

    try:
        existing = (
            db.query(Application)
            .filter(
                Application.job_title == job_title,
                Application.company == company,
            )
            .first()
        )

        if existing:
            return {
                "message": "Application already exists.",
                "application": {
                    "id": existing.id,
                    "job_title": existing.job_title,
                    "company": existing.company,
                },
            }

        application = Application(
            job_title=job_title,
            company=company,
            location=location,
            url=url,
            fit_score=fit_score,
            cybersecurity_relevance=cybersecurity_relevance,
            career_value=career_value,
            priority=priority,
            deadline=deadline,
            notes=notes,
        )

        db.add(application)
        db.commit()
        db.refresh(application)

        return {
            "message": "Application saved.",
            "application": {
                "id": application.id,
                "job_title": application.job_title,
                "company": application.company,
                "location": application.location,
                "url": application.url,
                "fit_score": application.fit_score,
                "cybersecurity_relevance":
                    application.cybersecurity_relevance,
                "career_value": application.career_value,
                "priority": application.priority,
                "status": application.status,
                "deadline": application.deadline,
                "notes": application.notes,
                "created_at":
                    application.created_at.isoformat()
                    if application.created_at
                    else None,
            },
        }

    finally:
        db.close()


@app.get("/applications")
async def get_applications():
    if not SessionLocal:
        raise HTTPException(
            status_code=500,
            detail="Database is not configured.",
        )

    db = SessionLocal()

    try:
        applications = (
            db.query(Application)
            .order_by(
                Application.created_at.desc()
            )
            .all()
        )

        return [
            {
                "id": app.id,
                "job_title": app.job_title,
                "company": app.company,
                "location": app.location,
                "url": app.url,
                "fit_score": app.fit_score or 0,
                "cybersecurity_relevance":
                    app.cybersecurity_relevance or 0,
                "career_value": app.career_value or 0,
                "priority": app.priority or "Medium",
                "status": app.status,
                "deadline": app.deadline,
                "notes": app.notes,
                "created_at":
                    app.created_at.isoformat()
                    if app.created_at
                    else None,
            }
            for app in applications
        ]

    finally:
        db.close()


@app.patch("/applications/{application_id}")
async def update_application(
    application_id: int,
    status: Optional[str] = Form(None),
    priority: Optional[str] = Form(None),
    deadline: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
):
    if not SessionLocal:
        raise HTTPException(
            status_code=500,
            detail="Database is not configured.",
        )

    db = SessionLocal()

    try:
        application = (
            db.query(Application)
            .filter(
                Application.id == application_id
            )
            .first()
        )

        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found.",
            )

        if status is not None:
            application.status = status

        if priority is not None:
            application.priority = priority

        if deadline is not None:
            application.deadline = deadline

        if notes is not None:
            application.notes = notes

        db.commit()
        db.refresh(application)

        return {
            "message": "Application updated.",
            "application": {
                "id": application.id,
                "job_title": application.job_title,
                "company": application.company,
                "location": application.location,
                "url": application.url,
                "fit_score": application.fit_score or 0,
                "cybersecurity_relevance":
                    application.cybersecurity_relevance or 0,
                "career_value":
                    application.career_value or 0,
                "priority": application.priority,
                "status": application.status,
                "deadline": application.deadline,
                "notes": application.notes,
            },
        }

    finally:
        db.close()


@app.delete("/applications/{application_id}")
async def delete_application(application_id: int):
    if not SessionLocal:
        raise HTTPException(
            status_code=500,
            detail="Database is not configured.",
        )

    db = SessionLocal()

    try:
        application = (
            db.query(Application)
            .filter(
                Application.id == application_id
            )
            .first()
        )

        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found.",
            )

        db.delete(application)
        db.commit()

        return {
            "message": "Application deleted.",
            "id": application_id,
        }

    finally:
        db.close()




# =========================================================
# CAREER INTELLIGENCE
# =========================================================

@app.post("/career-intelligence")
async def career_intelligence(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    jobs_data: str = Form(...),
    nice_mapping: str = Form(""),
    learning_data: str = Form(""),
    roadmap_data: str = Form(""),
):
    ai = require_client()

    prompt = f"""
You are CyberPath AI, a cybersecurity career intelligence engine.

Your job is to make a practical decision about what this candidate
should do NEXT in their cybersecurity career based on their actual
profile and the current jobs analyzed by the system.

Candidate Resume Profile:
{clean_text(resume_profile, 12000)}

Target Cybersecurity Role:
{clean_text(target_role, 2000)}

Analyzed Job Market:
{clean_text(jobs_data, 26000)}

NICE-aligned Skill Mapping:
{clean_text(nice_mapping, 10000)}

Learning Recommendations:
{clean_text(learning_data, 8000)}

Career Roadmap:
{clean_text(roadmap_data, 8000)}

IMPORTANT RULES:
- This is career guidance, not an official NICE/NIST assessment.
- Never invent experience, skills, certifications, projects, or education.
- Use only evidence present in the candidate profile.
- Prioritize cybersecurity roles and cybersecurity-relevant skills.
- Consider job fit, cybersecurity relevance, career value, missing skills,
  job frequency, experience match, and realistic student readiness.
- The candidate should NOT wait until every skill is learned before applying.
- Recommend applying now when the candidate is reasonably competitive,
  while learning the highest-impact missing skill in parallel.
- Do not recommend many certifications at once.
- Prefer practical skills and projects when they have higher immediate value.
- Distinguish between "apply now", "apply while upskilling", and "upskill first".
- Keep recommendations realistic for a college student/internship candidate.
- Scores must be 0-100.
- Return ONLY valid JSON.

Return exactly this structure:
{{
  "career_decision": {{
    "target_role": "",
    "career_fit": 0,
    "job_market_demand": "High",
    "current_readiness": 0,
    "internship_readiness": "High",
    "recommendation": "Apply now",
    "recommendation_reason": "",
    "best_next_move": ""
  }},
  "priority_actions": [
    {{
      "rank": 1,
      "action": "",
      "type": "Apply",
      "timeframe": "This week",
      "reason": "",
      "expected_impact": "High"
    }}
  ],
  "biggest_gap": {{
    "skill": "",
    "importance": "High",
    "reason": "",
    "evidence": "",
    "time_to_improve": ""
  }},
  "next_best_skill": {{
    "skill": "",
    "why_now": "",
    "career_impact": "",
    "learning_action": ""
  }},
  "next_project": {{
    "project": "",
    "skills_practiced": [],
    "why_this_project": "",
    "portfolio_value": "High"
  }},
  "certification_strategy": {{
    "recommended": "",
    "priority": "High",
    "why": "",
    "when": ""
  }},
  "application_strategy": {{
    "apply_now": true,
    "target_job_count": 0,
    "job_types": [],
    "avoid_for_now": [],
    "strategy": ""
  }},
  "thirty_day_plan": [
    {{
      "week": 1,
      "goal": "",
      "actions": []
    }}
  ],
  "decision_summary": ""
}}
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=5000,
        )
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Career intelligence failed: {str(e)}",
        )



# =========================================================
# STEP 21 — JOB APPLICATION COPILOT
# =========================================================

@app.post("/application-copilot")
async def application_copilot(
    resume_profile: str = Form(...),
    resume_text: str = Form(""),
    target_role: str = Form(...),
    job_data: str = Form(...),
):
    ai = require_client()

    prompt = f"""
You are CyberPath AI's Job Application Copilot for cybersecurity roles.

Analyze ONE specific job and the candidate's actual resume/profile.
Create a practical application package that helps the candidate decide
whether to apply and how to present their real experience.

Candidate Resume Profile:
{clean_text(resume_profile, 12000)}

Original Resume Text:
{clean_text(resume_text, 14000)}

Target Role:
{clean_text(target_role, 2000)}

Selected Job:
{clean_text(job_data, 18000)}

IMPORTANT RULES:
- Never invent experience, skills, projects, certifications, education,
  employers, metrics, or accomplishments.
- Only recommend resume emphasis when the candidate profile supports it.
- Clearly separate supported experience from missing requirements.
- The candidate may apply even when they do not meet every requirement.
- Do not tell the candidate to falsely claim a skill.
- Cover letter content must be based only on supported experience.
- Interview questions should reflect this exact job's likely requirements.
- Include cybersecurity technical questions when relevant.
- Include behavioral questions relevant to internships/entry-level roles.
- Keep the advice realistic for a college student.
- Scores must be 0-100.
- Return ONLY valid JSON.

Return exactly this structure:
{{
  "application_decision": {{
    "recommendation": "Apply",
    "fit_score": 0,
    "confidence": "High",
    "reason": "",
    "strongest_match": "",
    "biggest_concern": "",
    "apply_timing": "Now"
  }},
  "job_snapshot": {{
    "company": "",
    "job_title": "",
    "location": "",
    "top_requirements": [],
    "cybersecurity_focus": ""
  }},
  "resume_strategy": {{
    "headline_focus": "",
    "skills_to_emphasize": [],
    "experience_to_emphasize": [],
    "projects_to_emphasize": [],
    "skills_not_supported": [],
    "resume_changes": []
  }},
  "cover_letter": {{
    "opening": "",
    "body": "",
    "closing": ""
  }},
  "interview_prep": {{
    "technical_questions": [
      {{"question": "", "why_asked": "", "preparation_point": ""}}
    ],
    "behavioral_questions": [
      {{"question": "", "why_asked": "", "preparation_point": ""}}
    ],
    "candidate_stories": [
      {{"experience": "", "what_to_highlight": ""}}
    ]
  }},
  "application_checklist": [],
  "before_apply": [],
  "after_apply": [],
  "interview_readiness": 0,
  "decision_summary": ""
}}
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=6000,
        )
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Application copilot failed: {str(e)}",
        )


# =========================================================
# NICE SKILL MAPPING
# =========================================================


# =========================================================
# STEP 34 — CAREER EVIDENCE TRACKER
# =========================================================

@app.post("/career-evidence")
async def career_evidence(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    jobs_data: str = Form(...),
    applications_data: str = Form(...),
    ninety_day_plan: str = Form(...),
    sprint_data: str = Form("{}"),
    interview_analytics: str = Form("{}"),
    completed_actions: str = Form("{}"),
):
    ai = require_client()
    prompt = f"""
You are a cybersecurity career evidence auditor.
Determine how well the candidate can PROVE readiness for the target role using only supplied evidence.
Never invent achievements, projects, certifications, metrics, employers, interview results, or technical experience.
Planned work is not completed evidence. Job requirements are not candidate skills.

Candidate profile:
{clean_text(resume_profile, 10000)}
Target role:
{clean_text(target_role, 2000)}
Job market:
{clean_text(jobs_data, 12000)}
Application history:
{clean_text(applications_data, 8000)}
90-day plan:
{clean_text(ninety_day_plan, 10000)}
Current sprint:
{clean_text(sprint_data, 8000)}
Interview analytics:
{clean_text(interview_analytics, 6000)}
Completed sprint actions:
{clean_text(completed_actions, 6000)}

Return ONLY valid JSON in exactly this structure:
{{
  "readiness_score": 0,
  "evidence_strength": "Strong|Moderate|Weak",
  "headline": "",
  "current_proof": [{{"area":"","evidence":"","strength":"Strong|Moderate|Weak","why_it_matters":""}}],
  "evidence_gaps": [{{"skill":"","why_proof_is_missing":"","priority":"High|Medium|Low","best_proof":""}}],
  "portfolio_proof": [{{"artifact":"","type":"Project|Lab|Write-up|GitHub|Report|Certification|Interview","skill_proven":"","effort":"","proof_standard":""}}],
  "next_best_proof": {{"artifact":"","skill":"","reason":"","timeframe":""}},
  "application_evidence": {{"ready_to_apply":true,"what_to_emphasize":[],"what_not_to_claim":[],"minimum_proof_before_next_application":""}},
  "interview_evidence": {{"strongest_story_area":"","weakest_proof_area":"","practice_prompt":""}},
  "weekly_evidence_target":"",
  "top_actions":[{{"rank":1,"action":"","proof":"","impact":""}}],
  "evidence_summary":""
}}
"""
    try:
        response = ai.responses.create(model="gpt-5-mini", input=prompt, max_output_tokens=5000)
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Career evidence audit failed: {str(e)}")

# =========================================================
# STEP 35 — CYBERSECURITY PORTFOLIO BUILDER
# =========================================================

@app.post("/cybersecurity-portfolio")
async def cybersecurity_portfolio(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    jobs_data: str = Form(...),
    career_evidence: str = Form("{}"),
    personalized_plan: str = Form("{}"),
):
    ai = require_client()
    prompt = f"""
You are a cybersecurity portfolio strategist.
Build a realistic portfolio plan from the candidate's actual evidence and the analyzed cybersecurity job market.
Never invent completed experience, certifications, employers, projects, metrics, or tools.
Separate existing evidence from proposed projects. Proposed projects must be labeled as proposed.
Prioritize projects that close repeated job-market skill gaps and create strong interview/application evidence.
The candidate is a college student, so projects should be practical and achievable.

Candidate profile:
{clean_text(resume_profile, 10000)}
Target role:
{clean_text(target_role, 2000)}
Job market:
{clean_text(jobs_data, 18000)}
Career evidence audit:
{clean_text(career_evidence, 10000)}
90-day plan:
{clean_text(personalized_plan, 10000)}

Return ONLY valid JSON in exactly this structure:
{{
  "portfolio_direction": "",
  "portfolio_readiness": 0,
  "best_project": {{"name":"","why":"","target_skills":[],"difficulty":"Beginner|Intermediate|Advanced","estimated_time":"","career_value":0}},
  "project_blueprints": [
    {{
      "name":"",
      "status":"Proposed",
      "problem":"",
      "skills_proven":[],
      "tech_stack":[],
      "milestones":[{{"step":1,"task":"","deliverable":""}}],
      "github_structure":[],
      "resume_bullet":"",
      "interview_story":"",
      "proof_standard":"",
      "estimated_time":""
    }}
  ],
  "existing_evidence_to_feature": [{{"evidence":"","why":"","where":"Resume|GitHub|Portfolio|Interview"}}],
  "portfolio_gaps": [{{"skill":"","gap":"","best_artifact":"","priority":"High|Medium|Low"}}],
  "github_readme_outline": [""],
  "portfolio_homepage_sections": [""],
  "top_3_build_actions": [{{"rank":1,"action":"","deliverable":"","timeframe":""}}],
  "do_not_build": [""],
  "portfolio_summary":""
}}
"""
    try:
        response = ai.responses.create(model="gpt-5-mini", input=prompt, max_output_tokens=6000)
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cybersecurity portfolio builder failed: {str(e)}")

# =========================================================
# STEP 36 — PORTFOLIO QUALITY AUDIT
# =========================================================

@app.post("/portfolio-quality-audit")
async def portfolio_quality_audit(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    jobs_data: str = Form(...),
    career_evidence: str = Form("{}"),
    portfolio_data: str = Form("{}"),
    applications_data: str = Form("[]"),
):
    ai = require_client()
    prompt = f"""
You are a cybersecurity portfolio hiring reviewer.
Audit the candidate's current cybersecurity portfolio strategy against the target role and real analyzed job market.
Do not invent completed projects, tools, certifications, metrics, employers, or experience.
Treat portfolio projects marked Proposed as not completed.
The goal is to make the portfolio credible for cybersecurity internship and entry-level hiring.
Prioritize evidence that can be verified in GitHub, a portfolio site, a lab write-up, a report, a demo, or an interview.
Identify weak or generic projects, missing proof, missing technical depth, and projects that should be improved before adding more projects.
Keep recommendations realistic for a college student.

Candidate profile:
{clean_text(resume_profile, 10000)}
Target role:
{clean_text(target_role, 2000)}
Analyzed job market:
{clean_text(jobs_data, 18000)}
Career evidence:
{clean_text(career_evidence, 9000)}
Portfolio plan:
{clean_text(portfolio_data, 14000)}
Application history:
{clean_text(applications_data, 7000)}

Return ONLY valid JSON using exactly this structure:
{{
  "portfolio_score": 0,
  "hiring_readiness": "",
  "overall_verdict": "",
  "strongest_proof": {{"artifact":"","why":"","skills_proven":[]}},
  "weakest_proof": {{"artifact":"","problem":"","risk":"","fix":""}},
  "project_audits": [
    {{
      "project":"",
      "status":"Completed|In Progress|Proposed|Unknown",
      "technical_depth": 0,
      "cybersecurity_relevance": 0,
      "evidence_quality": 0,
      "resume_value": 0,
      "interview_value": 0,
      "what_is_good":"",
      "what_is_missing":"",
      "next_improvement":"",
      "keep_or_change":"Keep|Improve|Replace"
    }}
  ],
  "skill_proof_matrix": [
    {{"skill":"","job_demand":"High|Medium|Low","current_proof":"","proof_strength":"Strong|Partial|Gap","best_evidence":"","priority":"High|Medium|Low"}}
  ],
  "top_portfolio_fixes": [
    {{"rank":1,"fix":"","deliverable":"","timeframe":"","impact":""}}
  ],
  "github_quality_checklist": [],
  "interview_demo_checklist": [],
  "resume_portfolio_changes": [],
  "do_not_add": [],
  "next_best_artifact": {{"name":"","purpose":"","skills_proven":[],"deliverables":[],"estimated_time":""}},
  "portfolio_strategy":""
}}
Return valid JSON only.
"""
    try:
        response = ai.responses.create(model="gpt-5-mini", input=prompt, max_output_tokens=6500)
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Portfolio quality audit failed: {str(e)}")


# =========================================================
# STEP 37 — APPLICATION READINESS GATE
# =========================================================

@app.post("/application-readiness-gate")
async def application_readiness_gate(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    selected_job: str = Form(...),
    jobs_data: str = Form("[]"),
    applications_data: str = Form("[]"),
    career_intelligence: str = Form("{}"),
    career_evidence: str = Form("{}"),
    portfolio_audit: str = Form("{}"),
    interview_analytics: str = Form("{}"),
):
    ai = require_client()
    prompt = f"""
You are a cybersecurity application readiness gate for a college student.
Decide whether the candidate should APPLY NOW, FIX A SMALL GAP AND APPLY, or UPSKILL BEFORE APPLYING to the selected job.
Use only supplied evidence. Never invent experience, certifications, projects, tools, metrics, employers, or completed work.
A proposed project or planned skill is NOT completed evidence.
Do not reject a candidate merely because they do not meet every preferred qualification; distinguish must-have blockers from trainable gaps.
Prioritize cybersecurity relevance, realistic internship/entry-level expectations, evidence quality, and interview readiness.

Candidate profile:
{clean_text(resume_profile, 10000)}
Target role:
{clean_text(target_role, 2000)}
Selected job:
{clean_text(selected_job, 12000)}
Other analyzed jobs:
{clean_text(jobs_data, 10000)}
Application history:
{clean_text(applications_data, 7000)}
Career intelligence:
{clean_text(career_intelligence, 8000)}
Career evidence:
{clean_text(career_evidence, 9000)}
Portfolio audit:
{clean_text(portfolio_audit, 9000)}
Interview analytics:
{clean_text(interview_analytics, 7000)}

Return ONLY valid JSON in exactly this structure:
{{
  "decision": "APPLY NOW|FIX SMALL GAP AND APPLY|UPSKILL BEFORE APPLYING|DEPRIORITIZE",
  "readiness_score": 0,
  "confidence": "High|Medium|Low",
  "one_line_verdict": "",
  "why_now_or_not": "",
  "scorecard": {{
    "job_fit": 0,
    "technical_readiness": 0,
    "cybersecurity_readiness": 0,
    "evidence_strength": 0,
    "interview_readiness": 0,
    "application_quality": 0
  }},
  "must_have_check": [
    {{"requirement":"","candidate_evidence":"","status":"Met|Partial|Missing|Unknown","is_blocker":false,"action":""}}
  ],
  "strongest_matches": [],
  "critical_gaps": [
    {{"skill":"","severity":"High|Medium|Low","why_it_matters":"","minimum_fix":"","estimated_effort":""}}
  ],
  "resume_positioning": {{
    "headline_focus":"",
    "skills_to_emphasize":[],
    "experience_to_emphasize":[],
    "do_not_claim":[]
  }},
  "interview_risk": {{
    "risk_level":"Low|Medium|High",
    "likely_challenge":"",
    "prepare_this":""
  }},
  "application_actions": [
    {{"rank":1,"action":"","reason":"","timeframe":""}}
  ],
  "if_applying_now": [""],
  "if_waiting": [""],
  "final_recommendation":""
}}
Return valid JSON only.
"""
    try:
        response = ai.responses.create(model="gpt-5-mini", input=prompt, max_output_tokens=5000)
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Application readiness gate failed: {str(e)}")

@app.post("/nice-skill-mapping")
async def nice_skill_mapping(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    jobs_data: str = Form(...),
):
    ai = require_client()

    prompt = f"""
You are a cybersecurity career analyst specializing in the
NIST NICE Cybersecurity Workforce Framework.

Analyze the candidate against cybersecurity work roles and
skills using NICE-aligned terminology.

Candidate Resume Profile:
{resume_profile}

Target Cybersecurity Role:
{target_role}

Analyzed Job Market Data:
{clean_text(jobs_data, 22000)}

Your goal is to map the candidate's current cybersecurity
capabilities to appropriate NICE-aligned cybersecurity work
roles and identify the highest-impact skill gaps.

IMPORTANT:
- This is an AI-generated career mapping using NICE-aligned terminology.
- Do NOT claim this is an official NIST assessment, certification, or credential.
- Do not invent candidate experience.
- Only mark a skill as Strong when the resume/profile provides clear evidence.
- Mark a skill Partial when there is related or indirect evidence.
- Mark a skill Gap when there is no meaningful evidence.
- Focus on cybersecurity capabilities rather than generic programming skills.
- Use recognizable NICE-aligned cybersecurity terminology.
- Use the target role and analyzed jobs to determine relevance.
- Prioritize skills that repeatedly appear in the analyzed job market.
- Do not force every NICE category into the result.
- Keep the mapping realistic for a college student.
- A candidate can match multiple work roles.
- Match scores must be 0-100.
- Priority must be High, Medium, or Low.

Useful NICE-aligned work-role/category terminology includes:
- Securely Provision
- Operate and Maintain
- Protect and Defend
- Investigate
- Collect and Operate
- Analyze
- Oversight and Governance

Useful cybersecurity skill areas include:
- Threat Analysis
- Threat Intelligence
- Network Analysis
- Vulnerability Analysis
- Incident Response
- Digital Forensics
- Security Monitoring
- Security Operations
- Log Analysis
- Intrusion Detection
- Malware Analysis
- Cyber Defense
- Security Architecture
- Cloud Security
- Identity and Access Management
- Risk Management
- Security Assessment
- Application Security
- Security Engineering

Return ONLY valid JSON using exactly this structure:

{{
    "nice_summary": {{
        "best_work_role": "",
        "work_role_match": 0,
        "overall_skill_match": 0,
        "summary": ""
    }},

    "work_roles": [
        {{
            "role": "",
            "match_score": 0,
            "reason": "",
            "skills": [
                {{
                    "skill": "",
                    "nice_category": "",
                    "candidate_level": "Strong",
                    "evidence": "",
                    "gap": "",
                    "priority": "Low"
                }}
            ]
        }}
    ],

    "skill_summary": {{
        "strong": [],
        "partial": [],
        "gaps": []
    }},

    "top_skill_gaps": [
        {{
            "skill": "",
            "nice_category": "",
            "priority": "High",
            "why_it_matters": "",
            "recommended_action": ""
        }}
    ],

    "recommended_work_role": "",

    "recommended_next_skill": {{
        "skill": "",
        "reason": "",
        "career_impact": ""
    }},

    "career_direction": ""
}}

Rules for candidate_level:
- Strong = clear evidence in the candidate profile/resume.
- Partial = related, adjacent, or limited evidence.
- Gap = no meaningful evidence.

Rules for top_skill_gaps:
- Rank by target-role importance, job frequency, and career impact.
- Prefer gaps that can improve the candidate's match across multiple jobs.
- Do not list a skill as a gap if the candidate clearly demonstrates it.

Return valid JSON only.
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=6000,
        )

        return safe_json_load(response.output_text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"NICE skill mapping failed: {str(e)}",
        )


# =========================================================
# STEP 38 — APPLICATION FOLLOW-UP COPILOT
# =========================================================

@app.post("/application-follow-up-copilot")
async def application_follow_up_copilot(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    selected_job: str = Form(...),
    application_status: str = Form("Applied"),
    application_notes: str = Form(""),
    applications_data: str = Form("[]"),
    application_readiness: str = Form("{}"),
    application_pipeline: str = Form("{}"),
    interview_analytics: str = Form("{}"),
):
    ai = require_client()
    prompt = f"""
You are a cybersecurity job-search follow-up copilot for a college student applying to internships and entry-level cybersecurity roles.
Create a realistic, concise follow-up and networking strategy for the selected job.
Use ONLY supplied information. Never invent recruiter names, contact information, referrals, conversations, interview results, certifications, experience, or relationships.
If no recruiter/contact person is supplied, provide a generic recruiter or hiring-team message rather than inventing a name.
Do not recommend spammy behavior. Follow-ups should be spaced appropriately and stop when the company signals no further contact.
Do not claim the candidate has interviewed unless the supplied application status/history supports it.
Differentiate between application follow-up, recruiter outreach, networking, interview thank-you, and post-interview follow-up.
Keep outreach professional, short, and realistic for a college student.

Candidate resume/profile:
{clean_text(resume_profile, 9000)}
Target role:
{clean_text(target_role, 1500)}
Selected job:
{clean_text(selected_job, 10000)}
Current application status:
{clean_text(application_status, 500)}
Application notes/contact details supplied by the user:
{clean_text(application_notes, 3000)}
Application history:
{clean_text(applications_data, 7000)}
Application readiness:
{clean_text(application_readiness, 7000)}
Application package/pipeline:
{clean_text(application_pipeline, 7000)}
Interview analytics/history:
{clean_text(interview_analytics, 6000)}

Return ONLY valid JSON in exactly this structure:
{{
  "follow_up_strategy": "",
  "recommended_channel": "Email|LinkedIn|Application Portal|No outreach yet|Multiple",
  "recommended_timing": "",
  "priority": "High|Medium|Low",
  "contact_assumption": "",
  "recruiter_message": {{"subject":"","message":""}},
  "linkedin_message": "",
  "application_follow_up": [{{"timing":"","trigger":"","action":"","message":""}}],
  "interview_thank_you": {{"when_to_send":"","subject":"","message":""}},
  "post_interview_follow_up": {{"timing":"","message":"","what_to_reference":[]}},
  "networking_targets": [{{"target_type":"","why":"","approach":""}}],
  "questions_to_ask": [],
  "personalization_points": [],
  "do_not_send": [],
  "tracking_updates": [{{"field":"","value":"","reason":""}}],
  "next_best_action": {{"action":"","timing":"","why":""}},
  "follow_up_summary": ""
}}
"""
    try:
        response = ai.responses.create(model="gpt-5-mini", input=prompt, max_output_tokens=5000)
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Application follow-up copilot failed: {str(e)}")



# =========================================================
# STEP 39 — CAREER OUTCOME INTELLIGENCE
# =========================================================

@app.post("/career-outcome-intelligence")
async def career_outcome_intelligence(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    jobs_data: str = Form("[]"),
    applications_data: str = Form("[]"),
    application_analytics: str = Form("{}"),
    interview_analytics: str = Form("{}"),
    career_intelligence: str = Form("{}"),
    application_decision: str = Form("{}"),
):
    ai = require_client()
    prompt = f"""
You are a cybersecurity career outcome analyst for a college student applying to internships and entry-level cybersecurity roles.
Analyze the candidate's actual application and interview outcomes and turn them into practical targeting improvements.
Use ONLY the supplied information. Never invent applications, interviews, offers, recruiter responses, skills, certifications, or outcomes.
If there is not enough outcome history, explicitly say the sample is too small and give a measurement plan instead of pretending there is a pattern.
Do not treat Saved applications as applications sent. Distinguish Saved, Applied, Interview, Offer, and Rejected when the data supports it.
Focus on cybersecurity career strategy: job type, role, company pattern, skill gaps, fit score calibration, interview readiness, and application behavior.
Avoid generic advice. Recommendations should be tied to observed data or clearly labeled as hypotheses.

Candidate profile:
{clean_text(resume_profile, 9000)}
Target role:
{clean_text(target_role, 1500)}
Analyzed job market:
{clean_text(jobs_data, 12000)}
Application history:
{clean_text(applications_data, 10000)}
Application analytics:
{clean_text(application_analytics, 9000)}
Interview analytics/history:
{clean_text(interview_analytics, 8000)}
Career intelligence:
{clean_text(career_intelligence, 8000)}
Application decision engine:
{clean_text(application_decision, 8000)}

Return ONLY valid JSON in exactly this structure:
{{
  "data_quality": {{"sample_size": 0, "confidence": "Low|Medium|High", "limitations": []}},
  "outcome_summary": "",
  "conversion_funnel": {{"saved": 0, "applied": 0, "interviews": 0, "offers": 0, "rejected": 0, "application_to_interview_rate": 0, "interview_to_offer_rate": 0}},
  "what_is_working": [{{"signal":"","evidence":"","confidence":"High|Medium|Low"}}],
  "what_is_not_working": [{{"signal":"","evidence":"","likely_cause":"","confidence":"High|Medium|Low"}}],
  "best_targeting_pattern": {{"job_types":[],"roles":[],"cybersecurity_focus":[],"location_pattern":"","reason":""}},
  "weak_targeting_pattern": {{"job_types":[],"roles":[],"reason":""}},
  "fit_score_calibration": {{"interpretation":"","overestimating_risk":"","underestimating_risk":"","recommended_rule":""}},
  "skill_signals": [{{"skill":"","job_demand":"","candidate_evidence":"","outcome_signal":"","action":""}}],
  "interview_signal": {{"strength":"","weakness":"","evidence":"","next_practice":""}},
  "application_behavior": {{"weekly_target_recommendation":0,"timing_advice":"","priority_rule":"","follow_up_rule":""}},
  "strategy_changes": [{{"rank":1,"change":"","why":"","expected_impact":"","timeframe":""}}],
  "next_best_skill": {{"skill":"","why":"","how_to_prove_it":""}},
  "next_best_job_profile": {{"title_pattern":"","cybersecurity_focus":"","minimum_fit_score":0,"minimum_cybersecurity_relevance":0,"reason":""}},
  "30_day_experiment": [{{"week":1,"action":"","metric":""}}],
  "stop_doing": [],
  "continue_doing": [],
  "measurement_plan": [{{"metric":"","target":"","review_frequency":""}}],
  "executive_recommendation": ""
}}
"""
    try:
        response = ai.responses.create(model="gpt-5-mini", input=prompt, max_output_tokens=6000)
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Career outcome intelligence failed: {str(e)}")

# =========================================================
# STEP 23 — MOCK INTERVIEW
# =========================================================

@app.post("/mock-interview/start")
async def mock_interview_start(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    job_data: str = Form(...),
    interview_plan: str = Form(""),
):
    ai = require_client()

    prompt = f"""
You are an experienced cybersecurity interviewer running a realistic mock interview.
Create a 5-question interview for a college student applying to the target job.

Target Role:
{target_role}

Candidate Profile:
{clean_text(resume_profile, 10000)}

Selected Job:
{clean_text(job_data, 12000)}

Interview Preparation Plan:
{clean_text(interview_plan, 10000)}

Rules:
- Use the actual job requirements and candidate profile.
- Do not invent candidate experience.
- Mix technical, cybersecurity scenario, resume-based, and behavioral questions.
- Start at realistic internship/entry-level difficulty.
- Questions should require the candidate to explain reasoning, not just definitions.
- Make follow-up questions possible from the candidate's answer.
- Do not provide the answers.
- The fifth question should be a strong closing question.

Return ONLY valid JSON:
{{
  "session_title": "",
  "instructions": "",
  "questions": [
    {{
      "number": 1,
      "category": "Technical",
      "difficulty": "Medium",
      "question": "",
      "what_it_tests": ""
    }}
  ]
}}
"""
    try:
        response = ai.responses.create(model="gpt-5-mini", input=prompt, max_output_tokens=3000)
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mock interview start failed: {str(e)}")


@app.post("/mock-interview/evaluate")
async def mock_interview_evaluate(
    resume_profile: str = Form(...),
    target_role: str = Form(...),
    job_data: str = Form(...),
    question: str = Form(...),
    category: str = Form("Technical"),
    answer: str = Form(...),
    previous_feedback: str = Form(""),
):
    ai = require_client()

    prompt = f"""
You are evaluating a student's answer in a cybersecurity job mock interview.
Be strict but constructive. Evaluate what the candidate actually said.

Target Role:
{target_role}

Candidate Profile:
{clean_text(resume_profile, 9000)}

Job:
{clean_text(job_data, 10000)}

Question Category: {category}
Question:
{clean_text(question, 5000)}

Candidate Answer:
{clean_text(answer, 9000)}

Previous Feedback (if any):
{clean_text(previous_feedback, 4000)}

Rules:
- Never reward claims that are unsupported by the candidate profile.
- Identify technical inaccuracies clearly.
- For behavioral answers, check STAR structure without requiring the labels literally.
- For cybersecurity answers, evaluate security reasoning, prioritization, investigation steps, and communication.
- For technical answers, evaluate correctness and depth appropriate for an internship candidate.
- Give actionable feedback the candidate can use immediately.
- Suggest a stronger answer direction, but do NOT fabricate personal experience.
- Generate 1-3 realistic follow-up questions based on the answer.
- Score each area from 1 to 5.

Return ONLY valid JSON:
{{
  "scores": {{
    "overall": 0,
    "technical_accuracy": 0,
    "cybersecurity_reasoning": 0,
    "communication": 0,
    "structure": 0
  }},
  "verdict": "Strong",
  "what_went_well": [],
  "issues_to_fix": [],
  "technical_accuracy_issues": [],
  "star_feedback": "",
  "stronger_answer_direction": "",
  "must_include_next_time": [],
  "follow_up_questions": [],
  "coach_note": ""
}}
"""
    try:
        response = ai.responses.create(model="gpt-5-mini", input=prompt, max_output_tokens=3000)
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mock interview evaluation failed: {str(e)}")


# =========================================================
# STEP 22 — INTERVIEW INTELLIGENCE
# =========================================================

@app.post("/interview-intelligence")
async def interview_intelligence(
    resume_profile: str = Form(...),
    resume_text: str = Form(""),
    target_role: str = Form(...),
    job_data: str = Form(...),
    copilot_data: str = Form(""),
):
    ai = require_client()

    prompt = f"""
You are a cybersecurity technical interviewer and career coach.
Create a realistic interview preparation package for a college student
applying to a cybersecurity job.

Target Role:
{target_role}

Candidate Profile:
{clean_text(resume_profile, 12000)}

Candidate Resume:
{clean_text(resume_text, 14000)}

Selected Job:
{clean_text(job_data, 14000)}

Application Copilot Analysis:
{clean_text(copilot_data, 9000)}

IMPORTANT RULES:
- Do not invent candidate experience, projects, certifications, employers, or technical knowledge.
- Resume evidence must be treated as the source of truth for candidate-specific questions.
- Ask realistic questions that could actually appear for this job.
- Focus on cybersecurity, cloud/security engineering, SOC, CTI, incident response, network security, or other relevant areas from the job.
- Include resume-based questions that connect directly to real candidate experience.
- Include technical questions at an appropriate internship/entry-level difficulty.
- Include behavioral questions.
- Include scenario-based cybersecurity questions.
- For every question explain why it is likely to be asked and what a strong answer should demonstrate.
- Do not write a fake answer claiming the candidate did something they did not do.
- For candidate-specific preparation, tell the candidate which real experience or evidence to use.
- Score readiness from 0-100.
- Identify the highest-impact weakness.
- Give concrete practice actions.
- Keep the result useful for an actual interview within the next few weeks.

Return ONLY valid JSON using exactly this structure:

{{
  "interview_readiness": {{
    "overall_score": 0,
    "technical_score": 0,
    "cybersecurity_score": 0,
    "behavioral_score": 0,
    "resume_score": 0,
    "readiness_level": "",
    "summary": "",
    "biggest_weakness": "",
    "next_practice": ""
  }},

  "interview_strategy": {{
    "first_impression": "",
    "top_topics": [],
    "stories_to_prepare": [],
    "technical_focus": [],
    "questions_to_ask_interviewer": []
  }},

  "technical_questions": [
    {{
      "question": "",
      "difficulty": "Easy",
      "why_asked": "",
      "what_strong_answer_should_show": "",
      "candidate_preparation": "",
      "follow_up": ""
    }}
  ],

  "cybersecurity_scenarios": [
    {{
      "scenario": "",
      "what_interviewer_is_testing": "",
      "recommended_framework": "",
      "candidate_preparation": "",
      "follow_up": ""
    }}
  ],

  "resume_questions": [
    {{
      "question": "",
      "resume_evidence_to_use": "",
      "what_to_emphasize": "",
      "follow_up": ""
    }}
  ],

  "behavioral_questions": [
    {{
      "question": "",
      "why_asked": "",
      "recommended_story": "",
      "what_to_emphasize": ""
    }}
  ],

  "practice_plan": [
    {{
      "priority": 1,
      "topic": "",
      "action": "",
      "estimated_time": ""
    }}
  ],

  "red_flags": [],
  "confidence_notes": ""
}}

Return valid JSON only.
"""

    try:
        response = ai.responses.create(
            model="gpt-5-mini",
            input=prompt,
            max_output_tokens=6500,
        )
        return safe_json_load(response.output_text)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Interview intelligence failed: {str(e)}",
        )


# =========================================================
# STEP 29 — APPLICATION ANALYTICS
# =========================================================

@app.get("/application-analytics")
async def application_analytics():
    if not SessionLocal:
        raise HTTPException(status_code=500, detail="Database is not configured.")

    db = SessionLocal()
    try:
        applications = db.query(Application).order_by(Application.created_at.asc()).all()
        interviews = db.query(InterviewSession).order_by(InterviewSession.created_at.asc()).all()

        total = len(applications)
        status_counts = {}
        for item in applications:
            status = item.status or "Saved"
            status_counts[status] = status_counts.get(status, 0) + 1

        applied = sum(1 for x in applications if (x.status or '').lower() in {'applied','interview','offer','rejected'})
        interviews_count = status_counts.get("Interview", 0)
        offers = status_counts.get("Offer", 0)
        rejected = status_counts.get("Rejected", 0)
        awaiting = status_counts.get("Applied", 0)

        def pct(n, d):
            return round((n / d) * 100, 1) if d else 0

        conversion = {
            "saved_to_applied": pct(applied, total),
            "applied_to_interview": pct(interviews_count, applied),
            "interview_to_offer": pct(offers, interviews_count),
            "overall_offer_rate": pct(offers, applied),
            "rejection_rate": pct(rejected, applied),
        }

        avg_fit = round(sum((x.fit_score or 0) for x in applications) / total, 1) if total else 0
        applied_items = [x for x in applications if (x.status or '').lower() in {'applied','interview','offer','rejected'}]
        avg_applied_fit = round(sum((x.fit_score or 0) for x in applied_items) / len(applied_items), 1) if applied_items else 0

        companies = {}
        for item in applications:
            company = item.company or "Unknown Company"
            bucket = companies.setdefault(company, {"company": company, "applications": 0, "interviews": 0, "offers": 0, "avg_fit": 0, "fit_total": 0})
            bucket["applications"] += 1
            bucket["fit_total"] += item.fit_score or 0
            if (item.status or '').lower() == 'interview': bucket["interviews"] += 1
            if (item.status or '').lower() == 'offer': bucket["offers"] += 1

        company_performance = []
        for bucket in companies.values():
            bucket["avg_fit"] = round(bucket["fit_total"] / bucket["applications"], 1) if bucket["applications"] else 0
            bucket.pop("fit_total", None)
            company_performance.append(bucket)
        company_performance.sort(key=lambda x: (x["offers"], x["interviews"], x["avg_fit"]), reverse=True)

        roles = {}
        for item in applications:
            role = item.job_title or "Unknown Role"
            bucket = roles.setdefault(role, {"job_title": role, "applications": 0, "interviews": 0, "offers": 0, "avg_fit": 0, "fit_total": 0})
            bucket["applications"] += 1
            bucket["fit_total"] += item.fit_score or 0
            if (item.status or '').lower() == 'interview': bucket["interviews"] += 1
            if (item.status or '').lower() == 'offer': bucket["offers"] += 1
        role_performance = []
        for bucket in roles.values():
            bucket["avg_fit"] = round(bucket["fit_total"] / bucket["applications"], 1) if bucket["applications"] else 0
            bucket.pop("fit_total", None)
            role_performance.append(bucket)
        role_performance.sort(key=lambda x: (x["offers"], x["interviews"], x["avg_fit"]), reverse=True)

        interview_scores = [x.overall_score for x in interviews if x.overall_score is not None]
        avg_interview = round(sum(interview_scores) / len(interview_scores), 1) if interview_scores else 0

        if offers > 0:
            recommendation = "Prioritize the job types and companies already producing interviews or offers."
        elif interviews_count > 0:
            recommendation = "Your applications are generating interviews. Improve interview performance before dramatically increasing volume."
        elif applied > 0:
            recommendation = "Applications are going out but interviews are not converting yet. Tighten targeting, resume alignment, and job-fit selection."
        else:
            recommendation = "Build a focused application pipeline first. Target high-fit cybersecurity roles instead of maximizing application volume."

        return {
            "summary": {
                "total_applications": total,
                "applied_count": applied,
                "interview_count": interviews_count,
                "offer_count": offers,
                "rejected_count": rejected,
                "awaiting_response": awaiting,
                "average_fit": avg_fit,
                "average_applied_fit": avg_applied_fit,
                "average_interview_score": avg_interview,
                "recommendation": recommendation,
            },
            "status_counts": status_counts,
            "conversion": conversion,
            "company_performance": company_performance[:10],
            "role_performance": role_performance[:10],
            "interview_history_count": len(interviews),
        }
    finally:
        db.close()

# =========================================================
# DASHBOARD
# =========================================================

@app.get("/dashboard")
async def dashboard():
    if not SessionLocal:
        raise HTTPException(
            status_code=500,
            detail="Database is not configured.",
        )

    db = SessionLocal()

    try:
        applications = db.query(Application).all()

        total = len(applications)

        status_counts = {}

        for app in applications:
            status = app.status or "Saved"

            status_counts[status] = (
                status_counts.get(status, 0) + 1
            )

        high_priority = sum(
            1
            for app in applications
            if (app.priority or "").lower() == "high"
        )

        average_fit = (
            sum(
                app.fit_score or 0
                for app in applications
            ) / total
            if total
            else 0
        )

        average_cyber = (
            sum(
                app.cybersecurity_relevance or 0
                for app in applications
            ) / total
            if total
            else 0
        )

        average_career_value = (
            sum(
                app.career_value or 0
                for app in applications
            ) / total
            if total
            else 0
        )

        top_fit = None

        if applications:
            top_fit = max(
                applications,
                key=lambda x: x.fit_score or 0,
            )

        top_cyber = None

        if applications:
            top_cyber = max(
                applications,
                key=lambda x:
                    x.cybersecurity_relevance or 0,
            )

        return {
            "total_applications": total,

            "status_counts": status_counts,

            "high_priority_count": high_priority,

            "average_fit_score": round(
                average_fit,
                1,
            ),

            "average_cybersecurity_relevance":
                round(
                    average_cyber,
                    1,
                ),

            "average_career_value":
                round(
                    average_career_value,
                    1,
                ),

            "top_fit_application": {
                "id": top_fit.id,
                "job_title": top_fit.job_title,
                "company": top_fit.company,
                "fit_score": top_fit.fit_score or 0,
            }
            if top_fit
            else None,

            "top_cybersecurity_application": {
                "id": top_cyber.id,
                "job_title": top_cyber.job_title,
                "company": top_cyber.company,
                "cybersecurity_relevance":
                    top_cyber.cybersecurity_relevance
                    or 0,
            }
            if top_cyber
            else None,
        }

    finally:
        db.close()