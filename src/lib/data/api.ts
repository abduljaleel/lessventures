// Data layer: all Supabase reads/writes for the Mend dashboard go through this module.
// Maps DB rows (snake_case) onto the UI's existing camelCase types from "@/lib/data/ventures".
//
// Mapping notes:
// - Venture.capitalBudget / capitalSpent are derived from capital_allocations
//   (allocation_type 'budget' vs 'spend'; amount_cents -> dollars).
// - Venture.validationChecks <-> validation_checks rows (check_type / status).
// - Venture.owner shows the signed-in user's name when owner_id matches auth.uid(),
//   otherwise "Team" (profiles RLS only exposes your own profile row).
// - stage_gates.checklist jsonb stores [{ item, done }] entries; the default checklist
//   mirrors the playbook's "Stage Gate Review" items.

import { createClient } from "@/lib/supabase/client";
import {
  stageOrder,
  ventures as seedVentures,
  type Stage,
  type Status,
  type Tier,
} from "@/lib/data/ventures";

export type { Stage, Status, Tier };

export type CheckStatus = "pending" | "passed" | "failed" | "skipped";
export type GateDecision = "proceed" | "pivot" | "kill";
export type AllocationType = "budget" | "spend" | "forecast";

export interface ValidationCheck {
  id: string;
  ventureId: string;
  type: string;
  status: CheckStatus;
  evidenceUrl: string | null;
  createdAt: string;
}

export interface ChecklistItem {
  item: string;
  done: boolean;
}

export interface StageGate {
  id: string;
  ventureId: string;
  stage: Stage;
  checklist: ChecklistItem[];
  decision: GateDecision | null;
  decidedAt: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CapitalAllocation {
  id: string;
  ventureId: string;
  amount: number; // dollars
  allocationType: AllocationType;
  period: string | null;
  notes: string | null;
  createdAt: string;
}

export interface Venture {
  id: string;
  name: string;
  domain: string;
  tier: Tier;
  stage: Stage;
  status: Status;
  thesis: string;
  owner: string;
  capitalBudget: number; // dollars, sum of 'budget' allocations
  capitalSpent: number; // dollars, sum of 'spend' allocations
  validationChecks: ValidationCheck[];
  createdAt: string; // YYYY-MM-DD
}

export interface VentureDetail extends Venture {
  allocations: CapitalAllocation[];
  gates: StageGate[];
}

export interface NewVentureInput {
  name: string;
  domain: string;
  tier: Tier;
  thesis: string;
}

export interface NewAllocationInput {
  ventureId: string;
  amount: number; // dollars
  allocationType: AllocationType;
  period: string;
  notes: string;
}

// Default validation checks created for every new venture (matches seed content).
export const DEFAULT_CHECK_TYPES = [
  "Customer Discovery",
  "Technical Feasibility",
  "Commercial Viability",
  "Legal/Compliance",
] as const;

// Default stage-gate checklist — mirrors the playbook's "Stage Gate Review" items.
export const DEFAULT_GATE_CHECKLIST: string[] = [
  "Review all validation checklist items",
  "Present evidence for each check (pass/fail/skip)",
  "Assess capital efficiency and burn rate",
  "Evaluate against portfolio-level priorities",
  "Make formal decision: Proceed / Pivot / Kill",
  "Document decision rationale in the activity log",
];

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export async function getCtx() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id, full_name, email")
    .eq("id", user.id)
    .single();
  if (!profile?.org_id) throw new Error("No organization found for this account");
  return {
    supabase,
    userId: user.id,
    orgId: profile.org_id as string,
    userName:
      (profile.full_name as string | null) || (profile.email as string | null) || "You",
  };
}

function throwIfError(error: { message: string } | null, fallback: string): void {
  if (error) throw new Error(error.message || fallback);
}

// ---------------------------------------------------------------------------
// Row types (DB shape)
// ---------------------------------------------------------------------------

