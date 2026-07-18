"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { stageColors, statusColors, stageOrder } from "@/lib/data/ventures";
import {
  addCapitalAllocation,
  buildActivity,
  decideGate,
  ensureStageGate,
  fetchVenture,
  updateGateChecklist,
  updateValidationCheckStatus,
  type AllocationType,
  type CheckStatus,
  type GateDecision,
  type StageGate,
  type VentureDetail,
} from "@/lib/data/api";
import { CheckCircle, XCircle, Clock, MinusCircle, ArrowLeft, LoaderCircle } from "lucide-react";
import Link from "next/link";

const STATUS_CYCLE: Record<string, CheckStatus> = {
  pending: "passed",
  passed: "failed",
  failed: "skipped",
  skipped: "pending",
};

export default function VentureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [venture, setVenture] = useState<VentureDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<"overview" | "gate" | "capital" | "activity">("overview");
  const [deciding, setDeciding] = useState<GateDecision | null>(null);
  const [allocForm, setAllocForm] = useState({ amount: "", type: "spend" as AllocationType, period: "", notes: "" });
  const [addingAlloc, setAddingAlloc] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const detail = await fetchVenture(id);
      if (!detail) {
        setNotFound(true);
        setVenture(null);
        return;
      }
      // Make sure the current stage always has an OPEN (undecided) gate to work
      // against. A 'pivot' decision keeps the venture on the same stage but
      // leaves its gate decided; without this, no fresh gate would be created
      // and the workflow would dead-end on "Decision recorded: pivot".
      if (
        detail.status !== "killed" &&
        !detail.gates.some((g) => g.stage === detail.stage && !g.decision)
      ) {
        const gate = await ensureStageGate(detail.id, detail.stage);
        detail.gates = [...detail.gates, gate];
      }
      setNotFound(false);
      setVenture(detail);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load venture");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (notFound || (!venture && !error)) {
    return <div className="p-8 text-center text-muted-foreground">Venture not found</div>;
  }

  if (!venture) {
    return (
      <div className="space-y-6">
        <Link href="/ventures">
          <Button variant="ghost" size="sm"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
        </Link>
        <Card className="border-destructive/50">
          <CardContent className="py-4 flex items-center justify-between gap-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void load()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStageIndex = stageOrder.indexOf(venture.stage);
  const passedChecks = venture.validationChecks.filter((c) => c.status === "passed").length;
  const totalChecks = venture.validationChecks.length;
  const currentGate: StageGate | null =
    venture.gates.filter((g) => g.stage === venture.stage && !g.decision).at(-1) ??
    venture.gates.filter((g) => g.stage === venture.stage).at(-1) ??
    null;
  const gateChecklist = currentGate?.checklist ?? [];
  const activity = buildActivity(venture);

  async function handleCheckClick(checkId: string, current: CheckStatus) {
    if (!venture) return;
    const next = STATUS_CYCLE[current] ?? "pending";
    const prev = venture;
    setVenture({
      ...venture,
      validationChecks: venture.validationChecks.map((c) =>
        c.id === checkId ? { ...c, status: next } : c
      ),
    });
    try {
      await updateValidationCheckStatus(checkId, next);
    } catch (e) {
      setVenture(prev);
      setError(e instanceof Error ? e.message : "Failed to update validation check");
    }
  }

  async function handleChecklistToggle(index: number) {
    if (!venture || !currentGate) return;
    const updated = gateChecklist.map((item, i) =>
      i === index ? { ...item, done: !item.done } : item
    );
    const prev = venture;
    setVenture({
      ...venture,
      gates: venture.gates.map((g) => (g.id === currentGate.id ? { ...g, checklist: updated } : g)),
    });
    try {
      await updateGateChecklist(currentGate.id, updated);
    } catch (e) {
      setVenture(prev);
      setError(e instanceof Error ? e.message : "Failed to update gate checklist");
    }
  }

  async function handleDecision(decision: GateDecision) {
    if (!venture || !currentGate || deciding) return;
    setDeciding(decision);
    setError(null);
    try {
      await decideGate(venture.id, currentGate.id, decision, venture.stage);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to record gate decision");
    } finally {
      setDeciding(null);
    }
  }

  async function handleAddAllocation(e: React.FormEvent) {
    e.preventDefault();
    if (!venture || addingAlloc) return;
    const amount = Number(allocForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid allocation amount");
      return;
    }
    setAddingAlloc(true);
    setError(null);
    try {
      await addCapitalAllocation({
        ventureId: venture.id,
        amount,
        allocationType: allocForm.type,
        period: allocForm.period.trim(),
        notes: allocForm.notes.trim(),
      });
      setAllocForm({ amount: "", type: "spend", period: "", notes: "" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add allocation");
    } finally {
      setAddingAlloc(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ventures">
          <Button variant="ghost" size="sm"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{venture.name}</h1>
          <p className="text-muted-foreground">{venture.domain} — {venture.thesis}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">Tier {venture.tier}</Badge>
          <Badge className={stageColors[venture.stage]}>{venture.stage}</Badge>
          <Badge className={statusColors[venture.status]}>{venture.status}</Badge>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="py-3 flex items-center justify-between gap-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void load()}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {/* Stage Progress */}
      <div className="flex gap-1">
        {stageOrder.map((stage, i) => (
          <div key={stage} className="flex-1">
            <div className={`h-2 rounded-full ${i <= currentStageIndex ? "bg-primary" : "bg-muted"}`} />
            <p className="text-xs text-center mt-1 capitalize text-muted-foreground">{stage}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {(["overview", "gate", "capital", "activity"] as const).map((t) => (
          <Button key={t} variant={tab === t ? "default" : "ghost"} size="sm" onClick={() => setTab(t)} className="capitalize">
            {t === "gate" ? "Stage Gate" : t}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Thesis</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground">{venture.thesis}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Key Metrics</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between"><span className="text-sm">Capital Budget</span><span className="font-medium">${venture.capitalBudget.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-sm">Capital Spent</span><span className="font-medium">${venture.capitalSpent.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-sm">Burn Rate</span><span className="font-medium">{venture.capitalBudget > 0 ? ((venture.capitalSpent / venture.capitalBudget) * 100).toFixed(0) : 0}%</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-sm">Validation Progress</span><span className="font-medium">{passedChecks}/{totalChecks} passed</span></div>
              <div className="flex justify-between"><span className="text-sm">Owner</span><span className="font-medium">{venture.owner}</span></div>
              <div className="flex justify-between"><span className="text-sm">Created</span><span className="font-medium">{venture.createdAt}</span></div>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "gate" && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Stage Gate: {venture.stage.charAt(0).toUpperCase() + venture.stage.slice(1)}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {venture.validationChecks.length === 0 && (
                <p className="text-sm text-muted-foreground">No validation checks for this venture yet.</p>
              )}
              {venture.validationChecks.map((check) => (
                <div key={check.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    {check.status === "passed" ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                     check.status === "failed" ? <XCircle className="h-5 w-5 text-red-600" /> :
                     check.status === "skipped" ? <MinusCircle className="h-5 w-5 text-gray-500" /> :
                     <Clock className="h-5 w-5 text-yellow-600" />}
                    <div>
                      <span className="font-medium">{check.type}</span>
                      <p className="text-xs text-muted-foreground capitalize">{check.status}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleCheckClick(check.id, check.status)}
                    title="Click to update status"
                    className="cursor-pointer"
                  >
                    <Badge variant="outline" className={
                      check.status === "passed" ? "bg-green-50 text-green-700" :
                      check.status === "failed" ? "bg-red-50 text-red-700" :
                      check.status === "skipped" ? "bg-gray-100 text-gray-700" :
                      "bg-yellow-50 text-yellow-700"
                    }>
                      {check.status}
                    </Badge>
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>

          {currentGate && (
            <Card>
              <CardHeader><CardTitle>Gate Checklist</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {gateChecklist.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => void handleChecklistToggle(i)}
                    className="flex items-start gap-3 rounded-lg border p-3 w-full text-left cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${item.done ? "text-green-600" : "text-muted-foreground"}`} />
                    <span className={`text-sm ${item.done ? "line-through text-muted-foreground" : ""}`}>{item.item}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Gate Decision</CardTitle></CardHeader>
            <CardContent>
              {venture.status === "killed" ? (
                <p className="text-sm text-muted-foreground">
                  This venture was killed
                  {currentGate?.decidedAt ? ` on ${currentGate.decidedAt.slice(0, 10)}` : ""}. No further gate decisions.
                </p>
              ) : currentGate?.decision ? (
                <p className="text-sm text-muted-foreground">
                  Decision recorded: <span className="font-medium capitalize">{currentGate.decision}</span>
                  {currentGate.decidedAt ? ` on ${currentGate.decidedAt.slice(0, 10)}` : ""}.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    {passedChecks === totalChecks && totalChecks > 0
                      ? "All validation checks passed. Ready for gate decision."
                      : `${totalChecks - passedChecks} checks still pending. Complete validation before gate review.`}
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-green-600 hover:bg-green-700" disabled={deciding !== null} onClick={() => void handleDecision("proceed")}>
                      {deciding === "proceed" && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                      Proceed
                    </Button>
                    <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50" disabled={deciding !== null} onClick={() => void handleDecision("pivot")}>
                      {deciding === "pivot" && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                      Pivot
                    </Button>
                    <Button variant="outline" className="border-red-500 text-red-700 hover:bg-red-50" disabled={deciding !== null} onClick={() => void handleDecision("kill")}>
                      {deciding === "kill" && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                      Kill
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "capital" && (
        <Card>
          <CardHeader><CardTitle>Capital Allocation</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Budget</span>
                <span className="font-bold">${venture.capitalBudget.toLocaleString()}</span>
              </div>
              <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${venture.capitalBudget > 0 ? Math.min((venture.capitalSpent / venture.capitalBudget) * 100, 100) : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Spent: ${venture.capitalSpent.toLocaleString()}</span>
                <span>Remaining: ${(venture.capitalBudget - venture.capitalSpent).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="rounded-lg border">
                <div className="grid grid-cols-4 gap-4 p-3 text-sm font-medium bg-muted/50">
                  <span>Type</span><span>Period</span><span>Amount</span><span>Notes</span>
                </div>
                {venture.allocations.length === 0 && (
                  <div className="p-3 text-sm text-muted-foreground border-t">No allocations recorded yet.</div>
                )}
                {venture.allocations.map((row) => (
                  <div key={row.id} className="grid grid-cols-4 gap-4 p-3 text-sm border-t">
                    <span>
                      <Badge variant="outline" className="capitalize">{row.allocationType}</Badge>
                    </span>
                    <span>{row.period || "—"}</span>
                    <span>${row.amount.toLocaleString()}</span>
                    <span className="text-muted-foreground truncate" title={row.notes ?? undefined}>{row.notes || "—"}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <form onSubmit={handleAddAllocation} className="space-y-3">
                <p className="text-sm font-medium">Add Allocation</p>
                <div className="flex gap-2 flex-wrap">
                  {(["budget", "spend", "forecast"] as const).map((t) => (
                    <Button
                      key={t}
                      type="button"
                      size="sm"
                      variant={allocForm.type === t ? "default" : "outline"}
                      className="capitalize"
                      onClick={() => setAllocForm({ ...allocForm, type: t })}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Amount (USD)"
                    value={allocForm.amount}
                    onChange={(e) => setAllocForm({ ...allocForm, amount: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Period (e.g., 2026 H2)"
                    value={allocForm.period}
                    onChange={(e) => setAllocForm({ ...allocForm, period: e.target.value })}
                  />
                  <Input
                    placeholder="Notes"
                    value={allocForm.notes}
                    onChange={(e) => setAllocForm({ ...allocForm, notes: e.target.value })}
                  />
                </div>
                <Button type="submit" size="sm" disabled={addingAlloc}>
                  {addingAlloc && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  {addingAlloc ? "Adding..." : "Add Allocation"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "activity" && (
        <Card>
          <CardHeader><CardTitle>Activity Timeline</CardTitle></CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {activity.map((event, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      {i < activity.length - 1 && <div className="w-px h-full bg-border flex-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">{event.action}</p>
                      <p className="text-xs text-muted-foreground">{event.date} — {event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-20" />
      <div className="space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-6 w-full" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
          <CardContent><Skeleton className="h-20 w-full" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
