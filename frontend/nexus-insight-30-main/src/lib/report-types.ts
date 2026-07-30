export type Verdict = "verified" | "partial" | "unverified";

export type ResearchClaim = {
  claim: string;
  verdict: Verdict;
  note: string;
};

export type Argument = {
  title: string;
  detail: string;
  weight: number; // 0-100 conviction
};

export type Source = {
  title: string;
  domain: string;
  url: string;
  snippet: string;
};

export type Report = {
  company: string;
  ticker: string;
  sector: string;
  executiveSummary: string;
  highlights: string[];
  research: ResearchClaim[];
  bull: Argument[];
  bear: Argument[];
  judge: {
    verdict: string;
    confidence: number;
    rationale: string;
    bullScore: number;
    bearScore: number;
  };
  recommendation: {
    horizon: string;
    stance: string;
    actions: string[];
  };
  conclusion: string;
  sources: Source[];
};

export const AGENTS = [
  {
    id: "research",
    name: "Research Agent",
    role: "Signal acquisition",
    detail: "Sweeping filings, transcripts and market chatter",
    icon: "Telescope",
  },
  {
    id: "factcheck",
    name: "Fact Checker",
    role: "Verification layer",
    detail: "Cross-referencing every claim against primary sources",
    icon: "ShieldCheck",
  },
  {
    id: "bull",
    name: "Bull Analyst",
    role: "Upside thesis",
    detail: "Constructing the strongest case for expansion",
    icon: "TrendingUp",
  },
  {
    id: "bear",
    name: "Bear Analyst",
    role: "Downside thesis",
    detail: "Stress-testing the story for structural risk",
    icon: "TrendingDown",
  },
  {
    id: "judge",
    name: "Judge",
    role: "Adjudication",
    detail: "Weighing both theses into a single verdict",
    icon: "Scale",
  },
  {
    id: "writer",
    name: "Report Writer",
    role: "Synthesis",
    detail: "Composing the executive intelligence brief",
    icon: "PenLine",
  },
] as const;

export type AgentId = (typeof AGENTS)[number]["id"];