interface CheckRow {
  id: string;
  venture_id: string;
  check_type: string;
  status: string | null;
  evidence_url: string | null;
  created_at: string;
}

interface GateRow {
  id: string;
  venture_id: string;
  stage: string;
  checklist: unknown;
  decision: string | null;
  decided_at: string | null;
  notes: string | null;
  created_at: string;
}

interface AllocationRow {
  id: string;
  venture_id: string;
  amount_cents: number;
  allocation_type: string | null;
  period: string | null;
  notes: string | null;
  created_at: string;
}

interface VentureRow {
  id: string;
  org_id: string;
  name: string;
  domain: string | null;
  tier: number | null;
  stage: string | null;
  status: string | null;
  thesis: string | null;
  owner_id: string | null;
  created_at: string;
  validation_checks?: CheckRow[];
  capital_allocations?: AllocationRow[];
  stage_gates?: GateRow[];
}

const VENTURE_SELECT = "*, validation_checks(*), capital_allocations(*)";
const VENTURE_DETAIL_SELECT = "*, validation_checks(*), capital_allocations(*), stage_gates(*)";

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function toDateOnly(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

function mapCheck(r: CheckRow): ValidationCheck {
  const status: CheckStatus =
    r.status === "passed" || r.status === "failed" || r.status === "skipped"
      ? r.status
      : "pending";
  return {
    id: r.id,
    ventureId: r.venture_id,
    type: r.check_type,
    status,
    evidenceUrl: r.evidence_url,
    createdAt: r.created_at,
  };
}

function normalizeChecklist(raw: unknown): ChecklistItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null)
    .map((entry) => ({
      item: typeof entry.item === "string" ? entry.item : String(entry.item ?? ""),
      done: entry.done === true,
    }))
    .filter((entry) => entry.item.length > 0);
}

function mapGate(r: GateRow): StageGate {
  const decision: GateDecision | null =
    r.decision === "proceed" || r.decision === "pivot" || r.decision === "kill"
      ? r.decision
      : null;
  return {
    id: r.id,
    ventureId: r.venture_id,
    stage: (r.stage as Stage) || "idea",
    checklist: normalizeChecklist(r.checklist),
    decision,
    decidedAt: r.decided_at,
    notes: r.notes,
    createdAt: r.created_at,
  };
}

function mapAllocation(r: AllocationRow): CapitalAllocation {
  const allocationType: AllocationType =
    r.allocation_type === "budget" || r.allocation_type === "spend" || r.allocation_type === "forecast"
      ? r.allocation_type
      : "spend";
  return {
    id: r.id,
    ventureId: r.venture_id,
    amount: Math.round(r.amount_cents) / 100,
    allocationType,
    period: r.period,
    notes: r.notes,
    createdAt: r.created_at,
  };
}

function mapVenture(r: VentureRow, userId: string, userName: string): Venture {
  const allocations = (r.capital_allocations ?? []).map(mapAllocation);
  const checks = (r.validation_checks ?? [])
    .map(mapCheck)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return {
    id: r.id,
    name: r.name,
    domain: r.domain ?? "",
    tier: (r.tier === 1 || r.tier === 2 || r.tier === 3 ? r.tier : 1) as Tier,
    stage: (r.stage as Stage) || "idea",
    status: (r.status as Status) || "active",
    thesis: r.thesis ?? "",
    owner: r.owner_id === userId ? userName : "Team",
    capitalBudget: sumAllocations(allocations, "budget"),
    capitalSpent: sumAllocations(allocations, "spend"),
    validationChecks: checks,
    createdAt: toDateOnly(r.created_at),
  };
}

function mapVentureDetail(r: VentureRow, userId: string, userName: string): VentureDetail {
  const base = mapVenture(r, userId, userName);
  return {
    ...base,
    allocations: (r.capital_allocations ?? [])
      .map(mapAllocation)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    gates: (r.stage_gates ?? [])
      .map(mapGate)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  };
}

