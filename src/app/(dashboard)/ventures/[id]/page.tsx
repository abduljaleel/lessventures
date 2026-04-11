"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ventures, stageColors, statusColors, stageOrder } from "@/lib/data/ventures";
import { CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VentureDetailPage() {
  const { id } = useParams();
  const venture = ventures.find((v) => v.id === id);
  const [tab, setTab] = useState<"overview" | "gate" | "capital" | "activity">("overview");

  if (!venture) {
    return <div className="p-8 text-center text-muted-foreground">Venture not found</div>;
  }

  const currentStageIndex = stageOrder.indexOf(venture.stage);
  const passedChecks = venture.validationChecks.filter((c) => c.status === "passed").length;
  const totalChecks = venture.validationChecks.length;

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
              <div className="flex justify-between"><span className="text-sm">Burn Rate</span><span className="font-medium">{((venture.capitalSpent / venture.capitalBudget) * 100).toFixed(0)}%</span></div>
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
              {venture.validationChecks.map((check, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    {check.status === "passed" ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                     check.status === "failed" ? <XCircle className="h-5 w-5 text-red-600" /> :
                     <Clock className="h-5 w-5 text-yellow-600" />}
                    <div>
                      <span className="font-medium">{check.type}</span>
                      <p className="text-xs text-muted-foreground capitalize">{check.status}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    check.status === "passed" ? "bg-green-50 text-green-700" :
                    check.status === "failed" ? "bg-red-50 text-red-700" :
                    "bg-yellow-50 text-yellow-700"
                  }>
                    {check.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Gate Decision</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {passedChecks === totalChecks
                  ? "All validation checks passed. Ready for gate decision."
                  : `${totalChecks - passedChecks} checks still pending. Complete validation before gate review.`}
              </p>
              <div className="flex gap-3">
                <Button className="bg-green-600 hover:bg-green-700">Proceed</Button>
                <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">Pivot</Button>
                <Button variant="outline" className="border-red-500 text-red-700 hover:bg-red-50">Kill</Button>
              </div>
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
                  style={{ width: `${(venture.capitalSpent / venture.capitalBudget) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Spent: ${venture.capitalSpent.toLocaleString()}</span>
                <span>Remaining: ${(venture.capitalBudget - venture.capitalSpent).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="rounded-lg border">
                <div className="grid grid-cols-4 gap-4 p-3 text-sm font-medium bg-muted/50">
                  <span>Category</span><span>Budgeted</span><span>Spent</span><span>Status</span>
                </div>
                {[
                  { cat: "Engineering", budget: venture.capitalBudget * 0.4, spent: venture.capitalSpent * 0.5 },
                  { cat: "Design", budget: venture.capitalBudget * 0.2, spent: venture.capitalSpent * 0.2 },
                  { cat: "Marketing", budget: venture.capitalBudget * 0.2, spent: venture.capitalSpent * 0.15 },
                  { cat: "Operations", budget: venture.capitalBudget * 0.2, spent: venture.capitalSpent * 0.15 },
                ].map((row) => (
                  <div key={row.cat} className="grid grid-cols-4 gap-4 p-3 text-sm border-t">
                    <span>{row.cat}</span>
                    <span>${row.budget.toLocaleString()}</span>
                    <span>${row.spent.toLocaleString()}</span>
                    <Badge variant="outline" className={row.spent / row.budget > 0.8 ? "text-red-600" : "text-green-600"}>
                      {((row.spent / row.budget) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "activity" && (
        <Card>
          <CardHeader><CardTitle>Activity Timeline</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "2026-04-10", action: "Stage gate review scheduled", user: "AK" },
                { date: "2026-04-08", action: "Technical feasibility check completed", user: "AK" },
                { date: "2026-04-05", action: "Customer discovery interviews completed (5/5)", user: "AK" },
                { date: "2026-03-28", action: "Capital allocation updated — $5K for engineering sprint", user: "AK" },
                { date: "2026-03-20", action: `Venture created: ${venture.name}`, user: "AK" },
              ].map((event, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    {i < 4 && <div className="w-px h-full bg-border flex-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">{event.action}</p>
                    <p className="text-xs text-muted-foreground">{event.date} — {event.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
