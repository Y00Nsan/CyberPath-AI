"""Bounded aggregate adaptive learning signals."""
from collections import Counter
STATE={'skill_seen':Counter(),'gap_seen':Counter(),'outcomes':Counter()}

def record_skills(skills):
    for s in skills or []: STATE['skill_seen'][s]+=1

def record_gaps(gaps):
    for s in gaps or []: STATE['gap_seen'][s]+=1

def record_outcome(outcome):
    if outcome: STATE['outcomes'][str(outcome).lower()]+=1

def record_skill_signal(job_ids, matched_ids, gap_ids):
    record_skills(job_ids); record_gaps(gap_ids)

def get_skill_signals():
    return {'top_skills':STATE['skill_seen'].most_common(10),'top_gaps':STATE['gap_seen'].most_common(10),'outcomes':dict(STATE['outcomes'])}

def insights():
    return {'top_observed_skills':STATE['skill_seen'].most_common(10),'top_repeated_gaps':STATE['gap_seen'].most_common(10),'outcomes':dict(STATE['outcomes']),'storage_policy':'Aggregate counters only; raw resume/job text is not retained by this module.'}