function sumAllocations(allocations: CapitalAllocation[], type: AllocationType): number {
  return allocations
    .filter((a) => a.allocationType === type)
    .reduce((sum, a) => sum + a.amount, 0);
}

// ---------------------------------------------------------------------------
// Ventures
// ---------------------------------------------------------------------------

export async function fetchVentures(): Promise<Venture[]> {
  const { supabase, userId, userName } = await getCtx();
  const { data, error } = await supabase
    .from("ventures")
    .select(VENTURE_SELECT)
    .order("created_at", { ascending: true });
  throwIfError(error, "Failed to load ventures");
  return ((data ?? []) as VentureRow[]).map((r) => mapVenture(r, userId, userName));
}

export async function fetchVenture(id: string): Promise<VentureDetail | null> {
  const { supabase, userId, userName } = await getCtx();
  const { data, error } = await supabase
    .from("ventures")
    .select(VENTURE_DETAIL_SELECT)
    .eq("id", id)
    .maybeSingle();
  throwIfError(error, "Failed to load venture");
  if (!data) return null;
  return mapVentureDetail(data as VentureRow, userId, userName);
}

export async function createVenture(input: NewVentureInput): Promise<Venture> {
  const { supabase, orgId, userId, userName } = await getCtx();
  const { data, error } = await supabase
    .from("ventures")
    .insert({
      org_id: orgId,
      owner_id: userId,
      name: input.name,
      domain: input.domain,
      tier: input.tier,
      thesis: input.thesis,
      stage: "idea",
      status: "active",
    })
    .select("*")
    .single();
  throwIfError(error, "Failed to create venture");
  const row = data as VentureRow;

  // Default validation checks (kept in display order via created_at offsets).
  const base = Date.now();
  const { error: checksError } = await supabase.from("validation_checks").insert(
    DEFAULT_CHECK_TYPES.map((type, i) => ({
      venture_id: row.id,
      check_type: type,
      status: "pending",
      created_at: new Date(base + i * 1000).toISOString(),
    }))
  );
  throwIfError(checksError, "Failed to create validation checks");

  // Open stage gate for the idea stage with the default checklist.
  const { error: gateError } = await supabase.from("stage_gates").insert({
    venture_id: row.id,
    stage: "idea",
    checklist: DEFAULT_GATE_CHECKLIST.map((item) => ({ item, done: false })),
  });
  throwIfError(gateError, "Failed to create stage gate");

  const detail = await fetchVenture(row.id);
  if (detail) return detail;
  return mapVenture(row, userId, userName);
}

export async function updateVenture(
  id: string,
  patch: { stage?: Stage; status?: Status }
): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase.from("ventures").update(patch).eq("id", id);
  throwIfError(error, "Failed to update venture");
}

// ---------------------------------------------------------------------------
// Validation checks
// ---------------------------------------------------------------------------

export async function updateValidationCheckStatus(
  id: string,
  status: CheckStatus
): Promise<void> {
  const { supabase, userId } = await getCtx();
  const { error } = await supabase
    .from("validation_checks")
    .update({ status, reviewer_id: status === "pending" ? null : userId })
    .eq("id", id);
  throwIfError(error, "Failed to update validation check");
}

// ---------------------------------------------------------------------------
// Stage gates
// ---------------------------------------------------------------------------

/** Returns the most recent gate for (venture, stage), creating one if none exists. */
export async function ensureStageGate(ventureId: string, stage: Stage): Promise<StageGate> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("stage_gates")
    .select("*")
    .eq("venture_id", ventureId)
    .eq("stage", stage)
    .order("created_at", { ascending: false })
    .limit(1);
  throwIfError(error, "Failed to load stage gate");
  const existing = (data ?? []) as GateRow[];
  if (existing.length > 0) return mapGate(existing[0]);

  const { data: created, error: insertError } = await supabase
    .from("stage_gates")
    .insert({
      venture_id: ventureId,
      stage,
      checklist: DEFAULT_GATE_CHECKLIST.map((item) => ({ item, done: false })),
    })
    .select("*")
    .single();
  throwIfError(insertError, "Failed to create stage gate");
  return mapGate(created as GateRow);
}

