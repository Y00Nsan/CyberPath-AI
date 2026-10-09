"""CyberPath deterministic local intelligence engine.
No external LLM/API is required for career analysis.
"""
import json, re
from dataclasses import dataclass
from typing import Any
from .skill_engine import extract_skills, compare_skills, skill_evidence, graph_neighbors
from .scoring_engine import score
from .knowledge_base import SKILLS


def _balanced_json(text: str, start_at: int = 0):
    start = text.find('{', start_at)
    if start < 0:
        return None
    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(text)):
        c = text[i]
        if in_str:
            if esc:
                esc = False
            elif c == '\\':
                esc = True
            elif c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    raw = text[start:i + 1]
                    try:
                        return json.loads(raw)
                    except Exception:
                        return None
    return None


def _extract_section(prompt, label):
    m = re.search(rf'{re.escape(label)}:\s*(.*?)(?=\n[A-Z][A-Za-z _-]+:\n|\nReturn ONLY|\Z)', prompt, re.S)
    return m.group(1).strip() if m else ''


def _skills_from_text(text):
    return extract_skills(text or '')


def _display(skill):
    return skill.replace('_', ' ').title()


def _template_from_prompt(prompt):
    # IMPORTANT: find the JSON schema after the final 'Return ... JSON' marker,
    # not the first JSON-looking object in candidate/job data.
    markers = list(re.finditer(r'Return(?: ONLY)?\s+(?:valid\s+)?JSON[^\n]*', prompt, re.I))
    if markers:
        candidate = prompt[markers[-1].end():]
        obj = _balanced_json(candidate)
        if obj is not None:
            return obj
    # Fallback: prefer the last balanced object in the prompt.
    positions = [m.start() for m in re.finditer(r'\{', prompt)]
    for pos in reversed(positions):
        obj = _balanced_json(prompt, pos)
        if obj is not None:
            return obj
    return {}


def _context(prompt):
    candidate = (_extract_section(prompt, 'Candidate') or
                 _extract_section(prompt, 'Resume') or
                 _extract_section(prompt, 'Resume Text') or
                 _extract_section(prompt, 'Candidate profile'))
    job = (_extract_section(prompt, 'Job') or
           _extract_section(prompt, 'Job Description') or
           _extract_section(prompt, 'Selected job'))
    target = (_extract_section(prompt, 'Target Role') or
              _extract_section(prompt, 'target role'))
    cmp = compare_skills(candidate, job) if candidate or job else None
    gaps = cmp.get('skill_gaps', []) if cmp else []
    matches = cmp.get('strong_matches', []) if cmp else []
    gap_names = [_display(x if isinstance(x, str) else x.get('id', x.get('name', ''))) for x in gaps]
    match_names = [_display(x if isinstance(x, str) else x.get('id', x.get('name', ''))) for x in matches]
    return candidate, job, target, cmp, gap_names, match_names


