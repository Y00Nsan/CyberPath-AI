"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

const API = "http://127.0.0.1:8000";

type Job = {
  id?: string;
  title?: string;
  company?: string;
  location?: string;
  url?: string;
  description?: string;

  fit_score?: number;
  cybersecurity_relevance?: number;

  score_breakdown?: {
    technical_skills?: number;
    cybersecurity_skills?: number;
    cloud_skills?: number;
    experience?: number;
    career_relevance?: number;
  };

  summary?: string;
  why_this_job?: string[];
  why_not_this_job?: string[];
  strong_matches?: string[];
  partial_matches?: string[];
  missing_skills?: string[];

  skill_gap_priority?: {
    skill?: string;
    priority?: number;
    importance?: string;
    reason?: string;
    recommended_action?: string;
  }[];

  recommended_next_skill?: {
    skill?: string;
    reason?: string;
    career_impact?: string;
  };

  application_priority?: string;
  application_priority_reason?: string;

  career_value?: number;
  career_value_reason?: string;
  experience_match?: string;
};

type ApplicationPackageRecord = {
  id: number;
  job_title: string;
  company?: string;
  location?: string;
  url?: string;
  target_role?: string;
  fit_score?: number;
  status?: string;
  priority?: string;
  version?: number;
  package?: ApplicationPipeline;
  created_at?: string;
  updated_at?: string;
};

type Application = {
  id: number;
  job_title: string;
  company?: string;
  location?: string;
  url?: string;
  fit_score?: number;
  status?: string;
  priority?: string;
  cybersecurity_relevance?: number;
  career_value?: number;
  deadline?: string;
  notes?: string;
  created_at?: string;
};

type LearningItem = {
  title?: string;
  provider?: string;
  url?: string;
};

type SkillRoadmapItem = {
  skill?: string;
  priority?: number;
  difficulty?: string;
  why_it_matters?: string;
  youtube?: LearningItem[];
  free_courses?: LearningItem[];
  official_docs?: LearningItem[];
  hands_on_labs?: LearningItem[];
  project?: string;
  estimated_time?: string;
};

type LearningData = {
  next_best_skill?: {
    skill?: string;
    reason?: string;
    career_impact?: string;
  };

  skill_roadmap?: SkillRoadmapItem[];

  certifications?: {
    name?: string;
    priority?: number;
    reason?: string;
    best_for?: string;
    difficulty?: string;
  }[];

  learning_order?: string[];
  career_strategy?: string;
};

type RoadmapPhase = {
  goal?: string;
  actions?: string[];
};

type CareerIntelligence = {
  career_decision?: {
    target_role?: string;
    career_fit?: number;
    job_market_demand?: string;
    current_readiness?: number;
    internship_readiness?: string;
    recommendation?: string;
    recommendation_reason?: string;
    best_next_move?: string;
  };
  priority_actions?: {
    rank?: number;
    action?: string;
    type?: string;
    timeframe?: string;
    reason?: string;
    expected_impact?: string;
  }[];
  biggest_gap?: {
    skill?: string;
    importance?: string;
    reason?: string;
    evidence?: string;
    time_to_improve?: string;
  };
  next_best_skill?: {
    skill?: string;
    why_now?: string;
    career_impact?: string;
    learning_action?: string;
  };
  next_project?: {
    project?: string;
    skills_practiced?: string[];
    why_this_project?: string;
    portfolio_value?: string;
  };
  certification_strategy?: {
    recommended?: string;
    priority?: string;
    why?: string;
    when?: string;
  };
  application_strategy?: {
    apply_now?: boolean;
    target_job_count?: number;
    job_types?: string[];
    avoid_for_now?: string[];
    strategy?: string;
  };
  thirty_day_plan?: {
    week?: number;
    goal?: string;
    actions?: string[];
  }[];
  decision_summary?: string;
  error?: string;
};

type ApplicationPipeline = {
  application_decision?: {
    recommendation?: string;
    fit_score?: number;
    reason?: string;
    apply_timing?: string;
    biggest_risk?: string;
    minimum_fix?: string;
  };
  resume_package?: {
    headline_focus?: string;
    summary?: string;
    skills_to_emphasize?: string[];
    experience_bullets_to_emphasize?: string[];
    project_bullets_to_emphasize?: string[];
    resume_changes?: string[];
    unsupported_keywords?: string[];
  };
  cover_letter?: {
    subject?: string;
    opening?: string;
    body?: string;
    closing?: string;
  };
  interview_package?: {
    top_technical_questions?: string[];
    top_cybersecurity_questions?: string[];
    top_behavioral_questions?: string[];
    resume_questions?: string[];
    must_prepare_topics?: string[];
  };
  application_checklist?: { step?: number; task?: string; status?: string; reason?: string }[];
  tracker_setup?: {
    recommended_status?: string;
    recommended_priority?: string;
    deadline_action?: string;
    follow_up_action?: string;
    notes?: string;
  };
  next_actions?: string[];
  application_summary?: string;
  error?: string;
};

type ApplicationCopilot = {
  application_decision?: {
    recommendation?: string;
    fit_score?: number;
    confidence?: string;
    reason?: string;
    strongest_match?: string;
    biggest_concern?: string;
    apply_timing?: string;
  };
  job_snapshot?: {
    company?: string;
    job_title?: string;
    location?: string;
    top_requirements?: string[];
    cybersecurity_focus?: string;
  };
  resume_strategy?: {
    headline_focus?: string;
    skills_to_emphasize?: string[];
    experience_to_emphasize?: string[];
    projects_to_emphasize?: string[];
    skills_not_supported?: string[];
    resume_changes?: string[];
  };
  cover_letter?: {
    opening?: string;
    body?: string;
    closing?: string;
  };
  interview_prep?: {
    technical_questions?: {
      question?: string;
      why_asked?: string;
      preparation_point?: string;
    }[];
    behavioral_questions?: {
      question?: string;
      why_asked?: string;
      preparation_point?: string;
    }[];
    candidate_stories?: {
      experience?: string;
      what_to_highlight?: string;
    }[];
  };
  application_checklist?: string[];
  before_apply?: string[];
  after_apply?: string[];
  interview_readiness?: number;
  decision_summary?: string;
  error?: string;
};

type InterviewIntelligence = {
  interview_readiness?: { overall_score?: number; technical_score?: number; cybersecurity_score?: number; behavioral_score?: number; resume_score?: number; readiness_level?: string; summary?: string; biggest_weakness?: string; next_practice?: string; };
  interview_strategy?: { first_impression?: string; top_topics?: string[]; stories_to_prepare?: string[]; technical_focus?: string[]; questions_to_ask_interviewer?: string[]; };
  technical_questions?: { question?: string; difficulty?: string; why_asked?: string; what_strong_answer_should_show?: string; candidate_preparation?: string; follow_up?: string; }[];
  cybersecurity_scenarios?: { scenario?: string; what_interviewer_is_testing?: string; recommended_framework?: string; candidate_preparation?: string; follow_up?: string; }[];
  resume_questions?: { question?: string; resume_evidence_to_use?: string; what_to_emphasize?: string; follow_up?: string; }[];
  behavioral_questions?: { question?: string; why_asked?: string; recommended_story?: string; what_to_emphasize?: string; }[];
  practice_plan?: { priority?: number; topic?: string; action?: string; estimated_time?: string; }[];
  red_flags?: string[]; confidence_notes?: string; error?: string;
};


type ApplicationDecisionEngine = {
  decision_summary?: string;
  overall_strategy?: string;
  readiness?: { career_fit?: number; skill_readiness?: number; interview_readiness?: number; application_readiness?: number };
  selected_job_decision?: { decision?: string; priority?: string; fit_score?: number; confidence?: string; reason?: string; strongest_match?: string; biggest_risk?: string; minimum_fix_before_applying?: string };
  job_decisions?: { index?: number; job_title?: string; company?: string; decision?: string; priority?: string; score?: number; reason?: string; key_strength?: string; key_gap?: string; next_action?: string }[];
  apply_now?: { job_title?: string; company?: string; why?: string; action?: string }[];
  upskill_first?: { job_title?: string; company?: string; skill_to_fix?: string; why?: string; action?: string }[];
  deprioritize?: { job_title?: string; company?: string; reason?: string }[];
  top_priority_actions?: { rank?: number; action?: string; timeframe?: string; why?: string; expected_impact?: string }[];
  next_best_skill?: { skill?: string; why?: string; how_to_prove_it?: string };
  application_strategy?: { weekly_application_target?: number; ideal_job_types?: string[]; avoid_for_now?: string[]; strategy?: string };
  error?: string;
};

type MockInterviewQuestion = {
  number?: number;
  category?: string;
  difficulty?: string;
  question?: string;
  what_it_tests?: string;
};

type MockInterviewEvaluation = {
  scores?: { overall?: number; technical_accuracy?: number; cybersecurity_reasoning?: number; communication?: number; structure?: number };
  verdict?: string;
  what_went_well?: string[];
  issues_to_fix?: string[];
  technical_accuracy_issues?: string[];
  star_feedback?: string;
  stronger_answer_direction?: string;
  must_include_next_time?: string[];
  follow_up_questions?: string[];
  coach_note?: string;
};

type MockInterviewSession = {
  session_title?: string;
  instructions?: string;
  questions?: MockInterviewQuestion[];
};

type InterviewHistory = {
  sessions?: any[];
  analytics?: {
    overall?: number; technical?: number; cybersecurity?: number;
    communication?: number; structure?: number; trend?: number;
    weakest_area?: string; strongest_area?: string; readiness?: number;
  };
};

type NiceSkill = {
  skill?: string;
  nice_category?: string;
  candidate_level?: "Strong" | "Partial" | "Gap" | string;
  evidence?: string;
  gap?: string;
  priority?: "High" | "Medium" | "Low" | string;
};

type NiceWorkRole = {
  role?: string;
  match_score?: number;
  reason?: string;
  skills?: NiceSkill[];
};

type NiceSkillMapping = {
  nice_summary?: {
    best_work_role?: string;
    work_role_match?: number;
    overall_skill_match?: number;
    summary?: string;
  };
  work_roles?: NiceWorkRole[];
  skill_summary?: {
    strong?: string[];
    partial?: string[];
    gaps?: string[];
  };
  top_skill_gaps?: {
    skill?: string;
    nice_category?: string;
    priority?: string;
    why_it_matters?: string;
    recommended_action?: string;
  }[];
  recommended_work_role?: string;
  recommended_next_skill?: {
    skill?: string;
    reason?: string;
    career_impact?: string;
  };
  career_direction?: string;
  error?: string;
};

type CareerRoadmap = {
  career_position?: string;
  current_strengths?: string[];
  biggest_gaps?: string[];
  next_30_days?: RoadmapPhase[];
  next_90_days?: RoadmapPhase[];
  next_6_months?: RoadmapPhase[];
  internship_strategy?: string;
  certification_strategy?: string;
  project_strategy?: string;
  job_application_strategy?: string;
  top_priority?: string;
  why?: string;
};

type Personalized90DayPlan = {
  current_position?: string;
  target_role?: string;
  career_readiness?: number;
  biggest_strength?: string;
  biggest_gap?: string;
  priority_skill?: string;
  how_to_learn?: { action?: string; resource_type?: string; resource?: string; time?: string }[];
  how_to_prove_it?: string[];
  cybersecurity_project?: { name?: string; goal?: string; skills_proven?: string[]; deliverables?: string[]; estimated_time?: string };
  certification_strategy?: { recommendation?: string; priority?: string; why_now?: string; what_not_to_do?: string };
  weekly_application_target?: number;
  weekly_application_routine?: string[];
  days_1_30?: { theme?: string; goals?: string[]; weekly_actions?: { week?: number; actions?: string[] }[] };
  days_31_60?: { theme?: string; goals?: string[]; weekly_actions?: { week?: number; actions?: string[] }[] };
  days_61_90?: { theme?: string; goals?: string[]; weekly_actions?: { week?: number; actions?: string[] }[] };
  top_5_actions?: { rank?: number; action?: string; why?: string; timeframe?: string }[];
  what_not_to_do_now?: string[];
  success_metrics?: string[];
  plan_summary?: string;
};

type CareerSprint = {
  week?: number;
  sprint_theme?: string;
  weekly_goal?: string;
  focus_skill?: string;
  why_this_week_matters?: string;
  actions?: { id?: string; category?: string; action?: string; estimated_time?: string; proof_of_completion?: string; priority?: string }[];
  application_target?: number;
  application_strategy?: string;
  skill_practice?: { topic?: string; practice?: string; proof?: string };
  project_milestone?: { milestone?: string; deliverable?: string };
  interview_practice?: { topic?: string; questions?: string[] };
  end_of_week_check?: string[];
  success_definition?: string;
  avoid_this_week?: string[];
  coach_note?: string;
};

type CareerEvidence = {
  readiness_score?: number; evidence_strength?: string; headline?: string;
  current_proof?: { area?: string; evidence?: string; strength?: string; why_it_matters?: string }[];
  evidence_gaps?: { skill?: string; why_proof_is_missing?: string; priority?: string; best_proof?: string }[];
  portfolio_proof?: { artifact?: string; type?: string; skill_proven?: string; effort?: string; proof_standard?: string }[];
  next_best_proof?: { artifact?: string; skill?: string; reason?: string; timeframe?: string };
  application_evidence?: { ready_to_apply?: boolean; what_to_emphasize?: string[]; what_not_to_claim?: string[]; minimum_proof_before_next_application?: string };
  interview_evidence?: { strongest_story_area?: string; weakest_proof_area?: string; practice_prompt?: string };
  weekly_evidence_target?: string; top_actions?: { rank?: number; action?: string; proof?: string; impact?: string }[]; evidence_summary?: string;
};

type CybersecurityPortfolio = {
  portfolio_direction?: string;
  portfolio_readiness?: number;
  best_project?: { name?: string; why?: string; target_skills?: string[]; difficulty?: string; estimated_time?: string; career_value?: number };
  project_blueprints?: { name?: string; status?: string; problem?: string; skills_proven?: string[]; tech_stack?: string[]; milestones?: { step?: number; task?: string; deliverable?: string }[]; github_structure?: string[]; resume_bullet?: string; interview_story?: string; proof_standard?: string; estimated_time?: string }[];
  existing_evidence_to_feature?: { evidence?: string; why?: string; where?: string }[];
  portfolio_gaps?: { skill?: string; gap?: string; best_artifact?: string; priority?: string }[];
  github_readme_outline?: string[];
  portfolio_homepage_sections?: string[];
  top_3_build_actions?: { rank?: number; action?: string; deliverable?: string; timeframe?: string }[];
  do_not_build?: string[];
  portfolio_summary?: string;
};

type PortfolioQualityAudit = {
  portfolio_score?: number;
  hiring_readiness?: string;
  overall_verdict?: string;
  strongest_proof?: { artifact?: string; why?: string; skills_proven?: string[] };
  weakest_proof?: { artifact?: string; problem?: string; risk?: string; fix?: string };
  project_audits?: { project?: string; status?: string; technical_depth?: number; cybersecurity_relevance?: number; evidence_quality?: number; resume_value?: number; interview_value?: number; what_is_good?: string; what_is_missing?: string; next_improvement?: string; keep_or_change?: string }[];
  skill_proof_matrix?: { skill?: string; job_demand?: string; current_proof?: string; proof_strength?: string; best_evidence?: string; priority?: string }[];
  top_portfolio_fixes?: { rank?: number; fix?: string; deliverable?: string; timeframe?: string; impact?: string }[];
  github_quality_checklist?: string[];
  interview_demo_checklist?: string[];
  resume_portfolio_changes?: string[];
  do_not_add?: string[];
  next_best_artifact?: { name?: string; purpose?: string; skills_proven?: string[]; deliverables?: string[]; estimated_time?: string };
  portfolio_strategy?: string;
};


type ApplicationReadinessGate = {
  decision?: string;
  readiness_score?: number;
  confidence?: string;
  one_line_verdict?: string;
  why_now_or_not?: string;
  scorecard?: {
    job_fit?: number;
    technical_readiness?: number;
    cybersecurity_readiness?: number;
    evidence_strength?: number;
    interview_readiness?: number;
    application_quality?: number;
  };
  must_have_check?: { requirement?: string; candidate_evidence?: string; status?: string; is_blocker?: boolean; action?: string }[];
  strongest_matches?: string[];
  critical_gaps?: { skill?: string; severity?: string; why_it_matters?: string; minimum_fix?: string; estimated_effort?: string }[];
  resume_positioning?: { headline_focus?: string; skills_to_emphasize?: string[]; experience_to_emphasize?: string[]; do_not_claim?: string[] };
  interview_risk?: { risk_level?: string; likely_challenge?: string; prepare_this?: string };
  application_actions?: { rank?: number; action?: string; reason?: string; timeframe?: string }[];
  if_applying_now?: string[];
  if_waiting?: string[];
  final_recommendation?: string;
};

type ApplicationFollowUpCopilot = {
  follow_up_strategy?: string;
  recommended_channel?: string;
  recommended_timing?: string;
  priority?: string;
  contact_assumption?: string;
  recruiter_message?: { subject?: string; message?: string };
  linkedin_message?: string;
  application_follow_up?: { timing?: string; trigger?: string; action?: string; message?: string }[];
  interview_thank_you?: { when_to_send?: string; subject?: string; message?: string };
  post_interview_follow_up?: { timing?: string; message?: string; what_to_reference?: string[] };
  networking_targets?: { target_type?: string; why?: string; approach?: string }[];
  questions_to_ask?: string[];
  personalization_points?: string[];
  do_not_send?: string[];
  tracking_updates?: { field?: string; value?: string; reason?: string }[];
  next_best_action?: { action?: string; timing?: string; why?: string };
  follow_up_summary?: string;
};


type CareerOutcomeIntelligence = {
  data_quality?: { sample_size?: number; confidence?: string; limitations?: string[] };
  outcome_summary?: string;
  conversion_funnel?: { saved?: number; applied?: number; interviews?: number; offers?: number; rejected?: number; application_to_interview_rate?: number; interview_to_offer_rate?: number };
  what_is_working?: { signal?: string; evidence?: string; confidence?: string }[];
  what_is_not_working?: { signal?: string; evidence?: string; likely_cause?: string; confidence?: string }[];
  best_targeting_pattern?: { job_types?: string[]; roles?: string[]; cybersecurity_focus?: string[]; location_pattern?: string; reason?: string };
  weak_targeting_pattern?: { job_types?: string[]; roles?: string[]; reason?: string };
  fit_score_calibration?: { interpretation?: string; overestimating_risk?: string; underestimating_risk?: string; recommended_rule?: string };
  skill_signals?: { skill?: string; job_demand?: string; candidate_evidence?: string; outcome_signal?: string; action?: string }[];
  interview_signal?: { strength?: string; weakness?: string; evidence?: string; next_practice?: string };
  application_behavior?: { weekly_target_recommendation?: number; timing_advice?: string; priority_rule?: string; follow_up_rule?: string };
  strategy_changes?: { rank?: number; change?: string; why?: string; expected_impact?: string; timeframe?: string }[];
  next_best_skill?: { skill?: string; why?: string; how_to_prove_it?: string };
  next_best_job_profile?: { title_pattern?: string; cybersecurity_focus?: string; minimum_fit_score?: number; minimum_cybersecurity_relevance?: number; reason?: string };
  "30_day_experiment"?: { week?: number; action?: string; metric?: string }[];
  stop_doing?: string[];
  continue_doing?: string[];
  measurement_plan?: { metric?: string; target?: string; review_frequency?: string }[];
  executive_recommendation?: string;
};

type DashboardData = {
  total_applications?: number;
  high_priority?: number;
  average_fit_score?: number;
  applications_by_status?: Record<string, number>;
  top_job?: {
    title?: string;
    company?: string;
    fit_score?: number;
  };
};

type ApplicationAnalytics = {
  summary?: {
    total_applications?: number;
    applied_count?: number;
    interview_count?: number;
    offer_count?: number;
    rejected_count?: number;
    awaiting_response?: number;
    average_fit?: number;
    average_applied_fit?: number;
    average_interview_score?: number;
    recommendation?: string;
  };
  status_counts?: Record<string, number>;
  conversion?: {
    saved_to_applied?: number;
    applied_to_interview?: number;
    interview_to_offer?: number;
    overall_offer_rate?: number;
    rejection_rate?: number;
  };
  company_performance?: {
    company?: string;
    applications?: number;
    interviews?: number;
    offers?: number;
    avg_fit?: number;
  }[];
  role_performance?: {
    job_title?: string;
    applications?: number;
    interviews?: number;
    offers?: number;
    avg_fit?: number;
  }[];
  interview_history_count?: number;
};

type LoadingState = {
  [key: string]: boolean;
};

function scoreClass(score?: number) {
  const value = Number(score || 0);

  if (value >= 85) return "score excellent";
  if (value >= 70) return "score good";
  if (value >= 50) return "score medium";
  return "score low";
}

function priorityClass(priority?: string) {
  const value = String(priority || "").toLowerCase();

  if (value === "high") return "priority high";
  if (value === "medium") return "priority medium";
  return "priority low";
}

function safeArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function Tag({
  children,
  type = "",
}: {
  children: React.ReactNode;
  type?: string;
}) {
  return <span className={`tag ${type}`}>{children}</span>;
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}

function LoadingButton({
  loading,
  children,
  onClick,
  disabled = false,
}: {
  loading?: boolean;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="button primary"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? "Working..." : children}
    </button>
  );
}

function InterviewQuestionCard({ title, items }: { title: string; items: { question?: string; meta?: string; detail?: string; prep?: string; tag?: string }[] }) {
  return <div className="card" style={{marginTop:14}}><div className="mini-label">{title}</div><div className="interview-question-list">{items.map((item,i)=><div className="interview-question" key={`${title}-${i}`}><div className="interview-question-top"><strong>{item.question || "Question"}</strong>{item.tag && <Tag>{item.tag}</Tag>}</div><span>{item.meta}</span><small>{item.detail}</small><small>{item.prep}</small></div>)}</div></div>;
}

function InterviewListCard({ title, items }: { title: string; items: { question?: string; meta?: string; detail?: string; prep?: string }[] }) {
  return <div className="card"><div className="mini-label">{title}</div><div className="interview-question-list">{items.map((item,i)=><div className="interview-question" key={`${title}-${i}`}><strong>{item.question || "Question"}</strong><span>{item.meta}</span><small>{item.detail}</small><small>{item.prep}</small></div>)}</div></div>;
}