export async function updateGateChecklist(
  gateId: string,
  checklist: ChecklistItem[]
): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase
    .from("stage_gates")
    .update({ checklist })
    .eq("id", gateId);
  throwIfError(error, "Failed to update gate checklist");
}

/**
 * Records a gate decision and applies the resulting venture transition:
 * proceed -> advance to the next stage; kill -> status 'killed'; pivot -> recorded only.
 * Returns the venture's new stage/status so callers can update local state.
 */
export async function decideGate(
  ventureId: string,
  gateId: string,
  decision: GateDecision,
  currentStage: Stage,
  notes?: string
): Promise<{ stage: Stage; status: Status }> {
  const { supabase, userId } = await getCtx();
  const { error } = await supabase
    .from("stage_gates")
    .update({
      decision,
      decision_by: userId,
      decided_at: new Date().toISOString(),
      notes: notes ?? null,
    })
    .eq("id", gateId);
  throwIfError(error, "Failed to record gate decision");

  let stage = currentStage;
  let status: Status = "active";
  if (decision === "proceed") {
    const idx = stageOrder.indexOf(currentStage);
    stage = stageOrder[Math.min(idx + 1, stageOrder.length - 1)];
  } else if (decision === "kill") {
    status = "killed";
  }

  const patch: { stage?: Stage; status?: Status } =
    decision === "proceed" ? { stage } : decision === "kill" ? { status } : {};
  if (Object.keys(patch).length > 0) {
    const { error: ventureError } = await supabase
      .from("ventures")
      .update(patch)
      .eq("id", ventureId);
    throwIfError(ventureError, "Failed to update venture stage");
  }
  return { stage, status };
}

// ---------------------------------------------------------------------------
// Capital allocations
// ---------------------------------------------------------------------------

export async function addCapitalAllocation(
  input: NewAllocationInput
): Promise<CapitalAllocation> {
  const { supabase, userId } = await getCtx();
  const { data, error } = await supabase
    .from("capital_allocations")
    .insert({
      venture_id: input.ventureId,
      amount_cents: Math.round(input.amount * 100),
      allocation_type: input.allocationType,
      period: input.period || null,
      notes: input.notes || null,
      approved_by: userId,
    })
    .select("*")
    .single();
  throwIfError(error, "Failed to add capital allocation");
  return mapAllocation(data as AllocationRow);
}

// ---------------------------------------------------------------------------
// Activity (derived client-side from real rows)
// ---------------------------------------------------------------------------

export interface ActivityEvent {
  date: string;
  action: string;
  user: string;
}

export function buildActivity(v: VentureDetail): ActivityEvent[] {
  const events: ActivityEvent[] = [
    { date: v.createdAt, action: `Venture created: ${v.name}`, user: v.owner },
  ];
  for (const gate of v.gates) {
    if (gate.decision && gate.decidedAt) {
      events.push({
        date: toDateOnly(gate.decidedAt),
        action: `Stage gate (${gate.stage}) decision: ${gate.decision}${gate.notes ? ` — ${gate.notes}` : ""}`,
        user: v.owner,
      });
    }
  }
  for (const alloc of v.allocations) {
    events.push({
      date: toDateOnly(alloc.createdAt),
      action: `Capital ${alloc.allocationType} recorded — $${alloc.amount.toLocaleString()}${alloc.notes ? ` (${alloc.notes})` : ""}`,
      user: v.owner,
    });
  }
  for (const check of v.validationChecks) {
    if (check.status !== "pending") {
      events.push({
        date: toDateOnly(check.createdAt),
        action: `Validation check ${check.status}: ${check.type}`,
        user: v.owner,
      });
    }
  }
  return events.sort((a, b) => b.date.localeCompare(a.date));
}

