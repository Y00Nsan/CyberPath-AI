"""Explainable deterministic cybersecurity scoring."""
WEIGHTS={'skill_match':.55,'cyber_relevance':.20,'evidence':.15,'career_signal':.10}

def score(skill_match=0, cyber_relevance=0, evidence=0, career_signal=0):
    return round(max(0,min(100,skill_match*.55+cyber_relevance*.20+evidence*.15+career_signal*.10)),1)

def calculate_job_fit(candidate_text, job_text, comparison=None):
    from .skill_engine import compare_skills
    c=comparison or compare_skills(candidate_text,job_text)
    evidence=sum(v.get('evidence_strength',0) for v in c.get('evidence',{}).values())/max(1,len(c.get('evidence',{})))
    text=(job_text or '').lower()
    cyber=min(100,25+sum(12 for t in ['cybersecurity','security','soc','siem','incident response','threat intelligence','iam','vulnerability','cloud security'] if t in text))
    career=cyber
    total=score(c.get('fit_score',0),cyber,evidence,career)
    return {'fit_score':total,'skill_match':c.get('fit_score',0),'cybersecurity_relevance':cyber,'evidence_strength':round(evidence,1),'career_value':career,'weights':WEIGHTS}

def explain():
    return [{'factor':'Skill match','weight':55,'reason':'Direct required-skill coverage.'},{'factor':'Cybersecurity relevance','weight':20,'reason':'Direct security relevance of the role.'},{'factor':'Evidence strength','weight':15,'reason':'Strength of candidate evidence.'},{'factor':'Career signal','weight':10,'reason':'Transferable career value.'}]
