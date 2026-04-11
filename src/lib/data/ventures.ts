export type Stage = "idea" | "validation" | "build" | "scale" | "sunset";
export type Status = "active" | "paused" | "killed";
export type Tier = 1 | 2 | 3;

export interface Venture {
  id: string;
  name: string;
  domain: string;
  tier: Tier;
  stage: Stage;
  status: Status;
  thesis: string;
  owner: string;
  capitalBudget: number;
  capitalSpent: number;
  validationChecks: { type: string; status: "passed" | "failed" | "pending" }[];
  createdAt: string;
}

export const ventures: Venture[] = [
  {
    id: "1", name: "Less Ventures", domain: "lessventures.us", tier: 1, stage: "build", status: "active",
    thesis: "Minimalist venture design system with ruthless prioritization",
    owner: "AK", capitalBudget: 50000, capitalSpent: 18000,
    validationChecks: [
      { type: "Customer Discovery", status: "passed" },
      { type: "Technical Feasibility", status: "passed" },
      { type: "Commercial Viability", status: "pending" },
      { type: "Legal/Compliance", status: "passed" },
    ],
    createdAt: "2025-12-01",
  },
  {
    id: "2", name: "AIVI", domain: "aivi.co.uk", tier: 1, stage: "build", status: "active",
    thesis: "Enterprise AI competitiveness assessment and transformation",
    owner: "AK", capitalBudget: 75000, capitalSpent: 22000,
    validationChecks: [
      { type: "Customer Discovery", status: "passed" },
      { type: "Technical Feasibility", status: "passed" },
      { type: "Commercial Viability", status: "passed" },
      { type: "Legal/Compliance", status: "pending" },
    ],
    createdAt: "2025-12-15",
  },
  {
    id: "3", name: "Neurl", domain: "neurl.sg", tier: 1, stage: "build", status: "active",
    thesis: "AI routing and orchestration infrastructure — the airport for intelligence",
    owner: "AK", capitalBudget: 100000, capitalSpent: 35000,
    validationChecks: [
      { type: "Customer Discovery", status: "passed" },
      { type: "Technical Feasibility", status: "pending" },
      { type: "Commercial Viability", status: "pending" },
      { type: "Legal/Compliance", status: "passed" },
    ],
    createdAt: "2026-01-10",
  },
  {
    id: "4", name: "Flow", domain: "flow.at", tier: 1, stage: "validation", status: "active",
    thesis: "IF/THEN for the AI age — workflow and decision orchestration",
    owner: "AK", capitalBudget: 80000, capitalSpent: 12000,
    validationChecks: [
      { type: "Customer Discovery", status: "passed" },
      { type: "Technical Feasibility", status: "pending" },
      { type: "Commercial Viability", status: "pending" },
      { type: "Legal/Compliance", status: "pending" },
    ],
    createdAt: "2026-01-20",
  },
  {
    id: "5", name: "AI Capital", domain: "aicapital.ee", tier: 1, stage: "validation", status: "active",
    thesis: "AI as a guide for the thinking human — decision support companion",
    owner: "AK", capitalBudget: 60000, capitalSpent: 8000,
    validationChecks: [
      { type: "Customer Discovery", status: "pending" },
      { type: "Technical Feasibility", status: "passed" },
      { type: "Commercial Viability", status: "pending" },
      { type: "Legal/Compliance", status: "pending" },
    ],
    createdAt: "2026-02-01",
  },
  {
    id: "6", name: "Dynamic", domain: "dynamic.fi", tier: 2, stage: "idea", status: "active",
    thesis: "Scientific engineering — disciplined experimentation for technical teams",
    owner: "AK", capitalBudget: 40000, capitalSpent: 2000,
    validationChecks: [
      { type: "Customer Discovery", status: "pending" },
      { type: "Technical Feasibility", status: "pending" },
      { type: "Commercial Viability", status: "pending" },
      { type: "Legal/Compliance", status: "pending" },
    ],
    createdAt: "2026-02-15",
  },
  {
    id: "7", name: "Finite Infinite", domain: "finiteinfinite.ca", tier: 2, stage: "idea", status: "active",
    thesis: "Strategic decision system for choosing which games to play",
    owner: "AK", capitalBudget: 40000, capitalSpent: 3000,
    validationChecks: [
      { type: "Customer Discovery", status: "pending" },
      { type: "Technical Feasibility", status: "pending" },
      { type: "Commercial Viability", status: "pending" },
      { type: "Legal/Compliance", status: "pending" },
    ],
    createdAt: "2026-02-20",
  },
  {
    id: "8", name: "Playbook Films", domain: "playbookfilms.ie", tier: 2, stage: "idea", status: "active",
    thesis: "Narrative as strategic infrastructure — stories that drive adoption",
    owner: "AK", capitalBudget: 35000, capitalSpent: 1500,
    validationChecks: [
      { type: "Customer Discovery", status: "pending" },
      { type: "Technical Feasibility", status: "pending" },
      { type: "Commercial Viability", status: "pending" },
      { type: "Legal/Compliance", status: "pending" },
    ],
    createdAt: "2026-03-01",
  },
  {
    id: "9", name: "Smile", domain: "smile.dk", tier: 2, stage: "idea", status: "active",
    thesis: "Human energy platform rooted in performance and vitality",
    owner: "AK", capitalBudget: 45000, capitalSpent: 1000,
    validationChecks: [
      { type: "Customer Discovery", status: "pending" },
      { type: "Technical Feasibility", status: "pending" },
      { type: "Commercial Viability", status: "pending" },
      { type: "Legal/Compliance", status: "pending" },
    ],
    createdAt: "2026-03-05",
  },
  {
    id: "10", name: "Tesl.on", domain: "tesl.on", tier: 3, stage: "idea", status: "active",
    thesis: "Intelligence layer for energy optimization and resilience",
    owner: "AK", capitalBudget: 30000, capitalSpent: 500,
    validationChecks: [
      { type: "Customer Discovery", status: "pending" },
      { type: "Technical Feasibility", status: "pending" },
      { type: "Commercial Viability", status: "pending" },
      { type: "Legal/Compliance", status: "pending" },
    ],
    createdAt: "2026-03-10",
  },
  {
    id: "11", name: "Planet Pi", domain: "planetpi.ch", tier: 3, stage: "idea", status: "active",
    thesis: "Decision-grade geospatial intelligence at planetary scale",
    owner: "AK", capitalBudget: 30000, capitalSpent: 500,
    validationChecks: [
      { type: "Customer Discovery", status: "pending" },
      { type: "Technical Feasibility", status: "pending" },
      { type: "Commercial Viability", status: "pending" },
      { type: "Legal/Compliance", status: "pending" },
    ],
    createdAt: "2026-03-15",
  },
  {
    id: "12", name: "Robocars", domain: "robocars.co.nz", tier: 3, stage: "idea", status: "active",
    thesis: "Human-in-the-loop control plane for autonomous fleets",
    owner: "AK", capitalBudget: 30000, capitalSpent: 500,
    validationChecks: [
      { type: "Customer Discovery", status: "pending" },
      { type: "Technical Feasibility", status: "pending" },
      { type: "Commercial Viability", status: "pending" },
      { type: "Legal/Compliance", status: "pending" },
    ],
    createdAt: "2026-03-20",
  },
];

export const stageOrder: Stage[] = ["idea", "validation", "build", "scale", "sunset"];

export const stageColors: Record<Stage, string> = {
  idea: "bg-blue-100 text-blue-800",
  validation: "bg-yellow-100 text-yellow-800",
  build: "bg-purple-100 text-purple-800",
  scale: "bg-green-100 text-green-800",
  sunset: "bg-gray-100 text-gray-800",
};

export const statusColors: Record<Status, string> = {
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  killed: "bg-red-100 text-red-800",
};

export const tierLabels: Record<Tier, string> = {
  1: "Tier 1 — Core",
  2: "Tier 2 — Depth",
  3: "Tier 3 — Frontier",
};
