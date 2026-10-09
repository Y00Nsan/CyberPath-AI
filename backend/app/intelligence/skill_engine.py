"""Deterministic cybersecurity skill graph and evidence matcher."""

import re
from collections import Counter

from .knowledge_base import SKILLS, RELATIONSHIPS


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").lower()).strip()


def extract_skills(text: str):
    t = normalize(text)
    found = []
    for skill, aliases in SKILLS.items():
        if any(re.search(r"(?<!\w)" + re.escape(alias) + r"(?!\w)", t) for alias in aliases):
            found.append(skill)
    return sorted(set(found))


def skill_evidence(text: str):
    t = normalize(text)
    result = {}
    for skill in extract_skills(text):
        aliases = SKILLS[skill]
        hits = [a for a in aliases if re.search(r"(?<!\w)" + re.escape(a) + r"(?!\w)", t)]
        result[skill] = {"matched_terms": hits, "evidence_strength": min(100, 35 + len(hits) * 20)}
    return result


def graph_neighbors(skills):
    out = set()
    for skill in skills:
        out.update(RELATIONSHIPS.get(skill, []))
    return sorted(out)


def compare_skills(candidate_text: str, job_text: str):
    candidate = set(extract_skills(candidate_text))
    required = set(extract_skills(job_text))
    strong = sorted(candidate & required)
    gaps = sorted(required - candidate)
    related = sorted(set(graph_neighbors(candidate)) & set(gaps))

    score = round((len(strong) / len(required)) * 100, 1) if required else 0

    return {
        "fit_score": score,
        "candidate_skills": sorted(candidate),
        "required_skills": sorted(required),
        "strong_matches": strong,
        "skill_gaps": gaps,
        "related_gaps": related,
        "evidence": skill_evidence(candidate_text),
    }


def repeated_gaps(job_texts):
    counts = Counter()
    for text in job_texts or []:
        counts.update(extract_skills(text))
    return [{"skill": k, "frequency": v} for k, v in counts.most_common()]