// ---------------------------------------------------------------------------
// Demo seeding (repurposes the static seed arrays in ./ventures)
// ---------------------------------------------------------------------------

const DAY_MS = 86400000;

export async function seedDemoData(): Promise<void> {
  const { supabase, orgId, userId } = await getCtx();

  // Shift seed dates so the most recent venture lands one week ago,
  // preserving the original relative spacing.
  const latestSeed = Math.max(
    ...seedVentures.map((v) => new Date(v.createdAt).getTime())
  );
  const anchor = Date.now() - 7 * DAY_MS;
  const now = Date.now();
  const shifted = (seedDate: string, offsetDays = 0): string => {
    const t = anchor - (latestSeed - new Date(seedDate).getTime()) + offsetDays * DAY_MS;
    return new Date(Math.min(t, now)).toISOString();
  };

  for (const seed of seedVentures) {
    const { data: ventureRow, error: ventureError } = await supabase
      .from("ventures")
      .insert({
        org_id: orgId,
        owner_id: userId,
        name: seed.name,
        domain: seed.domain,
        tier: seed.tier,
        stage: seed.stage,
        status: seed.status,
        thesis: seed.thesis,
        created_at: shifted(seed.createdAt),
      })
      .select("id")
      .single();
    throwIfError(ventureError, "Failed to seed venture");
    const ventureId = (ventureRow as { id: string }).id;

    // Validation checks (created_at offsets keep display order stable).
    const { error: checksError } = await supabase.from("validation_checks").insert(
      seed.validationChecks.map((check, i) => ({
        venture_id: ventureId,
        check_type: check.type,
        status: check.status,
        reviewer_id: check.status === "pending" ? null : userId,
        created_at: shifted(seed.createdAt, 3 + i * 0.01),
      }))
    );
    throwIfError(checksError, "Failed to seed validation checks");

    // Capital allocations: one budget line plus a cumulative spend line.
    const allocations = [
      {
        venture_id: ventureId,
        amount_cents: seed.capitalBudget * 100,
        allocation_type: "budget",
        period: "FY2026",
        approved_by: userId,
        notes: "Initial budget allocation",
        created_at: shifted(seed.createdAt, 1),
      },
    ];
    if (seed.capitalSpent > 0) {
      allocations.push({
        venture_id: ventureId,
        amount_cents: seed.capitalSpent * 100,
        allocation_type: "spend",
        period: "2026 H1",
        approved_by: userId,
        notes: "Cumulative spend to date",
        created_at: shifted(seed.createdAt, 21),
      });
    }
    const { error: allocationError } = await supabase
      .from("capital_allocations")
      .insert(allocations);
    throwIfError(allocationError, "Failed to seed capital allocations");

    // Stage gates: a decided 'proceed' gate per completed stage, plus an open
    // gate (partially checked) for the current stage.
    const stageIdx = stageOrder.indexOf(seed.stage);
    const passedCount = seed.validationChecks.filter((c) => c.status === "passed").length;
    const gates = [];
    for (let i = 0; i < stageIdx; i++) {
      gates.push({
        venture_id: ventureId,
        stage: stageOrder[i],
        checklist: DEFAULT_GATE_CHECKLIST.map((item) => ({ item, done: true })),
        decision: "proceed",
        decision_by: userId,
        decided_at: shifted(seed.createdAt, 10 + i * 14),
        notes: `Advanced to ${stageOrder[i + 1]}`,
        created_at: shifted(seed.createdAt, 2 + i * 14),
      });
    }
    gates.push({
      venture_id: ventureId,
      stage: seed.stage,
      checklist: DEFAULT_GATE_CHECKLIST.map((item, i) => ({ item, done: i < passedCount })),
      decision: null,
      decision_by: null,
      decided_at: null,
      notes: null,
      created_at: shifted(seed.createdAt, 2 + stageIdx * 14),
    });
    const { error: gateError } = await supabase.from("stage_gates").insert(gates);
    throwIfError(gateError, "Failed to seed stage gates");
  }
}