def _fill_template(obj, key='', ctx=None):
    ctx = ctx or {}
    gaps = ctx.get('gap_names', [])
    matches = ctx.get('match_names', [])
    target = ctx.get('target') or 'Cybersecurity'
    candidate = ctx.get('candidate', '')
    job = ctx.get('job', '')
    k = str(key).lower()

    if isinstance(obj, dict):
        return {name: _fill_template(value, name, ctx) for name, value in obj.items()}

    if isinstance(obj, list):
        # Keep schemas useful instead of returning every list empty.
        if not obj:
            if any(x in k for x in ('gap', 'missing', 'weakness', 'risk', 'unsupported', 'avoid', 'red_flag')):
                return gaps[:5]
            if any(x in k for x in ('strong', 'match', 'strength')):
                return matches[:5]
            if 'skill' in k or 'topic' in k:
                return (gaps or matches)[:5]
            if any(x in k for x in ('question', 'practice')):
                return [
                    'Explain a cybersecurity problem you investigated and how you reached your conclusion.',
                    f'What would you prioritize first in a {target} role?',
                    'Describe a security tool or technique you have used and what evidence it produced.',
                ]
            if any(x in k for x in ('action', 'next', 'checklist', 'step', 'goal', 'recommend')):
                return [
                    'Close the highest-priority cybersecurity skill gap.',
                    'Build one hands-on proof artifact for that skill.',
                    'Re-check fit and apply to the strongest matching roles.',
                ]
            return []
        return [_fill_template(x, key, ctx) for x in obj[:3]]

    if isinstance(obj, (int, float)):
        if k in {'priority', 'rank', 'week', 'number', 'step'}:
            return 1
        if any(x in k for x in ('score', 'readiness', 'fit', 'match', 'quality', 'value', 'impact', 'confidence')):
            cmp = ctx.get('cmp')
            base = float(cmp.get('fit_score', 0)) if cmp else 0
            return round(base, 1)
        return 0

    # String fields: provide useful deterministic defaults based on their name.
    if 'skill' in k and gaps:
        return gaps[0]
    if k in {'question', 'interview_question'} or k.endswith('_question'):
        return 'Explain how you would investigate a suspicious security event and decide what evidence to collect first.'
    if 'target_role' in k or k == 'role':
        return target
    if k in {'goal', 'weekly_goal'}:
        return f'Improve readiness for {target} by closing the highest-impact skill gap.'
    if 'theme' in k:
        return f'{target} skill development'
    if k in {'topic', 'focus_skill'}:
        return gaps[0] if gaps else 'Security Monitoring'
    if k == 'action' or k.endswith('_action'):
        return 'Complete one hands-on cybersecurity exercise and save the result as interview-ready evidence.'
    if k in {'project', 'project_name', 'name', 'artifact'}:
        return f'{target} hands-on security lab'
    if 'current_position' in k:
        return 'Student / Early Career Cybersecurity Candidate'
    if 'career_position' in k or 'career_direction' in k:
        return target
    if 'decision' in k:
        return 'APPLY NOW' if ctx.get('cmp') and ctx['cmp'].get('fit_score', 0) >= 60 else 'UPSKILL BEFORE APPLYING'
    if 'recommendation' in k:
        return 'Prioritize the strongest-fit cybersecurity roles while closing the top repeated skill gap.'
    if 'summary' in k or 'verdict' in k:
        return f'Local cybersecurity analysis for {target}: prioritize evidence-backed matches and close the highest-impact gaps.'
    if 'reason' in k or 'why' in k:
        return 'This recommendation is based on the local cybersecurity skill graph and the supplied candidate/job evidence.'
    if 'headline' in k:
        return target
    if 'provider' in k:
        return 'CyberPath local catalog'
    if 'status' in k:
        return 'Recommended'
    if 'difficulty' in k:
        return 'Intermediate'
    if 'time' in k or 'timeframe' in k:
        return '1–2 weeks'
    if 'url' in k:
        return ''
    return ''


def _resume_analysis(prompt):
    text = _extract_section(prompt, 'Resume')
    skills = _skills_from_text(text)
    cyber = [s for s in skills if s in {'cloud_security','aws_iam','network_security','siem','incident_response','threat_intelligence','vulnerability_management','wireshark','endpoint_security','identity_security','malware_analysis','digital_forensics','secure_coding','security_plus'}]
    cloud = [s for s in skills if s in {'aws','aws_iam','cloud_security','cloud_certification'}]
    programming = [s for s in skills if s in {'python'}]
    tools = [s for s in skills if s in {'wireshark','siem','malware_analysis','digital_forensics','linux'}]
    readiness = min(95, 25 + len(skills)*7 + len(cyber)*5)
    roles=[]
    if 'threat_intelligence' in skills: roles.append('Cyber Threat Intelligence Analyst')
    if 'cloud_security' in skills or 'aws_iam' in skills: roles.append('Cloud Security Analyst / Engineer')
    if 'network_security' in skills or 'wireshark' in skills: roles.append('SOC / Security Analyst')
    if not roles: roles=['Cybersecurity Analyst']
    return {
      'summary': f'Cybersecurity profile identified {len(skills)} supported skills using the local cybersecurity knowledge base.',
      'candidate_level': 'Student / Early Career', 'target_roles': roles,
      'technical_skills': [_display(s) for s in skills], 'cybersecurity_skills': [_display(s) for s in cyber],
      'cloud_skills': [_display(s) for s in cloud], 'programming_skills': [_display(s) for s in programming],
      'tools': [_display(s) for s in tools], 'certifications': [], 'education': [], 'experience': [], 'projects': [],
      'strengths': [_display(s) for s in skills[:5]], 'weaknesses': [], 'missing_cybersecurity_skills': [],
      'recommended_roles': roles, 'overall_cybersecurity_readiness': readiness,
    }