function RoadmapList({ items }: { items?: RoadmapPhase[] }) {
  const phases = safeArray(items);

  if (phases.length === 0) {
    return <div className="empty-small">No items yet.</div>;
  }

  return (
    <div className="roadmap-list">
      {phases.map((phase, index) => (
        <div className="roadmap-item" key={`${phase.goal}-${index}`}>
          <div className="roadmap-number">{index + 1}</div>

          <div>
            <strong>{phase.goal || "Goal"}</strong>

            <ul>
              {safeArray(phase.actions).map((action, actionIndex) => (
                <li key={`${action}-${actionIndex}`}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [profile, setProfile] = useState("");

  const [targetRole, setTargetRole] = useState(
    "Cybersecurity Analyst / Cloud Security Intern"
  );

  // STEP 30 — Job Search Intelligence filters
  const [jobLocation, setJobLocation] = useState("");
  const [minFitScore, setMinFitScore] = useState(70);
  const [minCybersecurityRelevance, setMinCybersecurityRelevance] = useState(50);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [jobAnalysis, setJobAnalysis] = useState<any>(null);
  const [skillGap, setSkillGap] = useState<any>(null);
  const [careerAdvice, setCareerAdvice] = useState<any>(null);
  const [tailoredResume, setTailoredResume] = useState("");

  const [learning, setLearning] = useState<LearningData | null>(null);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [personalized90DayPlan, setPersonalized90DayPlan] = useState<Personalized90DayPlan | null>(null);
  const [careerSprint, setCareerSprint] = useState<CareerSprint | null>(null);
  const [careerEvidence, setCareerEvidence] = useState<CareerEvidence | null>(null);
  const [cybersecurityPortfolio, setCybersecurityPortfolio] = useState<CybersecurityPortfolio | null>(null);
  const [portfolioQualityAudit, setPortfolioQualityAudit] = useState<PortfolioQualityAudit | null>(null);
  const [applicationReadinessGate, setApplicationReadinessGate] = useState<ApplicationReadinessGate | null>(null);
  const [applicationFollowUpCopilot, setApplicationFollowUpCopilot] = useState<ApplicationFollowUpCopilot | null>(null);
  const [careerOutcomeIntelligence, setCareerOutcomeIntelligence] = useState<CareerOutcomeIntelligence | null>(null);
  const [evidenceNotes, setEvidenceNotes] = useState<Record<string, string>>({});
  const [sprintWeek, setSprintWeek] = useState(1);
  const [completedSprintActions, setCompletedSprintActions] = useState<Record<string, boolean>>({});
  const [niceMapping, setNiceMapping] =
    useState<NiceSkillMapping | null>(null);
  const [careerIntelligence, setCareerIntelligence] =
    useState<CareerIntelligence | null>(null);
  const [applicationPipeline, setApplicationPipeline] = useState<ApplicationPipeline | null>(null);
  const [applicationPackages, setApplicationPackages] = useState<ApplicationPackageRecord[]>([]);
  const [savedPipelineId, setSavedPipelineId] = useState<number | null>(null);
  const [applicationCopilot, setApplicationCopilot] =
    useState<ApplicationCopilot | null>(null);
  const [interviewIntelligence, setInterviewIntelligence] =
    useState<InterviewIntelligence | null>(null);
  const [mockInterview, setMockInterview] = useState<MockInterviewSession | null>(null);
  const [mockIndex, setMockIndex] = useState(0);
  const [mockAnswer, setMockAnswer] = useState("");
  const [mockEvaluation, setMockEvaluation] = useState<MockInterviewEvaluation | null>(null);
  const [mockScores, setMockScores] = useState<number[]>([]);
  const [mockCompleted, setMockCompleted] = useState(false);
  const [mockScoreDetails, setMockScoreDetails] = useState<any[]>([]);
  const [interviewHistory, setInterviewHistory] = useState<InterviewHistory | null>(null);
  const [applicationDecision, setApplicationDecision] = useState<ApplicationDecisionEngine | null>(null);


  const [applications, setApplications] = useState<Application[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [applicationAnalytics, setApplicationAnalytics] = useState<ApplicationAnalytics | null>(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchFilter, setSearchFilter] = useState("");

  const [activeSection, setActiveSection] = useState("dashboard");

  const [loading, setLoading] = useState<LoadingState>({});
  const [error, setError] = useState("");

  function setBusy(name: string, value: boolean) {
    setLoading((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function apiFetch(
    path: string,
    options?: RequestInit
  ): Promise<any> {
    const response = await fetch(`${API}${path}`, options);

    if (!response.ok) {
      let message = `Request failed: ${response.status}`;

      try {
        const body = await response.json();
        message = body.detail || body.error || message;
      } catch {
        // Ignore JSON parsing failure.
      }

      throw new Error(message);
    }

    return response.json();
  }

  function showError(message: string) {
    console.error(message);
    setError(message);

    window.setTimeout(() => {
      setError("");
    }, 7000);
  }

  async function uploadResume() {
    if (!resumeFile) {
      showError("Please select a PDF resume first.");
      return;
    }

    setBusy("upload", true);

    try {
      const formData = new FormData();
      formData.append("file", resumeFile);

      const data = await apiFetch("/upload-resume", {
        method: "POST",
        body: formData,
      });

      setResumeText(data.text || data.resume_text || "");

      if (data.profile) {
        setProfile(data.profile);
      }

      setActiveSection("resume");
    } catch (error: any) {
      showError(error.message || "Resume upload failed.");
    } finally {
      setBusy("upload", false);
    }
  }

  async function analyzeResume() {
    if (!resumeText.trim()) {
      showError("Upload a resume before analyzing it.");
      return;
    }

    setBusy("analyzeResume", true);

    try {
      const formData = new FormData();
      formData.append("resume_text", resumeText);

      const data = await apiFetch("/analyze-resume", {
        method: "POST",
        body: formData,
      });

      setProfile(
        typeof data === "string"
          ? data
          : JSON.stringify(data, null, 2)
      );
    } catch (error: any) {
      showError(error.message || "Resume analysis failed.");
    } finally {
      setBusy("analyzeResume", false);
    }
  }

  async function searchJobs() {
    setBusy("searchJobs", true);

    try {
      const formData = new FormData();

      formData.append("target_role", targetRole);
      formData.append("resume_profile", profile);
      formData.append("location", jobLocation);
      formData.append("min_fit_score", String(minFitScore));
      formData.append("min_cybersecurity_relevance", String(minCybersecurityRelevance));
      formData.append("max_jobs", "20");

      const data = await apiFetch("/search-and-analyze-jobs", {
        method: "POST",
        body: formData,
      });

      const result = Array.isArray(data)
        ? data
        : data.jobs || data.results || [];

      setJobs(result);
      setActiveSection("jobs");
    } catch (error: any) {
      showError(error.message || "Job search failed.");
    } finally {
      setBusy("searchJobs", false);
    }
  }

  async function analyzeSelectedJob() {
    if (!selectedJob) {
      showError("Select a job first.");
      return;
    }

    setBusy("analyzeJob", true);

    try {
      const formData = new FormData();

      formData.append(
        "job_description",
        selectedJob.description || ""
      );

      formData.append("resume_profile", profile);

      const data = await apiFetch("/analyze-job", {
        method: "POST",
        body: formData,
      });

      setJobAnalysis(data);
      setActiveSection("job-detail");
    } catch (error: any) {
      showError(error.message || "Job analysis failed.");
    } finally {
      setBusy("analyzeJob", false);
    }
  }

  async function runSkillGap() {
    if (!selectedJob) {
      showError("Select a job first.");
      return;
    }

    setBusy("skillGap", true);

    try {
      const formData = new FormData();

      formData.append("resume_profile", profile);
      formData.append(
        "job_description",
        selectedJob.description || ""
      );

      const data = await apiFetch("/skill-gap", {
        method: "POST",
        body: formData,
      });

      setSkillGap(data);
    } catch (error: any) {
      showError(error.message || "Skill gap analysis failed.");
    } finally {
      setBusy("skillGap", false);
    }
  }

  async function getCareerAdvice() {
    setBusy("careerAdvice", true);

    try {
      const formData = new FormData();

      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);

      const data = await apiFetch("/career-advice", {
        method: "POST",
        body: formData,
      });

      setCareerAdvice(data);
    } catch (error: any) {
      showError(error.message || "Career advice failed.");
    } finally {
      setBusy("careerAdvice", false);
    }
  }

  async function tailorResume() {
    if (!selectedJob) {
      showError("Select a job before tailoring your resume.");
      return;
    }

    setBusy("tailorResume", true);

    try {
      const formData = new FormData();

      formData.append("resume_text", resumeText);
      formData.append(
        "job_description",
        selectedJob.description || ""
      );

      const data = await apiFetch("/tailor-resume", {
        method: "POST",
        body: formData,
      });

      setTailoredResume(
        data.tailored_resume ||
          data.resume ||
          data.text ||
          JSON.stringify(data, null, 2)
      );

      setActiveSection("resume-tailor");
    } catch (error: any) {
      showError(error.message || "Resume tailoring failed.");
    } finally {
      setBusy("tailorResume", false);
    }
  }

  async function getLearningRecommendations() {
    if (!profile.trim()) {
      showError("Analyze your resume first.");
      return;
    }

    setBusy("learning", true);

    try {
      const formData = new FormData();

      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);

      const missingSkills = selectedJob?.missing_skills
        ? selectedJob.missing_skills.join(", ")
        : skillGap
        ? JSON.stringify(skillGap)
        : "";

      formData.append("missing_skills", missingSkills);

      const data = await apiFetch("/learning-recommendations", {
        method: "POST",
        body: formData,
      });

      setLearning(data);
      setActiveSection("learning");
    } catch (error: any) {
      showError(
        error.message || "Learning recommendations failed."
      );
    } finally {
      setBusy("learning", false);
    }
  }

  async function generateCareerRoadmap() {
    if (!profile.trim()) {
      showError("Analyze your resume first.");
      return;
    }

    setBusy("roadmap", true);

    try {
      const formData = new FormData();

      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("jobs_data", JSON.stringify(jobs));

      const data = await apiFetch("/career-roadmap", {
        method: "POST",
        body: formData,
      });

      setRoadmap(data);
      setActiveSection("roadmap");
    } catch (error: any) {
      showError(error.message || "Career roadmap failed.");
    } finally {
      setBusy("roadmap", false);
    }
  }

  async function generatePersonalized90DayPlan() {
    if (!profile.trim()) { showError("Analyze your resume first."); return; }
    if (!targetRole.trim()) { showError("Enter a target cybersecurity role first."); return; }
    if (!jobs.length) { showError("Analyze some cybersecurity jobs first."); return; }

    setBusy("personalized90DayPlan", true);
    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("jobs_data", JSON.stringify(jobs));
      formData.append("applications_data", JSON.stringify(applications));
      const data = await apiFetch("/personalized-90-day-plan", { method: "POST", body: formData });
      if (data?.error) throw new Error(data.error);
      setPersonalized90DayPlan(data);
      setActiveSection("90-day-plan");
    } catch (error: any) {
      showError(error.message || "Personalized 90-day plan failed.");
    } finally {
      setBusy("personalized90DayPlan", false);
    }
  }

  async function generateCareerSprint() {
    if (!profile.trim()) { showError("Analyze your resume first."); return; }
    if (!targetRole.trim()) { showError("Enter a target cybersecurity role first."); return; }
    if (!jobs.length) { showError("Analyze some cybersecurity jobs first."); return; }
    if (!personalized90DayPlan) { showError("Generate your 90-Day Career Plan first."); return; }

    setBusy("careerSprint", true);
    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("jobs_data", JSON.stringify(jobs));
      formData.append("applications_data", JSON.stringify(applications));
      formData.append("ninety_day_plan", JSON.stringify(personalized90DayPlan));
      formData.append("selected_week", String(sprintWeek));
      const data = await apiFetch("/career-sprint", { method: "POST", body: formData });
      if (data?.error) throw new Error(data.error);
      setCareerSprint(data);
      setActiveSection("career-sprint");
    } catch (error: any) {
      showError(error.message || "Career sprint failed.");
    } finally {
      setBusy("careerSprint", false);
    }
  }

  function toggleSprintAction(actionId: string) {
    setCompletedSprintActions((previous) => {
      const next = { ...previous, [actionId]: !previous[actionId] };
      window.localStorage.setItem("cyberpath-career-sprint", JSON.stringify(next));
      return next;
    });
  }

  async function generateCybersecurityPortfolio() {
    if (!profile.trim()) { showError("Analyze your resume first."); return; }
    if (!targetRole.trim()) { showError("Enter a target cybersecurity role first."); return; }
    if (!jobs.length) { showError("Analyze some cybersecurity jobs first."); return; }
    setBusy("cybersecurityPortfolio", true);
    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("jobs_data", JSON.stringify(jobs));
      formData.append("career_evidence", JSON.stringify(careerEvidence || {}));
      formData.append("personalized_plan", JSON.stringify(personalized90DayPlan || {}));
      const data = await apiFetch("/cybersecurity-portfolio", { method: "POST", body: formData });
      if (data?.error) throw new Error(data.error);
      setCybersecurityPortfolio(data);
      setActiveSection("cybersecurity-portfolio");
    } catch (error: any) { showError(error.message || "Cybersecurity portfolio builder failed."); }
    finally { setBusy("cybersecurityPortfolio", false); }
  }

  async function generateCareerEvidence() {
    if (!profile.trim()) { showError("Analyze your resume first."); return; }
    if (!targetRole.trim()) { showError("Enter a target cybersecurity role first."); return; }
    if (!jobs.length) { showError("Analyze some cybersecurity jobs first."); return; }
    setBusy("careerEvidence", true);
    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("jobs_data", JSON.stringify(jobs));
      formData.append("applications_data", JSON.stringify(applications));
      formData.append("ninety_day_plan", JSON.stringify(personalized90DayPlan || {}));
      formData.append("sprint_data", JSON.stringify(careerSprint || {}));
      formData.append("interview_analytics", JSON.stringify(applicationAnalytics || interviewHistory || {}));
      formData.append("completed_actions", JSON.stringify(completedSprintActions));
      const data = await apiFetch("/career-evidence", { method: "POST", body: formData });
      if (data?.error) throw new Error(data.error);
      setCareerEvidence(data); setActiveSection("career-evidence");
    } catch (error: any) { showError(error.message || "Career evidence audit failed."); }
    finally { setBusy("careerEvidence", false); }
  }

  function saveEvidenceNote(key: string, value: string) {
    setEvidenceNotes((previous) => { const next = { ...previous, [key]: value }; window.localStorage.setItem("cyberpath-career-evidence-notes", JSON.stringify(next)); return next; });
  }

  async function generatePortfolioQualityAudit() {
    if (!profile.trim()) { showError("Analyze your resume first."); return; }
    if (!targetRole.trim()) { showError("Enter a target cybersecurity role first."); return; }
    if (!jobs.length) { showError("Analyze some cybersecurity jobs first."); return; }
    if (!cybersecurityPortfolio) { showError("Build your cybersecurity portfolio first."); return; }
    setBusy("portfolioQualityAudit", true);
    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("jobs_data", JSON.stringify(jobs));
      formData.append("career_evidence", JSON.stringify(careerEvidence || {}));
      formData.append("portfolio_data", JSON.stringify(cybersecurityPortfolio || {}));
      formData.append("applications_data", JSON.stringify(applications));
      const data = await apiFetch("/portfolio-quality-audit", { method: "POST", body: formData });
      if (data?.error) throw new Error(data.error);
      setPortfolioQualityAudit(data);
      setActiveSection("portfolio-audit");
    } catch (error: any) {
      showError(error.message || "Portfolio quality audit failed.");
    } finally { setBusy("portfolioQualityAudit", false); }
  }


  async function generateApplicationReadinessGate() {
    if (!profile.trim()) { showError("Analyze your resume first."); return; }
    if (!targetRole.trim()) { showError("Enter a target cybersecurity role first."); return; }
    if (!jobs.length) { showError("Analyze some cybersecurity jobs first."); return; }
    const job = selectedJob || jobs[0];
    if (!job) { showError("Select a job first."); return; }
    setBusy("applicationReadinessGate", true);
    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("selected_job", JSON.stringify(job));
      formData.append("jobs_data", JSON.stringify(jobs));
      formData.append("applications_data", JSON.stringify(applications));
      formData.append("career_intelligence", JSON.stringify(careerIntelligence || {}));
      formData.append("career_evidence", JSON.stringify(careerEvidence || {}));
      formData.append("portfolio_audit", JSON.stringify(portfolioQualityAudit || {}));
      formData.append("interview_analytics", JSON.stringify(applicationAnalytics || interviewHistory || {}));
      const data = await apiFetch("/application-readiness-gate", { method: "POST", body: formData });
      if (data?.error) throw new Error(data.error);
      setApplicationReadinessGate(data);
      setActiveSection("application-readiness");
    } catch (error: any) {
      showError(error.message || "Application readiness gate failed.");
    } finally {
      setBusy("applicationReadinessGate", false);
    }
  }

  async function generateApplicationFollowUpCopilot() {
    if (!profile.trim()) { showError("Analyze your resume first."); return; }
    if (!targetRole.trim()) { showError("Enter a target cybersecurity role first."); return; }
    if (!jobs.length) { showError("Analyze some cybersecurity jobs first."); return; }
    const job = selectedJob || jobs[0];
    if (!job) { showError("Select a job first."); return; }
    setBusy("applicationFollowUpCopilot", true);
    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("selected_job", JSON.stringify(job));
      const selectedApplication = applications.find((item) => item.job_title === job.title && item.company === job.company);
      formData.append("application_status", selectedApplication?.status || "Applied");
      formData.append("application_notes", selectedApplication?.notes || "");
      formData.append("applications_data", JSON.stringify(applications));
      formData.append("application_readiness", JSON.stringify(applicationReadinessGate || {}));
      formData.append("application_pipeline", JSON.stringify(applicationPipeline || {}));
      formData.append("interview_analytics", JSON.stringify(applicationAnalytics || interviewHistory || {}));
      const data = await apiFetch("/application-follow-up-copilot", { method: "POST", body: formData });
      if (data?.error) throw new Error(data.error);
      setApplicationFollowUpCopilot(data);
      setActiveSection("application-follow-up");
    } catch (error: any) {
      showError(error.message || "Application follow-up copilot failed.");
    } finally {
      setBusy("applicationFollowUpCopilot", false);
    }
  }


  async function generateCareerOutcomeIntelligence() {
    if (!profile.trim()) { showError("Analyze your resume first."); return; }
    if (!targetRole.trim()) { showError("Enter a target cybersecurity role first."); return; }
    if (!applications.length) { showError("Save or apply to at least one job first so the system has outcome data."); return; }
    setBusy("careerOutcomeIntelligence", true);
    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("jobs_data", JSON.stringify(jobs));
      formData.append("applications_data", JSON.stringify(applications));
      formData.append("application_analytics", JSON.stringify(applicationAnalytics || {}));
      formData.append("interview_analytics", JSON.stringify(interviewHistory || applicationAnalytics || {}));
      formData.append("career_intelligence", JSON.stringify(careerIntelligence || {}));
      formData.append("application_decision", JSON.stringify(applicationDecision || {}));
      const data = await apiFetch("/career-outcome-intelligence", { method: "POST", body: formData });
      if (data?.error) throw new Error(data.error);
      setCareerOutcomeIntelligence(data);
      setActiveSection("career-outcomes");
    } catch (error: any) {
      showError(error.message || "Career outcome intelligence failed.");
    } finally { setBusy("careerOutcomeIntelligence", false); }
  }


  async function generateNiceSkillMapping() {
    if (!profile.trim()) {
      showError("Analyze your resume first.");
      return;
    }

    if (!targetRole.trim()) {
      showError("Enter a target cybersecurity role first.");
      return;
    }

    if (!jobs.length) {
      showError(
        "Analyze some cybersecurity jobs before generating the NICE skill map."
      );
      return;
    }

    setBusy("nice", true);

    try {
      const formData = new FormData();

      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("jobs_data", JSON.stringify(jobs));

      const data = await apiFetch("/nice-skill-mapping", {
        method: "POST",
        body: formData,
      });

      if (data?.error) {
        throw new Error(data.error);
      }

      setNiceMapping(data);
      setActiveSection("nice");
    } catch (error: any) {
      showError(
        error.message || "NICE skill mapping failed."
      );
    } finally {
      setBusy("nice", false);
    }
  }

  async function generateCareerIntelligence() {
    if (!profile.trim()) {
      showError("Analyze your resume first.");
      return;
    }

    if (!targetRole.trim()) {
      showError("Enter a target cybersecurity role first.");
      return;
    }

    if (!jobs.length) {
      showError("Analyze some cybersecurity jobs first.");
      return;
    }

    setBusy("careerIntelligence", true);

    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("jobs_data", JSON.stringify(jobs));
      formData.append("nice_mapping", JSON.stringify(niceMapping || {}));
      formData.append("learning_data", JSON.stringify(learning || {}));
      formData.append("roadmap_data", JSON.stringify(roadmap || {}));

      const data = await apiFetch("/career-intelligence", {
        method: "POST",
        body: formData,
      });

      if (data?.error) {
        throw new Error(data.error);
      }

      setCareerIntelligence(data);
      setActiveSection("career-intelligence");
    } catch (error: any) {
      showError(error.message || "Career intelligence failed.");
    } finally {
      setBusy("careerIntelligence", false);
    }
  }


  async function generateApplicationPipeline() {
    if (!selectedJob) {
      showError("Select a job first.");
      return;
    }

    if (!profile.trim()) {
      showError("Analyze your resume first.");
      return;
    }

    setBusy("pipeline", true);

    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("resume_text", resumeText);
      formData.append("target_role", targetRole);
      formData.append("job_data", JSON.stringify(selectedJob));

      const data = await apiFetch("/application-pipeline", {
        method: "POST",
        body: formData,
      });

      if (data?.error) throw new Error(data.error);

      setApplicationPipeline(data);
      setActiveSection("application-pipeline");
    } catch (error: any) {
      showError(error.message || "Application pipeline failed.");
    } finally {
      setBusy("pipeline", false);
    }
  }

  async function saveApplicationPackage() {
    if (!selectedJob || !applicationPipeline) {
      showError("Build an application package first.");
      return;
    }

    setBusy("savePipeline", true);

    try {
      const data = await apiFetch("/application-packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: selectedJob,
          target_role: targetRole,
          package: applicationPipeline,
        }),
      });

      if (data?.package) {
        setSavedPipelineId(data.package.id);
        setApplicationPackages((previous) => [
          data.package,
          ...previous.filter((item) => item.id !== data.package.id),
        ]);
      }

      console.log(data?.message || "Application package saved.");
    } catch (error: any) {
      showError(error.message || "Could not save application package.");
    } finally {
      setBusy("savePipeline", false);
    }
  }

  async function loadApplicationPackages() {
    try {
      const data = await apiFetch("/application-packages");
      setApplicationPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("loadApplicationPackages failed:", error);
      setApplicationPackages([]);
    }
  }

  function openApplicationPackage(record: ApplicationPackageRecord) {
    const job = {
      id: String(record.url || record.id),
      title: record.job_title,
      company: record.company || "",
      location: record.location || "",
      url: record.url || "",
      fit_score: record.fit_score || 0,
    } as Job;

    setSelectedJob(job);
    setTargetRole(record.target_role || targetRole);
    setApplicationPipeline(record.package || null);
    setSavedPipelineId(record.id);
    setActiveSection("application-pipeline");
  }

  async function generateApplicationCopilot() {
    if (!selectedJob) {
      showError("Select a job first.");
      return;
    }

    if (!profile.trim()) {
      showError("Analyze your resume first.");
      return;
    }

    setBusy("applicationCopilot", true);

    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("resume_text", resumeText);
      formData.append("target_role", targetRole);
      formData.append("job_data", JSON.stringify(selectedJob));

      const data = await apiFetch("/application-copilot", {
        method: "POST",
        body: formData,
      });

      if (data?.error) {
        throw new Error(data.error);
      }

      setApplicationCopilot(data);
      setActiveSection("application-copilot");
    } catch (error: any) {
      showError(error.message || "Application copilot failed.");
    } finally {
      setBusy("applicationCopilot", false);
    }
  }


  async function generateApplicationDecision() {
    if (!profile.trim()) { showError("Analyze your resume first."); return; }
    if (!targetRole.trim()) { showError("Enter a target cybersecurity role first."); return; }
    if (!jobs.length) { showError("Analyze some cybersecurity jobs first."); return; }

    setBusy("applicationDecision", true);
    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("jobs_data", JSON.stringify(jobs));
      formData.append("selected_job", JSON.stringify(selectedJob || {}));
      formData.append("career_intelligence", JSON.stringify(careerIntelligence || {}));
      formData.append("nice_mapping", JSON.stringify(niceMapping || {}));
      formData.append("learning_data", JSON.stringify(learning || {}));
      formData.append("interview_history", JSON.stringify(interviewHistory || {}));

      const data = await apiFetch("/application-decision-engine", { method: "POST", body: formData });
      if (data?.error) throw new Error(data.error);
      setApplicationDecision(data);
      setActiveSection("application-decision");
    } catch (error: any) {
      showError(error.message || "Application decision engine failed.");
    } finally {
      setBusy("applicationDecision", false);
    }
  }

  async function generateInterviewIntelligence() {
    if (!selectedJob) { showError("Select a job first."); return; }
    if (!profile.trim()) { showError("Analyze your resume first."); return; }
    setBusy("interviewIntelligence", true);
    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("resume_text", resumeText);
      formData.append("target_role", targetRole);
      formData.append("job_data", JSON.stringify(selectedJob));
      formData.append("copilot_data", JSON.stringify(applicationCopilot || {}));
      const data = await apiFetch("/interview-intelligence", { method: "POST", body: formData });
      if (data?.error) throw new Error(data.error);
      setInterviewIntelligence(data);
      setActiveSection("interview-intelligence");
    } catch (error: any) {
      showError(error.message || "Interview intelligence failed.");
    } finally { setBusy("interviewIntelligence", false); }
  }

  async function startMockInterview() {
    if (!selectedJob) { showError("Select a job first."); return; }
    if (!profile.trim()) { showError("Analyze your resume first."); return; }
    setBusy("mockInterview", true);
    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("job_data", JSON.stringify(selectedJob));
      formData.append("interview_plan", JSON.stringify(interviewIntelligence || {}));
      const data = await apiFetch("/mock-interview/start", { method: "POST", body: formData });
      if (data?.error) throw new Error(data.error);
      setMockInterview(data);
      setMockIndex(0);
      setMockAnswer("");
      setMockEvaluation(null);
      setMockScores([]);
      setMockScoreDetails([]);
      setMockCompleted(false);
      setActiveSection("mock-interview");
    } catch (error: any) {
      showError(error.message || "Mock interview could not start.");
    } finally { setBusy("mockInterview", false); }
  }

  async function evaluateMockAnswer() {
    const question = mockInterview?.questions?.[mockIndex];
    if (!question?.question) { showError("No interview question is active."); return; }
    if (!mockAnswer.trim()) { showError("Type your answer before submitting."); return; }
    setBusy("mockEvaluate", true);
    try {
      const formData = new FormData();
      formData.append("resume_profile", profile);
      formData.append("target_role", targetRole);
      formData.append("job_data", JSON.stringify(selectedJob || {}));
      formData.append("question", question.question);
      formData.append("category", question.category || "Technical");
      formData.append("answer", mockAnswer);
      formData.append("previous_feedback", JSON.stringify(mockEvaluation || {}));
      const data = await apiFetch("/mock-interview/evaluate", { method: "POST", body: formData });
      if (data?.error) throw new Error(data.error);
      setMockEvaluation(data);
      setMockScores((previous) => [...previous, Number(data?.scores?.overall || 0)]);
      setMockScoreDetails((previous) => [...previous, {
        overall: Number(data?.scores?.overall || 0),
        technical_accuracy: Number(data?.scores?.technical_accuracy || 0),
        cybersecurity_reasoning: Number(data?.scores?.cybersecurity_reasoning || 0),
        communication: Number(data?.scores?.communication || 0),
        structure: Number(data?.scores?.structure || 0),
        category: question.category || "Technical",
      }]);
    } catch (error: any) {
      showError(error.message || "Answer evaluation failed.");
    } finally { setBusy("mockEvaluate", false); }
  }

  async function saveCompletedInterview() {
    if (!mockScoreDetails.length) return;
    try {
      const formData = new FormData();
      formData.append("target_role", targetRole);
      formData.append("job_data", JSON.stringify(selectedJob || {}));
      formData.append("scores", JSON.stringify(mockScoreDetails));
      await apiFetch("/interview-history", { method: "POST", body: formData });
      await loadInterviewHistory();
    } catch (error: any) {
      showError(error.message || "Could not save interview history.");
    }
  }

  async function loadInterviewHistory() {
    try {
      const data = await apiFetch("/interview-history");
      setInterviewHistory(data);
    } catch (error) {
      console.error("loadInterviewHistory failed:", error);
      setInterviewHistory(null);
    }
  }

  async function nextMockQuestion() {
    const total = mockInterview?.questions?.length || 0;
    if (mockIndex >= total - 1) {
      setMockCompleted(true);
      await saveCompletedInterview();
      return;
    }
    setMockIndex((previous) => previous + 1);
    setMockAnswer("");
    setMockEvaluation(null);
  }

  async function saveJob(job: Job) {
    setBusy(`save-${job.id || job.title}`, true);

    try {
      const body = {
        job_title: job.title || "Untitled Job",
        company: job.company || "",
        location: job.location || "",
        url: job.url || "",
        fit_score: Number(job.fit_score || 0),
        status: "Saved",
        deadline: "",
        notes: "",
      };

      await apiFetch("/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      await loadApplications();
      await loadDashboard();
      await loadApplicationAnalytics();
    } catch (error: any) {
      showError(error.message || "Could not save job.");
    } finally {
      setBusy(`save-${job.id || job.title}`, false);
    }
  }

  async function loadApplications() {
    try {
      const data = await apiFetch("/applications");

      const result = Array.isArray(data)
        ? data
        : data.applications || [];

      setApplications(result);
    } catch (error) {
      console.error("loadApplications failed:", error);
      setApplications([]);
    }
  }

  async function loadApplicationAnalytics() {
    try {
      const data = await apiFetch("/application-analytics");
      setApplicationAnalytics(data);
    } catch (error) {
      console.error("loadApplicationAnalytics failed:", error);
      setApplicationAnalytics(null);
    }
  }

  async function loadDashboard() {
    try {
      const data = await apiFetch("/dashboard");
      setDashboard(data);
    } catch (error) {
      console.error("loadDashboard failed:", error);
      setDashboard(null);
    }
  }

  async function updateApplication(
    id: number,
    updates: Partial<Application>
  ) {
    try {
      await apiFetch(`/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      await loadApplications();
      await loadDashboard();
      await loadApplicationAnalytics();
    } catch (error: any) {
      showError(
        error.message || "Application update failed."
      );
    }
  }

  async function deleteApplication(id: number) {
    const confirmed = window.confirm(
      "Delete this application from your tracker?"
    );

    if (!confirmed) return;

    try {
      await apiFetch(`/applications/${id}`, {
        method: "DELETE",
      });

      await loadApplications();
      await loadDashboard();
      await loadApplicationAnalytics();
    } catch (error: any) {
      showError(
        error.message || "Application deletion failed."
      );
    }
  }

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("cyberpath-career-sprint");
      if (saved) setCompletedSprintActions(JSON.parse(saved));
      const savedEvidence = window.localStorage.getItem("cyberpath-career-evidence-notes");
      if (savedEvidence) setEvidenceNotes(JSON.parse(savedEvidence));
    } catch {
      // Ignore malformed local sprint state.
    }
    loadApplications();
    loadDashboard();
    loadApplicationAnalytics();
    loadInterviewHistory();
    loadApplicationPackages();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      const query = searchFilter.toLowerCase();

      const matchesSearch =
        !query ||
        `${application.job_title} ${application.company}`
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [applications, statusFilter, searchFilter]);

  const deadlineIntelligence = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const items = applications
      .filter((application) => application.status !== "Rejected" && application.status !== "Offer")
      .map((application) => {
        if (!application.deadline) {
          return { ...application, daysLeft: null, urgency: "No deadline" };
        }

        const deadline = new Date(`${application.deadline}T00:00:00`);
        const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / 86400000);
        let urgency = "Upcoming";
        if (daysLeft < 0) urgency = "Overdue";
        else if (daysLeft === 0) urgency = "Due today";
        else if (daysLeft <= 3) urgency = "Urgent";
        else if (daysLeft <= 7) urgency = "This week";
        return { ...application, daysLeft, urgency };
      })
      .sort((a, b) => {
        if (a.daysLeft === null) return 1;
        if (b.daysLeft === null) return -1;
        return a.daysLeft - b.daysLeft;
      });

    return {
      items,
      overdue: items.filter((x) => x.daysLeft !== null && x.daysLeft < 0),
      today: items.filter((x) => x.daysLeft === 0),
      next3: items.filter((x) => x.daysLeft !== null && x.daysLeft > 0 && x.daysLeft <= 3),
      next7: items.filter((x) => x.daysLeft !== null && x.daysLeft > 3 && x.daysLeft <= 7),
      noDeadline: items.filter((x) => x.daysLeft === null),
      appliedWaiting: applications.filter((x) => x.status === "Applied"),
    };
  }, [applications]);

  const topJobs = useMemo(() => {
    return [...jobs]
      .sort(
        (a, b) =>
          Number(b.fit_score || 0) -
          Number(a.fit_score || 0)
      )
      .slice(0, 5);
  }, [jobs]);

  /*
   * STEP 18
   * Dashboard Intelligence calculations
   */

  const highFitJobs = useMemo(() => {
    return jobs.filter(
      (job) => Number(job.fit_score || 0) >= 80
    );
  }, [jobs]);

  const fitDistribution = useMemo(() => {
    return {
      excellent: jobs.filter(
        (job) => Number(job.fit_score || 0) >= 85
      ).length,

      good: jobs.filter((job) => {
        const score = Number(job.fit_score || 0);
        return score >= 70 && score < 85;
      }).length,

      medium: jobs.filter((job) => {
        const score = Number(job.fit_score || 0);
        return score >= 50 && score < 70;
      }).length,

      low: jobs.filter(
        (job) => Number(job.fit_score || 0) < 50
      ).length,
    };
  }, [jobs]);

  const applicationStatusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Saved: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    applications.forEach((application) => {
      const status = application.status || "Saved";

      if (counts[status] === undefined) {
        counts[status] = 0;
      }

      counts[status] += 1;
    });

    return counts;
  }, [applications]);

  const allMissingSkills = useMemo(() => {
    const counts: Record<string, number> = {};

    jobs.forEach((job) => {
      safeArray(job.missing_skills).forEach((skill) => {
        const normalized = String(skill).trim();

        if (!normalized) return;

        counts[normalized] =
          (counts[normalized] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [jobs]);

  const allRequestedSkills = useMemo(() => {
    const counts: Record<string, number> = {};

    jobs.forEach((job) => {
      safeArray(job.strong_matches).forEach((skill) => {
        const normalized = String(skill).trim();

        if (!normalized) return;

        counts[normalized] =
          (counts[normalized] || 0) + 1;
      });

      safeArray(job.partial_matches).forEach((skill) => {
        const normalized = String(skill).trim();

        if (!normalized) return;

        counts[normalized] =
          (counts[normalized] || 0) + 0.5;
      });
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [jobs]);

  const biggestSkillGap = useMemo(() => {
    if (!allMissingSkills.length) {
      return null;
    }

    return {
      skill: allMissingSkills[0][0],
      frequency: allMissingSkills[0][1],
    };
  }, [allMissingSkills]);

  const nextBestSkill = useMemo(() => {
    if (learning?.next_best_skill?.skill) {
      return learning.next_best_skill;
    }

    if (selectedJob?.recommended_next_skill?.skill) {
      return selectedJob.recommended_next_skill;
    }

    if (biggestSkillGap?.skill) {
      return {
        skill: biggestSkillGap.skill,
        reason:
          "This is the most frequently identified skill gap across the current job results.",
        career_impact:
          "Improving this skill should increase your match against multiple cybersecurity positions.",
      };
    }

    return null;
  }, [
    learning,
    selectedJob,
    biggestSkillGap,
  ]);

  const averageJobScore = useMemo(() => {
    if (!jobs.length) return 0;

    const total = jobs.reduce(
      (sum, job) =>
        sum + Number(job.fit_score || 0),
      0
    );

    return Math.round(total / jobs.length);
  }, [jobs]);

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => {
        const dateA = a.created_at
          ? new Date(a.created_at).getTime()
          : 0;

        const dateB = b.created_at
          ? new Date(b.created_at).getTime()
          : 0;

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [applications]);

  const topApplication = useMemo(() => {
    if (!applications.length) return null;

    return [...applications].sort(
      (a, b) =>
        Number(b.fit_score || 0) -
        Number(a.fit_score || 0)
    )[0];
  }, [applications]);

  const niceTopGap = useMemo(() => {
    return safeArray(niceMapping?.top_skill_gaps)[0] || null;
  }, [niceMapping]);

  const niceStrongCount = useMemo(() => {
    return safeArray(niceMapping?.skill_summary?.strong).length;
  }, [niceMapping]);

  const nicePartialCount = useMemo(() => {
    return safeArray(niceMapping?.skill_summary?.partial).length;
  }, [niceMapping]);

  const niceGapCount = useMemo(() => {
    return safeArray(niceMapping?.skill_summary?.gaps).length;
  }, [niceMapping]);

  const commandCenterStats = useMemo(() => {
    const averageCybersecurityRelevance = jobs.length
      ? Math.round(
          jobs.reduce(
            (sum, job) => sum + Number(job.cybersecurity_relevance || 0),
            0
          ) / jobs.length
        )
      : 0;

    const averageCareerValue = jobs.length
      ? Math.round(
          jobs.reduce(
            (sum, job) => sum + Number(job.career_value || 0),
            0
          ) / jobs.length
        )
      : 0;

    return {
      jobsAnalyzed: jobs.length,
      highFitJobs: jobs.filter((job) => Number(job.fit_score || 0) >= 80).length,
      applications: applications.length,
      interviews: Number(applicationAnalytics?.summary?.interview_count || 0),
      averageFit: averageJobScore,
      averageCybersecurityRelevance,
      averageCareerValue,
    };
  }, [jobs, applications, applicationAnalytics, averageJobScore]);

  const commandCenterOpportunities = useMemo(() => {
    return [...jobs]
      .sort((a, b) => {
        const scoreA =
          Number(a.fit_score || 0) * 0.45 +
          Number(a.cybersecurity_relevance || 0) * 0.30 +
          Number(a.career_value || 0) * 0.25;
        const scoreB =
          Number(b.fit_score || 0) * 0.45 +
          Number(b.cybersecurity_relevance || 0) * 0.30 +
          Number(b.career_value || 0) * 0.25;
        return scoreB - scoreA;
      })
      .slice(0, 5);
  }, [jobs]);

  const commandCenterFocus = useMemo(() => {
    if (!profile.trim()) {
      return {
        title: "Build your cybersecurity profile",
        detail: "Upload and analyze your resume before making job-search decisions.",
        action: "resume",
        label: "START",
      };
    }

    if (!jobs.length) {
      return {
        title: "Analyze your job market",
        detail: "Search current cybersecurity positions to establish your opportunity baseline.",
        action: "jobs",
        label: "SEARCH",
      };
    }

    if (biggestSkillGap?.skill) {
      return {
        title: `Close the ${biggestSkillGap.skill} gap`,
        detail: `This skill appears repeatedly across your current job results (${biggestSkillGap.frequency} matches).`,
        action: "learning",
        label: "UPSKILL",
      };
    }

    if (applicationAnalytics?.summary?.applied_count === 0 && jobs.length > 0) {
      return {
        title: "Convert your strongest matches into applications",
        detail: "You have analyzed jobs but have not submitted applications yet.",
        action: "jobs",
        label: "APPLY",
      };
    }

    return {
      title: "Maintain application momentum",
      detail: "Keep targeting high-fit cybersecurity roles while improving the skills that appear most often.",
      action: "applications",
      label: "TRACK",
    };
  }, [profile, jobs.length, biggestSkillGap, applicationAnalytics]);

  const dashboardNextAction = useMemo(() => {
    if (!profile.trim()) {
      return {
        title: "Analyze your resume",
        description:
          "Build your cybersecurity profile before searching for jobs.",
        action: "resume",
      };
    }

    if (!jobs.length) {
      return {
        title: "Search cybersecurity jobs",
        description:
          "Find current roles and compare your profile against their requirements.",
        action: "jobs",
      };
    }

    if (biggestSkillGap?.skill) {
      return {
        title: `Improve ${biggestSkillGap.skill}`,
        description:
          "This is currently the most repeated skill gap in your analyzed jobs.",
        action: "learning",
      };
    }

    if (!applications.length) {
      return {
        title: "Save your strongest job",
        description:
          "Start building your application pipeline around high-fit cybersecurity roles.",
        action: "jobs",
      };
    }

    return {
      title: "Keep applying",
      description:
        "Continue prioritizing high-fit cybersecurity positions and improving repeated skill gaps.",
      action: "applications",
    };
  }, [
    profile,
    jobs.length,
    biggestSkillGap,
    applications.length,
  ]);

  function selectJob(job: Job) {
    setSelectedJob(job);
    setJobAnalysis(null);
    setSkillGap(null);
    setActiveSection("job-detail");
  }

  function jumpToSection(section: string) {
    setActiveSection(section);

    window.setTimeout(() => {
      document
        .getElementById(section)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  return (
    <main className="app-shell">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #07111f;
          color: #e5edf7;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        input,
        textarea,
        select {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .app-shell {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 80% 0%,
              rgba(38, 105, 180, 0.18),
              transparent 30%
            ),
            #07111f;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 20;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          border-bottom: 1px solid #17263a;
          background: rgba(7, 17, 31, 0.94);
          backdrop-filter: blur(18px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .brand-mark {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid #2b6ca8;
          border-radius: 9px;
          color: #7dd3fc;
          background: #0d2034;
          font-size: 15px;
        }

        .brand-sub {
          color: #6f8198;
          font-size: 12px;
          margin-left: 8px;
        }

        .layout {
          display: grid;
          grid-template-columns: 230px minmax(0, 1fr);
          min-height: calc(100vh - 72px);
        }

        .sidebar {
          border-right: 1px solid #17263a;
          padding: 24px 14px;
          background: #081321;
        }

        .nav-label {
          color: #52677f;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin: 12px 10px 8px;
        }

        .nav-button {
          width: 100%;
          border: 0;
          background: transparent;
          color: #8192a7;
          text-align: left;
          padding: 10px 12px;
          border-radius: 8px;
          margin-bottom: 2px;
          font-size: 13px;
        }

        .nav-button:hover,
        .nav-button.active {
          color: #e7f0fb;
          background: #102238;
        }

        .main {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          padding: 38px;
        }

        .hero {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 30px;
        }

        .hero h1 {
          font-size: clamp(30px, 4vw, 52px);
          line-height: 1;
          letter-spacing: -0.045em;
          margin: 0 0 14px;
        }

        .hero p {
          color: #8da0b7;
          max-width: 720px;
          line-height: 1.7;
          margin: 0;
        }

        .eyebrow {
          color: #5eb5e8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .target-box {
          min-width: 320px;
          border: 1px solid #1a344e;
          background: #0a1828;
          border-radius: 12px;
          padding: 16px;
        }

        .target-box label {
          display: block;
          color: #66809c;
          font-size: 11px;
          margin-bottom: 7px;
        }

        .target-box input {
          width: 100%;
          border: 1px solid #24415e;
          border-radius: 7px;
          background: #07111f;
          color: #e5edf7;
          padding: 10px;
          outline: none;
        }

        .section {
          margin-bottom: 34px;
          scroll-margin-top: 95px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 16px;
        }

        .section-header h2 {
          margin: 0 0 5px;
          font-size: 22px;
          letter-spacing: -0.02em;
        }

        .section-header p {
          margin: 0;
          color: #71869e;
          font-size: 13px;
        }

        .card {
          border: 1px solid #1a2b40;
          border-radius: 12px;
          background: #0a1726;
          padding: 20px;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .stat-card {
          border: 1px solid #1a2b40;
          background: #0a1726;
          border-radius: 12px;
          padding: 18px;
        }

        .stat-label {
          color: #637890;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .stat-value {
          margin-top: 8px;
          font-size: 30px;
          font-weight: 800;
        }

        .stat-sub {
          margin-top: 5px;
          color: #72879f;
          font-size: 12px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 14px;
          margin-top: 14px;
        }

        .dashboard-three {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 14px;
        }

        .intelligence-card {
          min-height: 180px;
        }

        .pipeline {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin-top: 14px;
        }

        .pipeline-item {
          border: 1px solid #1a2b40;
          background: #091624;
          border-radius: 9px;
          padding: 13px;
        }

        .pipeline-number {
          font-size: 24px;
          font-weight: 850;
          margin-top: 5px;
        }

        .skill-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
        }

        .skill-name {
          min-width: 0;
          flex: 1;
          color: #b8c8d9;
          font-size: 12px;
        }

        .skill-bar {
          width: 120px;
          height: 6px;
          background: #142336;
          border-radius: 999px;
          overflow: hidden;
        }

        .skill-bar-inner {
          height: 100%;
          background: #3e91c5;
          border-radius: 999px;
        }

        .skill-count {
          color: #6f849c;
          font-size: 11px;
          min-width: 28px;
          text-align: right;
        }

        .next-action {
          border: 1px solid #245174;
          background:
            linear-gradient(
              135deg,
              rgba(18, 64, 96, 0.55),
              rgba(10, 23, 38, 0.95)
            );
        }

        .next-action .big-highlight {
          color: #8ed5f7;
        }

        .nice-dashboard-grid {
          display: grid;
          grid-template-columns: 1.6fr 0.7fr 0.7fr;
          gap: 12px;
          margin: 14px 0;
        }

        .nice-score,
        .nice-summary-score {
          margin-top: 6px;
          font-size: 28px;
          font-weight: 850;
          color: #8ed5f7;
        }

        .nice-summary-grid {
          display: grid;
          grid-template-columns: 1.5fr 0.75fr 0.75fr;
          gap: 12px;
          margin-bottom: 14px;
        }

        .nice-summary-card {
          border: 1px solid #1a2d43;
          background: #0b1929;
          border-radius: 10px;
          padding: 16px;
        }

        .nice-summary-value {
          margin-top: 8px;
          font-size: 21px;
          font-weight: 800;
          line-height: 1.25;
        }

        .nice-count-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 14px;
        }

        .nice-count {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid #1a2d43;
          border-radius: 9px;
          background: #091624;
          padding: 12px 14px;
          font-size: 12px;
        }

        .nice-count strong {
          font-size: 20px;
        }

        .nice-count.strong strong {
          color: #79ddb1;
        }

        .nice-count.partial strong {
          color: #86c9ef;
        }

        .nice-count.gap strong {
          color: #e89595;
        }

        .nice-disclaimer {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          border: 1px solid #2a4a66;
          background: #091827;
          border-radius: 9px;
          padding: 12px 14px;
          color: #9bb0c5;
          font-size: 12px;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .nice-disclaimer strong {
          color: #8ed5f7;
        }

        .nice-empty {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .nice-role-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }

        .nice-role-title {
          margin: 5px 0 0;
          font-size: 18px;
        }

        .nice-skill-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          border: 1px solid #1a2d43;
          border-radius: 9px;
          background: #0b1929;
          padding: 14px;
        }

        .nice-skill-main {
          min-width: 0;
          flex: 1;
        }

        .nice-skill-main strong {
          display: block;
          margin-bottom: 4px;
        }

        .nice-skill-meta {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 6px;
        }

        .nice-evidence,
        .nice-gap-text,
        .nice-action {
          margin-top: 8px;
          color: #8197ae;
          font-size: 11px;
          line-height: 1.55;
        }

        .nice-evidence span {
          color: #79ddb1;
          font-weight: 700;
        }

        .nice-gap-text span {
          color: #e89595;
          font-weight: 700;
        }

        .nice-gap-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 15px;
          border: 1px solid #1a2d43;
          border-radius: 9px;
          background: #0b1929;
        }

        .nice-gap-number {
          width: 30px;
          height: 30px;
          flex: 0 0 30px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #123653;
          color: #8dd1f3;
          font-size: 11px;
          font-weight: 800;
        }

        .nice-gap-title {
          font-weight: 800;
          font-size: 14px;
          margin-bottom: 3px;
        }

        .callout {
          margin-top: 14px;
          border: 1px solid #203b54;
          border-radius: 9px;
          background: #091827;
          padding: 12px 14px;
        }

        .callout p {
          margin: 5px 0 0;
        }

        .upload-box {
          border: 1px dashed #2a4c6d;
          background: #091827;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
        }

        .upload-box input[type="file"] {
          width: 100%;
          max-width: 480px;
          margin: 16px auto;
          color: #8ea2ba;
        }

        .button-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #29425e;
          border-radius: 7px;
          padding: 9px 13px;
          background: #0c1d30;
          color: #d8e5f3;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
        }

        .button:hover {
          background: #122b44;
        }

        .button.primary {
          border-color: #286a9e;
          background: #104166;
          color: #e9f7ff;
        }

        .button.danger {
          border-color: #6b2d3a;
          background: #35151e;
        }

        .button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .profile-box {
          white-space: pre-wrap;
          color: #b8c7d8;
          font-size: 13px;
          line-height: 1.7;
          max-height: 430px;
          overflow: auto;
        }

        .job-list {
          display: grid;
          gap: 12px;
        }

        .job-card {
          border: 1px solid #1a2b40;
          border-radius: 12px;
          background: #0a1726;
          padding: 18px;
        }

        .job-card:hover {
          border-color: #2b557a;
        }

        .job-top {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .job-title {
          font-size: 17px;
          font-weight: 750;
          margin-bottom: 5px;
        }

        .job-company {
          color: #7890aa;
          font-size: 12px;
        }

        .score {
          min-width: 62px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 900;
          border: 1px solid #263d55;
          background: #0c1c2d;
        }

        .score.excellent {
          color: #79e2b4;
          border-color: #21634c;
        }

        .score.good {
          color: #8bd0f3;
          border-color: #235478;
        }

        .score.medium {
          color: #e8c77d;
          border-color: #665126;
        }

        .score.low {
          color: #e58b8b;
          border-color: #673536;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 12px 0;
        }

        .tag {
          display: inline-flex;
          border: 1px solid #263d55;
          background: #0d1d2d;
          color: #8ea4bb;
          border-radius: 999px;
          padding: 4px 8px;
          font-size: 10px;
        }

        .tag.green {
          color: #79ddb1;
          border-color: #215b46;
        }

        .tag.red {
          color: #e89595;
          border-color: #623539;
        }

        .tag.blue {
          color: #86c9ef;
          border-color: #285473;
        }

        .priority {
          display: inline-block;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 999px;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .priority.high {
          color: #80e1b2;
          background: #123728;
        }

        .priority.medium {
          color: #e5c87d;
          background: #382f18;
        }

        .priority.low {
          color: #93a5ba;
          background: #172333;
        }

        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .three-column {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .list {
          margin: 10px 0 0;
          padding-left: 20px;
          color: #9cafc3;
          line-height: 1.7;
          font-size: 13px;
        }

        .list li {
          margin-bottom: 5px;
        }

        .empty {
          border: 1px dashed #22384f;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          color: #637991;
          background: #091624;
        }

        .empty-small {
          color: #637991;
          font-size: 12px;
          padding: 12px 0;
        }

        .textarea {
          width: 100%;
          min-height: 240px;
          resize: vertical;
          border: 1px solid #223b55;
          border-radius: 8px;
          background: #07111f;
          color: #c9d6e4;
          padding: 13px;
          outline: none;
          line-height: 1.6;
        }

        .mini-label {
          color: #607890;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 800;
        }

        .big-highlight {
          font-size: 28px;
          font-weight: 850;
          margin: 7px 0;
        }

        .muted {
          color: #71869e;
          font-size: 12px;
          line-height: 1.6;
        }

        .roadmap-list {
          display: grid;
          gap: 12px;
        }

        .roadmap-item {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 12px;
          padding: 15px;
          border: 1px solid #1a2d43;
          border-radius: 9px;
          background: #0b1929;
        }

        .roadmap-number {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #123653;
          color: #8dd1f3;
          font-size: 11px;
          font-weight: 800;
        }

        .roadmap-item strong {
          font-size: 13px;
        }

        .learning-card {
          border: 1px solid #1a2c41;
          background: #0a1726;
          border-radius: 10px;
          padding: 16px;
        }

        .learning-card h3 {
          margin: 0 0 6px;
          font-size: 15px;
        }

        .resource-list {
          display: grid;
          gap: 6px;
          margin-top: 10px;
        }

        .resource-link {
          color: #7ec8ef;
          font-size: 12px;
          text-decoration: none;
        }

        .resource-link:hover {
          text-decoration: underline;
        }

        .application-table-wrap {
          overflow-x: auto;
        }

        .application-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 850px;
        }

        .application-table th,
        .application-table td {
          padding: 12px 10px;
          border-bottom: 1px solid #182a3e;
          text-align: left;
          vertical-align: middle;
        }

        .application-table th {
          color: #607890;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .application-table td {
          color: #aebed0;
          font-size: 12px;
        }

        .application-table select,
        .application-table input {
          background: #07111f;
          color: #dbe7f3;
          border: 1px solid #253c54;
          border-radius: 6px;
          padding: 6px;
          width: 100%;
        }

        .filter-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .filter-row input,
        .filter-row select {
          background: #07111f;
          color: #dbe7f3;
          border: 1px solid #253c54;
          border-radius: 7px;
          padding: 9px 10px;
        }

        .error {
          position: fixed;
          right: 22px;
          bottom: 22px;
          z-index: 100;
          max-width: 430px;
          border: 1px solid #713a42;
          background: #32161e;
          color: #f0b4b4;
          border-radius: 10px;
          padding: 14px 16px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
          font-size: 12px;
        }

        .footer {
          color: #42566d;
          text-align: center;
          font-size: 11px;
          padding: 40px 0 10px;
        }

        @media (max-width: 1100px) {
          .layout {
            grid-template-columns: 190px minmax(0, 1fr);
          }

          .stats-grid,
          .card-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dashboard-grid,
          .dashboard-three {
            grid-template-columns: 1fr;
          }

          .pipeline {
            grid-template-columns: repeat(3, 1fr);
          }

          .hero {
            flex-direction: column;
          }

          .target-box {
            min-width: 0;
          }
        }

        @media (max-width: 760px) {
          .topbar {
            padding: 0 15px;
          }

          .brand-sub {
            display: none;
          }

          .layout {
            display: block;
          }

          .sidebar {
            position: sticky;
            top: 72px;
            z-index: 10;
            display: flex;
            gap: 5px;
            overflow-x: auto;
            padding: 8px;
            border-right: 0;
            border-bottom: 1px solid #17263a;
          }

          .nav-label {
            display: none;
          }

          .nav-button {
            white-space: nowrap;
            width: auto;
            margin: 0;
          }

          .main {
            padding: 22px 15px;
          }

          .stats-grid,
          .card-grid,
          .two-column,
          .three-column {
            grid-template-columns: 1fr;
          }

          .pipeline {
            grid-template-columns: repeat(2, 1fr);
          }

          .nice-dashboard-grid,
          .nice-summary-grid {
            grid-template-columns: 1fr;
          }

          .nice-count-grid {
            grid-template-columns: 1fr;
          }

          .nice-empty {
            flex-direction: column;
            align-items: stretch;
          }

          .nice-skill-row,
          .nice-gap-row {
            flex-direction: column;
          }

          .nice-skill-meta {
            justify-content: flex-start;
          }

          .job-top {
            flex-direction: column;
          }

          .skill-bar {
            width: 70px;
          }
        }
      `}</style>

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">CP</div>

          <div>
            CyberPath AI

            <span className="brand-sub">
              CYBERSECURITY CAREER AGENT
            </span>
          </div>
        </div>

        <div className="muted">
          {targetRole}
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="nav-label">
            Workspace
          </div>

          <button
            className={`nav-button ${
              activeSection === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              jumpToSection("dashboard")
            }
          >
            Dashboard
          </button>

          <button
            className={`nav-button ${
              activeSection === "command-center" ? "active" : ""
            }`}
            onClick={() => jumpToSection("command-center")}
          >
            Career Command Center
          </button>

          <button
            className={`nav-button ${
              activeSection === "application-analytics" ? "active" : ""
            }`}
            onClick={() => jumpToSection("application-analytics")}
          >
            Application Analytics
          </button>

          <button
            className={`nav-button ${
              activeSection === "resume"
                ? "active"
                : ""
            }`}
            onClick={() =>
              jumpToSection("resume")
            }
          >
            Resume Intelligence
          </button>

          <button
            className={`nav-button ${
              activeSection === "jobs"
                ? "active"
                : ""
            }`}
            onClick={() =>
              jumpToSection("jobs")
            }
          >
            Job Intelligence
          </button>

          <button
            className={`nav-button ${
              activeSection === "job-detail"
                ? "active"
                : ""
            }`}
            onClick={() =>
              jumpToSection("job-detail")
            }
          >
            Selected Job
          </button>

          <button
            className={`nav-button ${
              activeSection === "learning"
                ? "active"
                : ""
            }`}
            onClick={() =>
              jumpToSection("learning")
            }
          >
            Learning
          </button>

          <button
            className={`nav-button ${
              activeSection === "roadmap"
                ? "active"
                : ""
            }`}
            onClick={() =>
              jumpToSection("roadmap")
            }
          >
            Career Strategy
          </button>

          <button
            className={`nav-button ${activeSection === "90-day-plan" ? "active" : ""}`}
            onClick={() => jumpToSection("90-day-plan")}
          >
            90-Day Career Plan
          </button>

          <button
            className={`nav-button ${activeSection === "career-sprint" ? "active" : ""}`}
            onClick={() => jumpToSection("career-sprint")}
          >
            AI Career Sprint
          </button>

          <button className={`nav-button ${activeSection === "career-evidence" ? "active" : ""}`} onClick={() => jumpToSection("career-evidence")}>
            Career Evidence
          </button>

          <button className={`nav-button ${activeSection === "cybersecurity-portfolio" ? "active" : ""}`} onClick={() => jumpToSection("cybersecurity-portfolio")}>
            Portfolio Builder
          </button>

          <button className={`nav-button ${activeSection === "portfolio-audit" ? "active" : ""}`} onClick={() => jumpToSection("portfolio-audit")}>
            Portfolio Audit
          </button>

          <button className={`nav-button ${activeSection === "application-readiness" ? "active" : ""}`} onClick={() => jumpToSection("application-readiness")}>
            Application Readiness
          </button>

          <button className={`nav-button ${activeSection === "application-follow-up" ? "active" : ""}`} onClick={() => jumpToSection("application-follow-up")}>
            Follow-up Copilot
          </button>

          <button className={`nav-button ${activeSection === "career-outcomes" ? "active" : ""}`} onClick={() => jumpToSection("career-outcomes")}>
            Career Outcome Intelligence
          </button>

          <button
            className={`nav-button ${
              activeSection === "nice"
                ? "active"
                : ""
            }`}
            onClick={() =>
              jumpToSection("nice")
            }
          >
            NICE Skill Map
          </button>

          <button
            className={`nav-button ${
              activeSection === "career-intelligence"
                ? "active"
                : ""
            }`}
            onClick={() =>
              jumpToSection("career-intelligence")
            }
          >
            Career Intelligence
          </button>

          <button
            className={`nav-button ${
              activeSection === "application-copilot"
                ? "active"
                : ""
            }`}
            onClick={() =>
              jumpToSection("application-copilot")
            }
          >
            Application Copilot
          </button>

          <button
            className={`nav-button ${
              activeSection === "application-pipeline"
                ? "active"
                : ""
            }`}
            onClick={() => jumpToSection("application-pipeline")}
          >
            Application Pipeline
          </button>

          <button
            className={`nav-button ${activeSection === "interview-intelligence" ? "active" : ""}`}
            onClick={() => jumpToSection("interview-intelligence")}
          >
            Interview Intelligence
          </button>

          <button
            className={`nav-button ${activeSection === "mock-interview" ? "active" : ""}`}
            onClick={() => jumpToSection("mock-interview")}
          >
            Mock Interview
          </button>

          <button
            className={`nav-button ${activeSection === "interview-history" ? "active" : ""}`}
            onClick={() => jumpToSection("interview-history")}
          >
            Interview Analytics
          </button>

          <button
            className={`nav-button ${
              activeSection === "application-tracker"
                ? "active"
                : ""
            }`}
            onClick={() =>
              jumpToSection("application-tracker")
            }
          >
            Deadline Tracker
          </button>

          <button
            className={`nav-button ${
              activeSection === "applications"
                ? "active"
                : ""
            }`}
            onClick={() =>
              jumpToSection("applications")
            }
          >
            Applications
          </button>
        </aside>

        <div className="main">
          <section className="hero">
            <div>
              <div className="eyebrow">
                AI CYBERSECURITY CAREER AGENT
              </div>

              <h1>
                Find the cybersecurity
                <br />
                jobs worth applying to.
              </h1>

              <p>
                CyberPath AI analyzes your resume against
                cybersecurity jobs, identifies skill gaps,
                recommends what to learn, and tracks the
                applications that matter.
              </p>
            </div>

            <div className="target-box">
              <label>
                Target Cybersecurity Role
              </label>

              <input
                value={targetRole}
                onChange={(event) =>
                  setTargetRole(event.target.value)
                }
              />

              <div
                className="muted"
                style={{ marginTop: 8 }}
              >
                Example: Cloud Security Engineer,
                SOC Analyst, Cyber Threat Intelligence
                Analyst
              </div>
            </div>
          </section>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* =====================================================
              STEP 31 — CAREER COMMAND CENTER
              ===================================================== */}

          <section className="section" id="command-center">
            <SectionHeader
              eyebrow="02 / CAREER COMMAND CENTER"
              title="Career Command Center"
              description="A single operating view of your current cybersecurity job market, application progress, and highest-impact next move."
            />

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Jobs analyzed</div>
                <div className="stat-value">{commandCenterStats.jobsAnalyzed}</div>
                <div className="stat-sub">Current market snapshot</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">High-fit jobs</div>
                <div className="stat-value">{commandCenterStats.highFitJobs}</div>
                <div className="stat-sub">Fit score ≥ 80</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Applications</div>
                <div className="stat-value">{commandCenterStats.applications}</div>
                <div className="stat-sub">Saved + submitted</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Interviews</div>
                <div className="stat-value">{commandCenterStats.interviews}</div>
                <div className="stat-sub">Tracked interview outcomes</div>
              </div>
            </div>

            <div className="stats-grid" style={{ marginTop: 14 }}>
              <div className="stat-card">
                <div className="stat-label">Average fit</div>
                <div className="stat-value">{commandCenterStats.averageFit || "—"}</div>
                <div className="stat-sub">Across analyzed jobs</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Cybersecurity relevance</div>
                <div className="stat-value">{commandCenterStats.averageCybersecurityRelevance || "—"}</div>
                <div className="stat-sub">Average relevance score</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Career value</div>
                <div className="stat-value">{commandCenterStats.averageCareerValue || "—"}</div>
                <div className="stat-sub">Long-term role value</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Top repeated gap</div>
                <div className="stat-value" style={{ fontSize: 22 }}>{biggestSkillGap?.skill || "—"}</div>
                <div className="stat-sub">{biggestSkillGap ? `${biggestSkillGap.frequency} job matches` : "Analyze jobs first"}</div>
              </div>
            </div>

            <div className="card" style={{ marginTop: 14 }}>
              <div className="mini-label">CAREER OPERATING STATUS</div>
              <div className="dashboard-grid" style={{ marginTop: 12 }}>
                <div>
                  <div className="small-note">1 · PROFILE</div>
                  <strong>{profile ? "Ready" : "Build profile"}</strong>
                  <div className="button-row" style={{ marginTop: 8 }}>
                    <button className="button" onClick={() => jumpToSection("resume")}>Resume</button>
                  </div>
                </div>
                <div>
                  <div className="small-note">2 · MARKET</div>
                  <strong>{jobs.length ? `${jobs.length} jobs analyzed` : "Not analyzed"}</strong>
                  <div className="button-row" style={{ marginTop: 8 }}>
                    <button className="button" onClick={() => jumpToSection("jobs")}>Job Market</button>
                  </div>
                </div>
                <div>
                  <div className="small-note">3 · APPLICATIONS</div>
                  <strong>{applications.length ? `${applications.length} tracked` : "No applications"}</strong>
                  <div className="button-row" style={{ marginTop: 8 }}>
                    <button className="button" onClick={() => jumpToSection("applications")}>Tracker</button>
                  </div>
                </div>
                <div>
                  <div className="small-note">4 · OUTCOMES</div>
                  <strong>{Number(applicationAnalytics?.summary?.offer_count || 0) > 0 ? "Offer signal" : Number(applicationAnalytics?.summary?.interview_count || 0) > 0 ? "Interview signal" : "Build signal"}</strong>
                  <div className="button-row" style={{ marginTop: 8 }}>
                    <button className="button" onClick={() => jumpToSection("career-outcomes")}>Outcomes</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid" style={{ marginTop: 14 }}>
              <div className="card intelligence-card">
                <div className="mini-label">RECOMMENDED CURRENT FOCUS</div>
                <div className="big-highlight" style={{ marginTop: 10 }}>{commandCenterFocus.title}</div>
                <p className="muted">{commandCenterFocus.detail}</p>
                <div className="button-row">
                  <button className="button primary" onClick={() => jumpToSection(commandCenterFocus.action)}>
                    {commandCenterFocus.label}
                  </button>
                  <button className="button" onClick={() => { loadApplications(); loadDashboard(); loadApplicationAnalytics(); }}>
                    Refresh Command Center
                  </button>
                </div>
              </div>

              <div className="card intelligence-card">
                <div className="mini-label">CAREER SEARCH SIGNAL</div>
                <div className="analytics-mini-grid">
                  <div><strong>{applicationAnalytics?.summary?.applied_count ?? 0}</strong><span>applied</span></div>
                  <div><strong>{applicationAnalytics?.summary?.interview_count ?? 0}</strong><span>interviews</span></div>
                  <div><strong>{applicationAnalytics?.summary?.offer_count ?? 0}</strong><span>offers</span></div>
                  <div><strong>{applicationAnalytics?.summary?.awaiting_response ?? 0}</strong><span>awaiting</span></div>
                </div>
                <p className="muted" style={{ marginTop: 16 }}>
                  {applicationAnalytics?.summary?.recommendation || "Keep analyzing and saving jobs to generate a stronger application signal."}
                </p>
              </div>
            </div>

            <div className="card" style={{ marginTop: 14 }}>
              <div className="mini-label">TOP CURRENT OPPORTUNITIES</div>
              {commandCenterOpportunities.length ? (
                <div className="analytics-list">
                  {commandCenterOpportunities.map((job, index) => (
                    <div className="analytics-list-row" key={`${job.id || job.title}-${index}`}>
                      <div>
                        <strong>{job.title || "Untitled Position"}</strong>
                        <small>{job.company || "Unknown Company"} · {job.location || "Location not specified"}</small>
                      </div>
                      <div className="tags" style={{ justifyContent: "flex-end" }}>
                        <Tag type={Number(job.fit_score || 0) >= 80 ? "green" : ""}>Fit {job.fit_score ?? 0}</Tag>
                        <Tag>Cyber {job.cybersecurity_relevance ?? 0}</Tag>
                        <Tag>Career {job.career_value ?? 0}</Tag>
                        <button className="button" onClick={() => selectJob(job)}>Review</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-small">No analyzed opportunities yet. Run Job Market Analysis first.</div>
              )}
            </div>

            <div className="dashboard-grid" style={{ marginTop: 14 }}>
              <div className="card">
                <div className="mini-label">REPEATED SKILL GAPS</div>
                {allMissingSkills.length ? (
                  allMissingSkills.slice(0, 6).map(([skill, count], index) => (
                    <div className="analytics-list-row" key={`${skill}-${index}`}>
                      <div><strong>{skill}</strong><small>Appears in {count} analyzed job{count === 1 ? "" : "s"}</small></div>
                      <Tag type={index === 0 ? "red" : ""}>{index === 0 ? "Top Gap" : `#${index + 1}`}</Tag>
                    </div>
                  ))
                ) : (
                  <div className="empty-small">No repeated skill gaps yet.</div>
                )}
              </div>

              <div className="card">
                <div className="mini-label">NEXT BEST ACTIONS</div>
                <div className="roadmap-list">
                  <div className="roadmap-item"><div className="roadmap-number">1</div><div><strong>{biggestSkillGap?.skill ? `Learn ${biggestSkillGap.skill}` : "Analyze your job market"}</strong><span className="muted">{biggestSkillGap?.skill ? "Attack the most repeated requirement first." : "Get current job data before choosing what to learn."}</span></div></div>
                  <div className="roadmap-item"><div className="roadmap-number">2</div><div><strong>Prioritize high-fit cybersecurity roles</strong><span className="muted">Use Fit + Cybersecurity Relevance + Career Value together.</span></div></div>
                  <div className="roadmap-item"><div className="roadmap-number">3</div><div><strong>Turn preparation into applications</strong><span className="muted">Use the Application Pipeline for the strongest opportunities.</span></div></div>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              STEP 29 — APPLICATION ANALYTICS
              ===================================================== */}

          <section className="section" id="application-analytics">
            <SectionHeader
              eyebrow="03 / APPLICATION ANALYTICS"
              title="Application Performance"
              description="Turn your saved applications into measurable career-search feedback: conversion, interview performance, and where your strategy is working."
            />

            <div className="stats-grid">
              <div className="stat-card"><div className="stat-label">Applications</div><div className="stat-value">{applicationAnalytics?.summary?.total_applications ?? applications.length}</div><div className="stat-sub">Tracked applications</div></div>
              <div className="stat-card"><div className="stat-label">Interview rate</div><div className="stat-value">{applicationAnalytics?.conversion?.applied_to_interview ?? 0}%</div><div className="stat-sub">Applied → Interview</div></div>
              <div className="stat-card"><div className="stat-label">Offer rate</div><div className="stat-value">{applicationAnalytics?.conversion?.overall_offer_rate ?? 0}%</div><div className="stat-sub">Applied → Offer</div></div>
              <div className="stat-card"><div className="stat-label">Avg. applied fit</div><div className="stat-value">{applicationAnalytics?.summary?.average_applied_fit ?? 0}</div><div className="stat-sub">Fit score of submitted jobs</div></div>
            </div>

            <div className="dashboard-grid">
              <div className="card intelligence-card">
                <div className="mini-label">CONVERSION FUNNEL</div>
                <div className="analytics-funnel">
                  {[
                    ["Saved → Applied", applicationAnalytics?.conversion?.saved_to_applied],
                    ["Applied → Interview", applicationAnalytics?.conversion?.applied_to_interview],
                    ["Interview → Offer", applicationAnalytics?.conversion?.interview_to_offer],
                  ].map(([label, value]) => (
                    <div className="analytics-funnel-row" key={String(label)}>
                      <div><strong>{label}</strong><small>{Number(value || 0).toFixed(1)}%</small></div>
                      <div className="analytics-bar"><span style={{ width: `${Math.min(100, Number(value || 0))}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card intelligence-card">
                <div className="mini-label">WHAT THE DATA SAYS</div>
                <div className="big-highlight">{applicationAnalytics?.summary?.recommendation || "Save applications to start generating career-search analytics."}</div>
                <div className="analytics-mini-grid">
                  <div><strong>{applicationAnalytics?.summary?.interview_count ?? 0}</strong><span>interviews</span></div>
                  <div><strong>{applicationAnalytics?.summary?.offer_count ?? 0}</strong><span>offers</span></div>
                  <div><strong>{applicationAnalytics?.summary?.awaiting_response ?? 0}</strong><span>awaiting</span></div>
                  <div><strong>{applicationAnalytics?.summary?.average_interview_score ?? 0}</strong><span>avg interview</span></div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card">
                <div className="mini-label">BEST COMPANIES</div>
                {safeArray(applicationAnalytics?.company_performance).length ? safeArray(applicationAnalytics?.company_performance).slice(0,5).map((item, i) => (
                  <div className="analytics-list-row" key={`${item.company}-${i}`}>
                    <div><strong>{item.company}</strong><small>{item.applications} applications · {item.interviews} interviews · {item.offers} offers</small></div>
                    <Tag type={item.offers ? "green" : item.interviews ? "blue" : ""}>Fit {item.avg_fit ?? 0}</Tag>
                  </div>
                )) : <div className="empty-small">No company performance data yet.</div>}
              </div>

              <div className="card">
                <div className="mini-label">BEST JOB TYPES</div>
                {safeArray(applicationAnalytics?.role_performance).length ? safeArray(applicationAnalytics?.role_performance).slice(0,5).map((item, i) => (
                  <div className="analytics-list-row" key={`${item.job_title}-${i}`}>
                    <div><strong>{item.job_title}</strong><small>{item.applications} applications · {item.interviews} interviews · {item.offers} offers</small></div>
                    <Tag type={item.offers ? "green" : item.interviews ? "blue" : ""}>Fit {item.avg_fit ?? 0}</Tag>
                  </div>
                )) : <div className="empty-small">No role performance data yet.</div>}
              </div>
            </div>

            <div className="card" style={{ marginTop: 14 }}>
              <div className="mini-label">APPLICATION STRATEGY SIGNAL</div>
              <p className="muted">Use conversion data to change your behavior, not just track numbers. If high-fit applications are not producing interviews, revisit resume alignment and targeting. If interviews are strong but offers are low, prioritize mock interviews and role-specific preparation.</p>
              <div className="button-row">
                <button className="button primary" onClick={() => jumpToSection("applications")}>Open Application Tracker</button>
                <button className="button" onClick={() => jumpToSection("mock-interview")}>Practice Interview</button>
                <button className="button" onClick={() => jumpToSection("learning")}>Improve Skills</button>
              </div>
            </div>
          </section>

          {/* =====================================================
              STEP 18 — DASHBOARD INTELLIGENCE
              ===================================================== */}

          <section
            className="section"
            id="dashboard"
          >
            <SectionHeader
              eyebrow="01 / DASHBOARD INTELLIGENCE"
              title="Career Dashboard"
              description="A real-time view of your cybersecurity job market, skill gaps, and application pipeline."
            />

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">
                  Jobs analyzed
                </div>

                <div className="stat-value">
                  {jobs.length}
                </div>

                <div className="stat-sub">
                  Current cybersecurity results
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">
                  High fit jobs
                </div>

                <div className="stat-value">
                  {highFitJobs.length}
                </div>

                <div className="stat-sub">
                  Fit score ≥ 80
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">
                  Average fit
                </div>

                <div className="stat-value">
                  {averageJobScore || "—"}
                </div>

                <div className="stat-sub">
                  Across analyzed jobs
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">
                  Applications
                </div>

                <div className="stat-value">
                  {dashboard?.total_applications ??
                    applications.length}
                </div>

                <div className="stat-sub">
                  In application tracker
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card intelligence-card">
                <div className="mini-label">
                  TOP CURRENT JOB
                </div>

                {topJobs[0] ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "flex-start",
                        gap: 20,
                        marginTop: 10,
                      }}
                    >
                      <div>
                        <div className="job-title">
                          {topJobs[0].title ||
                            "Untitled Position"}
                        </div>

                        <div className="job-company">
                          {topJobs[0].company ||
                            "Unknown Company"}{" "}
                          ·{" "}
                          {topJobs[0].location ||
                            "Location not specified"}
                        </div>
                      </div>

                      <div
                        className={scoreClass(
                          topJobs[0].fit_score
                        )}
                      >
                        {topJobs[0].fit_score ?? 0}
                      </div>
                    </div>

                    <p className="muted">
                      {topJobs[0].summary ||
                        "No summary available."}
                    </p>

                    <div className="tags">
                      <Tag type="green">
                        Cybersecurity{" "}
                        {topJobs[0]
                          .cybersecurity_relevance ??
                          0}
                        %
                      </Tag>

                      <Tag>
                        {topJobs[0]
                          .application_priority ||
                          "Priority unknown"}
                      </Tag>
                    </div>

                    <div className="button-row">
                      <button
                        className="button primary"
                        onClick={() =>
                          selectJob(topJobs[0])
                        }
                      >
                        View Job Intelligence
                      </button>

                      <button
                        className="button"
                        onClick={() =>
                          saveJob(topJobs[0])
                        }
                      >
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-small">
                    Search for cybersecurity jobs to
                    generate dashboard intelligence.
                  </div>
                )}
              </div>

              <div className="card intelligence-card">
                <div className="mini-label">
                  NEXT BEST ACTION
                </div>

                <div className="big-highlight">
                  {dashboardNextAction.title}
                </div>

                <p className="muted">
                  {dashboardNextAction.description}
                </p>

                <button
                  className="button primary"
                  onClick={() =>
                    jumpToSection(
                      dashboardNextAction.action
                    )
                  }
                >
                  Go to Recommendation
                </button>
              </div>
            </div>

            <div className="dashboard-three">
              <div className="card intelligence-card">
                <div className="mini-label">
                  BIGGEST SKILL GAP
                </div>

                {biggestSkillGap ? (
                  <>
                    <div className="big-highlight">
                      {biggestSkillGap.skill}
                    </div>

                    <div className="muted">
                      Appears as a missing skill in{" "}
                      {biggestSkillGap.frequency}{" "}
                      analyzed job
                      {biggestSkillGap.frequency === 1
                        ? ""
                        : "s"}
                      .
                    </div>

                    <div className="button-row">
                      <button
                        className="button"
                        onClick={() =>
                          jumpToSection("learning")
                        }
                      >
                        Learn This Skill
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-small">
                    No repeated skill gaps yet.
                  </div>
                )}
              </div>

              <div className="card intelligence-card">
                <div className="mini-label">
                  NEXT BEST SKILL
                </div>

                {nextBestSkill ? (
                  <>
                    <div className="big-highlight">
                      {nextBestSkill.skill}
                    </div>

                    <div className="muted">
                      {nextBestSkill.reason}
                    </div>

                    <div
                      className="muted"
                      style={{
                        marginTop: 8,
                      }}
                    >
                      {nextBestSkill.career_impact}
                    </div>
                  </>
                ) : (
                  <div className="empty-small">
                    Analyze jobs or generate a learning
                    plan first.
                  </div>
                )}
              </div>

              <div className="card intelligence-card">
                <div className="mini-label">
                  BEST APPLICATION
                </div>

                {topApplication ? (
                  <>
                    <div className="job-title">
                      {topApplication.job_title}
                    </div>

                    <div className="job-company">
                      {topApplication.company}
                    </div>

                    <div
                      className="big-highlight"
                      style={{
                        marginTop: 14,
                      }}
                    >
                      {topApplication.fit_score ??
                        0}
                    </div>

                    <Tag type="blue">
                      {topApplication.status ||
                        "Saved"}
                    </Tag>
                  </>
                ) : (
                  <div className="empty-small">
                    No saved applications yet.
                  </div>
                )}
              </div>
            </div>

            <div
              className="card"
              style={{ marginTop: 14 }}
            >
              <div className="mini-label">
                NICE-ALIGNED CYBERSECURITY MAP
              </div>

              {!niceMapping ? (
                <>
                  <div className="big-highlight">
                    Map your cybersecurity capabilities
                  </div>

                  <p className="muted">
                    Compare your current skills with
                    NICE-aligned work roles and the
                    requirements appearing across your
                    analyzed jobs.
                  </p>

                  <div className="button-row">
                    <LoadingButton
                      loading={loading.nice}
                      onClick={
                        generateNiceSkillMapping
                      }
                      disabled={
                        !profile.trim() ||
                        !jobs.length
                      }
                    >
                      Analyze NICE Skill Map
                    </LoadingButton>
                  </div>
                </>
              ) : (
                <>
                  <div className="nice-dashboard-grid">
                    <div>
                      <div className="mini-label">
                        BEST WORK ROLE
                      </div>
                      <div className="big-highlight">
                        {niceMapping.nice_summary
                          ?.best_work_role ||
                          niceMapping
                            .recommended_work_role ||
                          "—"}
                      </div>
                    </div>

                    <div>
                      <div className="mini-label">
                        ROLE MATCH
                      </div>
                      <div className="nice-score">
                        {Math.round(
                          Number(
                            niceMapping.nice_summary
                              ?.work_role_match || 0
                          )
                        )}
                        %
                      </div>
                    </div>

                    <div>
                      <div className="mini-label">
                        SKILL MATCH
                      </div>
                      <div className="nice-score">
                        {Math.round(
                          Number(
                            niceMapping.nice_summary
                              ?.overall_skill_match || 0
                          )
                        )}
                        %
                      </div>
                    </div>
                  </div>

                  <p className="muted">
                    {niceMapping.nice_summary
                      ?.summary ||
                      "NICE-aligned capability mapping is ready."}
                  </p>

                  <div className="button-row">
                    <button
                      className="button primary"
                      onClick={() =>
                        jumpToSection("nice")
                      }
                    >
                      View NICE Skill Map
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="card" style={{ marginTop: 14 }}>
              <div className="mini-label">
                APPLICATION PIPELINE
              </div>

              <div className="pipeline">
                <div className="pipeline-item">
                  <div className="mini-label">
                    SAVED
                  </div>

                  <div className="pipeline-number">
                    {applicationStatusCounts.Saved}
                  </div>
                </div>

                <div className="pipeline-item">
                  <div className="mini-label">
                    APPLIED
                  </div>

                  <div className="pipeline-number">
                    {applicationStatusCounts.Applied}
                  </div>
                </div>

                <div className="pipeline-item">
                  <div className="mini-label">
                    INTERVIEW
                  </div>

                  <div className="pipeline-number">
                    {applicationStatusCounts.Interview}
                  </div>
                </div>

                <div className="pipeline-item">
                  <div className="mini-label">
                    OFFER
                  </div>

                  <div className="pipeline-number">
                    {applicationStatusCounts.Offer}
                  </div>
                </div>

                <div className="pipeline-item">
                  <div className="mini-label">
                    REJECTED
                  </div>

                  <div className="pipeline-number">
                    {applicationStatusCounts.Rejected}
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="card">
                <div className="mini-label">
                  MOST REQUESTED / MATCHED SKILLS
                </div>

                {allRequestedSkills.length ? (
                  <div style={{ marginTop: 10 }}>
                    {allRequestedSkills.map(
                      ([skill, count]) => {
                        const max =
                          allRequestedSkills[0][1];

                        const percentage =
                          max > 0
                            ? Math.max(
                                8,
                                (count / max) * 100
                              )
                            : 0;

                        return (
                          <div
                            className="skill-row"
                            key={skill}
                          >
                            <div className="skill-name">
                              {skill}
                            </div>

                            <div className="skill-bar">
                              <div
                                className="skill-bar-inner"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>

                            <div className="skill-count">
                              {Number.isInteger(
                                count
                              )
                                ? count
                                : count.toFixed(1)}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="empty-small">
                    No skill-match data yet.
                  </div>
                )}
              </div>

              <div className="card">
                <div className="mini-label">
                  TOP SKILL GAPS
                </div>

                {allMissingSkills.length ? (
                  <div style={{ marginTop: 10 }}>
                    {allMissingSkills
                      .slice(0, 6)
                      .map(([skill, count]) => (
                        <div
                          className="skill-row"
                          key={skill}
                        >
                          <div className="skill-name">
                            {skill}
                          </div>

                          <Tag type="red">
                            {count} job
                            {count === 1
                              ? ""
                              : "s"}
                          </Tag>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="empty-small">
                    No missing-skill data yet.
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{ marginTop: 14 }}>
              <div className="mini-label">
                FIT SCORE DISTRIBUTION
              </div>

              <div className="pipeline">
                <div className="pipeline-item">
                  <div className="mini-label">
                    85–100
                  </div>

                  <div className="pipeline-number">
                    {fitDistribution.excellent}
                  </div>

                  <div className="muted">
                    Excellent fit
                  </div>
                </div>

                <div className="pipeline-item">
                  <div className="mini-label">
                    70–84
                  </div>

                  <div className="pipeline-number">
                    {fitDistribution.good}
                  </div>

                  <div className="muted">
                    Good fit
                  </div>
                </div>

                <div className="pipeline-item">
                  <div className="mini-label">
                    50–69
                  </div>

                  <div className="pipeline-number">
                    {fitDistribution.medium}
                  </div>

                  <div className="muted">
                    Medium fit
                  </div>
                </div>

                <div className="pipeline-item">
                  <div className="mini-label">
                    0–49
                  </div>

                  <div className="pipeline-number">
                    {fitDistribution.low}
                  </div>

                  <div className="muted">
                    Low fit
                  </div>
                </div>
              </div>
            </div>

            <div
              className="card"
              style={{ marginTop: 14 }}
            >
              <div className="mini-label">
                TOP 5 JOB RANKING
              </div>

              {topJobs.length ? (
                <div className="job-list" style={{ marginTop: 12 }}>
                  {topJobs.map((job, index) => (
                    <div
                      className="job-card"
                      key={`dashboard-${job.title}-${index}`}
                    >
                      <div className="job-top">
                        <div>
                          <div className="job-title">
                            <span
                              style={{
                                color: "#5eb5e8",
                                marginRight: 8,
                              }}
                            >
                              #{index + 1}
                            </span>

                            {job.title}
                          </div>

                          <div className="job-company">
                            {job.company} ·{" "}
                            {job.location}
                          </div>
                        </div>

                        <div
                          className={scoreClass(
                            job.fit_score
                          )}
                        >
                          {job.fit_score ?? 0}
                        </div>
                      </div>

                      <div className="button-row">
                        <button
                          className="button"
                          onClick={() =>
                            selectJob(job)
                          }
                        >
                          View
                        </button>

                        {job.url && (
                          <a
                            className="button"
                            href={job.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open Job
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-small">
                  No jobs available.
                </div>
              )}
            </div>

            <div
              className="card"
              style={{ marginTop: 14 }}
            >
              <div className="mini-label">
                RECENT APPLICATIONS
              </div>

              {recentApplications.length ? (
                <div className="job-list" style={{ marginTop: 12 }}>
                  {recentApplications.map(
                    (application) => (
                      <div
                        className="job-card"
                        key={application.id}
                      >
                        <div className="job-top">
                          <div>
                            <div className="job-title">
                              {application.job_title}
                            </div>

                            <div className="job-company">
                              {application.company ||
                                "Unknown Company"}
                            </div>
                          </div>

                          <div
                            className={scoreClass(
                              application.fit_score
                            )}
                          >
                            {application.fit_score ??
                              0}
                          </div>
                        </div>

                        <div className="tags">
                          <Tag type="blue">
                            {application.status ||
                              "Saved"}
                          </Tag>

                          {application.deadline && (
                            <Tag>
                              Deadline:{" "}
                              {application.deadline}
                            </Tag>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="empty-small">
                  Save jobs from Job Intelligence to
                  start your application pipeline.
                </div>
              )}
            </div>
          </section>

          <div className="card career-intel-dashboard-card" style={{ marginTop: 14 }}>
            <div>
              <div className="mini-label">STEP 20 / CAREER INTELLIGENCE</div>
              <div className="big-highlight">What should I do next?</div>
              <p className="muted">
                Combine your resume, analyzed jobs, NICE mapping, learning plan,
                and career roadmap into one practical decision.
              </p>
            </div>

            {careerIntelligence ? (
              <div className="career-intel-dashboard-grid">
                <div className="career-intel-mini">
                  <span>Career Fit</span>
                  <strong>{careerIntelligence.career_decision?.career_fit ?? 0}%</strong>
                </div>
                <div className="career-intel-mini">
                  <span>Readiness</span>
                  <strong>{careerIntelligence.career_decision?.current_readiness ?? 0}%</strong>
                </div>
                <div className="career-intel-mini">
                  <span>Next Skill</span>
                  <strong>{careerIntelligence.next_best_skill?.skill || "—"}</strong>
                </div>
                <div className="career-intel-mini">
                  <span>Recommendation</span>
                  <strong>{careerIntelligence.career_decision?.recommendation || "—"}</strong>
                </div>
              </div>
            ) : null}

            <div className="button-row" style={{ marginTop: 12 }}>
              <LoadingButton
                loading={loading.careerIntelligence}
                onClick={generateCareerIntelligence}
                disabled={!profile || !jobs.length}
              >
                {careerIntelligence ? "Refresh Career Intelligence" : "Generate Career Intelligence"}
              </LoadingButton>
              {careerIntelligence && (
                <button
                  className="button"
                  onClick={() => jumpToSection("career-intelligence")}
                >
                  View Full Analysis
                </button>
              )}
            </div>
          </div>

          {/* =====================================================
              RESUME
              ===================================================== */}

          <section
            className="section"
            id="resume"
          >
            <SectionHeader
              eyebrow="02 / RESUME"
              title="Resume Intelligence"
              description="Upload your resume and turn it into a cybersecurity career profile."
            />

            <div className="card">
              <div className="upload-box">
                <div className="eyebrow">
                  PDF RESUME
                </div>

                <h3>
                  {resumeFile
                    ? resumeFile.name
                    : "Upload your resume"}
                </h3>

                <div className="muted">
                  PDF files are parsed by the FastAPI
                  backend.
                </div>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={(
                    event: ChangeEvent<HTMLInputElement>
                  ) => {
                    const file =
                      event.target.files?.[0] ||
                      null;

                    setResumeFile(file);
                  }}
                />

                <div className="button-row">
                  <LoadingButton
                    loading={loading.upload}
                    onClick={uploadResume}
                  >
                    Upload Resume
                  </LoadingButton>

                  <LoadingButton
                    loading={loading.analyzeResume}
                    onClick={analyzeResume}
                    disabled={!resumeText}
                  >
                    Analyze Resume
                  </LoadingButton>
                </div>
              </div>
            </div>

            {profile && (
              <div
                className="card"
                style={{ marginTop: 14 }}
              >
                <div className="mini-label">
                  Cybersecurity Profile
                </div>

                <div
                  className="profile-box"
                  style={{ marginTop: 10 }}
                >
                  {profile}
                </div>

                <div className="button-row">
                  <LoadingButton
                    loading={loading.learning}
                    onClick={
                      getLearningRecommendations
                    }
                  >
                    Build Learning Plan
                  </LoadingButton>

                  <LoadingButton
                    loading={loading.roadmap}
                    onClick={generateCareerRoadmap}
                  >
                    Build Career Roadmap
                  </LoadingButton>

                  <LoadingButton
                    loading={loading.careerAdvice}
                    onClick={getCareerAdvice}
                  >
                    Get Career Advice
                  </LoadingButton>
                </div>
              </div>
            )}
          </section>

          {/* =====================================================
              JOB INTELLIGENCE
              ===================================================== */}

          <section
            className="section"
            id="jobs"
          >
            <SectionHeader
              eyebrow="03 / JOB MARKET"
              title="Cybersecurity Job Intelligence"
              description="Search multiple cybersecurity job variations and rank them by career fit."
            />

            <div className="card">
              <div className="form-grid">
                <div>
                  <label>Search Location</label>
                  <input
                    value={jobLocation}
                    onChange={(event) => setJobLocation(event.target.value)}
                    placeholder="e.g. Remote, Wilmington, NC, Raleigh, NC"
                  />
                </div>

                <div>
                  <label>Minimum Fit Score</label>
                  <select
                    value={minFitScore}
                    onChange={(event) => setMinFitScore(Number(event.target.value))}
                  >
                    <option value={0}>Any</option>
                    <option value={50}>50+</option>
                    <option value={60}>60+</option>
                    <option value={70}>70+</option>
                    <option value={80}>80+</option>
                    <option value={90}>90+</option>
                  </select>
                </div>

                <div>
                  <label>Minimum Cybersecurity Relevance</label>
                  <select
                    value={minCybersecurityRelevance}
                    onChange={(event) => setMinCybersecurityRelevance(Number(event.target.value))}
                  >
                    <option value={0}>Any</option>
                    <option value={40}>40+</option>
                    <option value={50}>50+</option>
                    <option value={60}>60+</option>
                    <option value={70}>70+</option>
                    <option value={80}>80+</option>
                    <option value={90}>90+</option>
                  </select>
                </div>
              </div>

              <div className="button-row" style={{ marginTop: 16 }}>
                <LoadingButton
                  loading={loading.searchJobs}
                  onClick={searchJobs}
                >
                  Analyze My Job Market
                </LoadingButton>
              </div>

              <div className="muted" style={{ marginTop: 10 }}>
                Searches up to 20 jobs, prioritizes cybersecurity-focused postings, and filters results using your minimum Fit and Cybersecurity Relevance scores.
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              {jobs.length === 0 ? (
                <div className="empty">
                  No jobs analyzed yet.
                  <br />
                  Upload your resume, analyze your
                  profile, then search for jobs.
                </div>
              ) : (
                <div className="job-list">
                  {jobs.map((job, index) => (
                    <div
                      className="job-card"
                      key={`${job.title}-${job.company}-${index}`}
                    >
                      <div className="job-top">
                        <div>
                          <div className="job-title">
                            {job.title ||
                              "Untitled Position"}
                          </div>

                          <div className="job-company">
                            {job.company ||
                              "Unknown Company"}{" "}
                            ·{" "}
                            {job.location ||
                              "Location not specified"}
                          </div>

                          <div className="tags">
                            <Tag
                              type={
                                Number(
                                  job.cybersecurity_relevance ||
                                    0
                                ) >= 70
                                  ? "green"
                                  : ""
                              }
                            >
                              Cybersecurity{" "}
                              {job.cybersecurity_relevance ??
                                0}
                              %
                            </Tag>

                            <Tag>
                              Priority{" "}
                              {job.application_priority ||
                                "Unknown"}
                            </Tag>
                          </div>
                        </div>

                        <div
                          className={scoreClass(
                            job.fit_score
                          )}
                        >
                          {job.fit_score ?? 0}
                        </div>
                      </div>

                      <p className="muted">
                        {job.summary ||
                          "No AI summary available."}
                      </p>

                      <div className="button-row">
                        <button
                          className="button primary"
                          onClick={() =>
                            selectJob(job)
                          }
                        >
                          View Intelligence
                        </button>

                        <button
                          className="button"
                          onClick={() =>
                            saveJob(job)
                          }
                          disabled={
                            loading[
                              `save-${job.id || job.title}`
                            ]
                          }
                        >
                          {loading[
                            `save-${job.id || job.title}`
                          ]
                            ? "Saving..."
                            : "Save Application"}
                        </button>

                        {job.url && (
                          <a
                            className="button"
                            href={job.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open Job
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* =====================================================
              SELECTED JOB
              ===================================================== */}

          <section
            className="section"
            id="job-detail"
          >
            <SectionHeader
              eyebrow="04 / DEEP ANALYSIS"
              title="Selected Job Intelligence"
              description="Understand exactly why this job fits and what you need to improve."
            />

            {!selectedJob ? (
              <div className="empty">
                Select a job from Job Intelligence.
              </div>
            ) : (
              <>
                <div className="card">
                  <div className="job-top">
                    <div>
                      <div className="eyebrow">
                        SELECTED POSITION
                      </div>

                      <div className="job-title">
                        {selectedJob.title}
                      </div>

                      <div className="job-company">
                        {selectedJob.company} ·{" "}
                        {selectedJob.location}
                      </div>
                    </div>

                    <div
                      className={scoreClass(
                        selectedJob.fit_score
                      )}
                    >
                      {selectedJob.fit_score ?? 0}
                    </div>
                  </div>

                  <div className="button-row">
                    <LoadingButton
                      loading={loading.analyzeJob}
                      onClick={analyzeSelectedJob}
                    >
                      Deep Analyze Job
                    </LoadingButton>

                    <LoadingButton
                      loading={loading.skillGap}
                      onClick={runSkillGap}
                    >
                      Analyze Skill Gap
                    </LoadingButton>

                    <LoadingButton
                      loading={loading.tailorResume}
                      onClick={tailorResume}
                    >
                      Tailor Resume
                    </LoadingButton>

                    <button
                      className="button"
                      onClick={() =>
                        saveJob(selectedJob)
                      }
                    >
                      Save Application
                    </button>
                  </div>
                </div>

                <div
                  className="two-column"
                  style={{ marginTop: 14 }}
                >
                  <div className="card">
                    <div className="mini-label">
                      Strong Matches
                    </div>

                    <ul className="list">
                      {safeArray(
                        selectedJob.strong_matches
                      ).map((item, index) => (
                        <li
                          key={`${item}-${index}`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card">
                    <div className="mini-label">
                      Missing Skills
                    </div>

                    <div className="tags">
                      {safeArray(
                        selectedJob.missing_skills
                      ).map((item, index) => (
                        <Tag
                          key={`${item}-${index}`}
                          type="red"
                        >
                          {item}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>

                {jobAnalysis && (
                  <div
                    className="card"
                    style={{ marginTop: 14 }}
                  >
                    <div className="mini-label">
                      AI Job Analysis
                    </div>

                    <pre className="profile-box">
                      {JSON.stringify(
                        jobAnalysis,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}

                {skillGap && (
                  <div
                    className="card"
                    style={{ marginTop: 14 }}
                  >
                    <div className="mini-label">
                      Skill Gap Analysis
                    </div>

                    <pre className="profile-box">
                      {JSON.stringify(
                        skillGap,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}

                {selectedJob.recommended_next_skill && (
                  <div
                    className="card"
                    style={{ marginTop: 14 }}
                  >
                    <div className="mini-label">
                      Recommended Next Skill
                    </div>

                    <div className="big-highlight">
                      {
                        selectedJob
                          .recommended_next_skill
                          .skill
                      }
                    </div>

                    <div className="muted">
                      {
                        selectedJob
                          .recommended_next_skill
                          .reason
                      }
                    </div>

                    <div
                      className="muted"
                      style={{ marginTop: 8 }}
                    >
                      {
                        selectedJob
                          .recommended_next_skill
                          .career_impact
                      }
                    </div>
                  </div>
                )}
              </>
            )}
          </section>


          {/* =====================================================
              STEP 32 — PERSONALIZED 90-DAY CAREER PLAN
              ===================================================== */}
          <section className="section" id="90-day-plan">
            <SectionHeader
              eyebrow="08 / 90-DAY CAREER PLAN"
              title="Your Next 90 Days"
              description="Turn your resume, cybersecurity job market, and application history into one focused execution plan."
            />

            {!personalized90DayPlan ? (
              <div className="card">
                <div className="two-column">
                  <div>
                    <div className="mini-label">PERSONALIZED EXECUTION PLAN</div>
                    <div className="big-highlight">Resume → Market → Skills → Applications</div>
                    <p className="muted">CyberPath AI will identify your current position, biggest gap, priority skill, project proof, certification strategy, and a week-by-week 90-day plan.</p>
                  </div>
                  <div>
                    <div className="mini-label">PLAN INPUTS</div>
                    <ul className="list">
                      <li>Analyzed cybersecurity resume/profile</li>
                      <li>Current target role and job market</li>
                      <li>Application history from the tracker</li>
                    </ul>
                    <LoadingButton loading={loading.personalized90DayPlan} onClick={generatePersonalized90DayPlan} disabled={!profile.trim() || !jobs.length}>Generate 90-Day Plan</LoadingButton>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="card">
                  <div className="career-intel-hero">
                    <div>
                      <div className="mini-label">CURRENT POSITION</div>
                      <h2>{personalized90DayPlan.current_position || "Cybersecurity Candidate"}</h2>
                      <p className="muted">Target: {personalized90DayPlan.target_role || targetRole}</p>
                    </div>
                    <div className="career-intel-score"><span>Career Readiness</span><strong>{personalized90DayPlan.career_readiness ?? 0}</strong><small>/ 100</small></div>
                  </div>
                  <div className="career-intel-stats">
                    <div className="career-intel-stat"><span>Biggest Strength</span><strong>{personalized90DayPlan.biggest_strength || "—"}</strong></div>
                    <div className="career-intel-stat"><span>Biggest Gap</span><strong>{personalized90DayPlan.biggest_gap || "—"}</strong></div>
                    <div className="career-intel-stat"><span>Priority Skill</span><strong>{personalized90DayPlan.priority_skill || "—"}</strong></div>
                    <div className="career-intel-stat"><span>Weekly Applications</span><strong>{personalized90DayPlan.weekly_application_target ?? 0}</strong></div>
                  </div>
                </div>

                <div className="two-column" style={{ marginTop: 14 }}>
                  <div className="card">
                    <div className="mini-label">HOW TO LEARN THE PRIORITY SKILL</div>
                    {safeArray(personalized90DayPlan.how_to_learn).map((item, index) => (
                      <div className="saved-package-row" key={`${item.action}-${index}`}><div><strong>{item.action || "Learning action"}</strong><span>{item.resource_type || "Resource"} · {item.resource || "Relevant learning resource"}{item.time ? ` · ${item.time}` : ""}</span></div></div>
                    ))}
                  </div>
                  <div className="card">
                    <div className="mini-label">HOW TO PROVE IT</div>
                    <ul className="list">{safeArray(personalized90DayPlan.how_to_prove_it).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>
                  </div>
                </div>

                <div className="card" style={{ marginTop: 14 }}>
                  <div className="mini-label">CYBERSECURITY PROJECT</div>
                  <div className="big-highlight">{personalized90DayPlan.cybersecurity_project?.name || "Build a portfolio proof project"}</div>
                  <p className="muted">{personalized90DayPlan.cybersecurity_project?.goal || "Create a hands-on artifact that proves the priority skill."}</p>
                  <div className="three-column">
                    <div><div className="mini-label">SKILLS PROVEN</div><ul className="list">{safeArray(personalized90DayPlan.cybersecurity_project?.skills_proven).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
                    <div><div className="mini-label">DELIVERABLES</div><ul className="list">{safeArray(personalized90DayPlan.cybersecurity_project?.deliverables).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
                    <div><div className="mini-label">ESTIMATED TIME</div><div className="big-highlight">{personalized90DayPlan.cybersecurity_project?.estimated_time || "—"}</div></div>
                  </div>
                </div>

                <div className="card" style={{ marginTop: 14 }}>
                  <div className="mini-label">CERTIFICATION STRATEGY</div>
                  <div className="big-highlight">{personalized90DayPlan.certification_strategy?.recommendation || "Focus on skill proof first."}</div>
                  <p className="muted">{personalized90DayPlan.certification_strategy?.why_now || "—"}</p>
                  {personalized90DayPlan.certification_strategy?.what_not_to_do && <div className="muted" style={{ marginTop: 8 }}>Avoid: {personalized90DayPlan.certification_strategy.what_not_to_do}</div>}
                </div>

                <div className="card" style={{ marginTop: 14 }}>
                  <div className="mini-label">90-DAY EXECUTION</div>
                  <div className="three-column">
                    {[["DAYS 1–30", personalized90DayPlan.days_1_30], ["DAYS 31–60", personalized90DayPlan.days_31_60], ["DAYS 61–90", personalized90DayPlan.days_61_90]].map(([label, phase]: any) => (
                      <div className="card" key={label} style={{ margin: 0 }}>
                        <div className="mini-label">{label}</div><div className="big-highlight">{phase?.theme || "Execution phase"}</div>
                        <ul className="list">{safeArray(phase?.goals).map((goal, index) => <li key={`${goal}-${index}`}>{goal}</li>)}</ul>
                        {safeArray(phase?.weekly_actions).map((week, index) => <div key={`${week.week}-${index}`} style={{ marginTop: 12 }}><div className="mini-label">WEEK {week.week ?? index + 1}</div><ul className="list">{safeArray(week.actions).map((action, actionIndex) => <li key={`${action}-${actionIndex}`}>{action}</li>)}</ul></div>)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="two-column" style={{ marginTop: 14 }}>
                  <div className="card"><div className="mini-label">WEEKLY APPLICATION ROUTINE</div><div className="big-highlight">{personalized90DayPlan.weekly_application_target ?? 0} target applications / week</div><ul className="list">{safeArray(personalized90DayPlan.weekly_application_routine).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
                  <div className="card"><div className="mini-label">TOP 5 ACTIONS</div>{safeArray(personalized90DayPlan.top_5_actions).map((item, index) => <div className="saved-package-row" key={`${item.rank}-${index}`}><div><strong>{item.rank ?? index + 1}. {item.action || "Priority action"}</strong><span>{item.timeframe || "90-day plan"} · {item.why || "High career impact"}</span></div></div>)}</div>
                </div>

                <div className="two-column" style={{ marginTop: 14 }}>
                  <div className="card"><div className="mini-label">SUCCESS METRICS</div><ul className="list">{safeArray(personalized90DayPlan.success_metrics).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
                  <div className="card"><div className="mini-label">DO NOT DO NOW</div><ul className="list">{safeArray(personalized90DayPlan.what_not_to_do_now).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
                </div>

                <div className="card" style={{ marginTop: 14 }}><div className="mini-label">PLAN SUMMARY</div><p className="muted">{personalized90DayPlan.plan_summary || "—"}</p><div className="button-row"><LoadingButton loading={loading.personalized90DayPlan} onClick={generatePersonalized90DayPlan}>Regenerate 90-Day Plan</LoadingButton></div></div>
              </>
            )}
          </section>

          {/* =====================================================
              STEP 33 — AI CAREER SPRINT
              ===================================================== */}
          <section className="section" id="career-sprint">
            <SectionHeader
              eyebrow="09 / AI CAREER SPRINT"
              title="Turn the 90-Day Plan Into This Week"
              description="Convert your long-term career plan into a focused weekly workload with measurable proof of completion."
            />

            <div className="card">
              <div className="two-column">
                <div>
                  <div className="mini-label">WEEKLY EXECUTION ENGINE</div>
                  <div className="big-highlight">Plan → Focus → Execute → Prove</div>
                  <p className="muted">Choose a week from your 90-day plan. CyberPath AI will prioritize the smallest set of actions that moves your cybersecurity career forward.</p>
                </div>
                <div>
                  <div className="mini-label">PLAN WEEK</div>
                  <select className="input" value={sprintWeek} onChange={(event) => setSprintWeek(Number(event.target.value))}>
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((week) => <option key={week} value={week}>Week {week}</option>)}
                  </select>
                  <div className="button-row" style={{ marginTop: 10 }}>
                    <LoadingButton loading={loading.careerSprint} onClick={generateCareerSprint} disabled={!personalized90DayPlan || !jobs.length}>Generate Weekly Sprint</LoadingButton>
                  </div>
                </div>
              </div>
            </div>

            {careerSprint && (
              <>
                <div className="card" style={{ marginTop: 14 }}>
                  <div className="career-intel-hero">
                    <div>
                      <div className="mini-label">WEEK {careerSprint.week ?? sprintWeek}</div>
                      <h2>{careerSprint.sprint_theme || "Career execution sprint"}</h2>
                      <p className="muted">{careerSprint.weekly_goal || "Complete the highest-impact actions for this week."}</p>
                    </div>
                    <div className="career-intel-score"><span>Application Target</span><strong>{careerSprint.application_target ?? 0}</strong><small>/ week</small></div>
                  </div>
                  <div className="career-intel-stats">
                    <div className="career-intel-stat"><span>Focus Skill</span><strong>{careerSprint.focus_skill || "—"}</strong></div>
                    <div className="career-intel-stat"><span>Actions</span><strong>{safeArray(careerSprint.actions).length}</strong></div>
                    <div className="career-intel-stat"><span>Completed</span><strong>{safeArray(careerSprint.actions).filter((item, index) => completedSprintActions[item.id || `week-${careerSprint.week}-action-${index}`]).length}</strong></div>
                    <div className="career-intel-stat"><span>Applications</span><strong>{applications.length}</strong></div>
                  </div>
                </div>

                <div className="two-column" style={{ marginTop: 14 }}>
                  <div className="card"><div className="mini-label">WHY THIS WEEK MATTERS</div><p className="muted">{careerSprint.why_this_week_matters || "—"}</p></div>
                  <div className="card"><div className="mini-label">APPLICATION STRATEGY</div><p className="muted">{careerSprint.application_strategy || "—"}</p></div>
                </div>

                <div className="card" style={{ marginTop: 14 }}>
                  <div className="mini-label">WEEKLY ACTION QUEUE</div>
                  {safeArray(careerSprint.actions).map((item, index) => {
                    const actionId = item.id || `week-${careerSprint.week || sprintWeek}-action-${index}`;
                    const completed = !!completedSprintActions[actionId];
                    return (
                      <div className="saved-package-row" key={actionId} style={{ opacity: completed ? 0.62 : 1 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", width: "100%" }}>
                          <input type="checkbox" checked={completed} onChange={() => toggleSprintAction(actionId)} style={{ marginTop: 4 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                              <strong style={{ textDecoration: completed ? "line-through" : "none" }}>{item.action || "Weekly action"}</strong>
                              <Tag>{item.category || "Career"}</Tag>
                              <Tag type={String(item.priority || "Medium").toLowerCase()}>{item.priority || "Medium"}</Tag>
                            </div>
                            <span>{item.estimated_time || "Time estimate not specified"}</span>
                            <small style={{ display: "block", marginTop: 5 }}>Proof: {item.proof_of_completion || "Document what you completed."}</small>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="three-column" style={{ marginTop: 14 }}>
                  <div className="card"><div className="mini-label">SKILL PRACTICE</div><strong>{careerSprint.skill_practice?.topic || "—"}</strong><p className="muted">{careerSprint.skill_practice?.practice || "—"}</p><small>Proof: {careerSprint.skill_practice?.proof || "—"}</small></div>
                  <div className="card"><div className="mini-label">PROJECT MILESTONE</div><strong>{careerSprint.project_milestone?.milestone || "—"}</strong><p className="muted">{careerSprint.project_milestone?.deliverable || "—"}</p></div>
                  <div className="card"><div className="mini-label">INTERVIEW PRACTICE</div><strong>{careerSprint.interview_practice?.topic || "—"}</strong><ul className="list">{safeArray(careerSprint.interview_practice?.questions).map((question, index) => <li key={`${question}-${index}`}>{question}</li>)}</ul></div>
                </div>

                <div className="two-column" style={{ marginTop: 14 }}>
                  <div className="card"><div className="mini-label">END-OF-WEEK CHECK</div><ul className="list">{safeArray(careerSprint.end_of_week_check).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul><div className="mini-label" style={{ marginTop: 16 }}>SUCCESS DEFINITION</div><p className="muted">{careerSprint.success_definition || "—"}</p></div>
                  <div className="card"><div className="mini-label">AVOID THIS WEEK</div><ul className="list">{safeArray(careerSprint.avoid_this_week).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul><div className="mini-label" style={{ marginTop: 16 }}>COACH NOTE</div><p className="muted">{careerSprint.coach_note || "—"}</p></div>
                </div>

                <div className="card" style={{ marginTop: 14 }}><div className="mini-label">SPRINT PROGRESS</div><div className="big-highlight">{safeArray(careerSprint.actions).length ? Math.round((safeArray(careerSprint.actions).filter((item, index) => completedSprintActions[item.id || `week-${careerSprint.week || sprintWeek}-action-${index}`]).length / safeArray(careerSprint.actions).length) * 100) : 0}% complete</div><div className="button-row"><LoadingButton loading={loading.careerSprint} onClick={generateCareerSprint}>Regenerate Week {careerSprint.week ?? sprintWeek}</LoadingButton></div></div>
              </>
            )}
          </section>

          {/* =====================================================
              STEP 34 — CAREER EVIDENCE TRACKER
              ===================================================== */}
          <section className="section" id="career-evidence">
            <SectionHeader eyebrow="10 / CAREER EVIDENCE" title="Prove You Are Ready" description="Audit the evidence behind your cybersecurity skills, identify what is still unproven, and build the next proof before you apply." />
            <div className="card">
              <div className="two-column">
                <div><div className="mini-label">EVIDENCE AUDIT</div><div className="big-highlight">Skill → Evidence → Proof → Application</div><p className="muted">Separate what you know from what you can demonstrate. Planned work is never counted as completed evidence.</p></div>
                <div><div className="button-row"><LoadingButton loading={loading.careerEvidence} onClick={generateCareerEvidence} disabled={!profile || !jobs.length}>Audit My Career Evidence</LoadingButton></div><div className="muted" style={{ marginTop: 10 }}>Uses resume, jobs, applications, 90-day plan, sprint progress, and interview data.</div></div>
              </div>
            </div>
            {careerEvidence && <>
              <div className="stats-grid" style={{ marginTop: 14 }}>
                <div className="stat-card"><div className="stat-label">Evidence readiness</div><div className="stat-value">{careerEvidence.readiness_score ?? "—"}</div><div className="stat-sub">/ 100 proof strength</div></div>
                <div className="stat-card"><div className="stat-label">Evidence strength</div><div className="stat-value" style={{fontSize:24}}>{careerEvidence.evidence_strength || "—"}</div><div className="stat-sub">Current proof quality</div></div>
                <div className="stat-card"><div className="stat-label">Ready to apply</div><div className="stat-value" style={{fontSize:24}}>{careerEvidence.application_evidence?.ready_to_apply ? "YES" : "NOT YET"}</div><div className="stat-sub">Evidence-based recommendation</div></div>
                <div className="stat-card"><div className="stat-label">Weekly proof target</div><div className="stat-value" style={{fontSize:18}}>{careerEvidence.weekly_evidence_target || "—"}</div><div className="stat-sub">Build evidence every week</div></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="career-intel-hero"><div><div className="mini-label">CURRENT AUDIT</div><h2>{careerEvidence.headline || "Build stronger cybersecurity evidence."}</h2><p className="muted">{careerEvidence.evidence_summary || "—"}</p></div>{careerEvidence.next_best_proof && <div className="career-intel-score"><span>Next Best Proof</span><strong style={{fontSize:18}}>{careerEvidence.next_best_proof.artifact || "—"}</strong><small>{careerEvidence.next_best_proof.timeframe || "Next"}</small></div>}</div></div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">CURRENT PROOF</div>{safeArray(careerEvidence.current_proof).map((item,index)=><div className="list-item" key={index}><div><strong>{item.area || "Evidence area"}</strong><div className="muted">{item.evidence || "—"}</div></div><Tag type={String(item.strength||"").toLowerCase()}>{item.strength || "Review"}</Tag></div>)}</div>
                <div className="card"><div className="mini-label">EVIDENCE GAPS</div>{safeArray(careerEvidence.evidence_gaps).map((item,index)=><div className="list-item" key={index}><div><strong>{item.skill || "Skill gap"}</strong><div className="muted">{item.why_proof_is_missing || "—"}</div><div className="small-note">Best proof: {item.best_proof || "—"}</div></div><Tag type={String(item.priority||"").toLowerCase()}>{item.priority || "Review"}</Tag></div>)}</div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">PORTFOLIO PROOF BUILDER</div>{safeArray(careerEvidence.portfolio_proof).map((item,index)=>{ const key=`proof-${index}-${item.artifact||"artifact"}`; return <div className="list-item" key={key} style={{alignItems:"flex-start"}}><div style={{flex:1}}><strong>{item.artifact || "Proof artifact"}</strong><div className="muted">{item.type || "Project"} · proves {item.skill_proven || "target skill"} · {item.effort || "—"}</div><div className="small-note">Proof standard: {item.proof_standard || "Create a concrete, reviewable artifact."}</div><input className="input" style={{marginTop:8}} value={evidenceNotes[key]||""} onChange={(event)=>saveEvidenceNote(key,event.target.value)} placeholder="Add evidence link / note / completion detail..." /></div></div>; })}</div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">APPLICATION EVIDENCE</div><h3>{careerEvidence.application_evidence?.ready_to_apply ? "Apply — emphasize the proof you already have." : "Strengthen proof before relying on this skill."}</h3><div className="muted" style={{marginTop:8}}>Minimum proof: {careerEvidence.application_evidence?.minimum_proof_before_next_application || "—"}</div><div style={{marginTop:12}}><strong>Emphasize</strong>{safeArray(careerEvidence.application_evidence?.what_to_emphasize).map((x,i)=><div className="list-item" key={i}>{x}</div>)}</div><div style={{marginTop:12}}><strong>Do not claim</strong>{safeArray(careerEvidence.application_evidence?.what_not_to_claim).map((x,i)=><div className="list-item" key={i}>{x}</div>)}</div></div>
                <div className="card"><div className="mini-label">INTERVIEW EVIDENCE</div><div className="list-item"><strong>Strongest story area</strong><span>{careerEvidence.interview_evidence?.strongest_story_area || "—"}</span></div><div className="list-item"><strong>Weakest proof area</strong><span>{careerEvidence.interview_evidence?.weakest_proof_area || "—"}</span></div><div className="mini-label" style={{marginTop:16}}>NEXT PRACTICE</div><p className="muted">{careerEvidence.interview_evidence?.practice_prompt || "—"}</p></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">TOP EVIDENCE ACTIONS</div>{safeArray(careerEvidence.top_actions).map((item,index)=><div className="list-item" key={index}><div><strong>#{item.rank || index+1} {item.action || "Action"}</strong><div className="muted">Proof: {item.proof || "—"}</div></div><span className="small-note">{item.impact || "High-impact evidence"}</span></div>)}</div>
            </>}
          </section>

          {/* =====================================================
              STEP 35 — CYBERSECURITY PORTFOLIO BUILDER
              ===================================================== */}
          <section className="section" id="cybersecurity-portfolio">
            <SectionHeader eyebrow="11 / PORTFOLIO BUILDER" title="Build Proof, Not Just Skills" description="Turn your real skill gaps and evidence into cybersecurity projects that are useful for GitHub, your resume, and interviews." />
            <div className="card">
              <div className="two-column">
                <div><div className="mini-label">CAREER → PORTFOLIO</div><div className="big-highlight">Job Gap → Project → GitHub → Resume → Interview</div><p className="muted">Projects are proposed unless your existing evidence proves they are already completed. The builder prioritizes projects that close real cybersecurity job-market gaps.</p></div>
                <div><div className="button-row"><LoadingButton loading={loading.cybersecurityPortfolio} onClick={generateCybersecurityPortfolio} disabled={!profile || !jobs.length}>Build My Cybersecurity Portfolio</LoadingButton></div><div className="muted" style={{marginTop:10}}>Uses your resume, analyzed jobs, evidence audit, and 90-day plan.</div></div>
              </div>
            </div>
            {cybersecurityPortfolio && <>
              <div className="stats-grid" style={{marginTop:14}}>
                <div className="stat-card"><div className="stat-label">Portfolio readiness</div><div className="stat-value">{cybersecurityPortfolio.portfolio_readiness ?? "—"}</div><div className="stat-sub">/ 100</div></div>
                <div className="stat-card"><div className="stat-label">Best project</div><div className="stat-value" style={{fontSize:20}}>{cybersecurityPortfolio.best_project?.name || "—"}</div><div className="stat-sub">{cybersecurityPortfolio.best_project?.estimated_time || "—"}</div></div>
                <div className="stat-card"><div className="stat-label">Career value</div><div className="stat-value">{cybersecurityPortfolio.best_project?.career_value ?? "—"}</div><div className="stat-sub">Best project impact</div></div>
                <div className="stat-card"><div className="stat-label">Build actions</div><div className="stat-value">{safeArray(cybersecurityPortfolio.top_3_build_actions).length || 0}</div><div className="stat-sub">Immediate portfolio actions</div></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="career-intel-hero"><div><div className="mini-label">PORTFOLIO DIRECTION</div><h2>{cybersecurityPortfolio.portfolio_direction || "Build a portfolio around cybersecurity evidence."}</h2><p className="muted">{cybersecurityPortfolio.portfolio_summary || "—"}</p></div>{cybersecurityPortfolio.best_project && <div className="career-intel-score"><span>BEST PROJECT</span><strong style={{fontSize:18}}>{cybersecurityPortfolio.best_project.name || "—"}</strong><small>{cybersecurityPortfolio.best_project.difficulty || "—"} · {cybersecurityPortfolio.best_project.estimated_time || "—"}</small></div>}</div><p className="muted" style={{marginTop:12}}>{cybersecurityPortfolio.best_project?.why || "—"}</p></div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">EXISTING EVIDENCE TO FEATURE</div>{safeArray(cybersecurityPortfolio.existing_evidence_to_feature).map((item,index)=><div className="list-item" key={index}><div><strong>{item.evidence || "Evidence"}</strong><div className="muted">{item.why || "—"}</div></div><Tag type="strong">{item.where || "Portfolio"}</Tag></div>)}</div>
                <div className="card"><div className="mini-label">PORTFOLIO GAPS</div>{safeArray(cybersecurityPortfolio.portfolio_gaps).map((item,index)=><div className="list-item" key={index}><div><strong>{item.skill || "Skill"}</strong><div className="muted">{item.gap || "—"}</div><div className="small-note">Best artifact: {item.best_artifact || "—"}</div></div><Tag type={String(item.priority||"").toLowerCase()}>{item.priority || "Review"}</Tag></div>)}</div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">PROJECT BLUEPRINTS</div>{safeArray(cybersecurityPortfolio.project_blueprints).map((project,index)=><div className="card" key={index} style={{marginTop:10}}><div className="career-intel-hero"><div><h3>{project.name || "Cybersecurity project"}</h3><p className="muted">{project.problem || "—"}</p></div><Tag type="medium">{project.status || "Proposed"}</Tag></div><div className="small-note" style={{marginTop:8}}>Skills: {safeArray(project.skills_proven).join(" · ") || "—"}</div><div className="small-note">Stack: {safeArray(project.tech_stack).join(" · ") || "—"} · Time: {project.estimated_time || "—"}</div><div className="mini-label" style={{marginTop:14}}>MILESTONES</div>{safeArray(project.milestones).map((m,i)=><div className="list-item" key={i}><strong>Step {m.step ?? i+1}</strong><span>{m.task || "—"}<br/><span className="small-note">Deliverable: {m.deliverable || "—"}</span></span></div>)}<div className="two-column" style={{marginTop:10}}><div><div className="mini-label">GITHUB STRUCTURE</div><ul className="list">{safeArray(project.github_structure).map((x,i)=><li key={i}>{x}</li>)}</ul></div><div><div className="mini-label">PROOF STANDARD</div><p className="muted">{project.proof_standard || "—"}</p><div className="mini-label" style={{marginTop:10}}>RESUME BULLET</div><p className="muted">{project.resume_bullet || "—"}</p><div className="mini-label" style={{marginTop:10}}>INTERVIEW STORY</div><p className="muted">{project.interview_story || "—"}</p></div></div></div>)}</div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">GITHUB README OUTLINE</div><ol className="list">{safeArray(cybersecurityPortfolio.github_readme_outline).map((x,i)=><li key={i}>{x}</li>)}</ol></div>
                <div className="card"><div className="mini-label">PORTFOLIO HOMEPAGE</div><ol className="list">{safeArray(cybersecurityPortfolio.portfolio_homepage_sections).map((x,i)=><li key={i}>{x}</li>)}</ol></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">TOP 3 BUILD ACTIONS</div>{safeArray(cybersecurityPortfolio.top_3_build_actions).map((item,index)=><div className="list-item" key={index}><div><strong>#{item.rank || index+1} {item.action || "Build action"}</strong><div className="muted">Deliverable: {item.deliverable || "—"}</div></div><span className="small-note">{item.timeframe || "Next"}</span></div>)}<div className="mini-label" style={{marginTop:16}}>DO NOT BUILD NOW</div><ul className="list">{safeArray(cybersecurityPortfolio.do_not_build).map((x,i)=><li key={i}>{x}</li>)}</ul></div>
            </>}
          </section>

          {/* =====================================================
              STEP 36 — PORTFOLIO QUALITY AUDIT
              ===================================================== */}
          <section className="section" id="portfolio-audit">
            <SectionHeader eyebrow="12 / PORTFOLIO AUDIT" title="Would a Cybersecurity Recruiter Believe This?" description="Audit your portfolio against real job-market requirements and identify the proof that needs to be stronger before you apply." />
            <div className="card">
              <div className="two-column">
                <div><div className="mini-label">PORTFOLIO → HIRING READINESS</div><div className="big-highlight">Project → Proof → Resume → Interview</div><p className="muted">This audit reviews technical depth, cybersecurity relevance, evidence quality, resume value, and interview value. It does not treat proposed projects as completed experience.</p></div>
                <div><div className="button-row"><LoadingButton loading={loading.portfolioQualityAudit} onClick={generatePortfolioQualityAudit} disabled={!cybersecurityPortfolio}>Audit My Portfolio</LoadingButton></div><div className="muted" style={{marginTop:10}}>Build the Portfolio Builder plan first, then audit its quality against your job market.</div></div>
              </div>
            </div>
            {portfolioQualityAudit && <>
              <div className="stats-grid" style={{marginTop:14}}>
                <div className="stat-card"><div className="stat-label">Portfolio score</div><div className="stat-value">{portfolioQualityAudit.portfolio_score ?? "—"}</div><div className="stat-sub">/ 100</div></div>
                <div className="stat-card"><div className="stat-label">Hiring readiness</div><div className="stat-value" style={{fontSize:18}}>{portfolioQualityAudit.hiring_readiness || "—"}</div><div className="stat-sub">Recruiter perspective</div></div>
                <div className="stat-card"><div className="stat-label">Projects audited</div><div className="stat-value">{safeArray(portfolioQualityAudit.project_audits).length}</div><div className="stat-sub">Current portfolio plan</div></div>
                <div className="stat-card"><div className="stat-label">Top fixes</div><div className="stat-value">{safeArray(portfolioQualityAudit.top_portfolio_fixes).length}</div><div className="stat-sub">Highest-impact changes</div></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="career-intel-hero"><div><div className="mini-label">OVERALL VERDICT</div><h2>{portfolioQualityAudit.overall_verdict || "—"}</h2><p className="muted">{portfolioQualityAudit.portfolio_strategy || "—"}</p></div>{portfolioQualityAudit.next_best_artifact && <div className="career-intel-score"><span>NEXT ARTIFACT</span><strong style={{fontSize:18}}>{portfolioQualityAudit.next_best_artifact.name || "—"}</strong><small>{portfolioQualityAudit.next_best_artifact.estimated_time || "—"}</small></div>}</div></div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">STRONGEST PROOF</div><h3>{portfolioQualityAudit.strongest_proof?.artifact || "—"}</h3><p className="muted">{portfolioQualityAudit.strongest_proof?.why || "—"}</p><div className="small-note">Skills: {safeArray(portfolioQualityAudit.strongest_proof?.skills_proven).join(" · ") || "—"}</div></div>
                <div className="card"><div className="mini-label">WEAKEST PROOF</div><h3>{portfolioQualityAudit.weakest_proof?.artifact || "—"}</h3><p className="muted">{portfolioQualityAudit.weakest_proof?.problem || "—"}</p><div className="small-note">Risk: {portfolioQualityAudit.weakest_proof?.risk || "—"}</div><div className="small-note">Fix: {portfolioQualityAudit.weakest_proof?.fix || "—"}</div></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">PROJECT AUDITS</div>{safeArray(portfolioQualityAudit.project_audits).map((project,index)=><div className="card" key={index} style={{marginTop:10}}><div className="career-intel-hero"><div><h3>{project.project || "Project"}</h3><div className="small-note">{project.status || "Unknown"} · {project.keep_or_change || "Review"}</div></div><Tag type={String(project.keep_or_change||"").toLowerCase()}>{project.keep_or_change || "Review"}</Tag></div><div className="stats-grid" style={{marginTop:10}}><div className="stat-card"><div className="stat-label">Technical depth</div><div className="stat-value">{project.technical_depth ?? "—"}</div></div><div className="stat-card"><div className="stat-label">Cyber relevance</div><div className="stat-value">{project.cybersecurity_relevance ?? "—"}</div></div><div className="stat-card"><div className="stat-label">Evidence</div><div className="stat-value">{project.evidence_quality ?? "—"}</div></div><div className="stat-card"><div className="stat-label">Interview value</div><div className="stat-value">{project.interview_value ?? "—"}</div></div></div><div className="two-column" style={{marginTop:10}}><div><div className="mini-label">WHAT IS GOOD</div><p className="muted">{project.what_is_good || "—"}</p><div className="mini-label">WHAT IS MISSING</div><p className="muted">{project.what_is_missing || "—"}</p></div><div><div className="mini-label">NEXT IMPROVEMENT</div><p className="muted">{project.next_improvement || "—"}</p></div></div></div>)}</div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">SKILL → PROOF MATRIX</div>{safeArray(portfolioQualityAudit.skill_proof_matrix).map((item,index)=><div className="list-item" key={index}><div><strong>{item.skill || "Skill"}</strong><div className="muted">Current proof: {item.current_proof || "—"}</div><div className="small-note">Best evidence: {item.best_evidence || "—"}</div></div><div><Tag type={String(item.proof_strength||"").toLowerCase()}>{item.proof_strength || "—"}</Tag><div className="small-note">Demand: {item.job_demand || "—"}</div></div></div>)}</div>
              <div className="two-column" style={{marginTop:14}}><div className="card"><div className="mini-label">TOP PORTFOLIO FIXES</div>{safeArray(portfolioQualityAudit.top_portfolio_fixes).map((item,index)=><div className="list-item" key={index}><div><strong>#{item.rank || index+1} {item.fix || "Fix"}</strong><div className="muted">{item.deliverable || "—"}</div></div><span className="small-note">{item.timeframe || "Next"}<br/>{item.impact || "High impact"}</span></div>)}</div><div className="card"><div className="mini-label">NEXT BEST ARTIFACT</div><h3>{portfolioQualityAudit.next_best_artifact?.name || "—"}</h3><p className="muted">{portfolioQualityAudit.next_best_artifact?.purpose || "—"}</p><div className="small-note">Skills: {safeArray(portfolioQualityAudit.next_best_artifact?.skills_proven).join(" · ") || "—"}</div><ul className="list">{safeArray(portfolioQualityAudit.next_best_artifact?.deliverables).map((x,i)=><li key={i}>{x}</li>)}</ul></div></div>
              <div className="two-column" style={{marginTop:14}}><div className="card"><div className="mini-label">GITHUB QUALITY CHECKLIST</div><ul className="list">{safeArray(portfolioQualityAudit.github_quality_checklist).map((x,i)=><li key={i}>{x}</li>)}</ul></div><div className="card"><div className="mini-label">INTERVIEW DEMO CHECKLIST</div><ul className="list">{safeArray(portfolioQualityAudit.interview_demo_checklist).map((x,i)=><li key={i}>{x}</li>)}</ul></div></div>
              <div className="two-column" style={{marginTop:14}}><div className="card"><div className="mini-label">RESUME / PORTFOLIO CHANGES</div><ul className="list">{safeArray(portfolioQualityAudit.resume_portfolio_changes).map((x,i)=><li key={i}>{x}</li>)}</ul></div><div className="card"><div className="mini-label">DO NOT ADD</div><ul className="list">{safeArray(portfolioQualityAudit.do_not_add).map((x,i)=><li key={i}>{x}</li>)}</ul></div></div>
            </>}
          </section>


          {/* =====================================================
              STEP 37 — APPLICATION READINESS GATE
              ===================================================== */}
          <section className="section" id="application-readiness">
            <SectionHeader eyebrow="13 / APPLICATION READINESS" title="Should You Apply Right Now?" description="Run one final cybersecurity-specific readiness check before spending time on an application. The gate separates real blockers from trainable gaps." />
            <div className="card">
              <div className="two-column">
                <div>
                  <div className="mini-label">FINAL APPLICATION GATE</div>
                  <div className="big-highlight">Job → Fit → Evidence → Interview → Apply</div>
                  <p className="muted">Uses your selected job, resume, job market, career evidence, portfolio audit, interview performance, and application history. A planned skill is never treated as completed evidence.</p>
                  {selectedJob && <div className="small-note" style={{marginTop:10}}>Selected: <strong>{selectedJob.title || "Job"}</strong> · {selectedJob.company || "Company"}</div>}
                </div>
                <div>
                  <div className="button-row"><LoadingButton loading={loading.applicationReadinessGate} onClick={generateApplicationReadinessGate} disabled={!profile || !jobs.length}>Run Application Readiness Gate</LoadingButton></div>
                  <div className="muted" style={{marginTop:10}}>Select a job in Job Intelligence first. If none is selected, the highest-ranked analyzed job is used.</div>
                </div>
              </div>
            </div>
            {applicationReadinessGate && <>
              <div className="stats-grid" style={{marginTop:14}}>
                <div className="stat-card"><div className="stat-label">Decision</div><div className="stat-value" style={{fontSize:18}}>{applicationReadinessGate.decision || "—"}</div><div className="stat-sub">Final application gate</div></div>
                <div className="stat-card"><div className="stat-label">Readiness</div><div className="stat-value">{applicationReadinessGate.readiness_score ?? "—"}</div><div className="stat-sub">/ 100</div></div>
                <div className="stat-card"><div className="stat-label">Confidence</div><div className="stat-value" style={{fontSize:22}}>{applicationReadinessGate.confidence || "—"}</div><div className="stat-sub">AI assessment</div></div>
                <div className="stat-card"><div className="stat-label">Interview risk</div><div className="stat-value" style={{fontSize:22}}>{applicationReadinessGate.interview_risk?.risk_level || "—"}</div><div className="stat-sub">Likely challenge level</div></div>
              </div>
              <div className="card" style={{marginTop:14}}>
                <div className="career-intel-hero"><div><div className="mini-label">FINAL VERDICT</div><h2>{applicationReadinessGate.one_line_verdict || "—"}</h2><p className="muted">{applicationReadinessGate.why_now_or_not || "—"}</p></div><div className="career-intel-score"><span>DECISION</span><strong style={{fontSize:18}}>{applicationReadinessGate.decision || "—"}</strong><small>{applicationReadinessGate.final_recommendation || "—"}</small></div></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">READINESS SCORECARD</div><div className="stats-grid" style={{marginTop:10}}>{Object.entries(applicationReadinessGate.scorecard || {}).map(([key,value])=><div className="stat-card" key={key}><div className="stat-label">{key.replaceAll("_"," ")}</div><div className="stat-value">{value ?? "—"}</div><div className="stat-sub">/ 100</div></div>)}</div></div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">MUST-HAVE CHECK</div>{safeArray(applicationReadinessGate.must_have_check).map((item,index)=><div className="list-item" key={index}><div><strong>{item.requirement || "Requirement"}</strong><div className="muted">Evidence: {item.candidate_evidence || "No evidence supplied"}</div><div className="small-note">Action: {item.action || "—"}</div></div><Tag type={String(item.status || "").toLowerCase()}>{item.status || "Unknown"}{item.is_blocker ? " · BLOCKER" : ""}</Tag></div>)}</div>
                <div className="card"><div className="mini-label">STRONGEST MATCHES</div><ul className="list">{safeArray(applicationReadinessGate.strongest_matches).map((x,i)=><li key={i}>{x}</li>)}</ul></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">CRITICAL GAPS</div>{safeArray(applicationReadinessGate.critical_gaps).map((item,index)=><div className="list-item" key={index}><div><strong>{item.skill || "Gap"}</strong><div className="muted">{item.why_it_matters || "—"}</div><div className="small-note">Minimum fix: {item.minimum_fix || "—"} · Effort: {item.estimated_effort || "—"}</div></div><Tag type={String(item.severity || "").toLowerCase()}>{item.severity || "Review"}</Tag></div>)}</div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">RESUME POSITIONING</div><h3>{applicationReadinessGate.resume_positioning?.headline_focus || "—"}</h3><div className="small-note">Emphasize</div><ul className="list">{safeArray(applicationReadinessGate.resume_positioning?.skills_to_emphasize).map((x,i)=><li key={i}>{x}</li>)}</ul><div className="small-note">Do not claim</div><ul className="list">{safeArray(applicationReadinessGate.resume_positioning?.do_not_claim).map((x,i)=><li key={i}>{x}</li>)}</ul></div>
                <div className="card"><div className="mini-label">INTERVIEW RISK</div><h3>{applicationReadinessGate.interview_risk?.risk_level || "—"}</h3><p className="muted">{applicationReadinessGate.interview_risk?.likely_challenge || "—"}</p><div className="small-note">Prepare: {applicationReadinessGate.interview_risk?.prepare_this || "—"}</div></div>
              </div>
              <div className="two-column" style={{marginTop:14}}><div className="card"><div className="mini-label">IF APPLYING NOW</div><ul className="list">{safeArray(applicationReadinessGate.if_applying_now).map((x,i)=><li key={i}>{x}</li>)}</ul></div><div className="card"><div className="mini-label">IF WAITING</div><ul className="list">{safeArray(applicationReadinessGate.if_waiting).map((x,i)=><li key={i}>{x}</li>)}</ul></div></div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">TOP APPLICATION ACTIONS</div>{safeArray(applicationReadinessGate.application_actions).map((item,index)=><div className="list-item" key={index}><div><strong>#{item.rank || index+1} {item.action || "Action"}</strong><div className="muted">{item.reason || "—"}</div></div><span className="small-note">{item.timeframe || "Next"}</span></div>)}</div>
            </>}
          </section>

          {/* =====================================================
              STEP 38 — APPLICATION FOLLOW-UP COPILOT
              ===================================================== */}
          <section className="section" id="application-follow-up">
            <SectionHeader eyebrow="14 / APPLICATION FOLLOW-UP" title="Turn Applications Into Conversations" description="Generate realistic recruiter outreach, follow-up timing, networking approaches, and interview thank-you messages without inventing contacts or experience." />
            <div className="card">
              <div className="two-column">
                <div>
                  <div className="mini-label">POST-APPLICATION COPILOT</div>
                  <div className="big-highlight">Apply → Follow Up → Network → Interview → Follow Through</div>
                  <p className="muted">Uses your selected job, application status, readiness gate, application package, interview history, and actual resume evidence. It will not invent a recruiter name or pretend you already contacted someone.</p>
                  {selectedJob && <div className="small-note" style={{marginTop:10}}>Selected: <strong>{selectedJob.title || "Job"}</strong> · {selectedJob.company || "Company"}</div>}
                </div>
                <div>
                  <div className="button-row"><LoadingButton loading={loading.applicationFollowUpCopilot} onClick={generateApplicationFollowUpCopilot} disabled={!profile || !jobs.length}>Build Follow-up Strategy</LoadingButton></div>
                  <div className="muted" style={{marginTop:10}}>Run after the Application Readiness Gate or after saving an application to the tracker.</div>
                </div>
              </div>
            </div>
            {applicationFollowUpCopilot && <>
              <div className="stats-grid" style={{marginTop:14}}>
                <div className="stat-card"><div className="stat-label">Priority</div><div className="stat-value" style={{fontSize:22}}>{applicationFollowUpCopilot.priority || "—"}</div><div className="stat-sub">Follow-up urgency</div></div>
                <div className="stat-card"><div className="stat-label">Channel</div><div className="stat-value" style={{fontSize:18}}>{applicationFollowUpCopilot.recommended_channel || "—"}</div><div className="stat-sub">Best current route</div></div>
                <div className="stat-card"><div className="stat-label">Timing</div><div className="stat-value" style={{fontSize:18}}>{applicationFollowUpCopilot.recommended_timing || "—"}</div><div className="stat-sub">Next outreach window</div></div>
                <div className="stat-card"><div className="stat-label">Next action</div><div className="stat-value" style={{fontSize:18}}>{applicationFollowUpCopilot.next_best_action?.timing || "—"}</div><div className="stat-sub">Recommended move</div></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="career-intel-hero"><div><div className="mini-label">FOLLOW-UP STRATEGY</div><h2>{applicationFollowUpCopilot.follow_up_strategy || "—"}</h2><p className="muted">{applicationFollowUpCopilot.follow_up_summary || "—"}</p></div><div className="career-intel-score"><span>NEXT BEST ACTION</span><strong style={{fontSize:18}}>{applicationFollowUpCopilot.next_best_action?.action || "—"}</strong><small>{applicationFollowUpCopilot.next_best_action?.why || "—"}</small></div></div></div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">RECRUITER EMAIL</div><h3>{applicationFollowUpCopilot.recruiter_message?.subject || "No email subject"}</h3><p className="muted" style={{whiteSpace:"pre-wrap"}}>{applicationFollowUpCopilot.recruiter_message?.message || "—"}</p><div className="small-note">{applicationFollowUpCopilot.contact_assumption || "Use only a real contact supplied by you."}</div></div>
                <div className="card"><div className="mini-label">LINKEDIN MESSAGE</div><p className="muted" style={{whiteSpace:"pre-wrap"}}>{applicationFollowUpCopilot.linkedin_message || "—"}</p></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">FOLLOW-UP TIMELINE</div>{safeArray(applicationFollowUpCopilot.application_follow_up).map((item,index)=><div className="list-item" key={index}><div><strong>{item.timing || `Step ${index+1}`} · {item.trigger || "Trigger"}</strong><div className="muted">{item.action || "—"}</div><div className="small-note">{item.message || "—"}</div></div></div>)}</div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">INTERVIEW THANK-YOU</div><h3>{applicationFollowUpCopilot.interview_thank_you?.when_to_send || "—"}</h3><div className="small-note">{applicationFollowUpCopilot.interview_thank_you?.subject || "—"}</div><p className="muted" style={{whiteSpace:"pre-wrap"}}>{applicationFollowUpCopilot.interview_thank_you?.message || "—"}</p></div>
                <div className="card"><div className="mini-label">POST-INTERVIEW FOLLOW-UP</div><h3>{applicationFollowUpCopilot.post_interview_follow_up?.timing || "—"}</h3><p className="muted" style={{whiteSpace:"pre-wrap"}}>{applicationFollowUpCopilot.post_interview_follow_up?.message || "—"}</p><div className="small-note">Reference: {safeArray(applicationFollowUpCopilot.post_interview_follow_up?.what_to_reference).join(" · ") || "—"}</div></div>
              </div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">NETWORKING TARGETS</div>{safeArray(applicationFollowUpCopilot.networking_targets).map((item,index)=><div className="list-item" key={index}><div><strong>{item.target_type || "Target"}</strong><div className="muted">{item.why || "—"}</div><div className="small-note">Approach: {item.approach || "—"}</div></div></div>)}</div>
                <div className="card"><div className="mini-label">QUESTIONS TO ASK</div><ul className="list">{safeArray(applicationFollowUpCopilot.questions_to_ask).map((x,i)=><li key={i}>{x}</li>)}</ul><div className="mini-label" style={{marginTop:16}}>PERSONALIZATION POINTS</div><ul className="list">{safeArray(applicationFollowUpCopilot.personalization_points).map((x,i)=><li key={i}>{x}</li>)}</ul></div>
              </div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">TRACKER UPDATES</div>{safeArray(applicationFollowUpCopilot.tracking_updates).map((item,index)=><div className="list-item" key={index}><div><strong>{item.field || "Field"}</strong><div className="muted">{item.value || "—"}</div></div><span className="small-note">{item.reason || "—"}</span></div>)}</div>
                <div className="card"><div className="mini-label">DO NOT SEND</div><ul className="list">{safeArray(applicationFollowUpCopilot.do_not_send).map((x,i)=><li key={i}>{x}</li>)}</ul></div>
              </div>
            </>}
          </section>



          {/* =====================================================
              STEP 39 — CAREER OUTCOME INTELLIGENCE
              ===================================================== */}
          <section className="section" id="career-outcomes">
            <SectionHeader eyebrow="15 / CAREER OUTCOME INTELLIGENCE" title="Learn From Your Actual Application Results" description="Turn application, interview, and job-market outcomes into evidence-based changes to your cybersecurity job-search strategy." />
            <div className="card">
              <div className="career-intel-hero">
                <div>
                  <div className="mini-label">FEEDBACK LOOP</div>
                  <h2>Application → Outcome → Strategy Update</h2>
                  <p className="muted">CyberPath AI compares what you targeted with what actually happened. It does not invent patterns when the sample is too small.</p>
                </div>
                <LoadingButton loading={loading.careerOutcomeIntelligence} onClick={generateCareerOutcomeIntelligence} disabled={!profile || !targetRole || !applications.length}>Analyze My Outcomes</LoadingButton>
              </div>
              <div className="small-note" style={{marginTop:12}}>Best used after several saved/applied jobs, interviews, or a meaningful change in your target strategy.</div>
            </div>
            {careerOutcomeIntelligence && <>
              <div className="stats-grid" style={{marginTop:14}}>
                <div className="stat-card"><div className="stat-label">Sample</div><div className="stat-value">{careerOutcomeIntelligence.data_quality?.sample_size ?? 0}</div><div className="stat-sub">Tracked applications</div></div>
                <div className="stat-card"><div className="stat-label">Applied → Interview</div><div className="stat-value">{careerOutcomeIntelligence.conversion_funnel?.application_to_interview_rate ?? 0}%</div><div className="stat-sub">Observed conversion</div></div>
                <div className="stat-card"><div className="stat-label">Interview → Offer</div><div className="stat-value">{careerOutcomeIntelligence.conversion_funnel?.interview_to_offer_rate ?? 0}%</div><div className="stat-sub">Observed conversion</div></div>
                <div className="stat-card"><div className="stat-label">Confidence</div><div className="stat-value" style={{fontSize:20}}>{careerOutcomeIntelligence.data_quality?.confidence || "—"}</div><div className="stat-sub">Pattern reliability</div></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">EXECUTIVE RECOMMENDATION</div><h2>{careerOutcomeIntelligence.executive_recommendation || "—"}</h2><p className="muted">{careerOutcomeIntelligence.outcome_summary || "—"}</p>{safeArray(careerOutcomeIntelligence.data_quality?.limitations).length > 0 && <div className="small-note">Limitations: {safeArray(careerOutcomeIntelligence.data_quality?.limitations).join(" · ")}</div>}</div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">WHAT IS WORKING</div>{safeArray(careerOutcomeIntelligence.what_is_working).map((item,index)=><div className="list-item" key={index}><div><strong>{item.signal || "Signal"}</strong><div className="muted">{item.evidence || "—"}</div></div><span className="small-note">{item.confidence || "—"}</span></div>)}</div>
                <div className="card"><div className="mini-label">WHAT IS NOT WORKING</div>{safeArray(careerOutcomeIntelligence.what_is_not_working).map((item,index)=><div className="list-item" key={index}><div><strong>{item.signal || "Signal"}</strong><div className="muted">{item.evidence || "—"}</div><div className="small-note">Likely cause: {item.likely_cause || "—"}</div></div><span className="small-note">{item.confidence || "—"}</span></div>)}</div>
              </div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">BEST TARGETING PATTERN</div><h3>{careerOutcomeIntelligence.best_targeting_pattern?.reason || "—"}</h3><p className="muted">Roles: {safeArray(careerOutcomeIntelligence.best_targeting_pattern?.roles).join(" · ") || "—"}</p><p className="muted">Job types: {safeArray(careerOutcomeIntelligence.best_targeting_pattern?.job_types).join(" · ") || "—"}</p><p className="muted">Cyber focus: {safeArray(careerOutcomeIntelligence.best_targeting_pattern?.cybersecurity_focus).join(" · ") || "—"}</p><div className="small-note">Location pattern: {careerOutcomeIntelligence.best_targeting_pattern?.location_pattern || "—"}</div></div>
                <div className="card"><div className="mini-label">NEXT BEST JOB PROFILE</div><h3>{careerOutcomeIntelligence.next_best_job_profile?.title_pattern || "—"}</h3><p className="muted">{careerOutcomeIntelligence.next_best_job_profile?.reason || "—"}</p><div className="small-note">Minimum Fit: {careerOutcomeIntelligence.next_best_job_profile?.minimum_fit_score ?? "—"} · Cyber Relevance: {careerOutcomeIntelligence.next_best_job_profile?.minimum_cybersecurity_relevance ?? "—"}</div></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">FIT SCORE CALIBRATION</div><p className="muted">{careerOutcomeIntelligence.fit_score_calibration?.interpretation || "—"}</p><div className="two-column"><div><strong>Overestimating risk</strong><p className="small-note">{careerOutcomeIntelligence.fit_score_calibration?.overestimating_risk || "—"}</p></div><div><strong>Underestimating risk</strong><p className="small-note">{careerOutcomeIntelligence.fit_score_calibration?.underestimating_risk || "—"}</p></div></div><div className="small-note" style={{marginTop:10}}>Recommended rule: {careerOutcomeIntelligence.fit_score_calibration?.recommended_rule || "—"}</div></div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">SKILL SIGNALS</div>{safeArray(careerOutcomeIntelligence.skill_signals).map((item,index)=><div className="list-item" key={index}><div><strong>{item.skill || "Skill"}</strong><div className="muted">Demand: {item.job_demand || "—"}</div><div className="small-note">Candidate evidence: {item.candidate_evidence || "—"}</div><div className="small-note">Outcome signal: {item.outcome_signal || "—"}</div></div><span className="small-note">Action: {item.action || "—"}</span></div>)}</div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">INTERVIEW SIGNAL</div><h3>Strength</h3><p className="muted">{careerOutcomeIntelligence.interview_signal?.strength || "—"}</p><h3>Weakness</h3><p className="muted">{careerOutcomeIntelligence.interview_signal?.weakness || "—"}</p><div className="small-note">Evidence: {careerOutcomeIntelligence.interview_signal?.evidence || "—"}</div><div className="small-note">Next practice: {careerOutcomeIntelligence.interview_signal?.next_practice || "—"}</div></div>
                <div className="card"><div className="mini-label">APPLICATION BEHAVIOR</div><div className="stat-value">{careerOutcomeIntelligence.application_behavior?.weekly_target_recommendation ?? "—"}</div><div className="stat-sub">Recommended applications / week</div><p className="muted">{careerOutcomeIntelligence.application_behavior?.timing_advice || "—"}</p><div className="small-note">Priority rule: {careerOutcomeIntelligence.application_behavior?.priority_rule || "—"}</div><div className="small-note">Follow-up rule: {careerOutcomeIntelligence.application_behavior?.follow_up_rule || "—"}</div></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">STRATEGY CHANGES</div>{safeArray(careerOutcomeIntelligence.strategy_changes).map((item,index)=><div className="list-item" key={index}><div><strong>#{item.rank ?? index+1} · {item.change || "Change"}</strong><div className="muted">{item.why || "—"}</div><div className="small-note">Expected impact: {item.expected_impact || "—"} · {item.timeframe || "—"}</div></div></div>)}</div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">NEXT BEST SKILL</div><h2>{careerOutcomeIntelligence.next_best_skill?.skill || "—"}</h2><p className="muted">{careerOutcomeIntelligence.next_best_skill?.why || "—"}</p><div className="small-note">Proof: {careerOutcomeIntelligence.next_best_skill?.how_to_prove_it || "—"}</div></div>
                <div className="card"><div className="mini-label">30-DAY EXPERIMENT</div>{safeArray(careerOutcomeIntelligence["30_day_experiment"]).map((item,index)=><div className="list-item" key={index}><div><strong>Week {item.week ?? index+1}</strong><div className="muted">{item.action || "—"}</div></div><span className="small-note">Metric: {item.metric || "—"}</span></div>)}</div>
              </div>
              <div className="two-column" style={{marginTop:14}}>
                <div className="card"><div className="mini-label">CONTINUE DOING</div><ul className="list">{safeArray(careerOutcomeIntelligence.continue_doing).map((x,i)=><li key={i}>{x}</li>)}</ul></div>
                <div className="card"><div className="mini-label">STOP DOING</div><ul className="list">{safeArray(careerOutcomeIntelligence.stop_doing).map((x,i)=><li key={i}>{x}</li>)}</ul></div>
              </div>
              <div className="card" style={{marginTop:14}}><div className="mini-label">MEASUREMENT PLAN</div>{safeArray(careerOutcomeIntelligence.measurement_plan).map((item,index)=><div className="list-item" key={index}><div><strong>{item.metric || "Metric"}</strong><div className="muted">Target: {item.target || "—"}</div></div><span className="small-note">Review: {item.review_frequency || "—"}</span></div>)}</div>
            </>}
          </section>

          {/* =====================================================
              STEP 19 — NICE CYBERSECURITY SKILL MAPPING
              ===================================================== */}

          <section
            className="section"
            id="nice"
          >
            <SectionHeader
              eyebrow="05 / NICE SKILL MAPPING"
              title="Cybersecurity Capability Map"
              description="AI-generated mapping of your current cybersecurity capabilities to NICE-aligned work roles and skills."
            />

            <div className="card">
              <div className="nice-disclaimer">
                <strong>NICE-aligned, not an official NIST assessment.</strong>
                <span>
                  CyberPath AI uses recognizable NICE terminology to
                  organize your career direction, skills, and gaps.
                </span>
              </div>

              {!niceMapping ? (
                <div className="nice-empty">
                  <div>
                    <div className="mini-label">
                      READY TO MAP
                    </div>

                    <div className="big-highlight">
                      Resume → NICE Work Role → Skill Gap
                    </div>

                    <p className="muted">
                      Analyze your resume, target role, and current
                      job-market results together. The system will
                      identify your strongest NICE-aligned work roles,
                      current skills, and highest-impact gaps.
                    </p>
                  </div>

                  <LoadingButton
                    loading={loading.nice}
                    onClick={
                      generateNiceSkillMapping
                    }
                    disabled={
                      !profile.trim() ||
                      !jobs.length
                    }
                  >
                    Analyze NICE Skill Map
                  </LoadingButton>
                </div>
              ) : (
                <>
                  <div className="nice-summary-grid">
                    <div className="nice-summary-card">
                      <div className="mini-label">
                        BEST WORK ROLE
                      </div>
                      <div className="nice-summary-value">
                        {niceMapping.nice_summary
                          ?.best_work_role ||
                          niceMapping
                            .recommended_work_role ||
                          "—"}
                      </div>
                    </div>

                    <div className="nice-summary-card">
                      <div className="mini-label">
                        WORK ROLE MATCH
                      </div>
                      <div className="nice-summary-score">
                        {Math.round(
                          Number(
                            niceMapping.nice_summary
                              ?.work_role_match || 0
                          )
                        )}
                        %
                      </div>
                    </div>

                    <div className="nice-summary-card">
                      <div className="mini-label">
                        OVERALL SKILL MATCH
                      </div>
                      <div className="nice-summary-score">
                        {Math.round(
                          Number(
                            niceMapping.nice_summary
                              ?.overall_skill_match || 0
                          )
                        )}
                        %
                      </div>
                    </div>
                  </div>

                  <p className="muted">
                    {niceMapping.nice_summary
                      ?.summary ||
                      "Your NICE-aligned career mapping is ready."}
                  </p>

                  <div className="nice-count-grid">
                    <div className="nice-count strong">
                      <span>Strong</span>
                      <strong>{niceStrongCount}</strong>
                    </div>

                    <div className="nice-count partial">
                      <span>Partial</span>
                      <strong>{nicePartialCount}</strong>
                    </div>

                    <div className="nice-count gap">
                      <span>Gap</span>
                      <strong>{niceGapCount}</strong>
                    </div>
                  </div>
                </>
              )}
            </div>

            {niceMapping && (
              <>
                <div
                  className="dashboard-grid"
                  style={{ marginTop: 14 }}
                >
                  <div className="card intelligence-card">
                    <div className="mini-label">
                      RECOMMENDED WORK ROLE
                    </div>

                    <div className="big-highlight">
                      {niceMapping
                        .recommended_work_role ||
                        niceMapping.nice_summary
                          ?.best_work_role ||
                        "—"}
                    </div>

                    <p className="muted">
                      {niceMapping.career_direction ||
                        "Use this role as a direction for your next cybersecurity applications and learning plan."}
                    </p>
                  </div>

                  <div className="card intelligence-card">
                    <div className="mini-label">
                      NICE-ALIGNED NEXT SKILL
                    </div>

                    <div className="big-highlight">
                      {niceMapping
                        .recommended_next_skill
                        ?.skill ||
                        niceTopGap?.skill ||
                        "—"}
                    </div>

                    <p className="muted">
                      {niceMapping
                        .recommended_next_skill
                        ?.reason ||
                        niceTopGap?.why_it_matters ||
                        "No next-skill recommendation was returned."}
                    </p>

                    <div className="callout">
                      <strong>
                        Career Impact
                      </strong>

                      <p className="muted">
                        {niceMapping
                          .recommended_next_skill
                          ?.career_impact ||
                          niceTopGap?.recommended_action ||
                          "Build evidence for this skill through a project, lab, or relevant coursework."}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="two-column"
                  style={{ marginTop: 14 }}
                >
                  {safeArray(
                    niceMapping.work_roles
                  ).map((workRole, index) => (
                    <div
                      className="card"
                      key={`${workRole.role || "role"}-${index}`}
                    >
                      <div className="nice-role-header">
                        <div>
                          <div className="mini-label">
                            NICE-ALIGNED WORK ROLE
                          </div>
                          <h3 className="nice-role-title">
                            {workRole.role ||
                              "Cybersecurity Work Role"}
                          </h3>
                        </div>

                        <div
                          className={scoreClass(
                            workRole.match_score
                          )}
                        >
                          {Math.round(
                            Number(
                              workRole.match_score ||
                                0
                            )
                          )}
                          %
                        </div>
                      </div>

                      <p className="muted">
                        {workRole.reason ||
                          "No role-match explanation returned."}
                      </p>

                      <div className="skill-list">
                        {safeArray(
                          workRole.skills
                        ).map(
                          (skill, skillIndex) => (
                            <div
                              className="nice-skill-row"
                              key={`${skill.skill || "skill"}-${skillIndex}`}
                            >
                              <div className="nice-skill-main">
                                <strong>
                                  {skill.skill ||
                                    "Cybersecurity Skill"}
                                </strong>

                                <div className="muted">
                                  {skill.nice_category ||
                                    "NICE-aligned category"}
                                </div>

                                {skill.evidence && (
                                  <div className="nice-evidence">
                                    <span>
                                      Evidence:
                                    </span>{" "}
                                    {skill.evidence}
                                  </div>
                                )}

                                {skill.gap && (
                                  <div className="nice-gap-text">
                                    <span>
                                      Gap:
                                    </span>{" "}
                                    {skill.gap}
                                  </div>
                                )}
                              </div>

                              <div className="nice-skill-meta">
                                <Tag
                                  type={
                                    skill.candidate_level ===
                                    "Strong"
                                      ? "green"
                                      : skill.candidate_level ===
                                        "Gap"
                                      ? "red"
                                      : "blue"
                                  }
                                >
                                  {skill.candidate_level ||
                                    "Unknown"}
                                </Tag>

                                {skill.priority && (
                                  <span
                                    className={priorityClass(
                                      skill.priority
                                    )}
                                  >
                                    {skill.priority}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="card"
                  style={{ marginTop: 14 }}
                >
                  <SectionHeader
                    eyebrow="HIGHEST-IMPACT GAPS"
                    title="NICE Skill Gaps"
                    description="Prioritized skills that can improve your alignment with the target role and repeated job requirements."
                  />

                  {safeArray(
                    niceMapping.top_skill_gaps
                  ).length > 0 ? (
                    <div className="skill-list">
                      {safeArray(
                        niceMapping.top_skill_gaps
                      ).map((gap, index) => (
                        <div
                          className="nice-gap-row"
                          key={`${gap.skill || "gap"}-${index}`}
                        >
                          <div className="nice-gap-number">
                            {index + 1}
                          </div>

                          <div className="nice-skill-main">
                            <div className="nice-gap-title">
                              {gap.skill ||
                                "Cybersecurity Skill"}
                            </div>

                            <div className="muted">
                              {gap.nice_category ||
                                "NICE-aligned category"}
                            </div>

                            <p className="muted">
                              {gap.why_it_matters ||
                                "No explanation returned."}
                            </p>

                            <div className="nice-action">
                              <strong>
                                Recommended:
                              </strong>{" "}
                              {gap.recommended_action ||
                                "Build practical evidence for this skill."}
                            </div>
                          </div>

                          <Tag
                            type={
                              String(
                                gap.priority || ""
                              ).toLowerCase() ===
                              "high"
                                ? "green"
                                : "blue"
                            }
                          >
                            {gap.priority ||
                              "Medium"}
                          </Tag>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-small">
                      No NICE skill gaps returned.
                    </div>
                  )}
                </div>

                <div
                  className="card"
                  style={{ marginTop: 14 }}
                >
                  <div className="mini-label">
                    SKILL SUMMARY
                  </div>

                  <div className="two-column">
                    <div>
                      <div className="mini-label">
                        STRONG
                      </div>

                      <div className="tags">
                        {safeArray(
                          niceMapping.skill_summary
                            ?.strong
                        ).map((skill, index) => (
                          <Tag
                            type="green"
                            key={`${skill}-${index}`}
                          >
                            {skill}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mini-label">
                        PARTIAL
                      </div>

                      <div className="tags">
                        {safeArray(
                          niceMapping.skill_summary
                            ?.partial
                        ).map((skill, index) => (
                          <Tag
                            type="blue"
                            key={`${skill}-${index}`}
                          >
                            {skill}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <div className="mini-label">
                      GAPS
                    </div>

                    <div className="tags">
                      {safeArray(
                        niceMapping.skill_summary
                          ?.gaps
                      ).map((skill, index) => (
                        <Tag
                          type="red"
                          key={`${skill}-${index}`}
                        >
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* =====================================================
              STEP 21 — APPLICATION COPILOT
              ===================================================== */}

          <section className="section" id="application-copilot">
            <SectionHeader
              eyebrow="07 / APPLICATION COPILOT"
              title="Turn a Job Into an Application Plan"
              description="Use one selected cybersecurity job and your real resume to prepare the application without inventing experience."
            />

            <div className="card">
              {!selectedJob ? (
                <div className="copilot-empty">
                  <div>
                    <div className="mini-label">SELECT A JOB FIRST</div>
                    <div className="big-highlight">Job → Resume → Application</div>
                    <p className="muted">
                      Choose a job from Job Intelligence, then generate an application package for that specific posting.
                    </p>
                  </div>
                  <button className="button" onClick={() => jumpToSection("jobs")}>Go to Jobs</button>
                </div>
              ) : (
                <>
                  <div className="copilot-selected-job">
                    <div>
                      <div className="mini-label">SELECTED JOB</div>
                      <h3>{selectedJob.title || "Untitled Job"}</h3>
                      <p className="muted">
                        {selectedJob.company || "Unknown company"} · {selectedJob.location || "Location not listed"}
                      </p>
                    </div>
                    <LoadingButton
                      loading={loading.applicationCopilot}
                      onClick={generateApplicationCopilot}
                      disabled={!profile}
                    >
                      {applicationCopilot ? "Regenerate Copilot" : "Generate Application Copilot"}
                    </LoadingButton>
                  </div>

                  {applicationCopilot && (
                    <>
                      <div className="copilot-decision">
                        <div>
                          <div className="mini-label">APPLICATION DECISION</div>
                          <h2>{applicationCopilot.application_decision?.recommendation || "Review application"}</h2>
                          <p className="muted">{applicationCopilot.application_decision?.reason || ""}</p>
                        </div>
                        <div className="copilot-score">
                          <span>FIT</span>
                          <strong>{applicationCopilot.application_decision?.fit_score ?? 0}</strong>
                          <small>/ 100</small>
                        </div>
                      </div>

                      <div className="copilot-stats">
                        <div><span>Confidence</span><strong>{applicationCopilot.application_decision?.confidence || "—"}</strong></div>
                        <div><span>Apply Timing</span><strong>{applicationCopilot.application_decision?.apply_timing || "—"}</strong></div>
                        <div><span>Interview Readiness</span><strong>{applicationCopilot.interview_readiness ?? 0}%</strong></div>
                        <div><span>Cyber Focus</span><strong>{applicationCopilot.job_snapshot?.cybersecurity_focus || "—"}</strong></div>
                      </div>

                      <div className="copilot-grid">
                        <div className="card">
                          <div className="mini-label">STRONGEST MATCH</div>
                          <div className="big-highlight">{applicationCopilot.application_decision?.strongest_match || "—"}</div>
                          <p className="muted">{applicationCopilot.application_decision?.biggest_concern || ""}</p>
                        </div>
                        <div className="card">
                          <div className="mini-label">RESUME HEADLINE FOCUS</div>
                          <div className="big-highlight">{applicationCopilot.resume_strategy?.headline_focus || "—"}</div>
                          <p className="muted">Use this as an emphasis, not as a new claim.</p>
                        </div>
                      </div>

                      <div className="copilot-grid">
                        <div className="card">
                          <div className="mini-label">EMPHASIZE</div>
                          <div className="tags">
                            {safeArray(applicationCopilot.resume_strategy?.skills_to_emphasize).map((item, i) => <Tag type="blue" key={`${item}-${i}`}>{item}</Tag>)}
                            {safeArray(applicationCopilot.resume_strategy?.experience_to_emphasize).map((item, i) => <Tag key={`e-${i}`}>{item}</Tag>)}
                          </div>
                        </div>
                        <div className="card">
                          <div className="mini-label">DO NOT CLAIM</div>
                          <div className="tags">
                            {safeArray(applicationCopilot.resume_strategy?.skills_not_supported).map((item, i) => <Tag type="red" key={`${item}-${i}`}>{item}</Tag>)}
                          </div>
                        </div>
                      </div>

                      <div className="card" style={{ marginTop: 14 }}>
                        <div className="mini-label">RESUME CHANGES</div>
                        <ul className="list">
                          {safeArray(applicationCopilot.resume_strategy?.resume_changes).map((item, i) => <li key={`${item}-${i}`}>{item}</li>)}
                        </ul>
                      </div>

                      <div className="card" style={{ marginTop: 14 }}>
                        <div className="mini-label">COVER LETTER</div>
                        <div className="cover-letter-box">
                          <p>{applicationCopilot.cover_letter?.opening}</p>
                          <p>{applicationCopilot.cover_letter?.body}</p>
                          <p>{applicationCopilot.cover_letter?.closing}</p>
                        </div>
                      </div>

                      <div className="copilot-grid" style={{ marginTop: 14 }}>
                        <div className="card">
                          <div className="mini-label">TECHNICAL INTERVIEW</div>
                          <div className="copilot-questions">
                            {safeArray(applicationCopilot.interview_prep?.technical_questions).map((item, i) => (
                              <div className="copilot-question" key={`tech-${i}`}>
                                <strong>{i + 1}. {item.question}</strong>
                                <span>{item.why_asked}</span>
                                <small>Prepare: {item.preparation_point}</small>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="card">
                          <div className="mini-label">BEHAVIORAL INTERVIEW</div>
                          <div className="copilot-questions">
                            {safeArray(applicationCopilot.interview_prep?.behavioral_questions).map((item, i) => (
                              <div className="copilot-question" key={`beh-${i}`}>
                                <strong>{i + 1}. {item.question}</strong>
                                <span>{item.why_asked}</span>
                                <small>Prepare: {item.preparation_point}</small>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="copilot-grid" style={{ marginTop: 14 }}>
                        <div className="card">
                          <div className="mini-label">BEFORE APPLY</div>
                          <ul className="list">
                            {safeArray(applicationCopilot.before_apply).map((item, i) => <li key={`before-${i}`}>{item}</li>)}
                          </ul>
                        </div>
                        <div className="card">
                          <div className="mini-label">AFTER APPLY</div>
                          <ul className="list">
                            {safeArray(applicationCopilot.after_apply).map((item, i) => <li key={`after-${i}`}>{item}</li>)}
                          </ul>
                        </div>
                      </div>

                      <div className="card" style={{ marginTop: 14 }}>
                        <div className="mini-label">DECISION SUMMARY</div>
                        <p className="copilot-summary">{applicationCopilot.decision_summary || ""}</p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </section>

          {/* =====================================================
              STEP 27 — APPLICATION PIPELINE
              ===================================================== */}

          <section className="section" id="application-pipeline">
            <SectionHeader
              eyebrow="08 / APPLICATION PIPELINE"
              title="One Job → One Complete Application"
              description="Turn the selected cybersecurity job into a resume strategy, cover letter, interview plan, checklist, and tracker setup."
            />

            <div className="card">
              {!selectedJob ? (
                <div className="copilot-empty">
                  <div>
                    <div className="mini-label">SELECT A JOB FIRST</div>
                    <div className="big-highlight">Job → Application Package</div>
                    <p className="muted">Select a job from Job Intelligence to build a complete application package.</p>
                  </div>
                  <button className="button" onClick={() => jumpToSection("jobs")}>Go to Jobs</button>
                </div>
              ) : (
                <>
                  <div className="copilot-selected-job">
                    <div>
                      <div className="mini-label">APPLICATION TARGET</div>
                      <h3>{selectedJob.title || "Untitled Job"}</h3>
                      <p className="muted">{selectedJob.company || "Unknown company"} · {selectedJob.location || "Location not listed"}</p>
                    </div>
                    <div className="pipeline-actions">
                      <LoadingButton loading={loading.pipeline} onClick={generateApplicationPipeline} disabled={!profile}>
                        {applicationPipeline ? "Regenerate Package" : "Build Application Package"}
                      </LoadingButton>
                      {applicationPipeline && (
                        <button className="button secondary" onClick={saveApplicationPackage} disabled={loading.savePipeline}>
                          {loading.savePipeline ? "Saving..." : savedPipelineId ? "Update Saved Package" : "Save to Tracker"}
                        </button>
                      )}
                    </div>
                  </div>

                  {applicationPipeline && (
                    <>
                      <div className="copilot-decision">
                        <div>
                          <div className="mini-label">APPLICATION DECISION</div>
                          <h2>{applicationPipeline.application_decision?.recommendation || "Review"}</h2>
                          <p className="muted">{applicationPipeline.application_decision?.reason || ""}</p>
                        </div>
                        <div className="copilot-score">
                          <span>FIT</span>
                          <strong>{applicationPipeline.application_decision?.fit_score ?? 0}</strong>
                          <small>/ 100</small>
                        </div>
                      </div>

                      <div className="copilot-stats">
                        <div><span>Apply Timing</span><strong>{applicationPipeline.application_decision?.apply_timing || "—"}</strong></div>
                        <div><span>Priority</span><strong>{applicationPipeline.tracker_setup?.recommended_priority || "—"}</strong></div>
                        <div><span>Tracker Status</span><strong>{applicationPipeline.tracker_setup?.recommended_status || "Saved"}</strong></div>
                        <div><span>Checklist</span><strong>{safeArray(applicationPipeline.application_checklist).length} steps</strong></div>
                      </div>

                      <div className="copilot-grid">
                        <div className="card">
                          <div className="mini-label">RESUME STRATEGY</div>
                          <div className="big-highlight">{applicationPipeline.resume_package?.headline_focus || "—"}</div>
                          <p className="muted">{applicationPipeline.resume_package?.summary || ""}</p>
                          <div className="tags">{safeArray(applicationPipeline.resume_package?.skills_to_emphasize).map((x,i)=><Tag type="blue" key={i}>{x}</Tag>)}</div>
                        </div>
                        <div className="card">
                          <div className="mini-label">WATCH OUT</div>
                          <div className="big-highlight">{applicationPipeline.application_decision?.biggest_risk || "No major risk identified"}</div>
                          <p className="muted">Minimum fix: {applicationPipeline.application_decision?.minimum_fix || "None"}</p>
                          <div className="tags">{safeArray(applicationPipeline.resume_package?.unsupported_keywords).map((x,i)=><Tag type="red" key={i}>{x}</Tag>)}</div>
                        </div>
                      </div>

                      <div className="card" style={{ marginTop: 14 }}>
                        <div className="mini-label">COVER LETTER — READY TO EDIT</div>
                        <div className="cover-letter-box">
                          <strong>{applicationPipeline.cover_letter?.subject || "Application"}</strong>
                          <p>{applicationPipeline.cover_letter?.opening}</p>
                          <p>{applicationPipeline.cover_letter?.body}</p>
                          <p>{applicationPipeline.cover_letter?.closing}</p>
                        </div>
                      </div>

                      <div className="copilot-grid" style={{ marginTop: 14 }}>
                        <div className="card">
                          <div className="mini-label">INTERVIEW PREP</div>
                          <div className="copilot-questions">
                            {safeArray(applicationPipeline.interview_package?.top_technical_questions).map((x,i)=><div className="copilot-question" key={`t-${i}`}><strong>{i+1}. {x}</strong></div>)}
                            {safeArray(applicationPipeline.interview_package?.top_cybersecurity_questions).map((x,i)=><div className="copilot-question" key={`c-${i}`}><strong>Cyber {i+1}. {x}</strong></div>)}
                            {safeArray(applicationPipeline.interview_package?.top_behavioral_questions).map((x,i)=><div className="copilot-question" key={`b-${i}`}><strong>Behavioral {i+1}. {x}</strong></div>)}
                          </div>
                        </div>
                        <div className="card">
                          <div className="mini-label">MUST PREPARE</div>
                          <div className="tags">{safeArray(applicationPipeline.interview_package?.must_prepare_topics).map((x,i)=><Tag key={i}>{x}</Tag>)}</div>
                          <div className="mini-label" style={{ marginTop: 18 }}>RESUME QUESTIONS</div>
                          <ul className="list">{safeArray(applicationPipeline.interview_package?.resume_questions).map((x,i)=><li key={i}>{x}</li>)}</ul>
                        </div>
                      </div>

                      <div className="card" style={{ marginTop: 14 }}>
                        <div className="mini-label">APPLICATION CHECKLIST</div>
                        <div className="pipeline-checklist">
                          {safeArray(applicationPipeline.application_checklist).map((item:any,i)=>(
                            <div className="pipeline-check" key={i}>
                              <span className="pipeline-number">{item.step || i+1}</span>
                              <div><strong>{item.task}</strong><small>{item.reason}</small></div>
                              <Tag type={item.status === "Blocked" ? "red" : "blue"}>{item.status || "Ready"}</Tag>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="copilot-grid" style={{ marginTop: 14 }}>
                        <div className="card">
                          <div className="mini-label">TRACKER SETUP</div>
                          <p><strong>Status:</strong> {applicationPipeline.tracker_setup?.recommended_status || "Saved"}</p>
                          <p><strong>Priority:</strong> {applicationPipeline.tracker_setup?.recommended_priority || "Medium"}</p>
                          <p><strong>Deadline:</strong> {applicationPipeline.tracker_setup?.deadline_action || "Set a realistic deadline"}</p>
                          <p><strong>Follow-up:</strong> {applicationPipeline.tracker_setup?.follow_up_action || "Track after applying"}</p>
                          <p className="muted">{applicationPipeline.tracker_setup?.notes || ""}</p>
                          <button className="button secondary" onClick={() => jumpToSection("applications")}>Open Application Tracker</button>
                        </div>
                        <div className="card">
                          <div className="mini-label">NEXT ACTIONS</div>
                          <ol className="list">{safeArray(applicationPipeline.next_actions).map((x,i)=><li key={i}>{x}</li>)}</ol>
                        </div>
                      </div>

                      <div className="card" style={{ marginTop: 14 }}>
                        <div className="mini-label">APPLICATION SUMMARY</div>
                        <p className="copilot-summary">{applicationPipeline.application_summary || ""}</p>
                      </div>

                      <div className="card pipeline-saved-card" style={{ marginTop: 14 }}>
                        <div className="pipeline-saved-header">
                          <div>
                            <div className="mini-label">SAVED APPLICATION PACKAGES</div>
                            <p className="muted">Saved packages stay in PostgreSQL so you can reopen them later.</p>
                          </div>
                          <span className="tag blue">{applicationPackages.length} saved</span>
                        </div>
                        {applicationPackages.length === 0 ? (
                          <div className="empty-small">No saved application packages yet.</div>
                        ) : (
                          <div className="saved-package-list">
                            {applicationPackages.slice(0, 8).map((item) => (
                              <div className="saved-package-row" key={item.id}>
                                <div>
                                  <strong>{item.job_title}</strong>
                                  <span>{item.company || "Unknown company"} · Fit {item.fit_score ?? 0} · v{item.version || 1}</span>
                                </div>
                                <button className="button secondary small" onClick={() => openApplicationPackage(item)}>Open Package</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </section>

          {/* =====================================================
              LEARNING
              ===================================================== */}

          {/* =====================================================
              STEP 20 — CAREER INTELLIGENCE
              ===================================================== */}

          <section
            className="section"
            id="career-intelligence"
          >
            <SectionHeader
              eyebrow="06 / CAREER INTELLIGENCE"
              title="What Should You Do Next?"
              description="A single cybersecurity career decision layer that combines your resume, job market, skill gaps, NICE mapping, learning plan, and roadmap."
            />

            <div className="card">
              <div className="career-intel-disclaimer">
                <strong>AI career guidance.</strong>
                <span>
                  Recommendations are based on the information analyzed in CyberPath AI and are not a guarantee of hiring outcomes.
                </span>
              </div>

              {!careerIntelligence ? (
                <div className="career-intel-empty">
                  <div>
                    <div className="mini-label">READY FOR A DECISION</div>
                    <div className="big-highlight">
                      Resume → Jobs → Gaps → Next Move
                    </div>
                    <p className="muted">
                      Generate this after analyzing your resume and at least one group of cybersecurity jobs.
                      CyberPath AI will decide whether you should apply now, apply while upskilling, or focus on a gap first.
                    </p>
                  </div>
                  <LoadingButton
                    loading={loading.careerIntelligence}
                    onClick={generateCareerIntelligence}
                    disabled={!profile || !jobs.length}
                  >
                    Generate Career Intelligence
                  </LoadingButton>
                </div>
              ) : (
                <>
                  <div className="career-intel-hero">
                    <div>
                      <div className="mini-label">RECOMMENDATION</div>
                      <h2>
                        {careerIntelligence.career_decision?.recommendation || "Review your next move"}
                      </h2>
                      <p className="muted">
                        {careerIntelligence.career_decision?.recommendation_reason || ""}
                      </p>
                    </div>
                    <div className="career-intel-score">
                      <span>Career Fit</span>
                      <strong>{careerIntelligence.career_decision?.career_fit ?? 0}</strong>
                      <small>/ 100</small>
                    </div>
                  </div>

                  <div className="career-intel-stats">
                    <div className="career-intel-stat">
                      <span>Job Market</span>
                      <strong>{careerIntelligence.career_decision?.job_market_demand || "—"}</strong>
                    </div>
                    <div className="career-intel-stat">
                      <span>Current Readiness</span>
                      <strong>{careerIntelligence.career_decision?.current_readiness ?? 0}%</strong>
                    </div>
                    <div className="career-intel-stat">
                      <span>Internship Readiness</span>
                      <strong>{careerIntelligence.career_decision?.internship_readiness || "—"}</strong>
                    </div>
                    <div className="career-intel-stat">
                      <span>Best Next Move</span>
                      <strong>{careerIntelligence.career_decision?.best_next_move || "—"}</strong>
                    </div>
                  </div>

                  <div className="career-intel-grid" style={{ marginTop: 14 }}>
                    <div className="card">
                      <div className="mini-label">BIGGEST GAP</div>
                      <div className="big-highlight">
                        {careerIntelligence.biggest_gap?.skill || "—"}
                      </div>
                      <p className="muted">
                        {careerIntelligence.biggest_gap?.reason || ""}
                      </p>
                      <div className="tags">
                        <Tag type="red">
                          {careerIntelligence.biggest_gap?.importance || "Unknown"}
                        </Tag>
                        {careerIntelligence.biggest_gap?.time_to_improve && (
                          <Tag>{careerIntelligence.biggest_gap.time_to_improve}</Tag>
                        )}
                      </div>
                    </div>

                    <div className="card">
                      <div className="mini-label">NEXT BEST SKILL</div>
                      <div className="big-highlight">
                        {careerIntelligence.next_best_skill?.skill || "—"}
                      </div>
                      <p className="muted">
                        {careerIntelligence.next_best_skill?.why_now || ""}
                      </p>
                      <div className="career-intel-action">
                        {careerIntelligence.next_best_skill?.learning_action || ""}
                      </div>
                    </div>

                    <div className="card">
                      <div className="mini-label">NEXT PROJECT</div>
                      <div className="big-highlight">
                        {careerIntelligence.next_project?.project || "—"}
                      </div>
                      <p className="muted">
                        {careerIntelligence.next_project?.why_this_project || ""}
                      </p>
                      <div className="tags">
                        {safeArray(careerIntelligence.next_project?.skills_practiced).map((skill, index) => (
                          <Tag key={`${skill}-${index}`} type="blue">{skill}</Tag>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <div className="mini-label">CERTIFICATION STRATEGY</div>
                      <div className="big-highlight">
                        {careerIntelligence.certification_strategy?.recommended || "No certification selected"}
                      </div>
                      <p className="muted">
                        {careerIntelligence.certification_strategy?.why || ""}
                      </p>
                      <div className="tags">
                        <Tag>{careerIntelligence.certification_strategy?.priority || "—"}</Tag>
                        {careerIntelligence.certification_strategy?.when && (
                          <Tag type="blue">{careerIntelligence.certification_strategy.when}</Tag>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card" style={{ marginTop: 14 }}>
                    <div className="mini-label">PRIORITY ACTIONS</div>
                    <div className="career-intel-actions">
                      {safeArray(careerIntelligence.priority_actions).map((item, index) => (
                        <div className="career-intel-action-row" key={`${item.action}-${index}`}>
                          <div className="career-intel-rank">{item.rank ?? index + 1}</div>
                          <div className="career-intel-action-main">
                            <strong>{item.action || "Action"}</strong>
                            <span>{item.reason || ""}</span>
                          </div>
                          <div className="tags">
                            <Tag type={item.type === "Apply" ? "blue" : item.expected_impact === "High" ? "red" : undefined}>
                              {item.type || "Action"}
                            </Tag>
                            <Tag>{item.timeframe || ""}</Tag>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="career-intel-grid" style={{ marginTop: 14 }}>
                    <div className="card">
                      <div className="mini-label">APPLICATION STRATEGY</div>
                      <div className="big-highlight">
                        {careerIntelligence.application_strategy?.apply_now ? "Apply now" : "Upskill first"}
                      </div>
                      <p className="muted">
                        {careerIntelligence.application_strategy?.strategy || ""}
                      </p>
                      <div className="tags">
                        <Tag type="blue">
                          Target: {careerIntelligence.application_strategy?.target_job_count ?? 0} jobs
                        </Tag>
                      </div>
                      <div className="tags" style={{ marginTop: 8 }}>
                        {safeArray(careerIntelligence.application_strategy?.job_types).map((item, index) => (
                          <Tag key={`${item}-${index}`}>{item}</Tag>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <div className="mini-label">30-DAY PLAN</div>
                      <div className="career-intel-week-list">
                        {safeArray(careerIntelligence.thirty_day_plan).map((week, index) => (
                          <div className="career-intel-week" key={`week-${week.week ?? index}`}>
                            <div className="career-intel-week-number">W{week.week ?? index + 1}</div>
                            <div>
                              <strong>{week.goal || "Weekly goal"}</strong>
                              <ul className="list">
                                {safeArray(week.actions).map((action, actionIndex) => (
                                  <li key={`${action}-${actionIndex}`}>{action}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="card" style={{ marginTop: 14 }}>
                    <div className="mini-label">DECISION SUMMARY</div>
                    <p className="career-intel-summary">
                      {careerIntelligence.decision_summary || ""}
                    </p>
                  </div>

                  <div className="button-row" style={{ marginTop: 14 }}>
                    <LoadingButton
                      loading={loading.careerIntelligence}
                      onClick={generateCareerIntelligence}
                    >
                      Refresh Analysis
                    </LoadingButton>
                    <button
                      className="button"
                      onClick={() => jumpToSection("jobs")}
                    >
                      Back to Jobs
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          <section
            className="section"
            id="learning"
          >
            <SectionHeader
              eyebrow="06 / SKILL DEVELOPMENT"
              title="Learning Intelligence"
              description="Turn missing cybersecurity skills into an actionable learning roadmap."
            />

            {!learning ? (
              <div className="card">
                <div className="empty-small">
                  No learning plan generated yet.
                </div>

                <div className="button-row">
                  <LoadingButton
                    loading={loading.learning}
                    onClick={
                      getLearningRecommendations
                    }
                  >
                    Generate Learning Plan
                  </LoadingButton>
                </div>
              </div>
            ) : (
              <>
                {learning.next_best_skill && (
                  <div className="card">
                    <div className="mini-label">
                      NEXT BEST SKILL
                    </div>

                    <div className="big-highlight">
                      {learning.next_best_skill.skill}
                    </div>

                    <div className="muted">
                      {learning.next_best_skill.reason}
                    </div>

                    <div
                      className="muted"
                      style={{ marginTop: 8 }}
                    >
                      Career impact:{" "}
                      {
                        learning.next_best_skill
                          .career_impact
                      }
                    </div>
                  </div>
                )}

                <div
                  className="card-grid"
                  style={{ marginTop: 14 }}
                >
                  {safeArray(
                    learning.skill_roadmap
                  ).map((item, index) => (
                    <div
                      className="learning-card"
                      key={`${item.skill}-${index}`}
                    >
                      <div className="tags">
                        <Tag type="blue">
                          Priority{" "}
                          {item.priority ??
                            index + 1}
                        </Tag>

                        <Tag>
                          {item.difficulty ||
                            "Recommended"}
                        </Tag>
                      </div>

                      <h3>{item.skill}</h3>

                      <div className="muted">
                        {item.why_it_matters}
                      </div>

                      <div className="resource-list">
                        {safeArray(
                          item.youtube
                        ).map(
                          (
                            resource,
                            resourceIndex
                          ) => (
                            <a
                              key={`yt-${resourceIndex}`}
                              className="resource-link"
                              href={resource.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              ▶ {resource.title}
                            </a>
                          )
                        )}

                        {safeArray(
                          item.free_courses
                        ).map(
                          (
                            resource,
                            resourceIndex
                          ) => (
                            <a
                              key={`course-${resourceIndex}`}
                              className="resource-link"
                              href={resource.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              ◆ {resource.title}{" "}
                              {resource.provider
                                ? `· ${resource.provider}`
                                : ""}
                            </a>
                          )
                        )}

                        {safeArray(
                          item.official_docs
                        ).map(
                          (
                            resource,
                            resourceIndex
                          ) => (
                            <a
                              key={`doc-${resourceIndex}`}
                              className="resource-link"
                              href={resource.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              ◇ {resource.title}
                            </a>
                          )
                        )}

                        {safeArray(
                          item.hands_on_labs
                        ).map(
                          (
                            resource,
                            resourceIndex
                          ) => (
                            <a
                              key={`lab-${resourceIndex}`}
                              className="resource-link"
                              href={resource.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              ⌁ {resource.title}
                            </a>
                          )
                        )}
                      </div>

                      {item.project && (
                        <div
                          className="muted"
                          style={{
                            marginTop: 12,
                          }}
                        >
                          <strong>
                            Project:
                          </strong>{" "}
                          {item.project}
                        </div>
                      )}

                      {item.estimated_time && (
                        <div
                          className="muted"
                          style={{
                            marginTop: 7,
                          }}
                        >
                          Time:{" "}
                          {item.estimated_time}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {safeArray(
                  learning.certifications
                ).length > 0 && (
                  <div
                    className="card"
                    style={{ marginTop: 14 }}
                  >
                    <div className="mini-label">
                      CERTIFICATION STRATEGY
                    </div>

                    <div
                      className="card-grid"
                      style={{ marginTop: 12 }}
                    >
                      {safeArray(
                        learning.certifications
                      ).map(
                        (cert, index) => (
                          <div
                            className="learning-card"
                            key={`${cert.name}-${index}`}
                          >
                            <h3>
                              {cert.name}
                            </h3>

                            <div className="tags">
                              <Tag type="blue">
                                Priority{" "}
                                {cert.priority ??
                                  index + 1}
                              </Tag>

                              <Tag>
                                {cert.difficulty}
                              </Tag>
                            </div>

                            <div className="muted">
                              {cert.reason}
                            </div>

                            <div
                              className="muted"
                              style={{
                                marginTop: 8,
                              }}
                            >
                              Best for:{" "}
                              {cert.best_for}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {learning.career_strategy && (
                  <div
                    className="card"
                    style={{ marginTop: 14 }}
                  >
                    <div className="mini-label">
                      CAREER STRATEGY
                    </div>

                    <p className="muted">
                      {learning.career_strategy}
                    </p>
                  </div>
                )}
              </>
            )}
          </section>

          {/* =====================================================
              ROADMAP
              ===================================================== */}

          <section
            className="section"
            id="roadmap"
          >
            <SectionHeader
              eyebrow="07 / CAREER STRATEGY"
              title="Cybersecurity Career Roadmap"
              description="Convert job-market requirements into a realistic 30/90/180-day plan."
            />

            {!roadmap ? (
              <div className="card">
                <div className="empty-small">
                  No roadmap generated yet.
                </div>

                <div className="button-row">
                  <LoadingButton
                    loading={loading.roadmap}
                    onClick={
                      generateCareerRoadmap
                    }
                  >
                    Generate Career Roadmap
                  </LoadingButton>
                </div>
              </div>
            ) : (
              <>
                <div className="card">
                  <div className="mini-label">
                    CURRENT CAREER POSITION
                  </div>

                  <div className="big-highlight">
                    {roadmap.career_position ||
                      "Cybersecurity Candidate"}
                  </div>

                  <div className="two-column">
                    <div>
                      <div className="mini-label">
                        Strengths
                      </div>

                      <ul className="list">
                        {safeArray(
                          roadmap.current_strengths
                        ).map(
                          (item, index) => (
                            <li
                              key={`${item}-${index}`}
                            >
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <div className="mini-label">
                        Biggest Gaps
                      </div>

                      <ul className="list">
                        {safeArray(
                          roadmap.biggest_gaps
                        ).map(
                          (item, index) => (
                            <li
                              key={`${item}-${index}`}
                            >
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div
                  className="three-column"
                  style={{ marginTop: 14 }}
                >
                  <div className="card">
                    <div className="mini-label">
                      NEXT 30 DAYS
                    </div>

                    <RoadmapList
                      items={
                        roadmap.next_30_days
                      }
                    />
                  </div>

                  <div className="card">
                    <div className="mini-label">
                      NEXT 90 DAYS
                    </div>

                    <RoadmapList
                      items={
                        roadmap.next_90_days
                      }
                    />
                  </div>

                  <div className="card">
                    <div className="mini-label">
                      NEXT 6 MONTHS
                    </div>

                    <RoadmapList
                      items={
                        roadmap.next_6_months
                      }
                    />
                  </div>
                </div>

                <div
                  className="card-grid"
                  style={{ marginTop: 14 }}
                >
                  <div className="card">
                    <div className="mini-label">
                      INTERNSHIP STRATEGY
                    </div>

                    <p className="muted">
                      {
                        roadmap.internship_strategy
                      }
                    </p>
                  </div>

                  <div className="card">
                    <div className="mini-label">
                      CERTIFICATION STRATEGY
                    </div>

                    <p className="muted">
                      {
                        roadmap.certification_strategy
                      }
                    </p>
                  </div>

                  <div className="card">
                    <div className="mini-label">
                      PROJECT STRATEGY
                    </div>

                    <p className="muted">
                      {roadmap.project_strategy}
                    </p>
                  </div>
                </div>

                <div
                  className="card"
                  style={{ marginTop: 14 }}
                >
                  <div className="mini-label">
                    TOP PRIORITY
                  </div>

                  <div className="big-highlight">
                    {roadmap.top_priority}
                  </div>

                  <p className="muted">
                    {roadmap.why}
                  </p>

                  <div className="mini-label">
                    JOB APPLICATION STRATEGY
                  </div>

                  <p className="muted">
                    {
                      roadmap.job_application_strategy
                    }
                  </p>
                </div>
              </>
            )}
          </section>

          {/* =====================================================
              RESUME TAILORING
              ===================================================== */}

          <section
            className="section"
            id="resume-tailor"
          >
            <SectionHeader
              eyebrow="08 / APPLICATION PREPARATION"
              title="Resume Tailoring"
              description="Adapt your existing resume to the selected cybersecurity position without inventing experience."
            />

            {!tailoredResume ? (
              <div className="card">
                <div className="empty-small">
                  Select a job and click
                  "Tailor Resume".
                </div>
              </div>
            ) : (
              <div className="card">
                <textarea
                  className="textarea"
                  value={tailoredResume}
                  onChange={(event) =>
                    setTailoredResume(
                      event.target.value
                    )
                  }
                />

                <div className="button-row">
                  <button
                    className="button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        tailoredResume
                      )
                    }
                  >
                    Copy Resume
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* =====================================================
              APPLICATION TRACKER
              ===================================================== */}

          {/* =====================================================
              STEP 22 — INTERVIEW INTELLIGENCE
              ===================================================== */}

          <section className="section" id="interview-intelligence">
            <SectionHeader eyebrow="08 / INTERVIEW INTELLIGENCE" title="Prepare for the Interview, Not Just the Application" description="Generate job-specific technical, cybersecurity, resume-based, and behavioral preparation using only evidence from your real profile." />
            <div className="card">
              {!selectedJob ? (
                <div className="interview-empty">
                  <div><div className="mini-label">SELECT A JOB FIRST</div><div className="big-highlight">Job → Application → Interview</div><p className="muted">Select a cybersecurity job first so the interview preparation is based on the actual posting.</p></div>
                  <button className="button" onClick={() => jumpToSection("jobs")}>Go to Jobs</button>
                </div>
              ) : (
                <>
                  <div className="interview-selected-job">
                    <div><div className="mini-label">INTERVIEW TARGET</div><h3>{selectedJob.title || "Untitled Job"}</h3><p className="muted">{selectedJob.company || "Unknown company"} · {selectedJob.location || "Location not listed"}</p></div>
                    <LoadingButton loading={loading.interviewIntelligence} onClick={generateInterviewIntelligence}>{interviewIntelligence ? "Regenerate Interview Plan" : "Generate Interview Plan"}</LoadingButton>
                  </div>
                  {interviewIntelligence && (<>
                    <div className="interview-hero"><div><div className="mini-label">INTERVIEW READINESS</div><h2>{interviewIntelligence.interview_readiness?.readiness_level || "Readiness"}</h2><p className="interview-summary">{interviewIntelligence.interview_readiness?.summary || ""}</p></div><div className="interview-score"><span>READY</span><strong>{interviewIntelligence.interview_readiness?.overall_score ?? 0}</strong><small>/ 100</small></div></div>
                    <div className="interview-stats">
                      <div><span>Technical</span><strong>{interviewIntelligence.interview_readiness?.technical_score ?? 0}%</strong></div><div><span>Cybersecurity</span><strong>{interviewIntelligence.interview_readiness?.cybersecurity_score ?? 0}%</strong></div><div><span>Behavioral</span><strong>{interviewIntelligence.interview_readiness?.behavioral_score ?? 0}%</strong></div><div><span>Resume</span><strong>{interviewIntelligence.interview_readiness?.resume_score ?? 0}%</strong></div>
                    </div>
                    <div className="interview-grid"><div className="card"><div className="mini-label">BIGGEST WEAKNESS</div><div className="big-highlight">{interviewIntelligence.interview_readiness?.biggest_weakness || "—"}</div></div><div className="card"><div className="mini-label">NEXT PRACTICE</div><div className="big-highlight">{interviewIntelligence.interview_readiness?.next_practice || "—"}</div></div></div>
                    <div className="interview-grid" style={{marginTop:14}}><div className="card"><div className="mini-label">TOP TOPICS</div><div className="tags">{safeArray(interviewIntelligence.interview_strategy?.top_topics).map((x,i)=><Tag type="blue" key={`tt-${i}`}>{x}</Tag>)}</div><div className="mini-label" style={{marginTop:16}}>TECHNICAL FOCUS</div><div className="tags">{safeArray(interviewIntelligence.interview_strategy?.technical_focus).map((x,i)=><Tag key={`tf-${i}`}>{x}</Tag>)}</div></div><div className="card"><div className="mini-label">STORIES TO PREPARE</div><ul className="list">{safeArray(interviewIntelligence.interview_strategy?.stories_to_prepare).map((x,i)=><li key={`st-${i}`}>{x}</li>)}</ul></div></div>
                    <InterviewQuestionCard title="TECHNICAL QUESTIONS" items={safeArray(interviewIntelligence.technical_questions).map(x=>({question:x.question, meta:`Why asked: ${x.why_asked || "—"}`, detail:`Strong answer: ${x.what_strong_answer_should_show || "—"}`, prep:`Preparation: ${x.candidate_preparation || "—"}`, tag:x.difficulty}))} />
                    <div className="interview-grid" style={{marginTop:14}}><InterviewListCard title="CYBERSECURITY SCENARIOS" items={safeArray(interviewIntelligence.cybersecurity_scenarios).map(x=>({question:x.scenario,meta:`Testing: ${x.what_interviewer_is_testing || "—"}`,detail:`Framework: ${x.recommended_framework || "—"}`,prep:`Preparation: ${x.candidate_preparation || "—"}`}))}/><InterviewListCard title="RESUME QUESTIONS" items={safeArray(interviewIntelligence.resume_questions).map(x=>({question:x.question,meta:`Use: ${x.resume_evidence_to_use || "—"}`,detail:`Emphasize: ${x.what_to_emphasize || "—"}`,prep:x.follow_up ? `Follow-up: ${x.follow_up}` : ""}))}/></div>
                    <InterviewQuestionCard title="BEHAVIORAL QUESTIONS" items={safeArray(interviewIntelligence.behavioral_questions).map(x=>({question:x.question,meta:`Why asked: ${x.why_asked || "—"}`,detail:`Story: ${x.recommended_story || "—"}`,prep:`Emphasize: ${x.what_to_emphasize || "—"}`}))} />
                    <div className="interview-grid" style={{marginTop:14}}><div className="card"><div className="mini-label">PRACTICE PLAN</div><div className="interview-practice-list">{safeArray(interviewIntelligence.practice_plan).map((x,i)=><div className="interview-practice" key={`pp-${i}`}><div className="interview-practice-number">{x.priority ?? i+1}</div><div><strong>{x.topic || "Practice"}</strong><p>{x.action || "—"}</p><small>{x.estimated_time || ""}</small></div></div>)}</div></div><div className="card"><div className="mini-label">QUESTIONS TO ASK THE INTERVIEWER</div><ul className="list">{safeArray(interviewIntelligence.interview_strategy?.questions_to_ask_interviewer).map((x,i)=><li key={`qa-${i}`}>{x}</li>)}</ul><div className="mini-label" style={{marginTop:18}}>RED FLAGS</div><ul className="list">{safeArray(interviewIntelligence.red_flags).map((x,i)=><li key={`rf-${i}`}>{x}</li>)}</ul></div></div>
                    <div className="card" style={{marginTop:14}}><div className="mini-label">CONFIDENCE NOTES</div><p className="interview-summary">{interviewIntelligence.confidence_notes || "—"}</p></div>
                  </>)}
                </>
              )}
            </div>
          </section>


          {/* =====================================================
              STEP 23 — MOCK INTERVIEW
              ===================================================== */}
          <section className="section" id="mock-interview">
            <SectionHeader eyebrow="09 / MOCK INTERVIEW" title="Practice the Interview, Then Fix the Weakness" description="Answer realistic cybersecurity interview questions and get AI feedback on technical accuracy, security reasoning, communication, and answer structure." />
            <div className="card">
              {!mockInterview ? (
                <div className="mock-empty">
                  <div>
                    <div className="mini-label">AI INTERVIEWER</div>
                    <div className="big-highlight">5 questions · real job · instant coaching</div>
                    <p className="muted">The interviewer will use the selected job, your resume profile, and the Step 22 interview plan. Start when you are ready to answer out loud or type your response.</p>
                  </div>
                  <LoadingButton loading={loading.mockInterview} onClick={startMockInterview}>Start Mock Interview</LoadingButton>
                </div>
              ) : mockCompleted ? (
                <div className="mock-complete">
                  <div className="mini-label">INTERVIEW COMPLETE</div>
                  <h2>Mock interview finished.</h2>
                  <p className="muted">You completed {mockScores.length} of {mockInterview.questions?.length || 0} questions.</p>
                  <div className="mock-final-score"><span>AVERAGE SCORE</span><strong>{mockScores.length ? Math.round(mockScores.reduce((a,b)=>a+b,0) / mockScores.length) : 0}</strong><small>/ 5</small></div>
                  <div className="button-row"><button className="button" onClick={startMockInterview}>Run Again</button><button className="button secondary" onClick={() => jumpToSection("interview-intelligence")}>Review Interview Plan</button></div>
                </div>
              ) : (
                <>
                  <div className="mock-topbar">
                    <div><div className="mini-label">{mockInterview.session_title || "MOCK INTERVIEW"}</div><strong>Question {mockIndex + 1} / {mockInterview.questions?.length || 0}</strong></div>
                    <div className="mock-progress"><div style={{width:`${((mockIndex + 1) / Math.max(mockInterview.questions?.length || 1,1)) * 100}%`}} /></div>
                    <button className="button secondary" onClick={startMockInterview}>Restart</button>
                  </div>
                  {mockInterview.instructions && <p className="mock-instructions">{mockInterview.instructions}</p>}
                  <div className="mock-question-card">
                    <div className="mock-question-meta"><Tag type="blue">{mockInterview.questions?.[mockIndex]?.category || "Technical"}</Tag><Tag>{mockInterview.questions?.[mockIndex]?.difficulty || "Medium"}</Tag></div>
                    <h2>{mockInterview.questions?.[mockIndex]?.question || "Question"}</h2>
                    <p className="muted">Tests: {mockInterview.questions?.[mockIndex]?.what_it_tests || "—"}</p>
                  </div>
                  <div className="mock-answer-area">
                    <div className="mini-label">YOUR ANSWER</div>
                    <textarea className="textarea mock-textarea" value={mockAnswer} onChange={(e)=>setMockAnswer(e.target.value)} placeholder="Answer as if you were in the actual interview. Explain your reasoning and use your real experience when relevant." />
                    <div className="mock-actions"><span className="muted">Tip: do not invent experience. If you have not done something, explain how you would approach it.</span><LoadingButton loading={loading.mockEvaluate} onClick={evaluateMockAnswer}>{mockEvaluation ? "Re-evaluate Answer" : "Submit Answer"}</LoadingButton></div>
                  </div>
                  {mockEvaluation && <div className="mock-feedback">
                    <div className="mock-feedback-header"><div><div className="mini-label">AI COACH</div><h3>{mockEvaluation.verdict || "Feedback"}</h3></div><div className="mock-answer-score"><strong>{mockEvaluation.scores?.overall ?? 0}</strong><span>/ 5</span></div></div>
                    <div className="mock-score-grid"><div><span>Technical</span><strong>{mockEvaluation.scores?.technical_accuracy ?? 0}/5</strong></div><div><span>Cybersecurity</span><strong>{mockEvaluation.scores?.cybersecurity_reasoning ?? 0}/5</strong></div><div><span>Communication</span><strong>{mockEvaluation.scores?.communication ?? 0}/5</strong></div><div><span>Structure</span><strong>{mockEvaluation.scores?.structure ?? 0}/5</strong></div></div>
                    <div className="mock-feedback-grid">
                      <div className="card"><div className="mini-label">WHAT WENT WELL</div><ul className="list">{safeArray(mockEvaluation.what_went_well).map((x,i)=><li key={`mw-${i}`}>{x}</li>)}</ul></div>
                      <div className="card"><div className="mini-label">FIX THIS</div><ul className="list">{safeArray(mockEvaluation.issues_to_fix).map((x,i)=><li key={`mi-${i}`}>{x}</li>)}</ul></div>
                      <div className="card"><div className="mini-label">TECHNICAL ACCURACY</div><ul className="list">{safeArray(mockEvaluation.technical_accuracy_issues).map((x,i)=><li key={`mt-${i}`}>{x}</li>)}</ul></div>
                      <div className="card"><div className="mini-label">STAR / STRUCTURE</div><p className="mock-coach-text">{mockEvaluation.star_feedback || "Not a behavioral question."}</p></div>
                    </div>
                    <div className="card"><div className="mini-label">STRONGER ANSWER DIRECTION</div><p className="mock-coach-text">{mockEvaluation.stronger_answer_direction || "—"}</p><div className="mini-label" style={{marginTop:16}}>MUST INCLUDE NEXT TIME</div><div className="tags">{safeArray(mockEvaluation.must_include_next_time).map((x,i)=><Tag key={`mn-${i}`}>{x}</Tag>)}</div></div>
                    <div className="card" style={{marginTop:14}}><div className="mini-label">LIKELY FOLLOW-UPS</div><ul className="list">{safeArray(mockEvaluation.follow_up_questions).map((x,i)=><li key={`mf-${i}`}>{x}</li>)}</ul><p className="mock-coach-text">{mockEvaluation.coach_note || ""}</p></div>
                    <div className="button-row"><button className="button" onClick={nextMockQuestion}>{mockIndex >= (mockInterview.questions?.length || 1) - 1 ? "Finish Interview" : "Next Question"}</button></div>
                  </div>}
                </>
              )}
            </div>
          </section>

          <section className="section" id="interview-history">
            <SectionHeader eyebrow="10 / INTERVIEW ANALYTICS" title="Turn Practice Into Progress" description="Track mock interview performance over time and focus your next practice session on the weakest area." />
            <div className="card">
              {!interviewHistory?.sessions?.length ? (
                <div className="mock-empty"><div><div className="mini-label">NO HISTORY YET</div><div className="big-highlight">Complete a mock interview first.</div><p className="muted">CyberPath AI will save each completed interview and identify your strongest and weakest interview areas.</p></div><button className="button" onClick={() => jumpToSection("mock-interview")}>Practice Now</button></div>
              ) : (
                <>
                  <div className="history-readiness-grid">
                    <div className="history-readiness"><span>READINESS</span><strong>{Math.round(interviewHistory.analytics?.readiness || 0)}%</strong><small>{(interviewHistory.analytics?.trend || 0) >= 0 ? "↑" : "↓"} {Math.abs(interviewHistory.analytics?.trend || 0).toFixed(1)} vs previous</small></div>
                    <div className="history-metric"><span>TECHNICAL</span><strong>{Number(interviewHistory.analytics?.technical || 0).toFixed(1)}<small>/5</small></strong></div>
                    <div className="history-metric"><span>CYBERSECURITY</span><strong>{Number(interviewHistory.analytics?.cybersecurity || 0).toFixed(1)}<small>/5</small></strong></div>
                    <div className="history-metric"><span>COMMUNICATION</span><strong>{Number(interviewHistory.analytics?.communication || 0).toFixed(1)}<small>/5</small></strong></div>
                    <div className="history-metric"><span>STRUCTURE</span><strong>{Number(interviewHistory.analytics?.structure || 0).toFixed(1)}<small>/5</small></strong></div>
                  </div>
                  <div className="history-focus-grid">
                    <div className="card"><div className="mini-label">BIGGEST WEAKNESS</div><h3>{interviewHistory.analytics?.weakest_area || "—"}</h3><p className="muted">Make this the focus of your next mock interview.</p></div>
                    <div className="card"><div className="mini-label">STRONGEST AREA</div><h3>{interviewHistory.analytics?.strongest_area || "—"}</h3><p className="muted">Keep this strength while improving your weakest area.</p></div>
                  </div>
                  <div className="mini-label" style={{marginTop:20}}>RECENT SESSIONS</div>
                  <div className="history-table">
                    {safeArray(interviewHistory.sessions).map((session:any) => (
                      <div className="history-row" key={session.id}>
                        <div><strong>{session.job_title || "Mock Interview"}</strong><span>{session.company || targetRole || "Cybersecurity"}</span></div>
                        <div><span>{session.question_count} questions</span><strong>{Number(session.overall_score || 0).toFixed(1)} / 5</strong></div>
                      </div>
                    ))}
                  </div>
                  <div className="callout" style={{marginTop:18}}><strong>NEXT PRACTICE → {interviewHistory.analytics?.weakest_area || "Technical"}</strong><p>Start another mock interview and deliberately improve this category instead of only repeating questions you already know.</p></div>
                </>
              )}
            </div>
          </section>

          <section className="section" id="application-decision">
            <SectionHeader eyebrow="11 / APPLY DECISION ENGINE" title="Decide What to Apply to Now" description="Combine job fit, cybersecurity skill gaps, career value, and interview readiness into a practical apply-or-upskill decision." />
            <div className="card">
              {!applicationDecision ? (
                <div className="decision-empty">
                  <div>
                    <div className="mini-label">CAREER → APPLICATION DECISION</div>
                    <div className="big-highlight">Stop treating every job the same.</div>
                    <p className="muted">CyberPath AI will classify analyzed jobs into APPLY NOW, UPSKILL FIRST, or DEPRIORITIZE using your real profile and the evidence already collected.</p>
                  </div>
                  <LoadingButton loading={loading.applicationDecision} onClick={generateApplicationDecision}>Generate Decision</LoadingButton>
                </div>
              ) : (
                <>
                  <div className="decision-hero">
                    <div>
                      <div className="mini-label">OVERALL STRATEGY</div>
                      <h2>{applicationDecision.selected_job_decision?.decision || "—"}</h2>
                      <p>{applicationDecision.decision_summary || "—"}</p>
                    </div>
                    <div className="decision-score"><span>APPLICATION READINESS</span><strong>{Math.round(applicationDecision.readiness?.application_readiness || 0)}%</strong></div>
                  </div>
                  <div className="decision-readiness-grid">
                    <div><span>CAREER FIT</span><strong>{Math.round(applicationDecision.readiness?.career_fit || 0)}%</strong></div>
                    <div><span>SKILL READINESS</span><strong>{Math.round(applicationDecision.readiness?.skill_readiness || 0)}%</strong></div>
                    <div><span>INTERVIEW</span><strong>{Math.round(applicationDecision.readiness?.interview_readiness || 0)}%</strong></div>
                    <div><span>APPLICATION</span><strong>{Math.round(applicationDecision.readiness?.application_readiness || 0)}%</strong></div>
                  </div>
                  <div className="decision-grid">
                    <div className="decision-panel decision-apply"><div className="mini-label">APPLY NOW</div><h3>{safeArray(applicationDecision.apply_now).length} jobs</h3>{safeArray(applicationDecision.apply_now).map((x:any,i)=><div className="decision-job" key={`da-${i}`}><strong>{x.job_title || "Job"}</strong><span>{x.company || ""}</span><p>{x.why || ""}</p><small>→ {x.action || "Apply"}</small></div>)}</div>
                    <div className="decision-panel decision-upskill"><div className="mini-label">UPSKILL FIRST</div><h3>{safeArray(applicationDecision.upskill_first).length} jobs</h3>{safeArray(applicationDecision.upskill_first).map((x:any,i)=><div className="decision-job" key={`du-${i}`}><strong>{x.job_title || "Job"}</strong><span>{x.company || ""}</span><p><b>{x.skill_to_fix || "Skill gap"}</b> — {x.why || ""}</p><small>→ {x.action || "Upskill"}</small></div>)}</div>
                    <div className="decision-panel decision-deprioritize"><div className="mini-label">DEPRIORITIZE</div><h3>{safeArray(applicationDecision.deprioritize).length} jobs</h3>{safeArray(applicationDecision.deprioritize).map((x:any,i)=><div className="decision-job" key={`dd-${i}`}><strong>{x.job_title || "Job"}</strong><span>{x.company || ""}</span><p>{x.reason || ""}</p></div>)}</div>
                  </div>
                  <div className="decision-grid two">
                    <div className="card"><div className="mini-label">NEXT BEST SKILL</div><h3>{applicationDecision.next_best_skill?.skill || "—"}</h3><p>{applicationDecision.next_best_skill?.why || ""}</p><div className="callout"><strong>HOW TO PROVE IT</strong><p>{applicationDecision.next_best_skill?.how_to_prove_it || "—"}</p></div></div>
                    <div className="card"><div className="mini-label">APPLICATION STRATEGY</div><h3>{applicationDecision.application_strategy?.weekly_application_target || 0} targeted applications / week</h3><p>{applicationDecision.application_strategy?.strategy || "—"}</p><div className="tags">{safeArray(applicationDecision.application_strategy?.ideal_job_types).map((x,i)=><Tag key={`jt-${i}`}>{x}</Tag>)}</div></div>
                  </div>
                  <div className="card" style={{marginTop:14}}><div className="mini-label">TOP PRIORITY ACTIONS</div><div className="decision-actions">{safeArray(applicationDecision.top_priority_actions).map((x:any,i)=><div className="decision-action" key={`pa-${i}`}><div className="decision-action-num">{x.rank || i+1}</div><div><strong>{x.action || "Action"}</strong><span>{x.timeframe || ""}</span><p>{x.why || ""}</p><small>Impact: {x.expected_impact || "—"}</small></div></div>)}</div></div>
                  <div className="button-row" style={{marginTop:16}}><LoadingButton loading={loading.applicationDecision} onClick={generateApplicationDecision}>Regenerate Decision</LoadingButton><button className="button secondary" onClick={() => jumpToSection("jobs")}>Review Jobs</button></div>
                </>
              )}
            </div>
          </section>

          <section className="section" id="application-tracker">
            <SectionHeader
              eyebrow="12 / DEADLINE INTELLIGENCE"
              title="Application Command Center"
              description="Know what needs attention now, what is due next, and which applications still need a deadline."
            />

            <div className="deadline-stat-grid">
              <div className="deadline-stat danger"><span>OVERDUE</span><strong>{deadlineIntelligence.overdue.length}</strong><small>Needs immediate attention</small></div>
              <div className="deadline-stat urgent"><span>DUE TODAY</span><strong>{deadlineIntelligence.today.length}</strong><small>Submit or update now</small></div>
              <div className="deadline-stat warning"><span>NEXT 3 DAYS</span><strong>{deadlineIntelligence.next3.length}</strong><small>High priority</small></div>
              <div className="deadline-stat"><span>NEXT 7 DAYS</span><strong>{deadlineIntelligence.next7.length}</strong><small>Plan these applications</small></div>
              <div className="deadline-stat muted-stat"><span>NO DEADLINE</span><strong>{deadlineIntelligence.noDeadline.length}</strong><small>Add a deadline</small></div>
              <div className="deadline-stat"><span>AWAITING RESPONSE</span><strong>{deadlineIntelligence.appliedWaiting.length}</strong><small>Currently marked Applied</small></div>
            </div>

            <div className="deadline-grid">
              <div className="card">
                <div className="mini-label">NEXT ACTION QUEUE</div>
                {deadlineIntelligence.items.length === 0 ? (
                  <div className="empty">No active applications need deadline attention.</div>
                ) : (
                  <div className="deadline-list">
                    {deadlineIntelligence.items.slice(0, 8).map((application: any) => (
                      <div className={`deadline-row ${String(application.urgency).toLowerCase().replaceAll(" ", "-")}`} key={`deadline-${application.id}`}>
                        <div className="deadline-main">
                          <strong>{application.job_title}</strong>
                          <span>{application.company || ""} · {application.status || "Saved"}</span>
                        </div>
                        <div className="deadline-date">
                          <b>{application.deadline || "No deadline"}</b>
                          <span>{application.daysLeft === null ? "Set a deadline" : application.daysLeft < 0 ? `${Math.abs(application.daysLeft)}d overdue` : application.daysLeft === 0 ? "Due today" : `${application.daysLeft}d left`}</span>
                        </div>
                        <div className="deadline-actions">
                          {application.status === "Saved" && <button className="button small" onClick={() => updateApplication(application.id, { status: "Applied" })}>Mark Applied</button>}
                          <button className="button secondary small" onClick={() => jumpToSection("applications")}>Open Tracker</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card">
                <div className="mini-label">APPLICATION HYGIENE</div>
                <div className="hygiene-list">
                  <div><strong>{deadlineIntelligence.noDeadline.length}</strong><span>active applications without deadlines</span></div>
                  <div><strong>{deadlineIntelligence.appliedWaiting.length}</strong><span>applications currently awaiting a response</span></div>
                  <div><strong>{applications.filter((x) => x.priority === "High").length}</strong><span>high-priority applications</span></div>
                </div>
                <div className="callout" style={{marginTop:16}}>
                  <strong>NEXT MOVE</strong>
                  <p>{deadlineIntelligence.overdue.length ? "Handle overdue applications first, then submit anything due today." : deadlineIntelligence.today.length ? "Finish today's applications before adding new low-priority work." : deadlineIntelligence.noDeadline.length ? "Add realistic deadlines to active applications so your queue can be prioritized." : "Your deadline queue is under control. Focus on the next 3-day window."}</p>
                </div>
              </div>
            </div>
          </section>

          <section
            className="section"
            id="applications"
          >
            <SectionHeader
              eyebrow="13 / APPLICATION INTELLIGENCE"
              title="Application Tracker"
              description="Track the cybersecurity jobs you actually intend to apply to."
            />

            <div className="card">
              <div className="filter-row">
                <input
                  placeholder="Search applications..."
                  value={searchFilter}
                  onChange={(event) =>
                    setSearchFilter(
                      event.target.value
                    )
                  }
                />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                >
                  <option value="All">
                    All Statuses
                  </option>

                  <option value="Saved">
                    Saved
                  </option>

                  <option value="Applied">
                    Applied
                  </option>

                  <option value="Interview">
                    Interview
                  </option>

                  <option value="Offer">
                    Offer
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>
                </select>
              </div>

              {filteredApplications.length ===
              0 ? (
                <div className="empty">
                  No applications in your
                  tracker.
                  <br />
                  Save jobs from the Job
                  Intelligence section.
                </div>
              ) : (
                <div className="application-table-wrap">
                  <table className="application-table">
                    <thead>
                      <tr>
                        <th>Job</th>
                        <th>Fit</th>
                        <th>Status</th>
                        <th>Deadline</th>
                        <th>Notes</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredApplications.map(
                        (application) => (
                          <tr
                            key={
                              application.id
                            }
                          >
                            <td>
                              <strong>
                                {
                                  application.job_title
                                }
                              </strong>

                              <div className="muted">
                                {
                                  application.company
                                }
                              </div>
                            </td>

                            <td>
                              <span
                                className={scoreClass(
                                  application.fit_score
                                )}
                              >
                                {
                                  application.fit_score ??
                                  0
                                }
                              </span>
                            </td>

                            <td>
                              <select
                                value={
                                  application.status ||
                                  "Saved"
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateApplication(
                                    application.id,
                                    {
                                      status:
                                        event
                                          .target
                                          .value,
                                    }
                                  )
                                }
                              >
                                <option value="Saved">
                                  Saved
                                </option>

                                <option value="Applied">
                                  Applied
                                </option>

                                <option value="Interview">
                                  Interview
                                </option>

                                <option value="Offer">
                                  Offer
                                </option>

                                <option value="Rejected">
                                  Rejected
                                </option>
                              </select>
                            </td>

                            <td>
                              <input
                                type="date"
                                value={
                                  application.deadline ||
                                  ""
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateApplication(
                                    application.id,
                                    {
                                      deadline:
                                        event
                                          .target
                                          .value,
                                    }
                                  )
                                }
                              />
                            </td>

                            <td>
                              <input
                                value={
                                  application.notes ||
                                  ""
                                }
                                placeholder="Add note..."
                                onChange={(
                                  event
                                ) =>
                                  updateApplication(
                                    application.id,
                                    {
                                      notes:
                                        event
                                          .target
                                          .value,
                                    }
                                  )
                                }
                              />
                            </td>

                            <td>
                              <button
                                className="button danger"
                                onClick={() =>
                                  deleteApplication(
                                    application.id
                                  )
                                }
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* =====================================================
              ORIGINAL RESUME
              ===================================================== */}

          {resumeText && (
            <section className="section">
              <SectionHeader
                eyebrow="11 / SOURCE"
                title="Original Resume Text"
                description="The extracted text used by CyberPath AI."
              />

              <div className="card">
                <textarea
                  className="textarea"
                  value={resumeText}
                  onChange={(event) =>
                    setResumeText(
                      event.target.value
                    )
                  }
                />
              </div>
            </section>
          )}

          <div className="footer">
            CyberPath AI · Personalized
            cybersecurity career intelligence
          </div>
        </div>
      </div>
    </main>
  );
}