def _batch_jobs(prompt):
    candidate = _extract_section(prompt, 'Candidate')
    m = re.search(r'Jobs:\s*(\[.*?\])\s*\n\s*Analyze EVERY job', prompt, re.S)
    try: jobs=json.loads(m.group(1)) if m else []
    except Exception: jobs=[]
    out=[]
    for j in jobs:
        desc=j.get('description',''); cmp=compare_skills(candidate, desc)
        req=set(cmp.get('required_skills',[])); strong=set(cmp.get('strong_matches',[])); gaps=cmp.get('skill_gaps',[])
        text=(j.get('title','')+' '+desc).lower()
        cyber_terms=['cybersecurity','security','soc','siem','incident response','threat intelligence','iam','vulnerability','cloud security']
        cyber=min(100, 25+sum(12 for t in cyber_terms if t in text))
        skill_match=cmp.get('fit_score',0)
        career=min(100, round(cyber*.6 + (30 if any(x in text for x in ['cloud','security','soc']) else 10)))
        fit=score(skill_match, cyber, sum(v['evidence_strength'] for v in cmp['evidence'].values())/max(1,len(cmp['evidence'])), career)
        next_skill=_display(gaps[0]) if gaps else (_display(next(iter(strong))) if strong else 'Networking')
        out.append({'index':j.get('index',len(out)),'fit_score':fit,
          'score_breakdown':{'technical_skills':skill_match,'cybersecurity_skills':cyber,'cloud_skills':70 if 'cloud' in text else 20,'experience':50,'career_relevance':career},
          'cybersecurity_relevance':cyber,'summary':f'{j.get("title","")} matched against the candidate using the local skill graph.',
          'why_this_job':[f'{len(strong)} directly matched skill(s)'], 'why_not_this_job':[f'{len(gaps)} skill gap(s)'] if gaps else [],
          'strong_matches':[_display(x) for x in sorted(strong)], 'partial_matches':[_display(x) for x in cmp.get('related_gaps',[])],
          'missing_skills':[_display(x) for x in gaps],
          'skill_gap_priority':[{'skill':_display(x),'priority':i+1,'importance':'High' if i<2 else 'Medium','reason':'Required by the job and not directly supported by the candidate evidence.','recommended_action':f'Build a hands-on {_display(x)} proof project.'} for i,x in enumerate(gaps[:5])],
          'recommended_next_skill':{'skill':next_skill,'reason':'Highest-priority unresolved skill in the local skill graph.','career_impact':'Improves readiness for cybersecurity roles using this requirement.'},
          'application_priority':'High' if fit>=75 else ('Medium' if fit>=55 else 'Low'),
          'application_priority_reason':'Strong local-engine match.' if fit>=75 else 'Close the highest-priority skill gap first.',
          'career_value':career,'career_value_reason':'Aligned with the target cybersecurity direction.' if cyber>=55 else 'Provides transferable technical experience.',
          'experience_match':'Evidence-supported match' if strong else 'Limited direct evidence.'})
    return {'jobs':out}


def generate(prompt: str, max_output_tokens: int = 4000):
    p=prompt or ''
    if 'Analyze this candidate resume specifically' in p: return _resume_analysis(p)
    if 'Analyze EVERY job' in p: return _batch_jobs(p)
    candidate, job, target, cmp, gap_names, match_names = _context(p)
    template = _template_from_prompt(p)
    ctx={'candidate':candidate,'job':job,'target':target,'cmp':cmp,'gap_names':gap_names,'match_names':match_names}
    result=_fill_template(template, ctx=ctx)
    if isinstance(result,dict) and cmp:
        if 'fit_score' in result: result['fit_score']=cmp.get('fit_score',0)
        for key in ['strong_matches','candidate_strengths']:
            if key in result: result[key]=match_names[:8]
        for key in ['missing_skills','candidate_gaps','critical_skill_gaps','biggest_gaps']:
            if key in result: result[key]=gap_names[:8]
        if 'learning_order' in result: result['learning_order']=gap_names[:5]
        if 'recommended_next_skill' in result and isinstance(result['recommended_next_skill'],dict):
            g=gap_names[0] if gap_names else 'Network Security'
            result['recommended_next_skill']['skill']=g
    return result


@dataclass
class LocalResponse:
    output_text: str


class LocalResponses:
    def create(self, model=None, input='', max_output_tokens=4000):
        return LocalResponse(json.dumps(generate(input, max_output_tokens), ensure_ascii=False))


class LocalAI:
    def __init__(self): self.responses=LocalResponses()
